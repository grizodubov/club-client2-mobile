<script lang="ts">
    import { type User, user, events } from '@/stores';

    import { Avatar } from '@/components';

    import { nameNormalization } from '@/utils/names';

    import { infoHide } from '@/helpers/info';

    import { router } from '@/libs/Router';

    import { Entity, collector } from '@/helpers/entity';
    import {
		eventConnection,
	} from '@/queries/event';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;


    let data: {
        eventId: number,
        state: boolean | null,
        participants: { [key: string]: any }[],
        speakers: { [key: string]: any }[],
        connections: { [key: string]: any }[],
        suggestions: { [key: string]: any }[],
    } = {
        eventId: 0,
        state: null,
        participants: [],
        speakers: [],
        connections: [],
        suggestions: [],
    };


    let filter = {
        connection: false,
        online: false,
        suggestion: false,
    };

    let connectLoading: number = 0;


    $: currentUser = $user as User;


    $: connectionsCache = parseConnections(data.connections);
    $: suggestionsCache = parseSuggestions(data.suggestions);


    /* DATA: eventConnectionHandler */
	const eventConnectionHandler = new Entity({
		model: eventConnection.model,
		retriever: eventConnection.retriever,
	});


    /* parseConnections */
    function parseConnections(cs: { [key: string]: any }[]) {
        const temp = {};
        cs.forEach((c: { [key: string]: any }) => {
            if (c.user_1_id != currentUser.id && c.user_2_id == currentUser.id)
                temp[c.user_1_id.toString()] = c;
            if (c.user_1_id == currentUser.id && c.user_2_id != currentUser.id)
                temp[c.user_2_id.toString()] = c;
        });
        return temp;
    }


    /* parseSuggestions */
    function parseSuggestions(sg: { [key: string]: any }[]) {
        const temp = {};
        sg.forEach((s: { [key: string]: any }) => {
            temp[s.id.toString()] = s;
        });
        return temp;
    }


    /* connect */
    function connect(userId) {
        collector.get([
            [ 
                eventConnectionHandler,
                {
                    eventId: data.eventId,
                    userId: userId,
                }
            ],
        ]);
    }


    /* update */
    export function update(p: any) {
        if (p.filter) {
            filter = Object.assign(p.filter);
            delete p.filter;
        }
        if (p.eventId)
            data = Object.assign(data, p);
        if (p.release)
            if (connectLoading)
                connectLoading = 0;
    }
</script>


<div class="w-full h-full flex flex-col px-2">
    <div class="w-full flex justify-between shrink-0 grow-0 py-4 px-2 border-b border-base-200">
        <div class="flex">
            <button
                class="w-9 h-9 text-front rounded-lg border-[2px] flex items-center justify-center transition-all"
                class:border-transparent="{!filter.connection}"
                class:border-front="{filter.connection}"
                on:click="{() => {
                    filter.connection = !filter.connection
                }}"
            >
                <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M16.48 10.41c-.39.39-1.04.39-1.43 0l-4.47-4.46l-7.05 7.04l-.66-.63a3 3 0 0 1 0-4.24l4.24-4.24a3 3 0 0 1 4.24 0L16.48 9c.39.39.39 1.02 0 1.41zm.7-2.12c.78.78.78 2.05 0 2.83c-1.27 1.27-2.61.22-2.83 0l-3.76-3.76l-5.57 5.57a.996.996 0 0 0 0 1.41c.39.39 1.02.39 1.42 0l4.62-4.62l.71.71l-4.62 4.62a.996.996 0 0 0 0 1.41c.39.39 1.02.39 1.42 0l4.62-4.62l.71.71l-4.62 4.62a.996.996 0 1 0 1.41 1.41l4.62-4.62l.71.71l-4.62 4.62a.996.996 0 1 0 1.41 1.41l8.32-8.34a3 3 0 0 0 0-4.24l-4.24-4.24a3.001 3.001 0 0 0-4.18-.06l4.47 4.47z" fill="currentColor"></path></svg>
            </button>
            <button
                class="ml-3 w-9 h-9 text-secondary rounded-lg border-[2px] flex items-center justify-center transition-all"
                class:border-transparent="{!filter.suggestion}"
                class:border-secondary="{filter.suggestion}"
                on:click="{() => {
                    filter.suggestion = !filter.suggestion
                }}"
            >
                <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024"><path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7c0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311h-.3v428h472.3c9.2 0 18.2-1.8 26.5-5.4c47.6-20.3 78.3-66.8 78.3-118.4c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c-.2-12.6-2-25.1-5.6-37.1zM112 528v364c0 17.7 14.3 32 32 32h65V496h-65c-17.7 0-32 14.3-32 32z" fill="currentColor"></path></svg>
            </button>
            <button
                class="ml-3 w-9 h-9 text-success rounded-lg border-[2px] flex items-center justify-center transition-all"
                class:border-transparent="{!filter.online}"
                class:border-success="{filter.online}"
                on:click="{() => {
                    filter.online = !filter.online
                }}"
            >
                <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10s10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3z" fill="currentColor"></path></svg>
            </button>
        </div>
        <button
            class="w-7 h-7 text-base-300"
            on:click="{() => {
                infoHide();
            }}"
        >
            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2zm4.3 14.3a.996.996 0 0 1-1.41 0L12 13.41L9.11 16.3a.996.996 0 1 1-1.41-1.41L10.59 12L7.7 9.11A.996.996 0 1 1 9.11 7.7L12 10.59l2.89-2.89a.996.996 0 1 1 1.41 1.41L13.41 12l2.89 2.89c.38.38.38 1.02 0 1.41z" fill="currentColor"></path></svg>
        </button>
    </div>
    <div class="w-full h-full shrink-1 grow-1 pb-4 scrollable-y">
        {#each [ ...data.speakers, ...data.participants ] as user (user.id)}
            {#if
                user.id != currentUser.id &&
                (!filter.connection || connectionsCache[user.id.toString()]) &&
                (!filter.suggestion || suggestionsCache[user.id.toString()]) &&
                (!filter.online || user.audit == 2)
            }
                <div
                    class="rounded-2xl border-[3px] p-2 mt-1"
                    class:border-transparent="{!connectionsCache[user.id.toString()]}"
                    class:border-base-300="{connectionsCache[user.id.toString()] && user.audit != 2}"
                    class:border-success="{connectionsCache[user.id.toString()] && (user.audit == 2)}"
                >
                    <div class="flex justify-between items-stretch w-full">
                        <div
                            class="relative w-[64px] h-[84px] self-start shrink-0 grow-0"
                        >
                            <button
                                class="relative top-[0px] w-[64px] h-[64px] mb-[20px]"
                                on:click="{() => {
                                    router.go('/residents/' + user.id.toString());
                                }}"
                            >
                                <Avatar
                                    user="{{
                                        id: user.id,
                                        name: user.name,
                                        avatar_hash: user.avatar_hash,
                                        roles: [ 'client' ],
                                        telegram: '',
                                    }}"
                                    online="{user.audit == 2}"
                                />
                                </button>
                            <!--
                            {#if !connectionsCache[user.id.toString()]}
                                <div
                                    class="absolute w-8 h-8 left-[16px] bottom-[0px] btn btn-sm btn-square btn-front text-base-100"
                                >
                                    <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M16.48 10.41c-.39.39-1.04.39-1.43 0l-4.47-4.46l-7.05 7.04l-.66-.63a3 3 0 0 1 0-4.24l4.24-4.24a3 3 0 0 1 4.24 0L16.48 9c.39.39.39 1.02 0 1.41zm.7-2.12c.78.78.78 2.05 0 2.83c-1.27 1.27-2.61.22-2.83 0l-3.76-3.76l-5.57 5.57a.996.996 0 0 0 0 1.41c.39.39 1.02.39 1.42 0l4.62-4.62l.71.71l-4.62 4.62a.996.996 0 0 0 0 1.41c.39.39 1.02.39 1.42 0l4.62-4.62l.71.71l-4.62 4.62a.996.996 0 1 0 1.41 1.41l4.62-4.62l.71.71l-4.62 4.62a.996.996 0 1 0 1.41 1.41l8.32-8.34a3 3 0 0 0 0-4.24l-4.24-4.24a3.001 3.001 0 0 0-4.18-.06l4.47 4.47z" fill="currentColor"></path></svg>
                                </div>
                            {/if}
                            -->
                        </div>
                        <div class="ml-4 shrink-1 grow-1 w-full flex flex-col justify-between">
                            <div class="w-full">
                                <div class="mb-[4px] mt-[2px] flex items-center">
                                    <button
                                        class="text-left font-medium text-[16px] leading-[20px]"
                                        on:click="{() => {
                                            router.go('/residents/' + user.id.toString());
                                        }}"
                                    >{nameNormalization(user.name, 2)}</button>
                                    {#if user.speaker}
                                        <svg class="w-5 h-5 text-moderate ml-1.5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M29.415 19L27.7 17.285A2.97 2.97 0 0 0 28 16a3 3 0 1 0-3 3a2.97 2.97 0 0 0 1.286-.3L28 20.414V28h-6v-3a7.008 7.008 0 0 0-7-7H9a7.008 7.008 0 0 0-7 7v5h28v-9.586A1.988 1.988 0 0 0 29.415 19zM4 25a5.006 5.006 0 0 1 5-5h6a5.006 5.006 0 0 1 5 5v3H4z" fill="currentColor"></path><path d="M12 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7z" fill="currentColor"></path></svg>
                                    {/if}
                                </div>
                                {#if user.position}
                                    <div class="text-left text-[10px] opacity-80">{user.position.toUpperCase()}</div>
                                {/if}
                                {#if user.company}
                                    <div class="text-left text-[10px] text-front mt-0.5">{user.company.toUpperCase()}</div>
                                {/if}
                                {#if user.catalog}
                                    <div class="text-left font-medium text-[10px] text-moderate mt-0.5">{user.catalog.split(/\s*,\s*/).filter(c => c).join(', ').toUpperCase()}</div>
                                {/if}
                            </div>
                            {#if !connectionsCache[user.id.toString()]}
                                {#if data.state !== null}
                                    <div class="flex">
                                        {#if connectLoading == user.id}
                                            <div class="flex items-center justify-center h-8 mt-1">
                                                <span class="loading loading-bars text-front"></span>
                                            </div>
                                        {:else}
                                            <button
                                                class="btn btn-sm btn-front text-base-100 mt-1" 
                                                on:click="{() => {
                                                    if (!connectionsCache[user.id.toString()]) {
                                                        connectLoading = user.id;
                                                        connect(user.id);
                                                    }
                                                }}"
                                            >Назначить встречу</button>
                                        {/if}
                                    </div>
                                {/if}
                            {:else}
                                <div class="mt-1 h-[32px] flex flex-col justify-end">
                                    <div class="text-xs opacity-50 leading-[16px] whitespace-nowrap w-full overflow-hidden">Инициатор: {connectionsCache[user.id.toString()].creator}</div>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            {/if}
        {/each}
    </div>
</div>
