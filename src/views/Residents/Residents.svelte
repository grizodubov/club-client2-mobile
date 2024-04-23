<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    import { Filters, ResidentCard, InputText } from './components';

    import { modalCreate, modalDestroy, modalShow } from '@/helpers/modal';

    import { findTags } from '@/utils/tags';

    import { type User, user, type ResidentsFilters, residentsFilters, activeResidentsFiltersAmount } from '@/stores';

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
    $: filters = $residentsFilters as ResidentsFilters;


    let residents: { [key: string]: any }[] = [];
    let residentsFiltered: { [key: string]: any }[] = [];
    let contacts: { [key: string]: any } = {};


    let tmFilter: ReturnType<typeof setTimeout> | null = null;


    $: filters, residents, filterResidents();


    /* DATA: residentsListHandler */
	const residentsListHandler = new Entity({
		model: residentsList.model,
		retriever: residentsList.retriever,
        onSuccess: data => {
            const resident = data.residents.find((r: { [key: string]: any }) => r.id == currentUser.id);
            residents = [
                ...data.residents.filter((r: { [key: string]: any }) => r.id != currentUser.id).map((r: { [key: string]: any }) => {
                    if (resident) {
                        r.tagsLinked = findTags(resident.tags, r.interests);
                        r.interestsLinked = findTags(resident.interests, r.tags);
                    }
                    else {
                        r.tagsLinked = [];
                        r.interestsLinked = [];
                    }
                    return r;
                })
            ];
            contacts = data.contacts;
        },
	});

    let residentsListLoading = residentsListHandler.loading;

    let residentFilterLoading = false;


    /* filterResidents */
    function filterResidents() {
        residentsFiltered = [];
        residentFilterLoading = true;
        if (tmFilter)
            clearTimeout(tmFilter);
        tmFilter = setTimeout(
            () => {
                residentsFilters.save();
                if ($activeResidentsFiltersAmount || filters.name) {
                    const fn = filters.name.toLowerCase();
                    residentsFiltered = residents.filter(
                        (r: { [key: string]: any }) => {
                            let flagOff = 0;
                            let flagOn = 0;
                            if (!filters.helpful) {
                                flagOff++;
                            }
                            else {
                                if (r.rating > 0)
                                    flagOn++;
                            }
                            if (!filters.tags) {
                                flagOff++;
                            }
                            else {
                                if (r.tagsLinked.length > 0)
                                    flagOn++;
                            }
                            if (!filters.interests) {
                                flagOff++;
                            }
                            else {
                                if (r.interestsLinked.length > 0)
                                    flagOn++;
                            }
                            if (!filters.contacts) {
                                flagOff++;
                            }
                            else {
                                if (contacts[r.id.toString()] && contacts[r.id.toString()].contact)
                                flagOn++;
                            }
                            return (!fn || r.name.toLowerCase().indexOf(fn) > -1 || r.company.toLowerCase().indexOf(fn) > -1) &&
                                (
                                    (filters.strict && flagOn + flagOff == 4) ||
                                    (!filters.strict && (flagOff == 4 || flagOn > 0))
                                )
                        }
                    );
                }
                else {
                    residentsFiltered = [ ...residents ];
                }
                residentFilterLoading = false;
            }, 250
        );
    }


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
        residentsFilters.load();
        modalCreate(Filters, undefined);
        get();
        const sub = subscribe('events', refresh);
        return () => {
            modalDestroy();
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
                Резиденты
            </div>
            <div class="w-[56px] h-[56px] mr-4 mt-4 shrink-0 grow-0 flex items-center justify-center">
                <button
                    class="relative text-base-100 w-8 h-8 flex items-center justify-center"
                    on:click="{() => {
                        modalShow();
                    }}"
                >
                    <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M30 8h-4.1c-.5-2.3-2.5-4-4.9-4s-4.4 1.7-4.9 4H2v2h14.1c.5 2.3 2.5 4 4.9 4s4.4-1.7 4.9-4H30V8zm-9 4c-1.7 0-3-1.3-3-3s1.3-3 3-3s3 1.3 3 3s-1.3 3-3 3z" fill="currentColor"></path><path d="M2 24h4.1c.5 2.3 2.5 4 4.9 4s4.4-1.7 4.9-4H30v-2H15.9c-.5-2.3-2.5-4-4.9-4s-4.4 1.7-4.9 4H2v2zm9-4c1.7 0 3 1.3 3 3s-1.3 3-3 3s-3-1.3-3-3s1.3-3 3-3z" fill="currentColor"></path></svg>
                    {#if $activeResidentsFiltersAmount}
                        <div class="absolute w-[18px] h-[18px] bg-scene text-base-100 flex items-center justify-center text-[10px] font-medium rounded-full top-5 left-5"><span>{$activeResidentsFiltersAmount}</span></div>
                    {/if}
                </button>
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
                </div>
                {#if $residentsListLoading || residentFilterLoading}
                    <div class="w-full h-full flex justify-center items-center">
                        <span class="loading loading-bars text-front laoding-lg"></span>
                    </div>
                {:else}
                    <div class="h-full scrollable-y">
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
                    </div>
                {/if}
            </div>
        </div>
    </div>

</div>
