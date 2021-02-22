import { Observer } from '@downpourdigital/dispatcher/dist/cjs/lib/Subscription';


export default interface PresenceObserver {
	in?: Observer<void>;
	out?: Observer<void>;
}


export type PassivePresenceObserver = () => ( () => void ) | void;
