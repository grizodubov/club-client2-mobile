<script lang="ts">
    export let placeholder: string;
    export let value: string;
    export let disabled: boolean = false;


    let focus: boolean = false;
</script>


<div
    class="relative h-16 w-full rounded-sm overflow-hidden"
    class:opacity-50="{disabled}"
>
    <div
        class="absolute top-0 h-full w-full pt-1 pl-3 bg-base-200 text-xs border-l-2 opacity-90"
        class:border-transparent="{!focus}"
        class:border-neutral="{focus}"
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
        disabled="{disabled}"
        bind:value="{value}"
        on:focus="{() => { focus = true; }}"
        on:blur="{() => { focus = false; }}"
    />
</div>
