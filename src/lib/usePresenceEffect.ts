import { useContext, useEffect } from 'react';

import PresenceContext from './PresenceContext';
import { PassivePresenceObserver } from './PresenceObserver';
import noop from './noop';


export default function usePresenceEffect(
	effect: PassivePresenceObserver,
	deps: React.DependencyList = [],
): void {
	const ctx = useContext( PresenceContext );
	useEffect( () => {
		if ( ctx.subscribePassive ) {
			const unsubscribe = ctx.subscribePassive( effect );
			return (): void => unsubscribe();
		}
		return noop;
	}, deps );
}
