import { derived } from 'svelte/store';

import { Store } from '@/helpers/store';


export type EventsFilters = {
    showCalendar: boolean;
    future: boolean;
    dateActive: Date | undefined;
};


const _default: EventsFilters = {
    showCalendar: true,
    future: true,
    dateActive: undefined,
};


export const eventsFilters = new Store('residentsFilters', _default);


export const activeEventsFiltersAmount = derived(eventsFilters, $eventsFilters => {
    return [ 'showCalendar', 'future' ].reduce((sum: number, k: string) => sum + (($eventsFilters as EventsFilters)[k as keyof EventsFilters] ? 1 : 0), 0);
});
