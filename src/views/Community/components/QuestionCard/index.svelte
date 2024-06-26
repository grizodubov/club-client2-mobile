<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import { type WordForms, nwfi } from '@/utils/numword';

    import Post from './Post.svelte';

    import { Observer } from '@/helpers/observe';

    import { Entity, collector } from '@/helpers/entity';
    import {
        viewItem,
        viewItems,
	} from '@/queries/item';


    /* DATA: viewItemHandler */
	const viewItemHandler = new Entity({
		model: viewItem.model,
		retriever: viewItem.retriever,
	});


    /* DATA: viewItemsHandler */
	const viewItemsHandler = new Entity({
		model: viewItems.model,
		retriever: viewItems.retriever,
	});


    export let post: { [key: string]: any };


    const dispatch = createEventDispatcher();


    const wordForms: WordForms = {
        'ответ': [ 'ответов', 'ответ', 'ответа', 'ответов' ],
    };

    $: answersAmount = post.answers.length;
    $: answersAmountNew = post.answers.filter((answer: any) => !answer.time_view).length;

    $: views = createViewsCache(post);


    let open: boolean = false;


    const observer = new Observer({
        /* onEnter */
        onEnter: (el, id_s) => {
            if (el && !views[id_s])
                setPostView(parseInt(id_s));
		},
        /* once */
	    once: true,
        /* threshold */
		threshold: 0.5,
    });


    let viewsIds: any[] = [];
    let viewsTm: any = null;


    /* setPostView */
    function setPostView(postId) {
        if (viewsTm !== null)
            clearTimeout(viewsTm);
            viewsTm = setTimeout(sendPostViews, 250);
        viewsIds.push(postId);
    }


    /* createViewsCache */
    function createViewsCache(p) {
        const temp = {};
        temp[p.question.id.toString()] = p.question.time_view;
        p.answers.forEach((a: any) => {
            temp[a.id.toString()] = a.time_view;
        });
        return temp;
    }


    /* sendPostViews */
    function sendPostViews() {
        const mv = [ ...viewsIds ];
        const ln = viewsIds.length;
        viewsIds.splice(0, ln);
        viewsTm = null;
        if (ln > 1) {
            collector.get([
                [ 
                    viewItemsHandler,
                    {
                        itemsIds: mv,
                    }
                ],
            ]);
        }
        else {
            collector.get([
                [ 
                    viewItemHandler,
                    {
                        itemId: mv[0],
                    }
                ],
            ]);
        }
    }


    /* observePost */
    function observePost(el: any, id: number) {
        observer.observe(el, id.toString());
        return {
            destroy() {
                observer.unobserve(el);
            },
    	};
    }
</script>


<style>
    .answers {
        width: calc(100% + 16px);
        margin-left: -8px;
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 150ms;
    }

    .answers.open {
        grid-template-rows: 1fr;
    }
</style>


<div
    class="w-full px-3"
>
    <button
        class="relative rounded-2xl w-full overflow-hidden p-4"
        on:click="{() => {
            if (post.answers.length)
                open = !open;
        }}"
    >
        <div
            class="absolute w-full h-full top-0 left-0 bg-moderate transition-all"
            class:opacity-15="{!open}"
            class:opacity-30="{open}"
        >
        </div>
        <div class="relative w-full">
            <div
                use:observePost="{ post.question.id }"
            >
                <Post
                    post="{post.question}"
                    isQuestion="{true}"
                    on:answer="{() => { dispatch('answer', post.question); }}"
                    on:open="{() => { dispatch('open', post.question); }}"
                    on:close="{() => { dispatch('close', post.question); }}"
                />
            </div>
            <div class="flex w-full justify-between items-center mt-3">
                <div
                    class="h-7"
                >
                    <div
                        class="flex items-center"
                    >
                        <div class="w-5 h-5 flex items-center justify-center mr-[-1px]">
                            <svg class="w-5 h-5 opacity-60" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2l-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29c7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1l-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160s-93.3 160-208 160z" fill="currentColor"></path></svg>
                        </div>
                        {#if answersAmountNew}
                            <div
                                class="relative ml-[-3px] rounded-full overflow-hidden w-6 h-6 bg-secondary flex items-center justify-center text-base-100 font-semibold text-xs tracking-tight"
                            >
                                {answersAmountNew}
                            </div>
                        {/if}
                        <div class="ml-2 text-xs opacity-60 font-medium">{answersAmount} {wordForms['ответ'][nwfi(answersAmount)]}</div>
                    </div>
                </div>
                {#if answersAmount}
                    <div class="w-5 ml-2 shrink-0 grow-0 opacity-50">
                        {#if open}
                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M18 12.998H6a1 1 0 0 1 0-2h12a1 1 0 0 1 0 2z" fill="currentColor"></path></svg>
                        {:else}
                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z" fill="currentColor"></path></svg>
                        {/if}
                    </div>
                {/if}
            </div>
            {#if post.answers.length}
                <div
                    class="answers"
                    class:open="{open}"
                >
                    <div class="w-full overflow-hidden">
                        {#each post.answers as answer (answer.id)}
                            <div
                                class="relative w-full bg-base-100 rounded-2xl w-full overflow-hidden px-2 py-3 mt-3 first:mt-4 mb-0"
                            >
                                <div class="absolute w-full h-full top-0 left-0 opacity-15 bg-moderate"></div>
                                <div class="relative w-full">
                                    <div
                                        use:observePost="{ answer.id }"
                                    >
                                        <Post
                                            post="{answer}"
                                            question="{post.question}"
                                            on:select="{() => { dispatch('select', answer); }}"                
                                        />
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    </button>
</div>
