<script lang="ts">
    import { onMount, tick } from 'svelte';
    import { fade } from 'svelte/transition';

    import { Filters, ResidentCard, InputText } from './components';

    import { nameNormalization } from '@/utils/names';

    import { Avatar, TagTiny } from '@/components';

    import { modalCreate, modalDestroy, modalShow } from '@/helpers/modal';

    import { findTags } from '@/utils/tags';

    import { SwipeDeck } from 'svelte-swipe-cards';

    import { type User, user, type ResidentsFilters, residentsFilters, activeResidentsFiltersAmount } from '@/stores';

    import { subscribe } from '@/helpers/notification';

    import { Entity, collector } from '@/helpers/entity';
    import {
        residentsList,
        userContactAdd,
        userFavorites,
        userFavoritesSet,
    } from '@/queries/user';


    import { type WordForms, nwfi } from '@/utils/numword';


    const wordForms: WordForms = {
        'новый потенциальный партнёр': [ 'новых потенциальных партнёров', 'новый потенциальный партнёр', 'новых потенциальных партнёра', 'новых потенциальных партнёров' ],
    };


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
            start = false;
            const resident = data.residents.find((r: { [key: string]: any }) => r.id == currentUser.id);
            const temp = [
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
            temp.sort((a: any, b: any) => {
                if (a.favorites_flag !== b.favorites_flag) {
                    if (a.favorites_flag === true || b.favorites_flag === false)
                        return -1;
                    if (b.favorites_flag === true || a.favorites_flag === false)
                        return 1;
                }
                if (a.name.toLowerCase() > b.name.toLowerCase())
                    return 1;
                if (a.name.toLowerCase() < b.name.toLowerCase())
                    return -1;
                return 0;
            });
            residents = temp;
            contacts = data.contacts;
        },
	});

    let residentsListLoading = residentsListHandler.loading;

    let residentFilterLoading = false;

    let start = true;


    let deck;
    let cards: any[] = [];
    let cardsAmount: number = 0;
    let cardsStates = {};
    let cardsShow = false;
    let cardsOpacity = false;
    let cardsContacts = {};


    /* DATA: userFavoritesHandler */
	const userFavoritesHandler = new Entity({
		model: userFavorites.model,
		retriever: userFavorites.retriever,
        onSuccess: data => {
            cards = data.users;
            cardsAmount = cards.length;
            cardsStates = cards.reduce(
                (states, card) => {
                    return { ...states, [card.id.toString()]: null }
                }, {}
            );
        },
	});


    /* DATA: userFavoritesSetHandler */
	const userFavoritesSetHandler = new Entity({
		model: userFavoritesSet.model,
		retriever: userFavoritesSet.retriever,
	});


    /* DATA: userContactAddHandler */
	const userContactAddHandler = new Entity({
		model: userContactAdd.model,
		retriever: userContactAdd.retriever,
	});


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


    /* getFavorites */
    function getFavorites() {
        collector.get([
            [ 
                userFavoritesHandler,
                {}
            ],
        ]);
    }


    /* setFavorites */
    function setFavorites(targetId, flag) {
        collector.get([
            [ 
                userFavoritesSetHandler,
                {
                    targetId: targetId,
                    flag: flag,
                }
            ],
        ]);
    }


    /* addContact */
    function addContact(id) {
        collector.get([
            [ 
                userContactAddHandler,
                {
                    contactId: id,
                }
            ],
        ]);
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
        getFavorites();
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
                Резиденты {#if (!$residentsListLoading || !start) && !residentFilterLoading}<span class="ml-1 text-base-300 text-lg font-extralight">(<span class="text-base-100">{residentsFiltered.length}</span> / <span>{residents.length}</span>)</span>{/if}
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
                {#if ($residentsListLoading && start) || residentFilterLoading}
                    <div class="w-full h-full flex justify-center items-center">
                        <span class="loading loading-bars text-front"></span>
                    </div>
                {:else}
                    <div class="h-full scrollable-y">
                        {#if cardsAmount}
                            <button
                                class="mt-[104px] pl-2 pr-4 py-2 mb-5 bg-moderate text-base-100 rounded-full mx-3 flex items-center"
                                on:click="{async () => {
                                    cardsShow = true;
                                    await tick();
                                    cardsOpacity = true;
                                }}"
                            ><span class="text-xl font-semibold rounded-full bg-info w-8 h-8 flex items-center justify-center">{cardsAmount}</span><span class="text-sm ml-2.5">{wordForms['новый потенциальный партнёр'][nwfi(cardsAmount)]}</span></button>
                        {/if}
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


{#if cardsShow}
    <div
        class="absolute top-0 left-0 w-full h-full transition-opacity duration-300 z-20"
        class:opacity-0="{!cardsOpacity}"
        class:opacity-100="{cardsOpacity}"
    >
        <div class="absolute bg-scene opacity-90 w-full h-full">
        </div>
        <div class="absolute w-full h-full flex flex-col jsutify-start items-center">
            <div class="text-base-100 mt-9 text-sm">Оцените потенциальных партнеров</div>
            <button
                class="rounded-lg px-4 btn-scene text-base-300 mt-2.5 text-[10px] font-semibold h-[24px] leading-[24px] py-0"
                on:click="{() => {
                    cardsOpacity = false;
                    setTimeout(() => { cardsShow = false; }, 400);
                }}"
            >
                <span class="normal-case">В другой раз</span>
            </button>
        </div>
        <div class="absolute left-[0px] right-[0px] top-[-10px] bottom-[0px] m-[auto] w-[310px] h-[450px]">
            <SwipeDeck
                {cards}
                let:card
                bind:this={deck}
                threshold="{10}"
                transitionDuration="{300}"
                allowedDirections="horizontal"
                on:swipe="{(e) => {
                    //console.log('swipe', e.detail.index);
                    cardsAmount = cardsAmount - 1;
                    const id = cards[e.detail.index]['id'];
                    setFavorites(id, cardsStates[id.toString()]);
                    if (!cardsAmount) {
                        cardsOpacity = false;
                        setTimeout(() => { cardsShow = false; }, 400);
                    }
                }}"
                on:move_left="{(e) => {
                    const id = cards[e.detail.index]['id'];
                    cardsStates[id.toString()] = false;
                }}"
                on:move_right="{(e) => {
                    const id = cards[e.detail.index]['id'];
                    cardsStates[id.toString()] = true;
                }}"
            >
                <div
                    class="w-[310px] h-[450px] rounded-xl transition-colors p-4 flex flex-col items-center justify-between border-2 border-base-300 relative"
                    class:bg-moderate="{cardsStates[card.id.toString()] === null}"
                    class:bg-success="{cardsStates[card.id.toString()] === true}"
                    class:bg-error="{cardsStates[card.id.toString()] === false}"
                >
                    <div class="shrink-1 grow-1 flex flex-col items-center overflow-hidden">
                        <div
                            class="w-[120px] h-[120px] left-[0px] right-[0px] mx-[auto] rounded-full overflow-hidden border-4 border-base-300"
                        >
                            <Avatar
                                user="{{
                                    id: card.id,
                                    name: card.name,
                                    avatar_hash: card.avatar_hash,
                                    roles: [ 'client' ],
                                    telegram: '',
                                }}"
                                scaleLetters="2.5"
                            />
                        </div>
                        <div class="w-full h-[0px] relative">
                            <button
                                class="btn btn-sm h-[48px] px-2 btn-warning text-base-100 transition-opacity duration-300 absolute bottom-[0px] right-[0px] z-[30]"
                                class:opacity-0="{cardsContacts[card.id.toString()]}"
                                on:click="{() => {
                                    if (!cardsContacts[card.id.toString()]) {
                                        cardsContacts[card.id.toString()] = true;
                                        addContact(card.id);
                                    }
                                }}"
                            >
                                <span class="leading-[18px] normal-case">Добавить<br />в избранные</span>
                            </button>
                        </div>
                        <div class="font-medium text-[20px] leading-[28px] mt-2 text-base-100 text-center">{nameNormalization(card.name, 2)}</div>
                        <div class="text-[12px] leading-[16px] mt-1.5 text-base-100 text-center">{card.position}</div>
                        <div class="font-medium text-[15px] leading-[19px] mt-0.5 text-base-100 text-center">{card.company}</div>
                        {#if card['catalog filtered']}
                            <div class="w-full text-center text-base-100 leading-[14px] mt-2">
                                {#each card['catalog filtered'] as tag}<span class="text-[10px] font-medium uppercase with-dot">{tag}</span>{/each}
                            </div>
                        {/if}
                        <!--
                        {#if card['catalog filtered']}
                            <div class="flex flex-wrap justify-center mt-2 ml-[-8px]">
                                {#each card['catalog filtered'] as tag}
                                    <div class="ml-2 mt-0.5"><TagTiny tag="{tag}" type="catalog" /></div>
                                {/each}
                            </div>
                        {/if}
                        -->
                        <!--
                        {#if card['hobby filtered']}
                            <div class="flex flex-wrap justify-center mt-2 ml-[-8px]">
                                {#each card['hobby filtered'] as tag}
                                    <div class="ml-2 mt-0.5"><TagTiny tag="{tag}" type="hobby" /></div>
                                {/each}
                            </div>
                        {/if}
                        -->
                    </div>
                    {#if card.tags['company needs intersections'] || card.tags['company scope intersections']}
                        <div class="shrink-0 grow-0 flex flex-col items-center overflow-hidden">
                            <div class="text-xs text-base-100">Совпадения:</div>
                            {#if card.tags['company needs intersections filtered']}
                                <div class="flex flex-wrap justify-center mt-2 ml-[-8px]">
                                    {#each card.tags['company needs intersections filtered'] as tag}
                                        <div class="ml-2 mt-0.5"><TagTiny tag="{tag}" type="tag" /></div>
                                    {/each}
                                </div>
                            {/if}
                            {#if card.tags['company scope intersections filtered']}
                                <div class="flex flex-wrap justify-center mt-2 ml-[-8px]">
                                    {#each card.tags['company scope intersections filtered'] as tag}
                                        <div class="ml-2 mt-0.5"><TagTiny tag="{tag}" type="interest" /></div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    {/if}
                    <div class="absolute rounded-[14px] bg-scene h-[28px] bottom-[-48px] left-[48px] right-[48px] flex justify-between items-center">
                        <div class="h-[28px] w-[28px] bg-error rounded-[14px] flex items-center justify-center px-1.5">
                            <svg class="text-base-100 w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28L75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256L9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" fill="currentColor"></path></svg>
                        </div>
                        <div
                            class="h-[28px] bg-success rounded-[14px] flex items-center px-1.5"
                            class:w-[28px]="{!card.favorites_stats}"
                            class:justify-center="{!card.favorites_stats}"
                            class:w-[64px]="{card.favorites_stats}"
                            class:justify-around="{card.favorites_stats}"
                        >
                            <svg class="text-base-100 w-4 h-4 shrink-0 grow-0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                            {#if card.favorites_stats}
                                <span class="text-base-100 font-medium text-sm shrink-0 grow-0">{card.favorites_stats}</span>
                            {/if}
                        </div>
                    </div>
                </div>
                <svelte:fragment slot="swipe-btn">
                    <div class="absolute bottom-[-56px] w-full flex justify-between">
                        <div class="w-12 h-12 flex items-center justify-center text-base-300">
                            <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M4.31 9.5l2.963 2.963a.75.75 0 0 1-.977 1.133l-.084-.073L1.97 9.281a.75.75 0 0 1-.073-.977l.073-.084l4.242-4.243a.75.75 0 0 1 1.134.977l-.073.084L4.31 8H10a7.75 7.75 0 0 1 7.746 7.504l.004.247a.75.75 0 0 1-1.5 0a6.25 6.25 0 0 0-6.02-6.246L10 9.5H4.31l2.963 2.963L4.31 9.5z" fill="currentColor"></path></g></svg>
                        </div>
                        <div class="w-12 h-12 flex items-center justify-center text-base-300">
                            <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M15.69 9.5l-2.963 2.963a.75.75 0 0 0 .977 1.133l.084-.073l4.242-4.242a.75.75 0 0 0 .073-.977l-.073-.084l-4.242-4.243a.75.75 0 0 0-1.134.977l.073.084L15.69 8H10a7.75 7.75 0 0 0-7.746 7.504l-.004.247a.75.75 0 0 0 1.5 0a6.25 6.25 0 0 1 6.02-6.246L10 9.5h5.69z" fill="currentColor"></path></g></svg>
                        </div>
                    </div>
                    <!--
                    <div class="absolute bottom-[-56px] w-full flex justify-between">
                        <button
                            class="w-12 h-12 border-2 border-base-300 flex items-center justify-center rounded-xl bg-error"
                            on:click="{() => {
                                if (deck) {
                                    deck.swipe('left');
                                }
                            }}"
                        >
                            <svg class="text-base-100 w-6 h-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28L75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256L9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" fill="currentColor"></path></svg>
                        </button>
                        <button
                            class="w-12 h-12 border-2 border-base-300 flex items-center justify-center rounded-xl bg-success"
                            on:click="{() => {
                                if (deck) {
                                    deck.swipe('right');
                                }
                            }}"
                        >
                            <svg class="text-base-100 w-6 h-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                        </button>
                    </div>
                    -->
                </svelte:fragment>
            </SwipeDeck>
        </div>
    </div>
{/if}
