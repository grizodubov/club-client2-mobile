import { writable, get } from 'svelte/store';

import type { Route } from './../types';


const { subscribe, set, update } = writable({
	url: '',
	path: '',
	params: {},
	query: {},
	meta: {},
} as Route);


const currentRoute = {
	subscribe,

	/* assign */
	assign: (r: Route) => update((self) => {
		return Object.assign(self, r);
	}),

	/* extract */
	extract: (prop: string) => {
		return prop ? get(currentRoute)[prop] : get(currentRoute);
	},
};


export default currentRoute;
