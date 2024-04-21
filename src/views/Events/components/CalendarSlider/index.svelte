<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import { compareDates } from '@/utils/dates';

    import DateItem from './date.svelte';


    export let events: { [key: string]: { [key: string]: any }[] };
    

    const dispatch = createEventDispatcher();

    let range: Date[] = [];

    let slider: any;

    let activeRangeIndex: number = -1;


    /* EXPORT: createCalendarRange */
    export function createCalendarRange(dateStart: Date, dateFinish: Date) {
        if (dateStart && dateFinish) {
            const temp = [];
            const cursor = new Date(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate(), 0, 0, 0, 0);
            do {
                temp.push(new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate(), 0, 0, 0, 0));
                cursor.setDate(cursor.getDate() + 1);
            }
            while (!compareDates(cursor, dateFinish));
            range = temp;
        }
        else {
            range = [];
        }
        if (slider)
            slider.swiper.update();
    }


    /* EXPORT: setActiveDate */
    export function setActiveDate(d: Date) {
        const temp = range.findIndex(r => compareDates(r, d));
        if (temp != activeRangeIndex) {
            activeRangeIndex = temp;
            if (slider) {
                slider.swiper.slideTo(activeRangeIndex, 0, false);
            }
        }
    }


    /* EXPORT: getActiveDate */
    export function getActiveDate() {
        return range[activeRangeIndex];
    }


    /* updateActiveDate */
    function updateActiveDate(e: any) {
        const ln = range.length;
        if (ln > 1) {
            const [ swiper, progress ] = e.detail;
            const temp = Math.round(progress / (1 / (ln - 1)));
            if (temp != activeRangeIndex) {
                activeRangeIndex = temp;
                dispatch('dateActiveChange', range[activeRangeIndex]);
            }
        }
    }
</script>


<swiper-container
    bind:this="{slider}"
    space-between="6"
    slides-per-view="auto"
    centered-slides="true"
    slide-to-clicked-slide="true"
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
