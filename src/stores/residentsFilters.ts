import { derived } from 'svelte/store';

import { Store } from '@/helpers/store';


export type ResidentsFilters = {
    tags: boolean;
    interests: boolean;
    helpful: boolean;
    contacts: boolean;
};


const _default: ResidentsFilters = {
	tags: false,
    interests: false,
    helpful: false,
    contacts: false,
};


export const residentsFilters = new Store('residentsFilters', _default);


export const activeResidentsFiltersAmount = derived(residentsFilters, $residentsFilters => {
    return Object.keys(_default).reduce((sum: number, k: string) => sum + (($residentsFilters as ResidentsFilters)[k as keyof ResidentsFilters] ? 1 : 0), 0);
});
