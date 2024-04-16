import { derived } from 'svelte/store';

import { Store } from '@/helpers/store';


export type ResidentsFilters = {
    tags: boolean,
    interests: boolean,
    helpful: boolean,
};


const _default: ResidentsFilters = {
	tags: false,
    interests: false,
    helpful: false,
};


export const residentsFilters = new Store('residentsFilters', _default);


export const activeFiltersAmount = derived(residentsFilters, $residentsFilters => {
    return Object.keys(_default).reduce((sum: number, k: string) => sum + (($residentsFilters as ResidentsFilters)[k as keyof ResidentsFilters] ? 1 : 0), 0);
});
