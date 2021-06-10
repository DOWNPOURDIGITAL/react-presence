import { useContext, useLayoutEffect, useState } from 'react';

import PresenceContext from './PresenceContext';


export default function usePresenceLate(): boolean {
	const ctx = useContext( PresenceContext );
	const [shouldPropagate, setShouldPropagate] = useState( false );

	useLayoutEffect( () => {
		// wait for two frames to propagate visibility:
		// The first rAF puts us at the end of the current frame -
		// all effects ran, new CSS is being applied.
		// The second rAF ensures that all CSS has been applied -
		// it's now save to update styles for transitions.
		let frame = requestAnimationFrame( () => {
			frame = requestAnimationFrame( () => {
				if ( !shouldPropagate ) setShouldPropagate( true );
			});
		});

		return (): void => cancelAnimationFrame( frame );
	}, []);

	return shouldPropagate && ctx.visible;
}
