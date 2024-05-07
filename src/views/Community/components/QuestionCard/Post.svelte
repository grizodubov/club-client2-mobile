<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { readable } from 'svelte/store';

    import { type WordForms, nwfi } from '@/utils/numword';

    import { Avatar } from '@/components';

    import { nameNormalization } from '@/utils/names';

    import { type User, user } from '@/stores';


    export let post: { [key: string]: any };
    export let question: { [key: string]: any } | null = null;
    export let isQuestion: boolean = false;


    const dispatch = createEventDispatcher();


    const wordForms: WordForms = {
        'минута': [ 'минут', 'минуту', 'минуты', 'минут' ],
        'час': [ 'часов', 'час', 'часа', 'часов' ],
        'день': [ 'дней', 'день', 'дня', 'дней' ],
    };


    /* current time */
    const time = readable(
        Date.now(),
        set => {
            const intvl = setInterval(() => set(Date.now()), 2000);
            return () => clearInterval(intvl);
        }
    );


    $: elapsedTime = generateElapsedString(Math.floor(($time - post.time_create) / 1000));


    $: currentUser = $user as User;


    /* generateElapsedString */
    function generateElapsedString(dt: number) {
        if (dt < 60) {
            return 'меньше минуты назад';
        }
        let temp = 0;
        if (dt < 3600) {
            temp = Math.floor(dt / 60);
            return temp.toString() + ' ' + wordForms['минута'][nwfi(temp)] + ' назад';
        }
        if (dt < 86400) {
            temp = Math.floor(dt / 3600);
            return temp.toString() + ' ' + wordForms['час'][nwfi(temp)] + ' назад';
        }
        temp = Math.floor(dt / 86400);
        return temp.toString() + ' ' + wordForms['день'][nwfi(temp)] + ' назад';
    }
</script>


<div class="flex items-center justify-start">
    <div class="w-[48px] h-[48px] shrink-0 grow-0">
        <Avatar
            user="{{
                id: post.author_id,
                name: post.author_name,
                avatar_hash: post.author_avatar_hash,
                roles: [ 'client' ],
                telegram: '',
            }}"
        />
    </div>
    <div class="ml-3 shrink-1 grow-1 w-full">
        <div class="text-left font-medium text-[15px] leading-[22px] whitespace-nowrap overflow-hidden">{nameNormalization(post.author_name, 2)}</div>
        <div class="text-left text-xs opacity-80">{elapsedTime}</div>
    </div>
    {#if post.verified}
        {#if isQuestion}
            {#if currentUser.id == post.author_id}
                {#if post.closed}
                    <button
                        class="btn btn-sm btn-success text-base-100 grow-0 shrink-0 self-start"
                        on:click|stopPropagation="{() => {
                            dispatch('open');
                        }}"
                    >
                        <span>Открыть</span>
                    </button>
                {:else}
                    <button
                        class="btn btn-sm btn-error text-base-100 grow-0 shrink-0 self-start"
                        on:click|stopPropagation="{() => {
                            dispatch('close');
                        }}"
                    >
                        <span>Закрыть</span>
                    </button>
                {/if}
            {:else}
                {#if post.closed}
                    <div class="w-6 h-6 grow-0 shrink-0 opacity-40">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024"><path d="M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM540 701v53c0 4.4-3.6 8-8 8h-40c-4.4 0-8-3.6-8-8v-53a48.01 48.01 0 1 1 56 0zm152-237H332V240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224z" fill="currentColor"></path></svg>
                    </div>
                {:else}
                    <button
                        class="btn btn-sm btn-front text-base-100 grow-0 shrink-0 self-start"
                        on:click|stopPropagation="{() => {
                            dispatch('answer');
                        }}"
                    >
                        <span>Ответить</span>
                    </button>
                {/if}
            {/if}
        {:else}
            {#if post.helpful}
                <svg class="self-start w-8 h-8 text-info" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024"><path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7c0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311h-.3v428h472.3c9.2 0 18.2-1.8 26.5-5.4c47.6-20.3 78.3-66.8 78.3-118.4c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c-.2-12.6-2-25.1-5.6-37.1zM112 528v364c0 17.7 14.3 32 32 32h65V496h-65c-17.7 0-32 14.3-32 32z" fill="currentColor"></path></svg>
            {/if}
        {/if}
    {:else}
        <button
            class="btn btn-sm bg-transparent hover:bg-transparent border-base-300 hover:border-base-300"
        >На проверке</button>
    {/if}
</div>
<div class="text-sm text-left mt-3">{post.text}</div>
{#if post.verified && !isQuestion && question && currentUser.id == question.author_id && currentUser.id != post.author_id}
    {#if post.helpful}
        <button
            class="btn btn-sm btn-error text-base-100 grow-0 shrink-0 self-start flex mt-3"
            on:click|stopPropagation="{() => {
                dispatch('select');
            }}"
        >
            <span>Отменить выбор</span>
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024"><path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7c0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311h-.3v428h472.3c9.2 0 18.2-1.8 26.5-5.4c47.6-20.3 78.3-66.8 78.3-118.4c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c-.2-12.6-2-25.1-5.6-37.1zM112 528v364c0 17.7 14.3 32 32 32h65V496h-65c-17.7 0-32 14.3-32 32z" fill="currentColor"></path></svg>
        </button>
    {:else}
        <button
            class="btn btn-sm btn-info text-base-100 grow-0 shrink-0 self-start flex mt-3"
            on:click|stopPropagation="{() => {
                dispatch('select');
            }}"
        >
            <span>Выбрать ответ</span>
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024"><path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7c0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311h-.3v428h472.3c9.2 0 18.2-1.8 26.5-5.4c47.6-20.3 78.3-66.8 78.3-118.4c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c-.2-12.6-2-25.1-5.6-37.1zM112 528v364c0 17.7 14.3 32 32 32h65V496h-65c-17.7 0-32 14.3-32 32z" fill="currentColor"></path></svg>
        </button>
    {/if}
{/if}
