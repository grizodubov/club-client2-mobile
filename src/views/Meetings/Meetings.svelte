<script lang="ts">
    import { onMount } from 'svelte';

    import { type User, user, bindings } from '@/stores';

    import { EventCard, OfflineCard, OnlineCard, RequestCard } from './components';

    import { subscribe } from '@/helpers/notification';

    import { Entity, collector } from '@/helpers/entity';
    import {
        userEventsConnectionsAll,
    } from '@/queries/user';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;


    $: currentUser = $user as User;


    let start = true;


    let meetings: { [key: string]: any }[] = [];
    let meetingsOffline: { [key: string]: any }[] = [];
    let meetingsOnline: { [key: string]: any }[] = [];
    let meetingsRequests: { [key: string]: any }[] = [];


    $: meetingsFiltered = parseData(meetings, filter);
    $: meetingsOfflineFiltered = parseOfflineData(meetingsOffline, filter);
    $: meetingsOnlineFiltered = parseOnlineData(meetingsOnline, filter);
    $: meetingsRequestsFiltered = parseRequestsData(meetingsRequests, filter);


    $: amount2 = ($bindings as any).pendings;

    $: amount3 = ($bindings as any).requests;


    let amountTotal = 0;
    let amountFiltered = 0;


    let archive = false;
    let requests = params && params['section'] && params['section'] == 'requests' ? true : false;


    let filter = {
        state: {
            t: true,
            f: true,
        },
        mark: {
            t: false,
            f: true,
        },
    };


    /* parseData */
    function parseData(list: any[], f: any) {
        const result: any[] = [];
        const ln = list.length;
        for (let i = 0; i < ln; i ++) {
            const users = list[i].users.filter(u => {
                if (archive) {
                    if (u.connection.state) {
                        amountTotal += 1;
                        const mark = u.connection.user_1_id == currentUser.id ? u.connection.user_rating_1 : u.connection.user_rating_2;
                        if ((mark !== null && f.mark.t) || (mark === null && f.mark.f))
                            amountFiltered += 1;
                        return (mark !== null && f.mark.t) || (mark === null && f.mark.f);
                    }
                }
                else {
                    if (!u.connection.state)
                        amountTotal += 1;
                    return !u.connection.state;
                }
            });
            if (users.length) {
                result.push(Object.assign(list[i], { 'usersFiltered': users }));
            }
        }
        return result;
    }


    /* parseOfflineData */
    function parseOfflineData(list: any[], f: any) {
        const result: any[] = [];
        const ln = list.length;
        for (let i = 0; i < ln; i ++) {
            if (archive) {
                if (list[i].connection.state) {
                    const mark = list[i].connection.user_1_id == currentUser.id ? list[i].connection.user_rating_1 : list[i].connection.user_rating_2;
                    amountTotal += 1;
                    if ((mark !== null && f.mark.t) || (mark === null && f.mark.f)) {
                        result.push(list[i]);
                        amountFiltered += 1;
                    }
                }
            }
            else {
                if (!list[i].connection.state) {
                    amountTotal += 1;
                    result.push(list[i]);
                }
            }
        }
        return result;
    }


    /* parseOnlineData */
    function parseOnlineData(list: any[], f: any) {
        const result: any[] = [];
        const ln = list.length;
        for (let i = 0; i < ln; i ++) {
            if (archive) {
                if (list[i].connection.state) {
                    const mark = list[i].connection.user_1_id == currentUser.id ? list[i].connection.user_rating_1 : list[i].connection.user_rating_2;
                    amountTotal += 1;
                    if ((mark !== null && f.mark.t) || (mark === null && f.mark.f)) {
                        result.push(list[i]);
                        amountFiltered += 1;
                    }
                }
            }
            else {
                if (!list[i].connection.state) {
                    amountTotal += 1;
                    result.push(list[i]);
                }
            }
        }
        return result;
    }


    /* parseRequestsData */
    function parseRequestsData(list: any[], f: any) {
        const result: any[] = [];
        const ln = list.length;
        for (let i = 0; i < ln; i ++) {
            if (requests) {
                amountTotal += 1;
                result.push(list[i]);
            }
        }
        return result;
    }


    /* DATA: userEventsConnectionsAllHandler */
	const userEventsConnectionsAllHandler = new Entity({
		model: userEventsConnectionsAll.model,
		retriever: userEventsConnectionsAll.retriever,
        onSuccess: data => {
            start = false;
            amountTotal = 0;
            amountFiltered = 0;
            meetings = data.events;
            meetingsOffline = data.offline;
            meetingsOnline = data.online;
            meetingsRequests = data.requests;
        },
	});

    let userEventsConnectionsAllLoading = userEventsConnectionsAllHandler.loading;


    /* get */
    function get() {
        collector.get([
            [ 
                userEventsConnectionsAllHandler,
                {
                    archive: archive,
                    requests: requests,
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
            <div class="mt-4 leading-[56px] h-[56px] shrink-1 grow-1 text-center text-base-100 text-xl font-medium">
                Встречи и контакты
            </div>
            <div class="w-[56px] h-[56px] mr-4 mt-4 shrink-0 grow-0 flex items-center justify-center">
                &nbsp;
            </div>
        </div>
        <div class="bg-base-100 rounded-t-2xl h-5"></div>
    </div>

    <div class="shrink-0 grow-0 h-[calc(100%-112px)]">
        <div class="mt-[-20px] h-[calc(100%+20px)] rounded-2xl">
            <div class="h-full flex flex-col">
                <div class="w-full h-[64px] mb-3 shrink-0 grow-0 px-3">
                    <div class="w-full mt-4 h-[48px] bg-base-200 rounded-full flex justify-between">
                        <button
                            class="relative flex items-center justify-center basis-3/6 h-[48px] transition-all duration-300 rounded-full"
                            class:bg-base-200="{archive || requests}"
                            class:bg-success="{!archive && !requests}"
                            class:text-base-100="{!archive && !requests}"
                            on:click="{() => {
                                if (archive || requests) {
                                    archive = false;
                                    requests = false;
                                    start = true;
                                    refresh();
                                }
                            }}"
                        >
                            <!--<svg class="text-success w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 352 512"><path d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78c16.52 18.85 42.36 58.23 52.21 91.45c.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78c9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176C352 78.61 272.91-.3 175.45 0C73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80c0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112c8.84 0 16 7.16 16 16s-7.16 16-16 16z" fill="currentColor"></path></svg>-->
                            <span class="text-sm leading-6">Назначенные</span>
                        </button>
                        <button
                            class="relative flex items-center justify-center basis-3/6 h-[48px] transition-all duration-300 rounded-full"
                            class:bg-base-200="{!requests}"
                            class:bg-success="{requests}"
                            class:text-base-100="{requests}"
                            on:click="{() => {
                                if (!requests) {
                                    archive = false;
                                    requests = true;
                                    start = true;
                                    refresh();
                                }
                            }}"
                        >
                            <!--<svg class="text-secondary w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 384 512"><path d="M202.021 0C122.202 0 70.503 32.703 29.914 91.026c-7.363 10.58-5.093 25.086 5.178 32.874l43.138 32.709c10.373 7.865 25.132 6.026 33.253-4.148c25.049-31.381 43.63-49.449 82.757-49.449c30.764 0 68.816 19.799 68.816 49.631c0 22.552-18.617 34.134-48.993 51.164c-35.423 19.86-82.299 44.576-82.299 106.405V320c0 13.255 10.745 24 24 24h72.471c13.255 0 24-10.745 24-24v-5.773c0-42.86 125.268-44.645 125.268-160.627C377.504 66.256 286.902 0 202.021 0zM192 373.459c-38.196 0-69.271 31.075-69.271 69.271c0 38.195 31.075 69.27 69.271 69.27s69.271-31.075 69.271-69.271s-31.075-69.27-69.271-69.27z" fill="currentColor"></path></svg>-->
                            <span class="text-sm leading-6">Запрошенные</span>
                            {#if amount3}<span class="absolute top-[-4px] right-[4px] w-[18px] h-[18px] bg-error text-base-100 flex items-center justify-center text-[10px] font-medium rounded-full"><span>{amount3}</span></span>{/if}
                        </button>
                        <button
                            class="relative flex items-center justify-center basis-3/6 h-[48px] transition-all duration-300 rounded-full"
                            class:bg-base-200="{!archive}"
                            class:bg-success="{archive}"
                            class:text-base-100="{archive}"
                            on:click="{() => {
                                if (!archive) {
                                    archive = true;
                                    requests = false;
                                    start = true;
                                    refresh();
                                }
                            }}"
                        >
                            <!--<svg class="text-warning w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M32 448c0 17.7 14.3 32 32 32h384c17.7 0 32-14.3 32-32V160H32v288zm160-212c0-6.6 5.4-12 12-12h104c6.6 0 12 5.4 12 12v8c0 6.6-5.4 12-12 12H204c-6.6 0-12-5.4-12-12v-8zM480 32H32C14.3 32 0 46.3 0 64v48c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16V64c0-17.7-14.3-32-32-32z" fill="currentColor"></path></svg>-->
                            <span class="text-sm leading-6">Архив{#if archive}<span class="ml-1.5 font-extralight tracking-widest">(<span>{amountFiltered}</span>/<span>{amountTotal}</span>)</span>{/if}</span>
                            {#if amount2}<span class="absolute top-[-4px] right-[4px] w-[18px] h-[18px] bg-error text-base-100 flex items-center justify-center text-[10px] font-medium rounded-full"><span>{amount2}</span></span>{/if}
                        </button>
                    </div>
                </div>
                {#if archive}
                    <div class="w-full px-3 mb-4 shrink-0 grow-0">
                        <button
                            class="flex items-center justify-start ml-3"
                            on:click="{() => {
                                amountTotal = 0;
                                amountFiltered = 0;
                                filter.mark.t = !filter.mark.t;
                                filter.mark.f = true;
                            }}"
                        >
                            <span
                                class="rounded-full w-7 h-7 border-2 border-success transition-all duration-200 flex items-center justify-center shrink-0 grow-0"
                                class:bg-success="{!filter.mark.t}"
                            >
                                <svg class="w-4 h-4 text-base-100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                            </span>
                            <span class="font-medium text-sm ml-2.5">Показать только без оценки</span>
                        </button>
                    </div>
                    <!--
                    <div class="w-full flex justify-about px-3 items-center mb-4 srink-0 grow-0">
                        <div class="w-full">
                            <div class="text-left text-xs mb-2">Встреча состоялась:</div>
                            <div class="flex">
                                <button
                                    class="flex items-center justify-start"
                                    on:click="{() => {
                                        filter.state.t = true;
                                        filter.state.f = true;
                                    }}"
                                >
                                    <span
                                        class="rounded-full w-6 h-6 border-2 border-secondary transition-all duration-200 flex items-center justify-center shrink-0 grow-0"
                                        class:bg-secondary="{filter.state.t && filter.state.f}"
                                    >
                                        <svg class="w-3 h-3 text-base-100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                                    </span>
                                    <span class="font-medium text-sm ml-1.5">все</span>
                                </button>
                                <button
                                    class="flex items-center justify-start ml-3"
                                    on:click="{() => {
                                        filter.state.t = true;
                                        filter.state.f = false;
                                    }}"
                                >
                                    <span
                                        class="rounded-full w-6 h-6 border-2 border-success transition-all duration-200 flex items-center justify-center shrink-0 grow-0"
                                        class:bg-success="{filter.state.t && !filter.state.f}"
                                    >
                                        <svg class="w-3 h-3 text-base-100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                                    </span>
                                    <span class="font-medium text-sm ml-1.5">да</span>
                                </button>
                                <button
                                    class="flex items-center justify-start ml-3"
                                    on:click="{() => {
                                        filter.state.t = false;
                                        filter.state.f = true;
                                    }}"
                                >
                                    <span
                                        class="rounded-full w-6 h-6 border-2 border-error transition-all duration-200 flex items-center justify-center shrink-0 grow-0"
                                        class:bg-error="{!filter.state.t && filter.state.f}"
                                    >
                                        <svg class="w-3 h-3 text-base-100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                                    </span>
                                    <span class="font-medium text-sm ml-1.5">нет</span>
                                </button>
                            </div>
                        </div>
                        <div class="w-full">
                            <div class="text-left text-xs mb-2">Дана оценка:</div>
                            <div class="flex">
                                <button
                                    class="flex items-center justify-start"
                                    on:click="{() => {
                                        filter.mark.t = true;
                                        filter.mark.f = true;
                                    }}"
                                >
                                    <span
                                        class="rounded-full w-6 h-6 border-2 border-secondary transition-all duration-200 flex items-center justify-center shrink-0 grow-0"
                                        class:bg-secondary="{filter.mark.t && filter.mark.f}"
                                    >
                                        <svg class="w-3 h-3 text-base-100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                                    </span>
                                    <span class="font-medium text-sm ml-1.5">все</span>
                                </button>
                                <button
                                    class="flex items-center justify-start ml-3"
                                    on:click="{() => {
                                        filter.mark.t = true;
                                        filter.mark.f = false;
                                    }}"
                                >
                                    <span
                                        class="rounded-full w-6 h-6 border-2 border-success transition-all duration-200 flex items-center justify-center shrink-0 grow-0"
                                        class:bg-success="{filter.mark.t && !filter.mark.f}"
                                    >
                                        <svg class="w-3 h-3 text-base-100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                                    </span>
                                    <span class="font-medium text-sm ml-1.5">да</span>
                                </button>
                                <button
                                    class="flex items-center justify-start ml-3"
                                    on:click="{() => {
                                        filter.mark.t = false;
                                        filter.mark.f = true;
                                    }}"
                                >
                                    <span
                                        class="rounded-full w-6 h-6 border-2 border-error transition-all duration-200 flex items-center justify-center shrink-0 grow-0"
                                        class:bg-error="{!filter.mark.t && filter.mark.f}"
                                    >
                                        <svg class="w-3 h-3 text-base-100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                                    </span>
                                    <span class="font-medium text-sm ml-1.5">нет</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    -->
                {/if}
                <div class="w-full h-full shrink-1 grow-1 scrollable-y">
                    {#if $userEventsConnectionsAllLoading && start}
                        <div class="w-full h-full flex justify-center items-center">
                            <span class="loading loading-bars text-front"></span>
                        </div>
                    {:else}
                        {#each meetingsFiltered as event (event.id)}
                            <EventCard event="{event}" archive="{archive}" />
                        {/each}
                        {#if meetingsOfflineFiltered.length}
                            <OfflineCard connections="{meetingsOfflineFiltered}" archive="{archive}" />
                        {/if}
                        {#if meetingsOnlineFiltered.length}
                            <OnlineCard connections="{meetingsOnlineFiltered}" archive="{archive}" />
                        {/if}
                        {#if meetingsRequestsFiltered.length}
                            <RequestCard connections="{meetingsRequestsFiltered}" />
                        {/if}
                    {/if}
                </div>
            </div>
        </div>
    </div>

</div>
