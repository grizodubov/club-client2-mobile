<script lang="ts">
	import type { ComponentType, SvelteComponentTyped } from 'svelte';
	import { setContext, getContext, onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';

	import type { View } from './../types';
	import router from './../router';
	import currentRoute from './../stores/state';

	import LoadingFallback from './Loading.svelte';
	import ErrorFallback from './Error.svelte';

	import {FirebaseAnalytics} from "@capacitor-community/firebase-analytics";
	import {user} from "@/stores";


	let className: string = '';
	export { className as class };


	const depthParent: number = getContext('_router' + router.getUID());
	const depth: number  = depthParent || depthParent === 0 ? depthParent + 1 : 0;
	setContext('_router' + router.getUID(), depth);

    /*
	let wrapper: HTMLElement = undefined;
    */

	let view: View | undefined = undefined;

	let userId = user.pull('id');

	let componentResolve: (arg0: unknown) => void;
	let component: Promise<ComponentType<SvelteComponentTyped>> = createPromise(undefined);


	router.subscribe(depth, unload);


	/* createPromise */
	function createPromise(componentView: View | undefined): Promise<ComponentType<SvelteComponentTyped>> {
		return new Promise((resolve, reject) => {
			(async() => {
				const waitForComponent = new Promise(r => { componentResolve = r; });
				await waitForComponent;
				if (componentView) {
					resolve((await componentView()).default);
				}
				else {
					reject(new Error('Component not found!'));
				}
			})();
		});
	}


	/* update */
	function update(): void {
		const viewNext: View | undefined = router.getComponent(depth);
		if (view !== viewNext) {
			view = viewNext;
			// console.log('FirebaseAnalytics.setScreenName: ' + viewNext?.name);
			/**
			 * Platform: Android/iOS
			 * Sets the current screen name, which specifies the current visual context in your app.
			 * @param screenName - name of the current screen to track
			 *        nameOverride - name of the screen class to override
			 * @returns instanceId - individual instance id value
			 * https://firebase.google.com/docs/analytics/screenviews
			 */
			let screenName	= viewNext?.name.toString();
			if (screenName) {
				FirebaseAnalytics.setScreenName({
					screenName,
					nameOverride: `${screenName}Screen`,
				});
			}
			const id = user.pull('id');
			if (userId != id) {
				userId = id;
				/**
				 * Platform: Web/Android/iOS
				 * Clears all analytics data for this app from the device and resets the app instance id.
				 * @param none
				 * @returns void
				 */
				FirebaseAnalytics.reset();
				// console.log('FirebaseAnalytics.setUserId: ' + userId);
				/**
				 * Platform: Web/Android/iOS
				 * Sets the user ID property.
				 * @param userId - unique identifier of a user
				 * @returns void
				 * https://firebase.google.com/docs/analytics/userid
				 */
				let userId_string = userId.toString();
				FirebaseAnalytics.setUserId({
					userId: userId_string,
				});
			}
			component = createPromise(viewNext);
			componentResolve(undefined);
		}
	}


	/* unload */
	function unload() {
		view = undefined;
		component = createPromise(undefined);
	}


	$: if ($currentRoute.url) update();


	onDestroy(() => {
		router.unsubscribe(depth, unload);
	});
</script>


<style>
	.component {
		width: 100%;
		height: 100%;
        /*
        overflow-y: scroll;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        -ms-overflow-style: none;
        scrollbar-width: none;
        */
	}
</style>


{#await component}
	<slot name="loading">
		<LoadingFallback />
	</slot>
{:then result}
	<!-- <div bind:this="{wrapper}" class="component {className}"> -->
    <div class="component {className}">
        {#key $currentRoute.path}
		    <svelte:component this="{result}" params="{$currentRoute.params}" />
        {/key}
	</div>
{:catch error}
	<slot name="error">
		<ErrorFallback message="{error.message}" />
	</slot>
{/await}
