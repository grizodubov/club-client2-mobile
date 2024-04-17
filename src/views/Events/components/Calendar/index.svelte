<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import DateItem from './date.svelte';


    export let events: { [key: string]: { [key: string]: any }[] };


    const dispatch = createEventDispatcher();

    const range: Date[] = [];


    let activeRangeIndex = -1;


    /* createCalendarRange */
    function createCalendarRange() {
        const d = new Date();
        for (let i = -50; i <= 50; i++)
            range.push(new Date(d.getFullYear(), d.getMonth(), d.getDate() + i, 0, 0, 0, 0));
    }


    /* updateActiveDate */
    function updateActiveDate(e: any) {
        const [ swiper, progress ] = e.detail;
        const temp = Math.round(progress / 0.01);
        if (temp != activeRangeIndex) {
            activeRangeIndex = temp;
            dispatch('change', range[temp]);
        }
    }


    /* getStartDate */
    export function getStartDate() {
        return range[0];
    }


    /* getFinishDate */
    export function getFinishDate() {
        return range[range.length - 1];
    }


    createCalendarRange();
</script>


<swiper-container
    space-between="6"
    slides-per-view="auto"
    centered-slides="true"
    slide-to-clicked-slide="true"
    initial-slide="50"
    on:swiperprogress="{updateActiveDate}"
>
    {#each range as d, i}
        <swiper-slide class="w-[64px] h-[92px]">
            <DateItem
                date="{d}"
                active="{activeRangeIndex == i}"
                events="{events}"
            />
        </swiper-slide>
    {/each}
</swiper-container>
