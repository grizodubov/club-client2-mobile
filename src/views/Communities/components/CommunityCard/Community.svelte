<script lang="ts">
    import { fade } from 'svelte/transition';

    import { CommunityIcon } from '@/components';

    import { type WordForms, nwfi } from '@/utils/numword';


    export let community: { [key: string]: any };
    export let open: boolean = false;


    const wordForms: WordForms = {
        'вопрос': [ 'вопросов', 'вопрос', 'вопроса', 'вопросов' ],
    };


    $: childrenFlag = community.children && community.children.length;

    $: subjectsOpen = childrenFlag ? community.children.reduce((sum: number, v: any) => sum + v.subjects_open, 0) : community.subjects_open;
</script>


<div class="relative w-[68px] h-[68px] shrink-0 grow-0">
    <CommunityIcon
        id="{community.id}"
        name="{community.name}"
        avatarHash="{community.avatar_hash}"
        scaleLetter="1.5"
    />
    {#if childrenFlag && !open}
        <div
            class="absolute right-[-10px] top-[3px] rounded-full overflow-hidden w-6 h-6 bg-moderate flex items-center justify-center text-base-100 font-semibold text-xs tracking-tight"
            in:fade="{{ duration: 100 }}"
            out:fade="{{ duration: 100 }}"
        >
            {community.children.length}
        </div>
    {/if}
</div>
<div class="ml-4 shrink-1 grow-1 w-full">
    <div class="text-left font-semibold text-[16px] leading-[22px] mt-1">{community.name}</div>
    <div class="text-left text-[12px] leading-[16px] opacity-80 mt-0.5">{community.description}</div>
    <div
        class="h-7 mt-2"
    >
        {#if !childrenFlag || !open}
            {#if subjectsOpen}
                <div
                    class="flex items-center"
                    in:fade="{{ duration: 100 }}"
                    out:fade="{{ duration: 100 }}"
                >
                    <div class="w-5 h-5 flex items-center justify-center mr-[-1px]">
                        <svg class="w-5 h-5 opacity-60" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2l-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29c7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1l-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160s-93.3 160-208 160z" fill="currentColor"></path></svg>
                    </div>
                    {#if community.subjects_new}
                        <div
                            class="relative ml-[-3px] rounded-full overflow-hidden w-6 h-6 bg-secondary flex items-center justify-center text-base-100 font-semibold text-xs tracking-tight"
                        >
                            {community.subjects_new}
                        </div>
                    {/if}
                    {#if community.answers_new}
                        <div
                            class="relative ml-[-3px] rounded-full overflow-hidden w-6 h-6 bg-success flex items-center justify-center text-base-100 font-semibold text-xs tracking-tight"
                        >
                            {community.answers_new}
                        </div>
                    {/if}
                    <div class="ml-2 text-xs opacity-60 font-medium">{subjectsOpen} {wordForms['вопрос'][nwfi(subjectsOpen)]}</div>
                </div>
            {:else}
                <div
                    class="flex items-center"
                    in:fade="{{ duration: 100 }}"
                    out:fade="{{ duration: 100 }}"
                >
                    <div class="text-xs opacity-40 font-medium">Нет вопросов</div>
                </div>
            {/if}
        {/if}
    </div>
</div>
{#if childrenFlag}
    <div class="w-5 ml-2 mt-[5px] shrink-0 grow-0 opacity-50">
        {#if open}
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M18 12.998H6a1 1 0 0 1 0-2h12a1 1 0 0 1 0 2z" fill="currentColor"></path></svg>
        {:else}
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z" fill="currentColor"></path></svg>
        {/if}
    </div>
{/if}
