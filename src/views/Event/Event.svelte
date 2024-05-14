<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    import { EVENTS } from '@/config/events.cfg';

    import { UserCard, Program } from './components';

    import { type User, user } from '@/stores';

    import { findTags } from '@/utils/tags';

    import { subscribe } from '@/helpers/notification';

    import { toDateText } from '@/utils/dates';

    import { Entity, collector } from '@/helpers/entity';
    import {
		eventInfo,
	} from '@/queries/event';
    import {
		userEventAdd,
        userEventDel,
	} from '@/queries/user';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;


    $: currentUser = $user as User;


    let event: any;
    let participants: any[] = [];
    let suggestions: any[] = [];
    let speakers: any[] = [];

    let infoState = false;

    let start = true;


    $: state = findState(event);

    $: currentFormat = event ? EVENTS.find(f => f.format == event.format) : undefined;

    $: currentDate = event ? toDateText(event.time_event).split(/\s+/) : [];


    const bgImageUrlFallback = 'https://static.clubgermes.ru/events/event.png';

    $: bgImageUrl = event ? 'https://static.clubgermes.ru/events/' + event.id.toString() + '/icon.png' : bgImageUrlFallback;


    /* handleBgImageError */
    function handleBgImageError() {
        bgImageUrl = bgImageUrlFallback;
    }


    /* toggle */
    function toggle(event: Event) {
        const info = <HTMLElement>(<HTMLElement>event.target).closest('button')?.nextElementSibling;
        if (info)
            if (info.style.maxHeight && info.style.maxHeight != '0px') {
                info.style.maxHeight = '0px';
                infoState = false;
            }
            else {
                info.style.maxHeight = info.scrollHeight + "px";
                infoState = true;
            }
    }


    /* DATA: eventInfoHandler */
	const eventInfoHandler = new Entity({
		model: eventInfo.model,
		retriever: eventInfo.retriever,
        onSuccess: data => {
            start = false;
            event = data.event;
            const cUser = data.residents.find((r: { [key: string]: any }) => r.id == currentUser.id);
            let temp = event.participants.filter(
                (p: any) => p.confirmation
            ).map(
                (p: any) => {
                    const r = data.residents.find((r: any) => r.id == p.id);
                    if (r)
                        if (cUser) {
                            r.tagsLinked = findTags(cUser.tags, r.interests);
                            r.interestsLinked = findTags(cUser.interests, r.tags);
                        }
                        else {
                            r.tagsLinked = [];
                            r.interestsLinked = [];
                        }
                    return r;
                }
            ).filter(
                (p: any) => p
            );
            temp.sort((a: any, b: any) => a.name.toLowerCase() > b.name.toLowerCase());
            participants = [ ...temp ];
            temp = event.speakers.map(
                (p: any) => {
                    const r = data.residents.find((r: any) => r.id == p.id);
                    return r;
                }
            ).filter(
                (p: any) => p
            );
            speakers = [ ...temp ];
            suggestions = participants.filter((p: any) => p.tagsLinked.length || p.interestsLinked.length);
        },
	});

    let eventInfoLoading = eventInfoHandler.loading;


    /* DATA: userEventAddHandler */
	const userEventAddHandler = new Entity({
		model: userEventAdd.model,
		retriever: userEventAdd.retriever,

	});


    /* DATA: userEventDelHandler */
	const userEventDelHandler = new Entity({
		model: userEventDel.model,
		retriever: userEventDel.retriever,
	});


    /* findState */
    function findState(event: any) {
        if (event) {
            const pu = event.participants.find((p: any) => p.id == currentUser.id);
            if (pu)
                return pu.confirmation;
        }
        return null;
    }


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
                <div class="mt-6 w-[118px] h-[1px]">
                    <div
                        class="absolute w-[118px] h-[118px] rounded-full overflow-hidden paddin-2 border-8 border-front bg-front z-[11]"
                    >
                        {#if event && (!$eventInfoLoading || !start)}
                            <img
                                alt=""
                                src="{bgImageUrl}"
                                on:error={handleBgImageError}
                            />
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
        <div class="mt-[-20px] h-[calc(100%+20px)] rounded-2xl">

            {#if !event || ($eventInfoLoading && start)}
                <div class="w-full h-full flex justify-center items-center">
                    <span class="loading loading-bars text-front laoding-lg"></span>
                </div>
            {:else}

                <div class="relative h-full">

                    <div class="absolute z-10 w-full p-3">
                        <div class="absolute top-0 bottom-0 left-0 right-0 bg-base-100 rounded-2xl opacity-90"></div>
                        <div class="relative flex justify-between items-end">
                            <div class="">
                                <div class="relative w-[66px] h-[66px] rounded-box flex flex-col items-center justify-center">
                                    <div class="absolute w-[66px] h-[66px] rounded-box bg-{currentFormat?.color} top-0 left-0"></div>
                                    <div class="relative text-2xl leading-7 font-bold text-base-100">{currentDate[0]}</div>
                                    <div class="relative text-xs font-medium mb-0.5 text-base-100">{currentDate[1]}</div>
                                </div>
                                <div class="mt-2.5 flex items-start text-{currentFormat?.color}">
                                    <div class="w-4 h-4 shrink-0 grow-0">{@html currentFormat?.icon}</div>
                                    <div class="text-xs leading-4 ml-1.5 text-left">{currentFormat?.name}</div>
                                </div>
                            </div>
                            {#if state == null}
                                <button
                                    class="btn btn-front text-base-100"
                                    on:click="{() => {
                                        collector.get([
                                            [ 
                                                userEventAddHandler,
                                                {
                                                    eventId: event.id
                                                }
                                            ],
                                        ]);
                                    }}"
                                >Участвовать!</button>
                            {:else if state}
                                <button
                                    class="btn btn-sm btn-error text-base-100"
                                    on:click="{() => {
                                        collector.get([
                                            [ 
                                                userEventDelHandler,
                                                {
                                                    eventId: event.id
                                                }
                                            ],
                                        ]);
                                    }}"
                                >Отказаться</button>
                            {:else}
                                <button
                                    class="btn btn-sm bg-base-300"
                                >Подтверждается</button>
                            {/if}
                        </div>
                    </div>

                    <div class="h-full pb-5 scrollable-y">
                        <div class="font-semibold text-lg px-3 leading-[25px] mt-[128px]">{event.name}</div>
                        <div class="text-sm opacity-70 px-3 leading-[18px] mt-1">{event.place}</div>
                        <button
                            class="btn btn-sm btn-front mx-3 mt-5 text-base-100"
                            on:click="{toggle}"
                        >
                            <span>Информация</span>
                            {#if infoState}
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M18 12.998H6a1 1 0 0 1 0-2h12a1 1 0 0 1 0 2z" fill="currentColor"></path></svg>
                            {:else}
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z" fill="currentColor"></path></svg>
                            {/if}
                        </button>
                        <div class="overflow-hidden transition-all max-h-0 px-3">
                            <div class="w-full rounded-2xl overflow-hidden mt-5"><img class="w-full" src="https://static.clubgermes.ru/events/{event.id}/img.jpg" alt="{event.name}" /></div>
                            <div class="detail text-sm mt-3">{@html event.detail}</div>
                        </div>

                        <!-- Спикеры -->
                        {#if (speakers.length)}
                            <div class="flex justify-start items-center h-7 mt-6 mb-5 px-3">
                                <div class="font-semibold text-lg leading-7">Спикеры</div>
                                <div class="rounded-full w-7 h-7 text-center leading-7 ml-2.5 font-semibold bg-base-200 text-sm"><span>{speakers.length}</span></div>
                            </div>
                            <div class="h-[142px] overflow-y-hidden">
                                <div class="carousel w-full h-full">
                                    {#each speakers as participant (participant.id)}
                                        <div
                                            class="carousel-item last:pr-3"
                                            in:fade="{{ duration: 100 }}"
                                        >
                                            <UserCard user="{participant}" event="{event}" showTags="{false}" />
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {/if}

                        <!-- Участники -->
                        {#if (participants.length)}
                            <div class="flex justify-start items-center h-7 mt-6 mb-5 px-3">
                                <div class="font-semibold text-lg leading-7">Участники</div>
                                <div class="rounded-full w-7 h-7 text-center leading-7 ml-2.5 font-semibold bg-base-200 text-sm"><span>{participants.length}</span></div>
                            </div>
                            <div class="h-[142px] overflow-y-hidden">
                                <div class="carousel w-full h-full">
                                    {#each participants as participant (participant.id)}
                                        <div
                                            class="carousel-item last:pr-3"
                                            in:fade="{{ duration: 100 }}"
                                        >
                                            <UserCard user="{participant}" event="{event}" showTags="{false}" />
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {/if}

                        <!-- Потенциальные партнёры -->
                        {#if (suggestions.length)}
                            <div class="flex justify-start items-center h-7 mt-6 mb-5 px-3">
                                <div class="font-semibold text-lg leading-7">Потенциальные партнёры</div>
                                <div class="rounded-full w-7 h-7 text-center leading-7 ml-2.5 font-semibold bg-base-200 text-sm"><span>{suggestions.length}</span></div>
                            </div>
                            <div class="h-[186px] overflow-y-hidden">
                                <div class="carousel w-full h-full">
                                    {#each suggestions as participant (participant.id)}
                                        <div
                                            class="carousel-item last:pr-3"
                                            in:fade="{{ duration: 100 }}"
                                        >
                                            <UserCard user="{participant}" event="{event}" showTags="{true}" />
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {/if}

                        <!-- Программа -->
                        <div class="flex justify-start items-center h-7 mt-6 mb-5 px-3">
                            <div class="font-semibold text-lg leading-7">Программа</div>
                        </div>
                        <Program event="{event}" speakers="{speakers}" />
                    </div>

                </div>

            {/if}

        </div>
    </div>

</div>
