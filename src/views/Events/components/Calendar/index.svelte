<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import { monthes, compareDates } from '@/utils/dates';

    import DateItem from './date.svelte';


    export let events: { [key: string]: { [key: string]: any }[] };
    export let state: boolean = false;


    const dispatch = createEventDispatcher();


    const today = new Date();


    let range: [ Date[], Date[], Date[], Date[], Date[], Date[], Date[] ] = [ [], [], [], [], [], [], [] ];
    let rangeMonthes: [ number, number, number, number, number, number, number ] = [ 0, 0, 0, 0, 0, 0, 0 ];

    let dateActive: Date = new Date();
    dateActive.setHours(0, 0, 0, 0);


    let swiper: any;


    /* createCalendarRange */
    function createCalendarRange() {
        const d = new Date();
        for(let i = -3; i <= 3; i++) {
            const dStart = new Date(d.getFullYear(), d.getMonth() + i, 1, 0, 0, 0, 0);
            rangeMonthes[i + 3] = dStart.getMonth();
            const dd = dStart.getDay() ? dStart.getDay() - 1 : 6;
            if (dd)
                dStart.setDate(dStart.getDate() - dd);
            for(let j = 0; j < 42; j++)
                range[i + 3].push(new Date(dStart.getFullYear(), dStart.getMonth(), dStart.getDate() + j, 0, 0, 0, 0));
        }
    }


    /* EXPORT: getActiveDate */
    export function getActiveDate() {
        return dateActive;
    }
    
    
    /* EXPORT: setActiveDate */
    export function setActiveDate(d: Date) {
        if (d.getTime() >= range[0][0].getTime() && d.getTime() <= range[6][range[6].length - 1].getTime()) {
            if (!compareDates(dateActive, d))
                dateActive = d;
        }
        else {
            dateActive = new Date();
        }
        if (!state && swiper) {
            const i = rangeMonthes.indexOf(dateActive.getMonth());
            if (i)
                swiper.swiper.slideTo(i, 0, false);
        }
    }


    /* EXPORT: getStartDate */
    export function getStartDate() {
        return range[0][0];
    }


    /* EXPORT: getFinishDate */
    export function getFinishDate() {
        return range[6][range[6].length - 1];
    }


    createCalendarRange();
</script>


<swiper-container
    slides-per-view="1"
    initial-slide="3"
    bind:this="{swiper}"
>
    {#each [0, 1, 2, 3, 4, 5, 6] as i}
        <swiper-slide>
            <div class="flex justify-between items-center mb-2">
                <div class="w-9 text-xs opacity-40 ml-7">{range[i][7].getFullYear()}</div>
                <div class="text-center font-medium mb-2 leading-6">{monthes[rangeMonthes[i]]}</div>
                <button
                    class="w-7 h-7 ml-1 mr-7"
                    on:click="{() => {
                        dateActive = today;
                        const i = rangeMonthes.indexOf(dateActive.getMonth());
                        swiper.swiper.slideTo(i, 300, true);
                        dispatch('dateActiveChange', dateActive);
                    }}"
                >
                    <svg class="w-7 h-7 opacity-70" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M21 6.25A3.25 3.25 0 0 0 17.75 3H6.25A3.25 3.25 0 0 0 3 6.25v11.5A3.25 3.25 0 0 0 6.25 21h4v-1.5h-4a1.75 1.75 0 0 1-1.75-1.75V8.5h15v9.25a1.75 1.75 0 0 1-1.75 1.75h-4V21h4A3.25 3.25 0 0 0 21 17.75V6.25zM6.25 4.5h11.5c.966 0 1.75.784 1.75 1.75V7h-15v-.75c0-.966.784-1.75 1.75-1.75zm7 7.25a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0zm.502 6.56a.75.75 0 0 0 .996-1.12l-2.25-2a.75.75 0 0 0-.996 0l-2.25 2a.75.75 0 0 0 .996 1.12l1.002-.89v3.83a.75.75 0 1 0 1.5 0v-3.83l1.002.89z" fill="currentColor"></path></g></svg>
                </button>
            </div>
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
