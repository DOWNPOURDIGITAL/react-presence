import React, {
	FunctionComponent,
	useState,
	useContext,
	useMemo,
	useEffect,
	useRef,
} from 'react';

import PresenceController from './PresenceController';
import PresenceContext from './PresenceContext';
import PresenceObserver from './PresenceObserver';


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
	const controller = useMemo( () => new PresenceController(), []);

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
			visible,
		}}
		>
			{( mounted || visible ) && children}
		</PresenceContext.Provider>
	);
};

export default PresenceWrapper;
