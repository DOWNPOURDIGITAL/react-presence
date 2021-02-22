import { useRef } from 'react';

type Init<T> = () => T;

/**
 * Stolen from framer motion
 * https://github.com/framer/motion/blob/main/src/utils/use-constant.ts
 */
export default function useConstant<T>( init: Init<T> ): T {
	const ref = useRef<T | null>( null );

	if ( ref.current === null ) {
		ref.current = init();
	}

	return ref.current;
}
