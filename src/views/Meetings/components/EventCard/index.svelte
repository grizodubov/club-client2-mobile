<script lang="ts">
    import { fade } from 'svelte/transition';

    import { EVENTS } from '@/config/events.cfg';

    import { toDateText } from '@/utils/dates';

    import { ResidentCard } from './..';


    export let event: any;
    export let archive: boolean;


    $: currentFormat = EVENTS.find(f => f.format == event.format);

    $: currentDate = toDateText(event.time_event).split(/\s+/);
</script>


<div
    class="mt-3 mx-3 first:mt-0"
    in:fade="{{ duration: 100 }}"
>
    <div class="relative rounded-2xl w-full p-3 overflow-hidden">
        <div class="absolute w-full h-full top-0 left-0 bg-{currentFormat?.color} opacity-15"></div>
        <div class="relativet w-full">
            <div class="flex justify-between items-start">
                <div class="relative w-[66px] h-[66px] rounded-box flex flex-col items-center justify-center shrink-0 grow-0">
                    <div class="absolute w-[66px] h-[66px] rounded-box bg-{currentFormat?.color} top-0 left-0"></div>
                    <div class="relative text-2xl leading-7 font-bold text-base-100">{currentDate[0]}</div>
                    <div class="relative text-xs font-medium mb-0.5 text-base-100">{currentDate[1]}</div>
                </div>
                <div class="shrink-1 grow-1 ml-3">
                    <div class="mt-1 flex items-start text-{currentFormat?.color}">
                        <div class="w-4 h-4 shrink-0 grow-0">{@html currentFormat?.icon}</div>
                        <div class="text-xs leading-4 ml-1.5 text-left">{currentFormat?.name}</div>
                    </div>
                    <div class="text-sm font-semibold mt-1 leading-[18px] w-full text-left">{event.name}</div>
                </div>
            </div>
            {#each event.users as resident (resident.user.id)}
                <div
                    class="mt-3"
                    in:fade="{{ duration: 100 }}"
                >
                    <ResidentCard
                        resident="{resident.user}"
                        connection="{resident.connection}"
                        confirmation="{resident.confirmation}"
                        archive="{archive}"
                        eventId="{event.id}"
                    />
                </div>
            {/each}
        </div>
    </div>
</div>
