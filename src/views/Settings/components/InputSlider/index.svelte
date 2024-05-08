<script lang="ts">
    export let placeholder: string;
    export let min: number;
    export let max: number;
    export let step: number = 1;
    export let value: string;
</script>


<div
    class="relative h-16 w-full overflow-hidden"
>
    <div
        class="absolute top-0 h-full w-full pt-1 pl-[14px] bg-base-200 text-xs"
        class:border-transparent="{!focus}"
        class:border-neutral="{focus}"
    >
        <span class="opacity-50">{placeholder}</span>
    </div>
    <div class="relative h-[60px] flex justify-between items-center mt-1">
        <div class="w-[90px] h-[60px] shrink-0 grow-0 leading-[60px] ml-[14px]">{value}</div>
        <div class="w-full shirnk-1 grow-1 mr-[12px] h-6">
            <input type="range" min="{min}" max="{max}" step="{step}" class="range range-primary m-0" bind:value="{value}" />
        </div>
    </div>
</div>
