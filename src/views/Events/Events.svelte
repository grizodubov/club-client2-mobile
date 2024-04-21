<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    import { CupertinoPane } from 'cupertino-pane';

    import { Filters, EventCard, Calendar, CalendarSlider } from './components';

    import { modalCreate, modalDestroy, modalShow } from '@/helpers/modal';

    import { type EventsFilters, eventsFilters, activeEventsFiltersAmount } from '@/stores';

    import { dateKey } from '@/utils/dates';

    import { subscribe } from '@/helpers/notification';

    import { Entity, collector } from '@/helpers/entity';
    import {
		eventsFeed,
	} from '@/queries/event'


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;


    $: filters = $eventsFilters as EventsFilters;


    let swiperIntance: any;
    let calendar: any;
    let calendarSlider: any;

    let firstRun = true;

    let events: { [key: string]: any } = {};
    let eventsSelectedCache = {};
    let eventsThumbsupCache = {};

    let dateActive: Date = new Date();
    dateActive.setHours(0, 0, 0, 0);

    let eventsFiltered: any[] = [];

    let sync: boolean = false;


    let tmFilter: ReturnType<typeof setTimeout> | null = null;


    $: filters, events, filterEvents();


    /* DATA: eventsFeedHandler */
	const eventsFeedHandler = new Entity({
		model: eventsFeed.model,
		retriever: eventsFeed.retriever,
        onSuccess: data => {
            eventsSelectedCache = Object.assign({}, data.events_selected);
            eventsThumbsupCache = Object.assign({}, data.events_thumbsup);
            const temp: { [key: string]: any } = {};
            data.events.forEach((event: any) => {
                const d = new Date(event.time_event);
                const k = dateKey(d);
                if (!temp.hasOwnProperty(k))
                    temp[k] = [];
                temp[k].push(event);
            });
            events = temp;
        },
	});

    let eventsFeedLoading = eventsFeedHandler.loading;

    let eventsFilterLoading = false;
    let calendarOpen = true;


    /* filterEvents */
    function filterEvents() {
        if (dateActive) {
            eventsFiltered = [];
            eventsFilterLoading = true;
            if (tmFilter)
                clearTimeout(tmFilter);
            tmFilter = setTimeout(
                () => {
                    const temp: any[] = [];
                    if (dateActive) {
                        const k = dateKey(dateActive);
                        if (events.hasOwnProperty(k))
                            temp.push(...events[k]);
                        if (filters.future) {
                            const t = new Date();
                            const tk = dateKey(t);
                            const dates = Object.keys(events);
                            dates.sort();
                            let flag = true;
                            dates.filter(d => d >= tk).map(ck => {
                                if (flag) {
                                    temp.push({ id: -1 });
                                    flag = false;
                                }
                                temp.push(...events[ck]);
                            });
                        }
                    }
                    eventsFiltered = temp;
                    eventsFilterLoading = false;
                }, 250
            );
        }
    }


    /* swiperCreate */
    function swiperCreate() {
        swiperIntance = new CupertinoPane('#events-swiper', {
            inverse: true,
            bottomClose: false,
            initialBreak: 'top',
            backdrop: false,
            breaks: {
                top: { enabled: true, height: 500 },
                middle: { enabled: false },
                bottom: { enabled: true, height: 50 },
            },
            preventClicks: true,
            clickBottomOpen: true,
            cssClass: 'swiper-fix',
        });
        swiperIntance.on('onTransitionStart', () => {
            calendarOpen = true;
        });
        swiperIntance.on('onTransitionEnd', () => {
            setTimeout(() => {
                if (swiperIntance.currentBreak() == 'bottom') {
                    calendarOpen = false;
                    swiperIntance.settings.preventClicks = true;
                }
                else {
                    calendarOpen = true;
                    swiperIntance.settings.preventClicks = false;
                }
            }, 20);
        });
        swiperIntance.present({animate: false});
    }


    /* get */
    function get() {
        if (calendar) {
            collector.get([
                [ 
                    eventsFeedHandler,
                    {
                        from: calendar.getStartDate().getTime(),
                        to: calendar.getFinishDate().getTime(),
                        find: firstRun,
                    }
                ],
            ]);
            firstRun = false;
        }
    }

    
    /* refresh */
    function refresh() {
        get();
    }


    /* onMount */
	onMount(() => {
        modalCreate(Filters, undefined);
        swiperCreate();
        if (calendar && calendarSlider) {
            calendarSlider.createCalendarRange(calendar.getStartDate(), calendar.getFinishDate());
            calendarSlider.setActiveDate(calendar.getActiveDate());
            sync = true;
        }
        get();
        const sub = subscribe('events', refresh);
        return () => {
            modalDestroy();
            sub.close();
        };
	});
</script>


<div 
    class="w-full h-full flex flex-col"
>

    <div class="bg-front w-full h-[112px] flex flex-col justify-between shrink-0 grow-0">
        <div class="flex justify-between items-start">
            <div class="w-[56px] h-[56px] ml-4 mt-4 shrink-0 grow-0 flex items-center justify-center">
                <button
                    class="text-base-100 w-8 h-8 flex items-center justify-center"
                    on:click="{() => {
                        history.back();
                    }}"
                >
                    <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M14 26l1.41-1.41L7.83 17H28v-2H7.83l7.58-7.59L14 6L4 16l10 10z" fill="currentColor"></path></svg>
                </button>
            </div>
            <div class="mt-4 leading-[56px] h-[56px] shrink-1 grow-1 text-center text-base-100 text-xl font-medium">
                События
            </div>
            <div class="w-[56px] h-[56px] mr-4 mt-4 shrink-0 grow-0 flex items-center justify-center">
                <button
                    class="relative text-base-100 w-8 h-8 flex items-center justify-center"
                    on:click="{() => {
                        modalShow();
                    }}"
                >
                    <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M30 8h-4.1c-.5-2.3-2.5-4-4.9-4s-4.4 1.7-4.9 4H2v2h14.1c.5 2.3 2.5 4 4.9 4s4.4-1.7 4.9-4H30V8zm-9 4c-1.7 0-3-1.3-3-3s1.3-3 3-3s3 1.3 3 3s-1.3 3-3 3z" fill="currentColor"></path><path d="M2 24h4.1c.5 2.3 2.5 4 4.9 4s4.4-1.7 4.9-4H30v-2H15.9c-.5-2.3-2.5-4-4.9-4s-4.4 1.7-4.9 4H2v2zm9-4c1.7 0 3 1.3 3 3s-1.3 3-3 3s-3-1.3-3-3s1.3-3 3-3z" fill="currentColor"></path></svg>
                    {#if $activeEventsFiltersAmount}
                        <div class="absolute w-[18px] h-[18px] bg-secondary text-base-100 flex items-center justify-center text-[10px] font-medium rounded-full top-5 left-5"><span>{$activeEventsFiltersAmount}</span></div>
                    {/if}
                </button>
            </div>
        </div>
        <div class="bg-base-100 rounded-t-2xl h-5"></div>
    </div>

    <div class="shrink-0 grow-0 h-[calc(100%-112px)]">
        <div class="mt-[-20px] h-[calc(100%+20px)] rounded-2xl overflow-hidden">
            <div class="relative h-full">
                <div class="absolute w-full mt-12">
                    <CalendarSlider
                        bind:this="{calendarSlider}"
                        events="{events}"
                        on:dateActiveChange="{(event) => {
                            if (sync) {
                                dateActive = event.detail;
                                if (calendar)
                                    calendar.setActiveDate(dateActive);
                                filterEvents();
                            }
                        }}"
                    />
                </div>
                <div
                    class="h-full transition-all"
                    class:scrollable-y="{!calendarOpen}"
                    class:overflow-y-hidden="{calendarOpen}"
                    class:opacity-20="{calendarOpen}"
                >
                    {#if $eventsFeedLoading || eventsFilterLoading}
                        <div class="w-full h-full flex justify-center items-center">
                            <span class="loading loading-bars text-front laoding-lg"></span>
                        </div>
                    {:else}
                        {#each eventsFiltered as event}
                            <div
                                class="mb-5 first:mt-[164px]"
                                in:fade="{{ duration: 100 }}"
                            >
                                {#if event.id == -1}
                                    <div class="font-semibold text-lg px-3">Ближайшие события</div>
                                {:else}
                                    <EventCard event="{event}" />
                                {/if}
                            </div>
                        {/each}
                    {/if}
                </div>
                <div class="absolute top-0 left-[4px]">
                    <div id="events-swiper" style="height: 500px;">
                        <Calendar
                            bind:this="{calendar}"
                            events="{events}"
                            on:dateActiveChange="{(event) => {
                                dateActive = event.detail;
                                if (calendarSlider)
                                    calendarSlider.setActiveDate(dateActive);
                                filterEvents();
                                if (swiperIntance)
                                    swiperIntance.moveToBreak('bottom');
                            }}"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>
