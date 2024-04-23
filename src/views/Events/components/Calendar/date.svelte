<script lang="ts">
    import { EVENTS } from '@/config/events.cfg';

    import { dateKey } from '@/utils/dates';


    export let date: Date;
    export let active: boolean;
    export let month: number;
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

<button
    class="relative w-full h-full rounded-2xl overflow-hidden"
    class:text-base-100="{active}"
    on:click
>
    <div
        class="absolute w-full h-full bg-base-100"
        class:bg-base-100="{!active}"
        class:bg-scene="{active}"
        class:opacity-90="{!active && date.getMonth() == month}"
        class:opacity-30="{!active && date.getMonth() != month}"
    ></div>
    <div class="relative w-full h-full flex flex-col items-center justify-between ">
        <div class="text-center mt-4">
            <div
                class="text-lg font-semibold leading-[21px]"
                class:opacity-60="{!active && date.getMonth() != month}"
            >{date.getDate()}</div>
        </div>
        <div class="w-full h-[8px] mb-2 mt-1 flex justify-center">
            {#each formats as format}
                <div class="w-2.5 h-2.5 mx-0.5">
                    <div class="w-full h-full bg-{format?.color} rounded-full"></div>
                </div>
            {/each}
        </div>
    </div>
</button>
