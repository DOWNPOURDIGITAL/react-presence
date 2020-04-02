import { createContext } from 'react';
import PresenceObserver from './PresenceObserver';


interface PresenceContextProps {
	subscribe?: ( observer: PresenceObserver ) => () => void;
}


const PresenceContext = createContext<PresenceContextProps>({});

export default PresenceContext;
