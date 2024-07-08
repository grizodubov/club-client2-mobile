<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    import { router } from '@/libs/Router';

    import { type User, user, userFirstName } from '@/stores';

    import { type Event, EventCard, UserCard, Partners } from './components';
    import { Avatar, PollCard } from '@/components';

    import { subscribe } from '@/helpers/notification';

    import { Entity, collector } from '@/helpers/entity';

    import { infoCreate, infoDestroy, infoShow, infoUpdate } from '@/helpers/info';

    import {
		eventsFeed,
	} from '@/queries/event';

    import {
		userRecommendations,
        userContacts,
	} from '@/queries/user';

    import {
		getRatingPolls,
	} from '@/queries/poll';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;


    let start = true;


    /* DATA: eventsFeedHandler */
	const eventsFeedHandler = new Entity({
		model: eventsFeed.model,
		retriever: eventsFeed.retriever,
        onSuccess: data => {
            start = false;
            eventsSelectedCache = Object.assign({}, data.events_selected);
            eventsThumbsupCache = Object.assign({}, data.events_thumbsup);
            events = [ ...data.events ];
        },
	});

    let eventsFeedLoading = eventsFeedHandler.loading;


    /* DATA: userRecommendationsHandler */
	const userRecommendationsHandler = new Entity({
		model: userRecommendations.model,
		retriever: userRecommendations.retriever,
        onSuccess: data => {
            const temp: any[] = [
                /*
                ...data.interests.map((u: any) => {
                    u.interestsLinked = u.tags.split(/,/).filter((t: string) => t.indexOf('~') > -1).map((t: string) => t.replace(/~/g, '').trim());
                    u.tagsLinked = [];
                    u.interests = '';
                    u.tags = '';
                    return u;
                }),
                ...data.tags.map((u: any) => {
                    u.tagsLinked = u.tags.split(/,/).filter((t: string) => t.indexOf('~') > -1).map((t: string) => t.replace(/~/g, '').trim());
                    u.interestsLinked = [];
                    u.interests = '';
                    u.tags = '';
                    return u;
                }),
                */
                ...data.interests,
                ...data.tags,
            ];
            recommendations = temp;
            recommendationsAll = [
                ...data.interests_all,
                ...data.tags_all.filter((r: any) => !data.interests_all.find((f: any) => r.id == f.id)),
            ];
            infoUpdate({
                partners: recommendationsAll,
            });
        },
	});

    let userRecommendationsLoading = userRecommendationsHandler.loading;


    /* DATA: userContactsHandler */
	const userContactsHandler = new Entity({
		model: userContacts.model,
		retriever: userContacts.retriever,
        onSuccess: data => {
            start = false;
            contacts = data.contacts.filter((c: any) => c.type == 'person' && c.id != 8000);
        },
	});

    let userContactsLoading = userContactsHandler.loading;


    /* DATA: getRatingPollsHandler */
	const getRatingPollsHandler = new Entity({
		model: getRatingPolls.model,
		retriever: getRatingPolls.retriever,
        onSuccess: data => {
            start = false;
            ratingPolls = data.polls;
            ratingVotes = data.votes;
        },
	});

    let getRatingPollsLoading = getRatingPollsHandler.loading;


    let events: Event[] = [];
    let eventsSelectedCache = {};
    let eventsThumbsupCache = {};

    let recommendations: any[] = [];
    let recommendationsAll: any[] = [];

    let contacts: any[] = [];

    let ratingPolls: any[] = [];
    let ratingVotes: any[] = [];


    $: currentUser = $user as User;


    /* getEvents */
    function getEvents() {
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


    /* getRecommendations */
    function getRecommendations() {
        collector.get([
            [ 
                userRecommendationsHandler,
                {}
            ],
        ]);
    }


    /* getContacts */
    function getContacts() {
        collector.get([
            [ 
                userContactsHandler,
                {}
            ],
        ]);
    }


    /* getPolls */
    function getPolls() {
        collector.get([
            [ 
                getRatingPollsHandler,
                {}
            ],
        ]);
    }

    
    /* refresh */
    function refresh() {
        getEvents();
        getPolls();
        getContacts();
        getRecommendations();
    }


    /* onMount */
	onMount(() => {
        infoCreate(Partners, {
            partners: [],
        });
        refresh();
		const sub = subscribe('events', refresh);
		return () => {
            infoDestroy();
            sub.close();
        };
	});
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
            {#if events.length}
                <div class="flex justify-between items-center h-9 mt-6 mb-5 px-3">
                    <div class="flex justify-start items-center">
                        <div class="font-semibold text-lg leading-9">События</div>
                        <div class="rounded-full w-9 h-9 text-center leading-9 ml-2.5 font-semibold bg-base-200 text-sm"><span>{events.length}</span></div>
                    </div>
                </div>
                <div class="h-[202px] overflow-y-hidden">
                    {#if start && $eventsFeedLoading}
                        <div class="w-full h-[202px] flex justify-center items-center">
                            <span class="loading loading-bars text-front"></span>
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
            {/if}

            <!-- Опросы -->
            {#if ratingPolls.length}
                <div class="flex justify-between items-center h-9 mt-6 mb-5 px-3">
                    <div class="flex justify-start items-center">
                        <div class="font-semibold text-lg leading-9">Опросы</div>
                        <div class="rounded-full w-9 h-9 text-center leading-9 ml-2.5 font-semibold bg-base-200 text-sm"><span>{ratingPolls.length}</span></div>
                    </div>
                </div>
                <div class="mb-5">
                    {#if start && $getRatingPollsLoading}
                        <div class="w-full py-6 flex justify-center items-center">
                            <span class="loading loading-bars text-front"></span>
                        </div>
                    {:else}
                        {#each ratingPolls as poll (poll.id)}
                            <div
                                in:fade="{{ duration: 100 }}"
                            >
                                <PollCard poll="{poll}" />
                            </div>
                        {/each}
                    {/if}
                </div>
            {/if}


            <!-- Контакты -->
            {#if contacts.length}
                <div class="flex justify-between items-center h-9 mt-6 mb-5 px-3">
                    <div class="flex justify-start items-center">
                        <div class="font-semibold text-lg leading-9">Контакты</div>
                        <div class="rounded-full w-9 h-9 text-center leading-9 ml-2.5 font-semibold bg-base-200 text-sm"><span>{contacts.length}</span></div>
                    </div>
                </div>
                <div class="h-[172px] overflow-y-hidden mb-5">
                    {#if start && $userContactsLoading}
                        <div class="w-full h-[172px] flex justify-center items-center">
                            <span class="loading loading-bars text-front"></span>
                        </div>
                    {:else}
                        <div class="carousel w-full h-full">
                            {#each contacts as contact}
                                <div
                                    class="carousel-item last:pr-3"
                                    in:fade="{{ duration: 100 }}"
                                >
                                    <UserCard user="{contact}" showTags="{false}" />
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/if}


            <!-- Партнёры -->
            {#if recommendations.length}
                <div class="flex justify-between items-center h-9 mt-6 mb-5 px-3">
                    <div class="flex justify-start items-center">
                        <div class="h-9 flex flex-col grow-0"><div class="font-semibold leading-[18px] text-left">Потенциальные</div><div class="font-semibold leading-[18px] text-left">партнёры</div></div>
                        <div class="rounded-full w-9 h-9 text-center leading-9 ml-2.5 font-semibold bg-base-200 text-sm shrink-0"><span>{recommendationsAll.length}</span></div>
                    </div>
                    <button
                        class="btn btn-sm btn-front text-base-100" on:click="{() => {
                            infoUpdate({});
                            infoShow();
                        }}"
                    >Все партнёры</button>
                </div>
                <div class="h-[172px] overflow-y-hidden mb-5">
                    {#if start && $userRecommendationsLoading}
                        <div class="w-full h-[172px] flex justify-center items-center">
                            <span class="loading loading-bars text-front"></span>
                        </div>
                    {:else}
                        <div class="carousel w-full h-full">
                            {#each recommendations as userRecommended}
                                <div
                                    class="carousel-item last:pr-3"
                                    in:fade="{{ duration: 100 }}"
                                >
                                    <UserCard user="{userRecommended}" showTags="{false}" />
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/if}

        </div>
    </div>

</div>
