<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    import { Filters, InputText, CommunityCard, ModalPhoto } from './components';

    import { modalCreate, modalDestroy, /* modalShow */ } from '@/helpers/modal';

    import { type CommunitiesFilters, communitiesFilters, activeCommunitiesFiltersAmount } from '@/stores';

    import { Avatar } from '@/components';

    import { nameNormalization } from '@/utils/names';

    import { subscribe } from '@/helpers/notification';
    
    import { Entity, collector } from '@/helpers/entity';
    import {
        communitiesList,
    } from '@/queries/community';
    import {
        userCommunityManager,
    } from '@/queries/user';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;


    $: filters = $communitiesFilters as CommunitiesFilters;


    let communities: { [key: string]: any }[] = [];
    let communitiesFiltered: { [key: string]: any }[] = [];

    let communitySelected: any = undefined;


    let communityManager: any = null;


    let tmFilter: ReturnType<typeof setTimeout> | null = null;

    
    let start = true;


    let photoShow = false;


    $: filters, communities, filterCommunities();


    /* DATA: communitiesListHandler */
	const communitiesListHandler = new Entity({
		model: communitiesList.model,
		retriever: communitiesList.retriever,
        onSuccess: data => {
            start = false;
            communities = [
                ...data.communities.map((c: any) => {
                    const temp = {
                        subjects_open: 0,
                        subjects_new: 0,
                        answers_new: 0,
                        time_last_post: null,
                        time_last_post_new: null,
                    };
                    c.children = c.children.map((cc: any) => {
                        if (data.stats.hasOwnProperty(cc.id.toString())) {
                            const st = data.stats[cc.id.toString()];
                            temp.subjects_open += st.subjects_open;
                            temp.subjects_new += st.subjects_new;
                            temp.answers_new += st.answers_new;
                            if (st.time_last_post)
                                if (!temp.time_last_post || st.time_last_post > temp.time_last_post)
                                    temp.time_last_post = st.time_last_post;
                            if (st.time_last_post_new)
                                if (!temp.time_last_post_new || st.time_last_post_new > temp.time_last_post_new)
                                    temp.time_last_post_new = st.time_last_post_new;
                            return Object.assign(cc, st);
                        }
                        return Object.assign(cc, {
                            subjects_open: 0,
                            subjects_new: 0,
                            answers_new: 0,
                            time_last_post: null,
                            time_last_post_new: null,
                        });
                    }).sort((a: any, b: any) => communitiesSorting(a, b));
                    if (data.stats.hasOwnProperty(c.id.toString()) && (!c.children || c.children.length == 0))
                        return Object.assign(c, data.stats[c.id.toString()]);
                    return Object.assign(c, temp);
                })
            ].sort((a, b) => communitiesSorting(a, b));
        },
	});

    let communitiesListLoading = communitiesListHandler.loading;

    let communitiesFilterLoading = false;



    /* DATA: userCommunityManagerHandler */
    const userCommunityManagerHandler = new Entity({
		model: userCommunityManager.model,
		retriever: userCommunityManager.retriever,
        onSuccess: data => {
            communityManager = data.community_manager;
        },
    });


    /* sendTelegramMessage */
    function sendTelegramMessage(telegramId: string) {
        const id = telegramId.replace(/^@+/, '');
        window.location.href = 'https://t.me/' + id;
    }
    
    
    /* communitiesSorting */
    function communitiesSorting(a: any, b: any) {
        let weightA = 0;
        let weightB = 0;
        // Открытые вопросы
        if (a.subjects_open)
            weightA += 1;
        if (b.subjects_open)
            weightB += 1;
        if (weightA != weightB)
            return weightB - weightA;
        // Непрочитанные сообщения
        if (a.subjects_new || a.answers_new)
            weightA += 1;
        if (b.subjects_new || b.answers_new)
            weightB += 1;
        if (weightA != weightB)
            return weightB - weightA;
        // Время непрочитанных сообщений
        if (a.time_last_post_new && b.time_last_post_new) {
            if (a.time_last_post_new > b.time_last_post_new) {
                weightA += 1;
            }
            else if (a.time_last_post_new < b.time_last_post_new) {
                weightB += 1;
            }
            if (weightA != weightB)
                return weightB - weightA;
        }
        // Время прочитанных сообщений
        if (a.time_last_post && b.time_last_post) {
            if (a.time_last_post > b.time_last_post) {
                weightA += 1;
            }
            else if (a.time_last_post < b.time_last_post) {
                weightB += 1;
            }
            if (weightA != weightB)
                return weightB - weightA;
        }
        return 0;
    }


    /* filterCommunities */
    function filterCommunities() {
        communitiesFiltered = [];
        communitiesFilterLoading = true;
        if (tmFilter)
            clearTimeout(tmFilter);
        tmFilter = setTimeout(
            () => {
                communitiesFilters.save();
                if ($activeCommunitiesFiltersAmount || filters.name) {
                    const fn = filters.name.toLowerCase();
                    communitiesFiltered = communities.filter(
                        (c: { [key: string]: any }) => {
                            return !fn ||
                                (fn && c.name.toLowerCase().indexOf(fn) > -1) || 
                                (fn && c.children && c.children.length && c.children.filter((cc: any) => cc.name.toLowerCase().indexOf(fn) > -1).length);
                        }
                    );
                }
                else {
                    communitiesFiltered = [ ...communities ];
                }
                communitiesFilterLoading = false;
            }, 250
        );
    }


    /* get */
    function get() {
        collector.get([
            [ 
                userCommunityManagerHandler,
                {}
            ],
        ]);
        collector.get([
            [ 
                communitiesListHandler,
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
        communitiesFilters.load();
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
                Коммуникации
            </div>
            <div class="w-[56px] h-[56px] mr-4 mt-4 shrink-0 grow-0 flex items-center justify-center">
                <!--
                <button
                    class="relative text-base-100 w-8 h-8 flex items-center justify-center"
                    on:click="{() => {
                        modalShow();
                    }}"
                >
                    <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M30 8h-4.1c-.5-2.3-2.5-4-4.9-4s-4.4 1.7-4.9 4H2v2h14.1c.5 2.3 2.5 4 4.9 4s4.4-1.7 4.9-4H30V8zm-9 4c-1.7 0-3-1.3-3-3s1.3-3 3-3s3 1.3 3 3s-1.3 3-3 3z" fill="currentColor"></path><path d="M2 24h4.1c.5 2.3 2.5 4 4.9 4s4.4-1.7 4.9-4H30v-2H15.9c-.5-2.3-2.5-4-4.9-4s-4.4 1.7-4.9 4H2v2zm9-4c1.7 0 3 1.3 3 3s-1.3 3-3 3s-3-1.3-3-3s1.3-3 3-3z" fill="currentColor"></path></svg>
                    {#if $activeCommunitiesFiltersAmount}
                        <div class="absolute w-[18px] h-[18px] bg-scene text-base-100 flex items-center justify-center text-[10px] font-medium rounded-full top-5 left-5"><span>{$activeCommunitiesFiltersAmount}</span></div>
                    {/if}
                </button>
                -->
            </div>
        </div>
        <div class="bg-base-100 rounded-t-2xl h-5"></div>
    </div>

    <div class="shrink-0 grow-0 h-[calc(100%-112px)]">
        <div class="mt-[-20px] h-[calc(100%+20px)] rounded-2xl">
            <div class="relative h-full">
                <div class="absolute w-full px-3 mt-5 h-16 z-10">
                    <InputText
                        placeholder="Название сообщества"
                        bind:value="{filters.name}"
                    />
                </div>
                {#if communityManager}
                    <div class="absolute w-full px-3 h-[144px] mt-[104px] z-11">
                        <div class="flex items-start p-4 justify-between rounded-2xl bg-base-200 w-full h-full">
                            <div class="w-[80px] h-[80px] shrink-0 grow-0">
                                <button
                                    on:click="{() => {
                                        if (communityManager && communityManager.avatar_hash)
                                            photoShow = true;
                                    }}"
                                >
                                    <Avatar
                                        user="{{
                                            id: communityManager.id,
                                            name: communityManager.name,
                                            avatar_hash: communityManager.avatar_hash,
                                            roles: [ 'client' ],
                                            telegram: '',
                                        }}"
                                        scaleLetters="2.5"
                                    />
                                </button>
                            </div>
                            <div class="w-full srink-1 grow-1 ml-4">
                                <div class="text-xs font-medium text-front">Ваш коммьюнити-менеджер:</div>
                                <div class="text font-medium text-[18px]">{nameNormalization(communityManager.name, 2)}</div>
                                <div class="flex items-center mt-2">
                                    <svg class="w-4 h-4 text-info" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M20.33 21.48l2.24-2.24a2.19 2.19 0 0 1 2.34-.48l2.73 1.09a2.18 2.18 0 0 1 1.36 2v5A2.17 2.17 0 0 1 26.72 29C7.59 27.81 3.73 11.61 3 5.41A2.17 2.17 0 0 1 5.17 3H10a2.16 2.16 0 0 1 2 1.36l1.09 2.73a2.16 2.16 0 0 1-.47 2.34l-2.24 2.24s1.29 8.73 9.95 9.81z" fill="currentColor"></path></svg>
                                    <span class="text-sm ml-1.5"><a href="tel:{communityManager.phone}">{communityManager.phone}</a></span>
                                </div>
                                {#if communityManager.link_telegram}
                                    <div class="flex justify-start mt-3">
                                        <button
                                            class="flex items-center rounded-full bg-info text-base-100 px-3 h-7"
                                            on:click="{() => {
                                                sendTelegramMessage(communityManager.link_telegram);
                                            }}"
                                        >
                                            <span class="text-sm mb-[2px] pr-2">Отправить сообщение</span>
                                            <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 448 512"><path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9l-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9l190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284L16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z" fill="currentColor"></path></svg>
                                        </button>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                {/if}
                {#if ($communitiesListLoading && start) || communitiesFilterLoading}
                    <div class="w-full h-full flex justify-center items-center">
                        <span class="loading loading-bars text-front"></span>
                    </div>
                {:else}
                    <div class="h-full scrollable-y">
                        {#each communitiesFiltered as community (community.id)}
                            <div
                                class="mb-5 first:mt-[268px]"
                                in:fade="{{ duration: 100 }}"
                            >
                                <CommunityCard
                                    community="{community}"
                                    on:click="{() => {
                                        if (!communitySelected && community.children && community.children.length) {
                                            communitySelected = community;
                                        }
                                    }}"
                                />
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    </div>

    <ModalPhoto
        bind:open="{photoShow}"
    >
        {#if communityManager && communityManager.avatar_hash}
            <div class="flex w-full h-full">
                <img class="w-full h-full" src="https://media.clubgermes.ru/n/{communityManager.avatar_hash}.jpg" alt="" />
            </div>
        {/if}
    </ModalPhoto>

</div>
