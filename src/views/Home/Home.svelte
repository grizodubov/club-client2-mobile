<script lang="ts">
    import { onMount } from 'svelte';

    import { user, userFirstName } from '@/stores';

    import { type Event, EventCard, PollCard } from './components';
    import { type User, Avatar } from '@/components';

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
		return () => { sub.close(); }
	});



    const polls: { [key: string]: any }[] = [
        {
            question: 'Оцените по пятибалльной шкале Ваш общий интерес к мероприятиям Клуба',
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


<div class="w-full">

    <!-- Добро пожаловать -->
    <div class="bg-front w-full h-[128px] flex flex-col justify-between">
        <div class="flex justify-between items-start">
            <div class="mt-7">
                <div class="text-sm text-base-100 ml-3">Добро пожаловать,</div>
                <div class="text-2xl text-base-100 font-semibold ml-3"> {$userFirstName}!</div>
            </div>
            <div class="w-[56px] h-[56px] mr-4 mt-6 rounded-full border-2 border-base-100">
                <Avatar user="{currentUser}" />
            </div>
        </div>
        <div class="bg-base-100 rounded-t-2xl h-5"></div>
    </div>

    <!-- События-->
    <div class="font-semibold text-lg px-3">События</div>
    <div class="carousel w-full h-[176px] mt-3">
        {#each events as event (event.id)}
            <div class="carousel-item first:pl-1.5 last:pr-1.5">
                <EventCard event="{event}" />
            </div>
        {/each}
    </div>

    <!-- Опросы -->
    <div class="font-semibold text-lg px-3 mt-5">Опросы</div>
    {#each polls as poll (poll.id)}
        <PollCard poll="{poll}" />
    {/each}

    <!-- Партнеры -->
    <div class="flex w-full justify-between items-end px-3 mt-5 mb-5">
        <div class="font-semibold text-lg leading-5">Партнеры</div>
        <button class="opacity-60 text-sm leading-5 text-left">Все потенциальные партнеры</button>
    </div>
</div>
