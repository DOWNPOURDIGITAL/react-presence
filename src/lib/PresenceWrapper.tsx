import React, {
	FunctionComponent,
	useState,
	useContext,
	useMemo,
	useEffect,
} from 'react';
import PresenceController from './PresenceController';
import PresenceContext from './PresenceContext';
import PresenceObserver from './PresenceObserver';


interface PresenceWrapperProps {
	visible: boolean;
}


const PresenceWrapper: FunctionComponent<PresenceWrapperProps> = ({ children, visible }) => {
	const [mounted, setMounted] = useState( visible );
	const ctx = useContext( PresenceContext );
	const controller = useMemo( () => new PresenceController(), []);

	useEffect( () => {
		if ( ctx.subscribe ) {
			const unsubscribe = ctx.subscribe({
				in: cb => {
					controller.mount( cb );
					return (): void => {};
				},
				out: cb => {
					controller.unmount( cb );
					return (): void => {};
				},
			});
			return (): void => unsubscribe();
		}
		return (): void => {};
	}, []);

	if ( visible && !controller.isMounted ) {
		controller.mount( () => {});
	} else if ( !visible && controller.isMounted ) {
		controller.unmount( () => setMounted( false ) );
	}

	return (
		<PresenceContext.Provider value={{
			subscribe: ( o: PresenceObserver ) => controller.subscribe( o ),
		}}
		>
			{mounted && children}
		</PresenceContext.Provider>
	);
};

export default PresenceWrapper;
