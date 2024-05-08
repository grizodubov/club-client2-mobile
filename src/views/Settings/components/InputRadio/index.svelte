<script lang="ts">
    import { createEventDispatcher } from 'svelte';


    export let placeholder: string;
    export let value: string;
    export let options: string[];


    const dispatch = createEventDispatcher();


    let currentStep = 1;


    $: options, value, getStep(options, value);


    /* getStep */
    function getStep(list: any[], item: string) {
        let temp = list.indexOf(item) + 1;
        if (!temp)
            temp = 1;
        currentStep = temp;
    }
</script>


<div
    class="relative h-16 w-full overflow-hidden"
>
    <div
        class="absolute top-0 h-full w-full pt-1 text-xs pl-3 bg-base-200 border-l-2 border-transparent"
    >
        <span
            class="opacity-50"
        >{placeholder}</span>
    </div>
    <div class="relative mt-1 h-[60px] flex items-center px-3" style="max-width: {(options.length * 24 + 24).toString() + 'px'}">
        {#if options.length >= 1}
            <input
                type="range"
                min="{1}"
                max="{options.length}"
                step="{1}"
                class="range range-sm range-primary mt-[-2px]"
                bind:value="{currentStep}"
                on:change="{() => {
                    dispatch('change', options[currentStep - 1]);
                }}"/>
        {/if}
    </div>
    <div
        class="absolute pl-[14px] top-[38px]"
    >
        <span
            class="text-xs"
        >{options[currentStep - 1]}</span>
    </div>
</div>
