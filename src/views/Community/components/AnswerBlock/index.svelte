<script lang="ts">
    import InputArea from './InputArea.svelte';

    import { Entity, collector } from '@/helpers/entity';
    import {
        addPost,
    } from '@/queries/community';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;


    let text: string = '';


    /* DATA: addPostHandler */
	const addPostHandler = new Entity({
		model: addPost.model,
		retriever: addPost.retriever,
        onSuccess: (data: any) => {
            if (params?.id) {
                if (params?.onSubmit)
                    params?.onSubmit({ postId: data.post_id, replyToPostId: params?.id });
            }
            else {
                if (params?.onSubmit)
                    params?.onSubmit({ postId: data.post_id });
            }
        },
	});


    /* add */
    function add() {
        if (text.length > 0)
            collector.get([
                [ 
                    addPostHandler,
                    {
                        communityId: params?.community_id,
                        text: text,
                        replyToPostId: params?.id ? params?.id : null,
                    }
                ],
            ]);
    }
</script>


<div class="px-4 pb-[39px]">
    {#if params?.id}
        <div class="text-xs opacity-50 pt-4">{params?.text.substring(0, 100)}{params?.text.length > 100 ? ' …' : ''}</div>
    {/if}
    <div class="h-[240px] w-full pt-4">
        <InputArea bind:value="{text}" placeholder="{params?.id ? 'Ваш ответ' : 'Ваш вопрос'}" />
    </div>
    <button
        class="btn btn-front text-base-100 mt-4"
        class:btn-active="{text.length == 0}"
        class:opacity-60="{text.length == 0}"
        on:click="{() => {
            if (text.length > 0)
                add();
        }}"
    >{params?.id ? 'Отправить ответ' : 'Задать вопрос'}</button>
</div>
