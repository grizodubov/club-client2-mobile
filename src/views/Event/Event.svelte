<script lang="ts">
    import { onMount } from 'svelte';

    import { subscribe } from '@/helpers/notification';

    import { Entity, collector } from '@/helpers/entity';
    import {
		eventInfo,
	} from '@/queries/event'


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;


    let event: any;
    let residents: any[] = [];


    /* DATA: eventInfoHandler */
	const eventInfoHandler = new Entity({
		model: eventInfo.model,
		retriever: eventInfo.retriever,
        onSuccess: data => {
            event = data.event;
            residents = data.residents;
        },
	});


    /* get */
    function get() {
        collector.get([
            [ 
                eventInfoHandler,
                {
                    id: parseInt(params?.id)
                }
            ],
        ]);
    }

    
    /* refresh */
    function refresh() {
        get();
    }


    /* onMount */
	onMount(() => {
        get();
        const sub = subscribe('events', refresh);
        return () => {
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
            <div class="shrink-1 grow-1 flex jsutify-center">
                <div class="mt-6 w-[88px] h-[12px]">
                    <div class="absolute w-[92px] h-[92px] rounded-full overflow-hidden paddin-2 border-4 border-base-100 bg-base-100">
                        {#if event}
                            <img class="max-w-full max-h-full" src="https://static.clubgermes.ru/events/{event.id}/icon.png" alt="{event.name}" />
                        {/if}
                    </div>
                </div>
            </div>
            <div class="w-[56px] h-[56px] mr-4 mt-4 shrink-0 grow-0 flex items-center justify-center">
                &nbsp;
            </div>
        </div>
        <div class="bg-base-100 rounded-t-2xl h-5"></div>
    </div>

    <div class="shrink-0 grow-0 h-[calc(100%-112px)]">
        <div class="mt-[-20px] h-[calc(100%+20px)] rounded-2xl scrollable-y">


                <!--
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
                -->

        </div>
    </div>

</div>
