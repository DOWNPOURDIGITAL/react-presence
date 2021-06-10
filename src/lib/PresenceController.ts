import { EventDispatcher } from '@downpourdigital/dispatcher';
import PassiveSubscription from '@downpourdigital/dispatcher/dist/cjs/lib/PassiveSubscription';
import Subscription from '@downpourdigital/dispatcher/dist/cjs/lib/Subscription';

import PresenceObserver, { PassivePresenceObserver } from './PresenceObserver';
import noop from './noop';


export default class PresenceController {
	private mountTrigger = new EventDispatcher<void>({
		mayCancelAfterCallback: false,
	});

	private unmountTrigger = new EventDispatcher<void>({
		mayCancelAfterCallback: false,
	});

	private lateInObserverCancelFuncs: ( () => void )[] = [];
	private inTimeout: number;

	public isMounted = false;


	public mount( cb: Function ): void {
		this.unmountTrigger.cancelAll();

		// wait for all observers to subscribe
		this.inTimeout = setTimeout( () => {
			this.isMounted = true;

			const e = this.mountTrigger.dispatch();
			e.promise.then( cb ).catch( noop );
		}, 0 );
	}


	public unmount( cb: Function ): void {
		clearTimeout( this.inTimeout );
		this.isMounted = false;
		this.mountTrigger.cancelAll();

		// cancel all in observers still running,
		// that aren't managed by the mount trigger
		this.lateInObserverCancelFuncs.forEach( c => c() );
		this.lateInObserverCancelFuncs = [];

		const e = this.unmountTrigger.dispatch();
		e.promise.then( cb ).catch( noop );
	}


	public subscribe( observer: PresenceObserver ): () => void {
		let mountSub: Subscription<void>;
		let unmountSub: Subscription<void>;

		if ( observer.in ) {
			mountSub = this.mountTrigger.subscribe( observer.in );
		}

		if ( observer.out ) {
			unmountSub = this.unmountTrigger.subscribe( observer.out );
		}

		// run in function if observer is late to the party
		// and register callback cleanup function
		if ( this.isMounted && observer.in ) {
			let callbackRan = false;
			let cancelFuncIsPushed = false;

			const lateObserver = observer.in( () => {
				// the callback may immediately run here.
				// since it is referring to lateObserver before it is fully declared,
				// we need to take some precautions
				if ( cancelFuncIsPushed ) {
					// only look for the cancelFunc, if it is listed.
					// this won't be the case if the cb ran immediately
					const i = this.lateInObserverCancelFuncs.findIndex(
						( f ) => f === lateObserver,
					);
					if ( i !== -1 ) this.lateInObserverCancelFuncs.splice( i, 1 );
				}

				callbackRan = true;
			});

			if ( !callbackRan ) {
				// if the callback already ran, the event can no longer be canceled,
				// so there's no need to keep track of it
				this.lateInObserverCancelFuncs.push( lateObserver );
				cancelFuncIsPushed = true;
			}
		}

		return (): void => {
			if ( mountSub ) mountSub.unsubscribe();
			if ( unmountSub ) unmountSub.unsubscribe();
		};
	}


	public subscribePassive( observer: PassivePresenceObserver ): () => void {
		let unmountSub: PassiveSubscription<void>;
		const inObserver = (): void => {
			const outObserver = observer();

			if ( unmountSub ) {
				// inObserver ran before. clear old out subscription before overwriting.
				unmountSub.unsubscribe();
				unmountSub = null;
			}

			if ( outObserver ) {
				unmountSub = this.unmountTrigger.subscribePassive( () => {
					outObserver();
				});
			}
		};

		const mountSub = this.mountTrigger.subscribePassive( inObserver );

		// run in function if observer is late to the party
		if ( this.isMounted ) inObserver();

		return (): void => {
			mountSub.unsubscribe();
			if ( unmountSub ) unmountSub.unsubscribe();
		};
	}
}
