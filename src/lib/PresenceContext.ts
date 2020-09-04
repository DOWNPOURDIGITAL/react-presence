import { createContext } from 'react';

import PresenceObserver from './PresenceObserver';


interface PresenceContextProps {
	subscribe?: ( observer: PresenceObserver ) => () => void;
	visible: boolean;
}


const PresenceContext = createContext<PresenceContextProps>({
	visible: true,
});

export default PresenceContext;
