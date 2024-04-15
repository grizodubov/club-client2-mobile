import type { ComponentType } from 'svelte';

import { CupertinoPane } from 'cupertino-pane';

import { Store } from '@/helpers/store';


export type Modal = {
    instance: typeof CupertinoPane.prototype | null,
    component: null | ComponentType,
    params: undefined | { [key: string]: any },
};


const _default: Modal = {
	instance: null,
    component: null,
    params: undefined,
};


export const modal = new Store('modal', _default);
