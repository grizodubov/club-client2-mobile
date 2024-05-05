import { derived } from 'svelte/store';

import { Store } from '@/helpers/store';


export type CommunityFilters = {
};


const _default: CommunityFilters = {
};


export const communityFilters = new Store('communityFilters', _default);


export const activeCommunityFiltersAmount = derived(communityFilters, $communityFilters => {
    return [ ].reduce((sum: number, k: string) => sum + (($communityFilters as CommunityFilters)[k as keyof CommunityFilters] ? 1 : 0), 0);
});
