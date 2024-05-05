<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    import { router } from '@/libs/Router';

    import { type User, user, userFirstName } from '@/stores';

    import { type Event, EventCard } from './components';
    import { Avatar, PollCard } from '@/components';

    import { subscribe } from '@/helpers/notification';

    import { Entity, collector } from '@/helpers/entity';
    import {
		eventsFeed,
	} from '@/queries/event';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;


    /* DATA: eventsFeedHandler */
	const eventsFeedHandler = new Entity({
		model: eventsFeed.model,
		retriever: eventsFeed.retriever,
        onSuccess: data => {
            eventsSelectedCache = Object.assign({}, data.events_selected);
            eventsThumbsupCache = Object.assign({}, data.events_thumbsup);
            events = [ ...data.events ];
        },
	});

    let eventsFeedLoading = eventsFeedHandler.loading;


    let events: Event[] = [];
    let eventsSelectedCache = {};
    let eventsThumbsupCache = {};


    $: currentUser = $user as User;


    /* get */
    function get() {
        const dt = new Date();
        dt.setHours(0, 0, 0, 0);
        collector.get([
            [ 
                eventsFeedHandler,
                {
                    from: dt.getTime(),
                    to: null,
                    find: false,
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



    const polls: { [key: string]: any }[] = [
        {
            text: 'Оцените по пятибалльной шкале Ваш общий интерес к мероприятиям Клуба',
            many: false,
            answers: [
                '5 - Отлично',
                '4 - Многое интересно',
                '3 - Скорее интересно',
                '2 - Мало пользы',
                '1 - Негативное отношение',
            ],
        },
    ];
</script>


<div 
    class="w-full h-full flex flex-col"
>

    <!-- Добро пожаловать -->
    <div class="bg-front w-full h-[128px] flex flex-col justify-between shrink-0 grow-0">
        <div class="flex justify-between items-center">
            <div class="shrink-1 grow-1 ml-7 flex flex-col items-start justify-center h-[108px]">
                <div class="text-sm text-base-100">Добро пожаловать,</div>
                <div class="text-2xl text-base-100 font-medium leading-[30px]"> {$userFirstName}!</div>
            </div>
            <button
                class="w-[72px] h-[56px] flex items-end mr-3 text-base-100"
                on:click="{() => { router.go('/me'); }}"
            >
                <div class="w-[56px] h-[56px] mt-6 rounded-full border-[2px] border-base-100 shrink-0 grow-0">
                    <Avatar user="{currentUser}" />
                </div>
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M10 17l5-5l-5-5v10z" fill="currentColor"></path></svg>
            </button>
        </div>
        <div class="bg-base-100 rounded-t-2xl h-5"></div>
    </div>

    <div class="shrink-0 grow-0 h-[calc(100%-128px)]">
        <div class="mt-[-20px] h-[calc(100%+20px)] rounded-2xl scrollable-y">

            <!-- События-->
            <div class="font-semibold text-lg px-3 mt-6 mb-5">События</div>
            <div class="h-[202px] overflow-y-hidden">
                {#if $eventsFeedLoading}
                    <div class="w-full h-[202px] flex justify-center items-center">
                        <span class="loading loading-bars text-front laoding-lg"></span>
                    </div>
                {:else}
                    <div class="carousel w-full h-[202px]">
                        {#each events as event (event.id)}
                            <div
                                class="carousel-item last:pr-3"
                                in:fade="{{ duration: 100 }}"
                            >
                                <EventCard event="{event}" />
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>

            <!-- Опросы -->
            <div class="font-semibold text-lg px-3 mt-6 mb-5">Опросы</div>
            {#each polls as poll (poll.id)}
                <div
                    in:fade="{{ duration: 100 }}"
                >
                    <PollCard poll="{poll}" />
                </div>
            {/each}

            <!-- Партнеры -->
            <div class="flex w-full justify-between items-end px-3 mt-6 mb-5">
                <div class="font-semibold text-lg leading-5">Партнеры</div>
                <button class="opacity-60 text-sm leading-5 text-left">Все потенциальные партнеры</button>
            </div>

        </div>
    </div>

</div>
