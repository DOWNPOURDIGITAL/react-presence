import React, {
	FunctionComponent,
	useState,
	useContext,
	useEffect,
} from 'react';

import useConstant from './useConstant';
import PresenceController from './PresenceController';
import PresenceContext from './PresenceContext';
import PresenceObserver, { PassivePresenceObserver } from './PresenceObserver';
import noop from './noop';


interface PresenceWrapperProps {
	visible: boolean;
}

const PresenceWrapper: FunctionComponent<PresenceWrapperProps> = ({
	children,
	visible: localVisible,
}) => {
	const ctx = useContext( PresenceContext );
	const [mounted, setMounted] = useState( false );
	const controller = useConstant( () => new PresenceController() );

	const visible = localVisible && ctx.visible;

	useEffect( () => {
		if ( ctx.subscribe ) {
			const unsubscribe = ctx.subscribe({
				in: ( cb ) => {
					if ( localVisible ) {
						// both parent and local wrapper
						// are visible
						controller.mount( cb );
					} else {
						// the parent is visible
						// but the local wrapper isn't
						cb();

						return noop;
					}

					return noop;
				},
				out: ( cb ) => {
					controller.unmount( cb );

					return noop;
				},
			});

			return (): void => unsubscribe();
		}

		return noop;
	}, [localVisible]);

	useEffect( () => {
		if ( visible && !mounted ) {
			setMounted( true );
		}
	}, [visible, mounted]);

	if ( visible && !controller.isMounted && mounted ) {
		controller.mount( noop );
	} else if ( !visible && controller.isMounted ) {
		controller.unmount( () => setMounted( false ) );
	}

	return (
		<PresenceContext.Provider value={{
			subscribe: ( o: PresenceObserver ): () => void => (
				controller.subscribe( o )
			),
			subscribePassive: ( o: PassivePresenceObserver ): () => void => (
				controller.subscribePassive( o )
			),
			visible,
		}}
		>
			{( mounted || visible ) && children}
		</PresenceContext.Provider>
	);
};

export default PresenceWrapper;
