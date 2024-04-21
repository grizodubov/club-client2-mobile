<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import { monthes, compareDates } from '@/utils/dates';

    import DateItem from './date.svelte';


    export let events: { [key: string]: { [key: string]: any }[] };


    const dispatch = createEventDispatcher();


    let range: [ Date[], Date[], Date[] ] = [ [], [], [] ];
    let rangeMonthes: [ number, number, number ] = [ 0, 0, 0 ];

    let dateActive: Date = new Date();
    dateActive.setHours(0, 0, 0, 0);


    /* createCalendarRange */
    function createCalendarRange() {
        const d = new Date();
        const m = d.getMonth();
        rangeMonthes = [ m > 0 ? m - 1 : 11, m, m < 11 ? m + 1 : 0 ];
        for(let i = 0; i <= 2; i++) {
            const dStart = new Date(d.getFullYear(), rangeMonthes[i], 1, 0, 0, 0, 0);
            const dd = d.getDay() ? d.getDay() - 1 : 6;
            if (dd)
                dStart.setDate(dStart.getDate() - dd);
            for(let j = 0; j < 42; j++)
                range[i].push(new Date(dStart.getFullYear(), dStart.getMonth(), dStart.getDate() + j, 0, 0, 0, 0));
        }
    }


    /* EXPORT: getActiveDate */
    export function getActiveDate() {
        return dateActive;
    }
    
    
    /* EXPORT: setActiveDate */
    export function setActiveDate(d: Date) {
        if (!compareDates(dateActive, d))
            dateActive = d;
    }


    /* EXPORT: getStartDate */
    export function getStartDate() {
        return range[0][0];
    }


    /* EXPORT: getFinishDate */
    export function getFinishDate() {
        return range[2][range[2].length - 1];
    }


    createCalendarRange();
</script>


<swiper-container
    slides-per-view="1"
    initial-slide="1"
>
    {#each [0, 1, 2] as i}
        <swiper-slide>
            <div class="text-center mb-2">{monthes[rangeMonthes[i]]}</div>
            <div class="grid grid-cols-7 gap-1 px-2">
                {#each [ 'пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс' ] as wd}
                    <div class="text-sm opacity-80 text-center mb-2">{wd}</div>
                {/each}
                {#each range[i] as d}
                    <DateItem
                        date="{d}"
                        active="{compareDates(dateActive, d)}"
                        month="{rangeMonthes[i]}"
                        events="{events}"
                        on:click="{() => {
                            dateActive = d;
                            dispatch('dateActiveChange', d);
                        }}"
                    />
                {/each}
            </div>
        </swiper-slide>
    {/each}
</swiper-container>
