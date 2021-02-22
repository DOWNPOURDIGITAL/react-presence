import React, {
	FunctionComponent,
	useState,
	useContext,
	useEffect,
	useRef,
} from 'react';

import PresenceController from './PresenceController';
import PresenceContext from './PresenceContext';
import PresenceObserver, { PassivePresenceObserver } from './PresenceObserver';
import useConstant from './useConstant';


interface PresenceWrapperProps {
	visible: boolean;
}


const PresenceWrapper: FunctionComponent<PresenceWrapperProps> = ({
	children,
	visible: localVisible,
}) => {
	const ctx = useContext( PresenceContext );
	const parentVisible = useRef( ctx.visible );
	const [mounted, setMounted] = useState( false );
	const controller = useConstant( () => new PresenceController() );

	const visible = localVisible && parentVisible.current;

	useEffect( () => {
		if ( ctx.subscribe ) {
			const unsubscribe = ctx.subscribe({
				in: cb => {
					parentVisible.current = true;
					controller.mount( cb );
					return (): void => {};
				},
				out: cb => {
					parentVisible.current = false;
					controller.unmount( cb );
					return (): void => {};
				},
			});
			return (): void => unsubscribe();
		}
		return (): void => {};
	}, []);

	useEffect( () => {
		if ( visible && !mounted ) {
			setMounted( true );
		}
	}, [visible, mounted]);

	if ( visible && !controller.isMounted && mounted ) {
		controller.mount( () => {});
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
