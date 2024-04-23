<script lang="ts">
    import { EVENTS } from '@/config/events.cfg';

    import { toDateText } from '@/utils/dates';

    
    export let event: any;
    export let speakers: any[];


    $: currentFormat = EVENTS.find(f => f.format == event.format);


    let program: any[] = [];
    let currentDate: Date | undefined = undefined;


    function createProgram() {
        const temp: any[] = [];
        let block: any = undefined;
        let tdate: string = '';
        event.program.forEach((p: any) => {
            const t: string = p.date.toString();
            if (tdate != t) {
                if (tdate != '')
                    temp.push(block);
                tdate = t;
                block = {
                    'date': toDateText(new Date(event.time_event)).split(/\s+/),
                    'items': [],
                };
            }
            if (block && block.items)
                block.items.push(
                    Object.assign(p, {
                        speakersNames: speakers.filter(s => p.speakers.indexOf(s.id) > -1).map(s => s.name)
                    })
                );
        });
        if (block)
            temp.push(block);
        program = temp;
        currentDate = temp.length ? temp[0].date : '';
    }


    createProgram();
</script>


{#each program as block}
    <div class="flex justify-between items-start px-3">
        <div class="relative w-[66px] h-[66px] rounded-box flex flex-col items-center justify-center shrink-0 grow-0">
            <div class="absolute w-[66px] h-[66px] rounded-box bg-{currentFormat?.color} top-0 left-0"></div>
            <div class="relative text-2xl leading-7 font-bold text-base-100">{block.date[0]}</div>
            <div class="relative text-xs font-medium mb-0.5 text-base-100">{block.date[1]}</div>
        </div>
        <div class="ml-3 w-full sirnk-1 grow-1">
            {#each block.items as item}
                <div class="mt-2.5 first:mt-0">
                    <div class="text-sm font-medium text-front">{item.time}</div>
                    <div class="text-sm leading-[18px]">{item.name}</div>
                    {#if item.speakersNames.length}
                        <div class="text-xs opacity-80 mt-0.5">Спикер{#if item.speakersNames.length > 1}ы{/if}: {item.speakersNames.join(', ')}</div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
{/each}
