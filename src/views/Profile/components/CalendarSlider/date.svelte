<script lang="ts">
    import { monthes, weekdaysShort } from '@/utils/dates';


    export let date: Date;
    export let active: boolean = false;
</script>

<div
    class="relative w-full h-full rounded-2xl overflow-hidden"
    class:text-base-100="{active}"
>
    <div
        class="absolute w-full h-full rounded-2xl overflow-hidden"
        class:bg-base-200="{!active}"
        class:opacity-90="{!active}"
        class:bg-scene="{active}"
    ></div>
    <div class="relative w-full h-full flex flex-col items-center justify-between">
        <div class="h-[14px] text-[10px] opacity-70 mt-[4px] leading-[14px]">{active ? monthes[date.getMonth()] : ' '}</div>
        <div class="text-center">
            <div class="text-lg font-semibold leading-[21px]">{date.getDate()}</div>
            <div class="text-sm opacity-90 leading-[17px]">{weekdaysShort[date.getDay()]}</div>
        </div>
        <div class="h-[20px]">&nbsp;</div>
    </div>
</div>
