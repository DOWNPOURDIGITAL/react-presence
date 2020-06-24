import { EventDispatcher } from '@downpourdigital/dispatcher';

import PresenceObserver from './PresenceObserver';


export default class PresenceController {
	private mountTrigger = new EventDispatcher<void>({
		mayCancelAfterCallback: false,
	});

	private unmountTrigger = new EventDispatcher<void>({
		mayCancelAfterCallback: false,
	});

	public isMounted = false;


	public mount( cb: Function ): void {
		this.isMounted = true;
		this.unmountTrigger.cancelAll();
		const e = this.mountTrigger.dispatch();

		e.promise.then( () => cb() ).catch( () => { });
	}


	public unmount( cb: Function ): void {
		this.isMounted = false;
		this.mountTrigger.cancelAll();
		const e = this.unmountTrigger.dispatch();

		e.promise.then( () => cb() ).catch( () => {});
	}


	public subscribe( observer: PresenceObserver ): () => void {
		const mountSub = this.mountTrigger.subscribe( observer.in );
		const unmountSub = this.unmountTrigger.subscribe( observer.out );

		// run in function if observer is late to the party
		if ( this.isMounted ) observer.in( () => {});

		return (): void => {
			mountSub.unsubscribe();
			unmountSub.unsubscribe();
		};
	}
}
