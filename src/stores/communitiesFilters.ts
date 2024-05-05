import { derived } from 'svelte/store';

import { Store } from '@/helpers/store';


export type CommunitiesFilters = {
    name: string;
};


const _default: CommunitiesFilters = {
    name: '',
};


export const communitiesFilters = new Store('communitiesFilters', _default);


export const activeCommunitiesFiltersAmount = derived(communitiesFilters, $communitiesFilters => {
    return [ ].reduce((sum: number, k: string) => sum + (($communitiesFilters as CommunitiesFilters)[k as keyof CommunitiesFilters] ? 1 : 0), 0);
});
