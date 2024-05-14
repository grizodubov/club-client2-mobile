<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    import { CommunityIcon, PollCard } from '@/components';

    import { states } from '@/stores';

    import { /* Filters,*/ AnswerBlock, QuestionCard } from './components';

    import { modalCreate, modalDestroy, modalShow } from '@/helpers/modal';

    /* import { type CommunityFilters, communityFilters, activeCommunityFiltersAmount } from '@/stores'; */

    import { subscribe } from '@/helpers/notification';
    
    import { Entity, collector } from '@/helpers/entity';
    import {
        communitiesList,
        updatePost,
    } from '@/queries/community';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;


    /* $: filters = $communityFilters as CommunityFilters; */


    $: currentStates = $states as any;


    let community: { [key: string]: any } | undefined = undefined;

    let posts: { [key: string]: any }[] = [];
    let polls: { [key: string]: any }[] = [];

    let start = true;

    /* let postSelected: any = null; */


    //$: filters, posts, polls, filterPosts();


    /* DATA: communitiesListHandler */
	const communitiesListHandler = new Entity({
		model: communitiesList.model,
		retriever: communitiesList.retriever,
        onSuccess: data => {
            start = false;
            let ct: any = undefined;
            // community
            data.communities.forEach((c: any) => {
                if (c.id == params?.id) {
                    ct = c;
                }
                else {
                    if (c.children && c.children.length)
                        c.children.forEach((cc: any) => {
                            if (cc.id == params?.id)
                                ct = cc;
                        });
                }
            });
            if (ct) {
                if (ct.children && ct.children.length) {
                    const temp = {
                        subjects_open: 0,
                        subjects_new: 0,
                        answers_new: 0,
                        time_last_post: null,
                        time_last_post_new: null,
                    };
                    ct.children.forEach((cc: any) => {
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
                        }
                    });
                    ct = Object.assign(ct, temp);
                }
                else {
                    if (data.stats.hasOwnProperty(ct.id.toString()))
                        ct = Object.assign(ct, data.stats[ct.id.toString()]);
                }
                community = ct;
            }
            else {
                community = undefined;
            }
            // polls
            polls = [ ...data.polls ];
            // posts
            posts = [ ...data.posts ].sort((a, b) => postsSorting(a, b));
        },
	});

    let communitiesListLoading = communitiesListHandler.loading;


    /* DATA: updatePostHandler */
	const updatePostHandler = new Entity({
		model: updatePost.model,
		retriever: updatePost.retriever,
	});


    let communitiesFilterLoading = false;


    /* postsSorting */
    function postsSorting(a: any, b: any) {
        let weightA = 0;
        let weightB = 0;
        // Непрочитанные сообщения
        if (a.time_last_post_new)
            weightA += 1;
        if (b.time_last_post_new)
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
        // Открытые вопросы
        if (!a.question.closed)
            weightA += 1;
        if (!b.question.closed)
            weightB += 1;
        if (weightA != weightB)
            return weightB - weightA;
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


    /* filterPosts */
    //function filterPosts() {
    //}


    /* ask */
    function ask() {
        if (community) {
            modalCreate(AnswerBlock, { community_id: community?.id, onSubmit: post }, null, modalDestroy);
            modalShow();
        }
    }


    /* answer */
    function answer(event: any) {
        modalCreate(AnswerBlock, Object.assign(event.detail, { onSubmit: post }), null, modalDestroy);
        modalShow();
    }


    /* post */
    function post(event: any) {
        modalDestroy(true);
        //console.log(event.detal);
    }


    /* open */
    function open(event: any) {
        collector.get([
            [ 
                updatePostHandler,
                {
                    postId: event.detail.id,
                    closed: false,
                    helpful: null,
                }
            ],
        ]);
    }


    /* close */
    function close(event: any) {
        collector.get([
            [ 
                updatePostHandler,
                {
                    postId: event.detail.id,
                    closed: true,
                    helpful: null,
                }
            ],
        ]);
    }


    /* select */
    function select(event: any) {
        collector.get([
            [ 
                updatePostHandler,
                {
                    postId: event.detail.id,
                    closed: null,
                    helpful: !event.detail.helpful,
                }
            ],
        ]);
    }


    /* get */
    function get() {
        collector.get([
            [ 
                communitiesListHandler,
                {
                    communityId: parseInt(params?.id),
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
        /* communityFilters.load(); */
        //modalCreate(Filters, undefined);
        get();
        const sub = subscribe('events', refresh);
        return () => {
            //modalDestroy();
            sub.close();
        };
	});
</script>


<div 
    class="w-full h-full flex flex-col"
>

    <button
        class="fixed right-3 btn btn-sm btn-front text-base-100 flex z-[12]"
        style="top: {108 + currentStates.safeTop}px"
        on:click="{ask}"
    >
        <span>Спросить</span>
    </button>

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
                <div class="relative mt-10 w-[100px] h-[1px]">
                    <div
                        class="absolute w-[100px] h-[100px] z-[6]"
                    >
                        {#if community || (!$communitiesListLoading && !start)}
                            <CommunityIcon
                                id="{community?.id}"
                                name="{community?.name}"
                                avatarHash="{community?.avatar_hash}"
                                scaleLetter="2"
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
        <div class="mt-[-20px] h-[calc(100%+20px)] rounded-2xl scrollable-y">
            {#if !community || ($communitiesListLoading && start)}
                <div class="w-full h-full flex justify-center items-center">
                    <span class="loading loading-bars text-front laoding-lg"></span>
                </div>
            {:else}
                <div class="mt-[60px]">
                    <div class="px-4 text font-medium text-[21px] leading-[29px] text-center mb-5">{community.name}</div>
                    {#each polls as poll (poll.id)}
                        <div
                            class="mb-5"
                            in:fade="{{ duration: 100 }}"
                        >
                            <PollCard poll="{poll}" />
                        </div>
                    {/each}
                    {#each posts as post (post.question.id)}
                        <div
                            class="mb-5"
                            in:fade="{{ duration: 100 }}"
                        >
                            <QuestionCard
                                post="{post}"
                                on:answer="{answer}"
                                on:open="{open}"
                                on:close="{close}"
                                on:select="{select}"
                            />
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>

</div>
