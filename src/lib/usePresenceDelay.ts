import { useContext, useEffect } from 'react';

import PresenceObserver from './PresenceObserver';
import PresenceContext from './PresenceContext';


export default function usePresenceDelay(
	factory: () => PresenceObserver,
	deps: React.DependencyList = [],
): void {
	const ctx = useContext( PresenceContext );
	useEffect( () => {
		if ( ctx.subscribe ) {
			const unsubscribe = ctx.subscribe( factory() );
			return (): void => unsubscribe();
		}
		return (): void => {};
	}, deps );
}
