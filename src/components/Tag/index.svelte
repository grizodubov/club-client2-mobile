<script lang="ts">
    import { createEventDispatcher } from 'svelte';


    export let tag: string;
    export let type: 'tag' | 'interest' | 'catalog';
    export let deleteButton: boolean = false;
    export let hit: boolean = false;


    const dispatch = createEventDispatcher();
</script>

{#if tag == '...'}
    <div
        class="text-base-100 rounded-xl pl-1.5 pr-1.5 h-[20px] flex items-center"
        class:bg-success="{type == 'tag'}"
        class:bg-secondary="{type == 'interest'}"
        class:bg-moderate="{type == 'catalog'}"
    >
        <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></g></svg>
    </div>
{:else}
    <div
        class="text-base-100 rounded-xl min-h-[20px] flex items-center"
        class:pl-1 ="{type == 'tag' || type == 'interest'}"
        class:pl-2="{type == 'catalog'}"
        class:pr-2="{!deleteButton}"
        class:bg-success="{type == 'tag'}"
        class:bg-secondary="{type == 'interest'}"
        class:bg-moderate="{type == 'catalog'}"
    >
        {#if type == 'tag'}
            <svg class="w-3 h-3 shrink-0 grow-0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42a.996.996 0 0 0-1.41 0l-6.59 6.59a.996.996 0 0 0 0 1.41l6.59 6.59a.996.996 0 1 0 1.41-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z" fill="currentColor"></path></svg>
        {:else if type == 'interest'}
            <svg class="w-3 h-3 shrink-0 grow-0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M5 13h11.17l-4.88 4.88c-.39.39-.39 1.03 0 1.42c.39.39 1.02.39 1.41 0l6.59-6.59a.996.996 0 0 0 0-1.41l-6.58-6.6a.996.996 0 1 0-1.41 1.41L16.17 11H5c-.55 0-1 .45-1 1s.45 1 1 1z" fill="currentColor"></path></svg>
        {/if}
        <div
            class:ml-1="{type == 'tag' || type == 'interest'}"
            class="text-xs leading-[18px] mt-[2px] mb-[3px] font-medium"
        >{(tag.split(/\s*\|\s*/).slice(-1))[0].toLowerCase()}</div>
        {#if hit}
            <div class="w-4 h-4 shrink-0 grow-0 ml-1.5 mr-[-4px] bg-warning rounded-full flex items-center justify-center">
                <svg class="w-2.5 h-2.5 text-base-100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 576 512"><path d="M259.3 17.8L194 150.2L47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103l-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5l105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2L316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" fill="currentColor"></path></svg>
            </div>
        {/if}
        {#if deleteButton}
            <button
                on:click="{() => {
                    dispatch('delete');
                }}"
            >
                <svg class="ml-1 mr-0.5 w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2zm5.4 21L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4l-1.6 1.6z" fill="currentColor"></path></svg>
            </button>
        {/if}
    </div>
{/if}
