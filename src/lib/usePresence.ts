import { useContext } from 'react';

import PresenceContext from './PresenceContext';


export default function usePresence(): boolean {
	const ctx = useContext( PresenceContext );

	return ctx.visible;
}
