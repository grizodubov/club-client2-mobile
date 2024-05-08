<script lang="ts">
    import { createEventDispatcher } from 'svelte';


    export let placeholder: string;
    export let value: string;
    export let disabled: boolean = false;
    export let clearButton: boolean = false;


    const dispatch = createEventDispatcher();


    let focus: boolean = false;
</script>


<div
    class="relative h-16 w-full overflow-hidden"
>
    <div
        class="absolute top-0 h-full w-full pt-1 pl-3 bg-base-200 text-xs border-l-2"
        class:border-transparent="{!focus}"
        class:border-neutral="{focus}"
        class:opacity-50="{disabled}"
    >
        <span
            class:opacity-50="{!disabled}"
            class:opacity-30="{disabled}"
        >{placeholder}</span>
    </div>
    <input
        type="text"
        class="absolute top-0 left-[2px] h-full w-[calc(100%-2px)] px-3 m-0 bg-transparent
            outline-none border-0 focus:outline-none focus:border-0 shadow-none focus:shadow-none"
        class:opacity-50="{disabled}"
        disabled="{disabled}"
        bind:value="{value}"
        on:focus="{() => { focus = true; }}"
        on:blur="{() => { focus = false; }}"
    />
    {#if disabled && clearButton}
        <button
            class="absolute rounded-lg w-8 h-8 top-[18px] right-2 flex items-center justify-center bg-base-100"
            on:click="{() => { dispatch('clear'); }}"
        >
            <svg class="opacity-70 w-6 h-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" fill="currentColor"></path></svg>
        </button>
    {/if}
</div>
