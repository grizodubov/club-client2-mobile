import { derived } from 'svelte/store';

import { Store } from '@/helpers/store';


export type EventsFilters = {
};


const _default: EventsFilters = {
};


export const eventsFilters = new Store('residentsFilters', _default);


export const activeEventsFiltersAmount = derived(eventsFilters, $eventsFilters => {
    return Object.keys(_default).reduce((sum: number, k: string) => sum + (($eventsFilters as EventsFilters)[k as keyof EventsFilters] ? 1 : 0), 0);
});
