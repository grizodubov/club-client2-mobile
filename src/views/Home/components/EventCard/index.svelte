<script lang="ts">
    import { EVENTS } from '@/config/events.cfg';
    import { type Event } from './types';


    export let event: Event;


    /* toDateText */
    export function toDateText(n: number) {
        const monthes =
            [ 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря' ];
        const d = new Date(n);
        return d.getUTCDate().toString() + ' ' + monthes[d.getUTCMonth()];
    }


    $: currentFormat = EVENTS.find(f => f.format == event.format);

    $: currentDate = toDateText(event.time_event).split(/\s+/);
</script>


<div class="w-[258px] h-[176px] px-1.5">
    <div class="relative rounded-2xl w-full h-[176px] overflow-hidden p-4">
        <div class="absolute w-full h-full top-0 left-0 bg-{currentFormat?.color} opacity-15">
        </div>
        <div class="relative flex justify-start items-start">
            <div class="relative w-[66px] h-[66px] rounded-box flex flex-col items-center justify-center shrink-0 grow-0">
                <div class="absolute w-[66px] h-[66px] rounded-box bg-{currentFormat?.color} top-0 left-0"></div>
                <div class="relative text-2xl leading-7 font-bold text-base-100">{currentDate[0]}</div>
                <div class="relative text-xs font-medium mb-0.5 text-base-100">{currentDate[1]}</div>
            </div>
            <div class="ml-3 h-[66px] flex flex-col justify-start items-start shrink-1 grow-1 w-full">
                <div class="mt-1 flex items-start text-{currentFormat?.color}">
                    <div class="w-4 h-4 shrink-0 grow-0">{@html currentFormat?.icon}</div>
                    <div class="text-xs leading-4 ml-1.5">{currentFormat?.name}</div>
                </div>
            </div>
        </div>
        <div class="text-sm font-semibold mt-2 leading-[18px] w-full h-[72px] overflow-hidden flex justify-start items-start"><span>{event.name}</span></div>
    </div>
</div>
