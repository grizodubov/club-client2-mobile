<script lang="ts">
    import { onMount, onDestroy, tick } from 'svelte';
    import { fade } from 'svelte/transition';

    import { ResidentCard, InputText, ModalSelector } from './components';
    
    import { nameNormalization } from '@/utils/names';

    import { type User, user, type PartnersFilters, partnersFilters } from '@/stores';

    import { subscribe } from '@/helpers/notification';

    import { Entity, collector } from '@/helpers/entity';
    import {
        partnersBundleList,
        bundleUser,
    } from '@/queries/user';

    import { partnersY } from '@/stores/scrolls';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;


    let scrollArea;
    let scrollBeacon = 0;


    $: currentUser = $user as User;
    $: filters = $partnersFilters as PartnersFilters;


    let partners: { [key: string]: any }[] = [];
    let partnersFiltered: { [key: string]: any }[] = [];
    let contacts: { [key: string]: any } = {};


    let tmFilter: ReturnType<typeof setTimeout> | null = null;


    let bundleShow = false;
    let userBundleId = 0;
    let userBundle: any = null;


    $: filters, partners, filterPartners();


    /* DATA: partnersBundleListHandler */
	const partnersBundleListHandler = new Entity({
		model: partnersBundleList.model,
		retriever: partnersBundleList.retriever,
        onSuccess: data => {
            start = false;
            partners = data.residents;
            contacts = data.contacts;
        },
	});

    let partnersListLoading = partnersBundleListHandler.loading;

    let partnerFilterLoading = false;

    let start = true;


    /* DATA: bundleUserHandler */
	const bundleUserHandler = new Entity({
		model: bundleUser.model,
		retriever: bundleUser.retriever,
        onSuccess: (data: any) => {
            userBundle = data.user;
        },
	});

    let userBundleLoading = bundleUserHandler.loading;


    /* setScrollBeacon */
    function setScrollBeacon(e) {
        scrollBeacon = e.target.scrollTop;
    }


    /* scrollToPosition */
    async function scrollToPosition() {
        await tick();
        if (scrollArea) {
            scrollArea.scrollTo({
                left: 0,
                top: $partnersY,
                behavior: 'instant',
            });
        }
    }


    /* filterPartners */
    function filterPartners() {
        partnersFiltered = [];
        partnerFilterLoading = true;
        if (tmFilter)
            clearTimeout(tmFilter);
        tmFilter = setTimeout(
            () => {
                partnersFilters.save();
                let temp;
                if (filters.name) {
                    const fn = filters.name.toLowerCase();
                    temp = partners.filter(
                        (r: { [key: string]: any }) => {
                            return (!fn || r.name.toLowerCase().indexOf(fn) > -1 || r.company.toLowerCase().indexOf(fn) > -1);
                        }
                    );
                }
                else {
                    temp = [ ...partners ];
                }
                temp.sort((a: any, b: any) => {
                    if ([0, 2, 4, 6, 8].indexOf(filters.sort) > -1) {
                        if (a.ratings[Math.floor(filters.sort / 2)] < b.ratings[Math.floor(filters.sort / 2)])
                            return 1;
                        if (a.ratings[Math.floor(filters.sort / 2)] > b.ratings[Math.floor(filters.sort / 2)])
                            return -1;
                    }
                    else {
                        if (a.ratings[Math.floor(filters.sort / 2)] > b.ratings[Math.floor(filters.sort / 2)])
                            return 1;
                        if (a.ratings[Math.floor(filters.sort / 2)] < b.ratings[Math.floor(filters.sort / 2)])
                            return -1;
                    }
                    if (a.name.toLowerCase() > b.name.toLowerCase())
                        return 1;
                    if (a.name.toLowerCase() < b.name.toLowerCase())
                        return -1;
                    return 0;
                });
                partnersFiltered = temp;
                partnerFilterLoading = false;
            }, 250
        );
    }


    /* get */
    function get() {
        collector.get([
            [ 
                partnersBundleListHandler,
                {}
            ],
        ]);
    }


    /* getBundleUser */
    function getBundleUser(userId, targetId) {
        collector.get([
            [ 
                bundleUserHandler,
                {
                    primaryUserId: userId,
                    secondaryUserId: targetId,
                }
            ],
        ]);
    }


    /* refresh */
    function refresh() {
        get();
    }


    const colors1 = [
        'rgb(0,169,110)',
        'rgb(0,181,251)',
        'rgb(255,191,0)',
        'rgb(55,124,251)',
        'rgb(246,128,103)',
    ];


    /* onMount */
	onMount(() => {
        partnersFilters.load();
        get();
        const sub = subscribe('events', refresh);
        return () => {
            sub.close();
        };
	});


    /* onDestroy */
    onDestroy(() => {
        if (scrollArea) {
            $partnersY = scrollBeacon;
        }
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
                Партнёры
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
                <div class="absolute w-full px-3 mt-5 h-16 z-10">
                    <InputText
                        placeholder="Имя / Компания"
                        bind:value="{filters.name}"
                    />
                    <div class="grid grid-cols-5 gap-0.5 h-6 mt-3">
                        <button
                            on:click="{() => { filters.sort = filters.sort == 0 ? 1 : 0 }}"
                            class="rounded-lg text-base-100 h-6 flex items-center justify-between w-full" style="background-color: {colors1[0]}"
                        >
                            <span class="text-[10px] ml-1.5 shrink-0 grow-0">Сделка</span>
                            {#if filters.sort == 0}
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M7 10l5 5l5-5z" fill="currentColor"></path></svg>
                            {:else if filters.sort == 1}
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M7 14l5-5l5 5z" fill="currentColor"></path></svg>
                            {:else}
                                <span class="w-4 h-4 shrink-0 grow-0"></span>
                            {/if}
                        </button>
                        <button
                            on:click="{() => { filters.sort = filters.sort == 2 ? 3 : 2 }}"
                            class="rounded-lg text-base-100 h-6 flex items-center justify-between w-full" style="background-color: {colors1[1]}"
                        >
                            <span class="text-[10px] ml-1.5 shrink-0 grow-0">Синергия</span>
                            {#if filters.sort == 2}
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M7 10l5 5l5-5z" fill="currentColor"></path></svg>
                            {:else if filters.sort == 3}
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M7 14l5-5l5 5z" fill="currentColor"></path></svg>
                            {:else}
                                <span class="w-4 h-4 shrink-0 grow-0"></span>
                            {/if}
                        </button>
                        <button
                            on:click="{() => { filters.sort = filters.sort == 4 ? 5 : 4 }}"
                            class="rounded-lg text-base-100 h-6 flex items-center justify-between w-full" style="background-color: {colors1[2]}"
                        >
                            <span class="text-[10px] ml-1.5 shrink-0 grow-0">Эксперт</span>
                            {#if filters.sort == 4}
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M7 10l5 5l5-5z" fill="currentColor"></path></svg>
                            {:else if filters.sort == 5}
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M7 14l5-5l5 5z" fill="currentColor"></path></svg>
                            {:else}
                                <span class="w-4 h-4 shrink-0 grow-0"></span>
                            {/if}
                        </button>
                        <button
                            on:click="{() => { filters.sort = filters.sort == 6 ? 7 : 6 }}"
                            class="rounded-lg text-base-100 h-6 flex items-center justify-between w-full" style="background-color: {colors1[3]}"
                        >
                            <span class="text-[10px] ml-1.5 shrink-0 grow-0">Инсайт</span>
                            {#if filters.sort == 6}
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M7 10l5 5l5-5z" fill="currentColor"></path></svg>
                            {:else if filters.sort == 7}
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M7 14l5-5l5 5z" fill="currentColor"></path></svg>
                            {:else}
                                <span class="w-4 h-4 shrink-0 grow-0"></span>
                            {/if}
                        </button>
                        <button
                            on:click="{() => { filters.sort = filters.sort == 8 ? 9 : 8 }}"
                            class="rounded-lg text-base-100 h-6 flex items-center justify-between w-full" style="background-color: {colors1[4]}"
                        >
                            <span class="text-[10px] ml-1.5 shrink-0 grow-0">Мост</span>
                            {#if filters.sort == 8}
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M7 10l5 5l5-5z" fill="currentColor"></path></svg>
                            {:else if filters.sort == 9}
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M7 14l5-5l5 5z" fill="currentColor"></path></svg>
                            {:else}
                                <span class="w-4 h-4 shrink-0 grow-0"></span>
                            {/if}
                        </button>
                    </div>
                </div>

                {#if ($partnersListLoading && start) || partnerFilterLoading}
                    <div class="w-full h-full flex justify-center items-center">
                        <span class="loading loading-bars text-front"></span>
                    </div>
                {:else}
                    <div class="w-full h-full scrollable-y" on:scroll="{setScrollBeacon}" bind:this="{scrollArea}">
                        {#if partnersFiltered.length}
                            {#each [ ...partnersFiltered, { id: 0 } ] as partner (partner.id)}
                                {#if partner.id !== 0}
                                    <div
                                        class="first:mt-[140px] mb-5"
                                        in:fade="{{ duration: 100 }}"
                                    >
                                        <ResidentCard
                                            resident="{partner}"
                                            contact="{contacts[partner.id.toString()] && contacts[partner.id.toString()].contact}"
                                            on:prompt="{(event) => {
                                                bundleShow = true;
                                                userBundleId = event.detail.secondaryUserId;
                                                getBundleUser(currentUser.id, event.detail.secondaryUserId);
                                            }}"
                                        />
                                    </div>
                                {:else}
                                    <div class="w-full first:mt-[104px] h-[0px]" use:scrollToPosition></div>
                                {/if}
                            {/each}
                        {/if}
                    </div>
                {/if}
            </div>
        </div>
    </div>

    <ModalSelector
        bind:open="{bundleShow}"
    >
        <div class="w-full h-full overflow-y-auto">
            {#if userBundleId}
                {#if $userBundleLoading}
                    <div class="w-full h-full flex justify-center items-center">
                        <span class="loading loading-bars text-front"></span>
                    </div>
                {:else}
                    {#key userBundleId}
                        <div
                            class="w-full h-full flex flex-col justify-between"
                        >
                            <div class="flex justify-start items-start w-full shrink-0 grow-0 pt-2 px-2 pb-1">
                                <div class="w-full overflow-hidden shrink-0 grow-0 mt-1">
                                    <div class="h-5 flex justify-start items-center">
                                        <div
                                            class="text-sm font-semibold whitespace-nowrap leading-5 text-left"
                                            class:opacity-70="{!userBundle.active}"
                                            class:text-error="{!userBundle.active}"
                                        >{nameNormalization(userBundle.name)}</div>
                                    </div>
                                    {#if userBundle.company}<div class="text-[10px] opacity-60 uppercase text-left">{userBundle.company}</div>{/if}
                                    <div class="flex mt-1">
                                        <div class="w-6 h-6 rounded-full bg-[rgba(102,204,138,0.3)] border border-[rgb(102,204,138)] flex justify-center items-center text-[10px] font-semibold">{typeof userBundle.ratings[0] == 'number' ? userBundle.ratings[0] : '-'}</div>
                                        <div class="w-6 h-6 ml-1.5 rounded-full bg-[rgba(0,181,251,0.3)] border border-[rgb(0,181,251)] flex justify-center items-center text-[10px] font-semibold">{typeof userBundle.ratings[1] == 'number' ? userBundle.ratings[1] : '-'}</div>
                                        <div class="w-6 h-6 ml-1.5 rounded-full bg-[rgba(255,191,0,0.3)] border border-[rgb(255,191,0)] flex justify-center items-center text-[10px] font-semibold">{typeof userBundle.ratings[2] == 'number' ? userBundle.ratings[2] : '-'}</div>
                                        <div class="w-6 h-6 ml-1.5 rounded-full bg-[rgba(55,124,251,0.3)] border border-[rgb(55,124,251)] flex justify-center items-center text-[10px] font-semibold">{typeof userBundle.ratings[3] == 'number' ? userBundle.ratings[3] : '-'}</div>
                                        <div class="w-6 h-6 ml-1.5 rounded-full bg-[rgba(246,128,103,0.3)] border border-[rgb(246,128,103)] flex justify-center items-center text-[10px] font-semibold">{typeof userBundle.ratings[4] == 'number' ? userBundle.ratings[4] : '-'}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="w-full h-full overflow-y-auto shrink-1 grow-1">
                                
                                <div class="m-2 pt-1.5 pb-2">
                                    <div class="text-sm font-semibold mb-2">{userBundle.prompt.blocks.block_1.title}</div>
                                    <div class="w-full flex">
                                        <div class="w-full p-2 rounded-lg bg-[rgba(102,204,138,0.3)] border border-[rgb(102,204,138)]">
                                            <div class="text-xs font-medium">{userBundle.prompt.blocks.block_1.block_11.title}</div>
                                            <div class="mt-2">
                                                {#each userBundle.prompt.blocks.block_1.block_11.details as q}
                                                    <div class="text-[11px] font-medium mt-2 border-t border-dotted border-[rgb(102,204,138)] pt-2 first:mt-0 first:pt-0 first:border-0">{q}</div>
                                                {/each}
                                            </div>
                                        </div>
                                        <div class="w-full ml-2 p-2 rounded-lg bg-[rgba(0,181,251,0.3)] border border-[rgb(0,181,251)]">
                                            <div class="text-xs font-medium">{userBundle.prompt.blocks.block_1.block_12.title}</div>
                                            <div class="mt-2">
                                                {#each userBundle.prompt.blocks.block_1.block_12.details as q}
                                                    <div class="text-[11px] font-medium mt-2 border-t border-dotted border-[rgb(0,181,251)] pt-2 first:mt-0 first:pt-0 first:border-0">{q}</div>
                                                {/each}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="w-full p-2 rounded-lg bg-base-200 border border-base-300 mt-2">
                                        <div class="flex items-center h-6">
                                            <div class="w-6 h-6 rounded-full bg-[rgba(102,204,138,0.3)] border border-[rgb(102,204,138)]"></div>
                                            <div class="ml-1 w-6 h-6 rounded-full bg-[rgba(0,181,251,0.3)] border border-[rgb(0,181,251)]"></div>
                                            <div class="ml-2.5 text-xs font-medium">{userBundle.prompt.blocks.block_1.block_13.title}</div>
                                        </div>
                                        <div class="mt-2">
                                            <div class="text-[11px] font-semibold">{userBundle.prompt.blocks.block_1.block_13.recommendation}</div>
                                            {#each userBundle.prompt.blocks.block_1.block_13.actions as q}
                                                <div class="text-[11px] font-medium mt-2 border-t border-dotted border-base-300 pt-2">{q}</div>
                                            {/each}
                                        </div>
                                    </div>
                                </div>

                                <div class="m-2 pt-1.5 pb-2">
                                    <div class="text-sm font-semibold mb-2">{userBundle.prompt.blocks.block_2.title}</div>
                                    <div class="w-full flex">
                                        <div class="w-full p-2 rounded-lg bg-[rgba(255,191,0,0.3)] border border-[rgb(255,191,0)]">
                                            <div class="text-xs font-medium">{userBundle.prompt.blocks.block_2.block_21.title}</div>
                                            <div class="mt-2">
                                                {#each userBundle.prompt.blocks.block_2.block_21.details as q}
                                                    <div class="text-[11px] font-medium mt-2 border-t border-dotted border-[rgb(255,191,0)] pt-2 first:mt-0 first:pt-0 first:border-0">{q}</div>
                                                {/each}
                                            </div>
                                        </div>
                                        <div class="w-full ml-2 p-2 rounded-lg bg-[rgba(55,124,251,0.3)] border border-[rgb(55,124,251)]">
                                            <div class="text-xs font-medium">{userBundle.prompt.blocks.block_2.block_22.title}</div>
                                            <div class="mt-2">
                                                {#each userBundle.prompt.blocks.block_2.block_22.details as q}
                                                    <div class="text-[11px] font-medium mt-2 border-t border-dotted border-[rgb(55,124,251)] pt-2 first:mt-0 first:pt-0 first:border-0">{q}</div>
                                                {/each}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="w-full p-2 rounded-lg bg-base-200 border border-base-300 mt-2">
                                        <div class="flex items-center h-6">
                                            <div class="w-6 h-6 rounded-full bg-[rgba(255,191,0,0.3)] border border-[rgb(255,191,0)]"></div>
                                            <div class="ml-1 w-6 h-6 rounded-full bg-[rgba(55,124,251,0.3)] border border-[rgb(55,124,251)]"></div>
                                            <div class="ml-2.5 text-xs font-medium">{userBundle.prompt.blocks.block_2.block_23.title}</div>
                                        </div>
                                        <div class="mt-2">
                                            <div class="text-[11px] font-semibold">{userBundle.prompt.blocks.block_2.block_23.recommendation}</div>
                                            {#each userBundle.prompt.blocks.block_2.block_23.actions as q}
                                                <div class="text-[11px] font-medium mt-2 border-t border-dotted border-base-300 pt-2">{q}</div>
                                            {/each}
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="m-2 pt-1.5 pb-2">
                                    <div class="text-sm font-semibold mb-2">{userBundle.prompt.blocks.block_3.title}</div>
                                    <div class="w-full flex">
                                        <div class="w-full p-2 rounded-lg bg-[rgba(246,128,103,0.3)] border border-[rgb(246,128,103)]">
                                            <div class="text-xs font-medium">{userBundle.prompt.blocks.block_3.block_31.title}</div>
                                            <div class="mt-2">
                                                {#each userBundle.prompt.blocks.block_3.block_31.details as q}
                                                    <div class="text-xs font-medium mt-2 border-t border-dotted border-[rgb(246,128,103)] pt-2 first:mt-0 first:pt-0 first:border-0">{q}</div>
                                                {/each}
                                                {#if userBundle.prompt.blocks.block_3.block_31.clients}
                                                    {#if userBundle.prompt.blocks.block_3.block_31.clients.participant1 && userBundle.prompt.blocks.block_3.block_31.clients.participant1.length}
                                                        <div class="italic text-[11px] font-medium mt-2 border-t border-dotted border-[rgb(246,128,103)] pt-2 first:mt-0 first:pt-0 first:border-0">{userBundle.prompt.blocks.block_3.block_31.clients.participant1.join(', ')}</div>
                                                    {/if}
                                                    {#if userBundle.prompt.blocks.block_3.block_31.clients.participant2 && userBundle.prompt.blocks.block_3.block_31.clients.participant2.length}
                                                        <div class="italic text-[11px] font-medium mt-2 border-t border-dotted border-[rgb(246,128,103)] pt-2 first:mt-0 first:pt-0 first:border-0">{userBundle.prompt.blocks.block_3.block_31.clients.participant2.join(', ')}</div>
                                                    {/if}
                                                {/if}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="w-full p-2 rounded-lg bg-base-200 border border-base-300 mt-2">
                                        <div class="flex items-center h-6">
                                            <div class="w-6 h-6 rounded-full bg-[rgba(246,128,103,0.3)] border border-[rgb(246,128,103)]"></div>
                                            <div class="ml-2.5 text-xs font-medium">{userBundle.prompt.blocks.block_3.block_32.title}</div>
                                        </div>
                                        <div class="mt-2">
                                            <div class="text-[11px] font-semibold">{userBundle.prompt.blocks.block_3.block_32.recommendation}</div>
                                            {#each userBundle.prompt.blocks.block_3.block_32.actions as q}
                                                <div class="text-[11px] font-medium mt-2 border-t border-dotted border-base-300 pt-2">{q}</div>
                                            {/each}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    {/key}
                {/if}
            {/if}
        </div>
    </ModalSelector>

</div>
