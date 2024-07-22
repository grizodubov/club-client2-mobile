<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    import { router } from '@/libs/Router';

    import { type User, user, userFirstName } from '@/stores';

    import { type Event, EventCard, UserCard, Users, LogButton, ScannerButton } from './components';
    import { Avatar, PollCard } from '@/components';

    import { Device } from '@capacitor/device';

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
            if (infoTitle == 'Потенциальные партнёры')
                infoUpdate({
                    title: infoTitle,
                    users: recommendationsAll,
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
            if (infoTitle == 'Избранные контакты')
                infoUpdate({
                    title: infoTitle,
                    users: contacts,
                });
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

    let infoTitle = '';


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
        infoCreate(Users, {
            title: '',
            users: [],
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
    <div class="bg-front w-full h-[120px] flex flex-col justify-between shrink-0 grow-0">
        <div class="h-[100px]">
            <div class="flex h-[100px] justify-between items-center">
                <div class="ml-7 shrink-0 grow-0">
                    <button
                        class="w-[72px] h-[56px] flex items-end text-base-100"
                        on:click="{() => { router.go('/me'); }}"
                    >
                        <div class="w-[56px] h-[56px] mt-6 rounded-full border-[2px] border-base-100 shrink-0 grow-0">
                            <Avatar user="{currentUser}" />
                        </div>
                        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M10 17l5-5l-5-5v10z" fill="currentColor"></path></svg>
                    </button>
                </div>
                <div class="flex mr-7 shrink-0 grow-0">
                    <ScannerButton>
                        <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M24 28v-2h2v2z" fill="currentColor"></path><path d="M18 24v-2h2v2z" fill="currentColor"></path><path d="M18 30h4v-2h-2v-2h-2v4z" fill="currentColor"></path><path d="M26 26v-4h2v4z" fill="currentColor"></path><path d="M28 26h2v4h-4v-2h2v-2z" fill="currentColor"></path><path d="M26 20v-2h4v4h-2v-2h-2z" fill="currentColor"></path><path d="M24 20h-2v4h-2v2h4v-6z" fill="currentColor"></path><path d="M18 20v-2h4v2z" fill="currentColor"></path><path d="M6 22h4v4H6z" fill="currentColor"></path><path d="M14 30H2V18h12zM4 28h8v-8H4z" fill="currentColor"></path><path d="M22 6h4v4h-4z" fill="currentColor"></path><path d="M30 14H18V2h12zm-10-2h8V4h-8z" fill="currentColor"></path><path d="M6 6h4v4H6z" fill="currentColor"></path><path d="M14 14H2V2h12zM4 12h8V4H4z" fill="currentColor"></path></svg>
                    </ScannerButton>
                    <LogButton>
                        <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M28.707 19.293L26 16.586V13a10.014 10.014 0 0 0-9-9.95V1h-2v2.05A10.014 10.014 0 0 0 6 13v3.586l-2.707 2.707A1 1 0 0 0 3 20v3a1 1 0 0 0 1 1h7v.777a5.152 5.152 0 0 0 4.5 5.199A5.006 5.006 0 0 0 21 25v-1h7a1 1 0 0 0 1-1v-3a1 1 0 0 0-.293-.707zM19 25a3 3 0 0 1-6 0v-1h6zm8-3H5v-1.586l2.707-2.707A1 1 0 0 0 8 17v-4a8 8 0 0 1 16 0v4a1 1 0 0 0 .293.707L27 20.414z" fill="currentColor"></path></svg>
                    </LogButton>
                </div>
            </div>
            <!--<div class="text-base-100"><span class="text-sm">Добро пожаловать,</span><span class="text-xl font-medium">&nbsp;{$userFirstName}</span></div>-->
        </div>
        <div class="bg-base-100 rounded-t-2xl h-5"></div>
    </div>

    <div class="shrink-0 grow-0 h-[calc(100%-120px)]">
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
                        <div class="h-9 flex flex-col grow-0"><div class="font-semibold leading-[18px] text-left">Избранные</div><div class="font-semibold leading-[18px] text-left">контакты</div></div>
                        <div class="rounded-full w-9 h-9 text-center leading-9 ml-2.5 font-semibold bg-base-200 text-sm shrink-0"><span>{contacts.length}</span></div>
                    </div>
                    <button
                        class="btn btn-sm btn-front text-base-100" on:click="{() => {
                            infoTitle = 'Избранные контакты';
                            infoUpdate({
                                title: infoTitle,
                                users: contacts,
                            });
                            infoShow();
                        }}"
                    >Все контакты</button>
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
                            infoTitle = 'Потенциальные партнёры';
                            infoUpdate({
                                title: infoTitle,
                                users: recommendationsAll,
                            });
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
