import { derived } from 'svelte/store';

import { Store } from '@/helpers/store';


export type ResidentsFilters = {
    tags: boolean;
    interests: boolean;
    helpful: boolean;
    contacts: boolean;
    name: string;
    strict: boolean;
};


const _default: ResidentsFilters = {
	tags: false,
    interests: false,
    helpful: false,
    contacts: false,
    name: '',
    strict: true,
};


export const residentsFilters = new Store('residentsFilters', _default);


export const activeResidentsFiltersAmount = derived(residentsFilters, $residentsFilters => {
    return [ 'tags', 'interests', 'helpful', 'contacts' ].reduce((sum: number, k: string) => sum + (($residentsFilters as ResidentsFilters)[k as keyof ResidentsFilters] ? 1 : 0), 0);
});
