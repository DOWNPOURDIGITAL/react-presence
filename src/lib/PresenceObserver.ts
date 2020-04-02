import { Observer } from '@downpourdigital/dispatcher/dist/lib/Subscription';


export default interface PresenceObserver {
	in: Observer<void>;
	out: Observer<void>;
}
