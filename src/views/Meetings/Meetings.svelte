<script lang="ts">
    import { onMount } from 'svelte';

    import { type User, user } from '@/stores';

    import { EventCard } from './components';

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


    let archive = false;


    /* DATA: userEventsConnectionsAllHandler */
	const userEventsConnectionsAllHandler = new Entity({
		model: userEventsConnectionsAll.model,
		retriever: userEventsConnectionsAll.retriever,
        onSuccess: data => {
            start = false;
            meetings = data.events;
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
                Встречи
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
                <div class="w-full flex justify-between items-center h-[64px] mb-3 srink-0 grow-0">
                    <button
                        class="flex items-center justify-center basis-3/6 h-[48px] border-b-4 ml-5 transition-all duration-300"
                        class:border-base-100="{archive}"
                        class:border-success="{!archive}"
                        on:click="{() => {
                            if (archive) {
                                archive = false;
                                start = true;
                                refresh();
                            }
                        }}"
                    >
                        <svg class="text-success w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 352 512"><path d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78c16.52 18.85 42.36 58.23 52.21 91.45c.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78c9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176C352 78.61 272.91-.3 175.45 0C73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80c0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112c8.84 0 16 7.16 16 16s-7.16 16-16 16z" fill="currentColor"></path></svg>
                        <span class="ml-2.5">Текущие</span>
                    </button>
                    <button
                        class="flex items-center justify-center basis-3/6 h-[48px] border-b-4 mx-5 transition-all duration-300"
                        class:border-base-100="{!archive}"
                        class:border-warning="{archive}"
                        on:click="{() => {
                            if (!archive) {
                                archive = true;
                                start = true;
                                refresh();
                            }
                        }}"
                    >
                        <svg class="text-warning w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M32 448c0 17.7 14.3 32 32 32h384c17.7 0 32-14.3 32-32V160H32v288zm160-212c0-6.6 5.4-12 12-12h104c6.6 0 12 5.4 12 12v8c0 6.6-5.4 12-12 12H204c-6.6 0-12-5.4-12-12v-8zM480 32H32C14.3 32 0 46.3 0 64v48c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16V64c0-17.7-14.3-32-32-32z" fill="currentColor"></path></svg>
                        <span class="ml-2.5">Архив</span>
                    </button>
                </div>
                <div class="w-full h-full shrink-1 grow-1 scrollable-y">
                    {#if $userEventsConnectionsAllLoading && start}
                        <div class="w-full h-full flex justify-center items-center">
                            <span class="loading loading-bars text-front"></span>
                        </div>
                    {:else}
                        {#each meetings as event (event.id)}
                            <EventCard event="{event}" archive="{archive}" />
                        {/each}
                    {/if}
                </div>
            </div>
        </div>
    </div>

</div>
