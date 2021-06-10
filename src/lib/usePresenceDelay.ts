import { useContext, useEffect } from 'react';

import PresenceObserver from './PresenceObserver';
import PresenceContext from './PresenceContext';
import noop from './noop';


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

		return noop;
	}, deps );
}
