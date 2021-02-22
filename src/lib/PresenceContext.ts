import { createContext } from 'react';

import PresenceObserver, { PassivePresenceObserver } from './PresenceObserver';


interface PresenceContextProps {
	subscribe?: ( observer: PresenceObserver ) => () => void;
	subscribePassive?: ( observer: PassivePresenceObserver ) => () => void;
	visible: boolean;
}


const PresenceContext = createContext<PresenceContextProps>({
	visible: true,
});

export default PresenceContext;
