<script lang="ts">
    export let tag: string;
    export let type: string = 'catalog';
</script>


{#if tag == '...'}
    <div class="h-[18px] flex items-center">
        <div class="rounded-full bg-base-100 w-[4px] h-[4px]"></div>
        <div class="rounded-full bg-base-100 w-[4px] h-[4px] ml-0.5"></div>
        <div class="rounded-full bg-base-100 w-[4px] h-[4px] ml-0.5"></div>
    </div>
{:else}
    <div
        class="text-base-100 rounded-xl min-h-[18px] flex items-start pr-2"
        class:pl-1 ="{type == 'tag' || type == 'interest'}"
        class:pl-2="{type == 'catalog' || type == 'hobby'}"
        class:bg-success="{type == 'tag'}"
        class:bg-secondary="{type == 'interest'}"
        class:bg-moderate="{type == 'catalog'}"
        class:bg-info="{type == 'hobby'}"
    >
        {#if type == 'tag'}
            <svg class="w-2.5 h-2.5 mt-1.5 shrink-0 grow-0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42a.996.996 0 0 0-1.41 0l-6.59 6.59a.996.996 0 0 0 0 1.41l6.59 6.59a.996.996 0 1 0 1.41-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z" fill="currentColor"></path></svg>
        {:else if type == 'interest'}
            <svg class="w-2.5 h-2.5 mt-1.5 shrink-0 grow-0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M5 13h11.17l-4.88 4.88c-.39.39-.39 1.03 0 1.42c.39.39 1.02.39 1.41 0l6.59-6.59a.996.996 0 0 0 0-1.41l-6.58-6.6a.996.996 0 1 0-1.41 1.41L16.17 11H5c-.55 0-1 .45-1 1s.45 1 1 1z" fill="currentColor"></path></svg>
        {/if}
        <div
            class="text-[11px] leading-[16px] mt-[2px] mb-[3px] font-medium text-center"
            class:ml-1="{type == 'tag' || type == 'interest'}"
        >{(tag.split(/\|/).slice(-1))[0].trim().toLowerCase()}</div>
    </div>
{/if}
