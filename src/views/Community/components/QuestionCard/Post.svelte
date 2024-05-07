<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { readable } from 'svelte/store';

    import { type WordForms, nwfi } from '@/utils/numword';

    import { Avatar } from '@/components';

    import { nameNormalization } from '@/utils/names';


    export let post: { [key: string]: any };
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
<div class="ml-4 shrink-1 grow-1 w-full">
    <div class="text-left font-medium text-[15px] leading-[22px] whitespace-nowrap overflow-hidden">{nameNormalization(post.author_name, 2)}</div>
    <div class="text-left text-xs opacity-80">{elapsedTime}</div>
</div>
{#if post.closed}
    <div class="w-6 h-6 grow-0 shrink-0 opacity-40">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024"><path d="M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM540 701v53c0 4.4-3.6 8-8 8h-40c-4.4 0-8-3.6-8-8v-53a48.01 48.01 0 1 1 56 0zm152-237H332V240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224z" fill="currentColor"></path></svg>
    </div>
{:else if isQuestion && post.verified}
    <button
        class="btn btn-sm btn-front text-base-100 grow-0 shrink-0 self-start"
        on:click|stopPropagation="{() => {
            dispatch('answer');
        }}"
    >
        <span>Ответить</span>
    </button>
{/if}
</div>
<div class="text-sm text-left mt-3">{post.text}</div>
