<script lang="ts">
    import { EVENTS } from '@/config/events.cfg';

    import { monthes, weekdaysShort, dateKey } from '@/utils/dates';


    export let date: Date;
    export let active: boolean = false;
    export let events: { [key: string]: { [key: string]: any }[] };


    /* getDateEvents */
    function getDateEvents(events: { [key: string]: { [key: string]: any }[] }, d: Date) {
        const k = dateKey(d);
        if (events.hasOwnProperty(k))
            return events[k];
        return [];
    }


    $: formats = getDateEvents(events, date).map(event => EVENTS.find(f => f.format == event.format));
</script>

<div
    class="relative w-full h-full rounded-2xl overflow-hidden"
    class:text-base-100="{active}"
>
    <div
        class="absolute w-full h-full"
        class:bg-base-200="{!active}"
        class:opacity-90="{!active}"
        class:bg-scene="{active}"
    ></div>
    <div class="relative w-full h-full flex flex-col items-center justify-between ">
        <div class="h-[14px] text-[10px] opacity-70 mt-[4px] leading-[14px]">{active ? monthes[date.getMonth()] : ' '}</div>
        <div class="text-center">
            <div class="text-lg font-semibold leading-[21px]">{date.getDate()}</div>
            <div class="text-sm opacity-90 leading-[17px]">{weekdaysShort[date.getDay()]}</div>
        </div>
        <div class="w-full h-[20px] mb-[6px] flex justify-center">
            {#each formats as format}
                <div class="relative w-5 h-5 mx-0.5">
                    <div class="absolute w-full h-full bg-{format?.color} rounded-full"></div>
                    <div class="relative w-full h-full p-1 text-base-100">{@html format?.icon}</div>
                </div>
            {/each}
        </div>
    </div>
</div>
