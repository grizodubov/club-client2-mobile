<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    import { type User, user } from '@/stores';

    import { subscribe } from '@/helpers/notification';

    import { Entity, collector } from '@/helpers/entity';
    import {
        residentsList,
    } from '@/queries/user';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;


    $: currentUser = $user as User;


    let start = true;


    let meetings: { [key: string]: any }[] = [];


    /* DATA: residentsListHandler */
	const residentsListHandler = new Entity({
		model: residentsList.model,
		retriever: residentsList.retriever,
        onSuccess: data => {
            start = false;
        },
	});

    let residentsListLoading = residentsListHandler.loading;


    /* get */
    function get() {
        collector.get([
            [ 
                residentsListHandler,
                {}
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
                Встречи {#if !$residentsListLoading}<span class="ml-1 text-base-300 text-lg font-extralight">(<span class="text-base-100">{meetings.length}</span>)</span>{/if}
            </div>
            <div class="w-[56px] h-[56px] mr-4 mt-4 shrink-0 grow-0 flex items-center justify-center">
                &nbsp;
            </div>
        </div>
        <div class="bg-base-100 rounded-t-2xl h-5"></div>
    </div>

    <div class="shrink-0 grow-0 h-[calc(100%-112px)]">
        <div class="mt-[-20px] h-[calc(100%+20px)] rounded-2xl">
            <div class="relative h-full">
                <!--
                <div class="absolute w-full px-3 mt-5 h-16 z-10">
                    <InputText
                        placeholder="Имя / Компания"
                        bind:value="{filters.name}"
                    />
                </div>
                -->
                {#if $residentsListLoading && start}
                    <div class="w-full h-full flex justify-center items-center">
                        <span class="loading loading-bars text-front"></span>
                    </div>
                {:else}
                    <div class="h-full scrollable-y">
                        <!--
                        {#each residentsFiltered as resident (resident.id)}
                            <div
                                class="mb-5 first:mt-[104px]"
                                in:fade="{{ duration: 100 }}"
                            >
                                <ResidentCard
                                    resident="{resident}"
                                    contact="{contacts[resident.id.toString()] && contacts[resident.id.toString()].contact}"
                                />
                            </div>
                        {/each}
                        -->
                    </div>
                {/if}
            </div>
        </div>
    </div>

</div>
