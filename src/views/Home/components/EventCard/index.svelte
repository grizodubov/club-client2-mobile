<script lang="ts">
    import { EVENTS } from '@/config/events.cfg';
    import { type Event } from './types';

    import { router } from '@/libs/Router';

    import { toDateText } from '@/utils/dates';


    export let event: Event;


    $: currentFormat = EVENTS.find(f => f.format == event.format);

    $: currentDate = toDateText(event.time_event).split(/\s+/);


    const bgImageUrlFallback = 'https://static.clubgermes.ru/events/event.png';

    $: bgImageUrl = event ? 'https://static.clubgermes.ru/events/' + event.id.toString() + '/icon.png' : bgImageUrlFallback;


    /* handleBgImageError */
    function handleBgImageError() {
        bgImageUrl = bgImageUrlFallback;
    }
</script>


<button
    class="w-[284px] h-[202px] pl-3"
    on:click="{() => { router.go('/events/' + event.id.toString()); }}"
>
    <div class="relative rounded-2xl w-full h-[202px] overflow-hidden p-3.5">
        <div class="absolute w-full h-full top-0 left-0 bg-{currentFormat?.color} opacity-15">
        </div>
        <div class="relative flex justify-between items-start w-full">
            <div class="relative w-[66px] h-[66px] rounded-box flex flex-col items-center justify-center shrink-0 grow-0">
                <div class="absolute w-[66px] h-[66px] rounded-box bg-{currentFormat?.color} top-0 left-0"></div>
                <div class="relative text-2xl leading-7 font-bold text-base-100">{currentDate[0]}</div>
                <div class="relative text-xs font-medium mb-0.5 text-base-100">{currentDate[1]}</div>
            </div>
            <div class="w-[66px] h-[66px] shrink-0 grow-0 rounded-full overflow-hidden">
                <img
                    alt=""
                    src="{bgImageUrl}"
                    on:error={handleBgImageError}
                />
            </div>
        </div>
        <div class="mt-2.5 flex items-start text-{currentFormat?.color}">
            <div class="w-4 h-4 shrink-0 grow-0">{@html currentFormat?.icon}</div>
            <div class="text-xs leading-4 ml-1.5 text-left">{currentFormat?.name}</div>
        </div>
        <div class="text-sm font-semibold mt-2 leading-[18px] w-full h-[72px] text-left">{event.name}</div>
    </div>
</button>
