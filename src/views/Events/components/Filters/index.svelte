<script lang="ts">
    import { type EventsFilters, eventsFilters, states } from '@/stores';


    $: filters = $eventsFilters as EventsFilters;


    $: currentStates = $states as any;


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;
</script>


<div class="px-4" style="padding-bottom: {currentStates.safeBottom + 41}px">
    <div class="font-semibold text-lg mt-6 mb-5">Фильтры</div>
    <button
        class="w-full mb-5"
        on:click="{() => {
            eventsFilters.push({ showCalendar: !filters.showCalendar });
        }}"
    >
        <div class=" w-full h-full flex justify-between items-start">
            {#if filters.showCalendar}
                <div class="rounded-[10px] border-2 border-front bg-front w-7 h-7 flex items-center justify-center text-base-100 shrink-0 grow-0">
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                </div>
            {:else}
                <div class="rounded-[10px] border-2 border-front w-7 h-7 shrink-0 grow-0"></div>
            {/if}
            <div class="w-full text-sm text-left ml-3 shrink-1 grow-1 mt-[3px]">Показывать календарь при входе в раздел события</div>
        </div>
    </button>
    <button
        class="w-full mb-5"
        on:click="{() => {
            eventsFilters.push({ future: !filters.future });
        }}"
    >
        <div class=" w-full h-full flex justify-between items-start">
            {#if filters.future}
                <div class="rounded-[10px] border-2 border-front bg-front w-7 h-7 flex items-center justify-center text-base-100 shrink-0 grow-0">
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                </div>
            {:else}
                <div class="rounded-[10px] border-2 border-front w-7 h-7 shrink-0 grow-0"></div>
            {/if}
            <div class="w-full text-sm text-left ml-3 shrink-1 grow-1 mt-[3px]">Показывать ближайшие события</div>
        </div>
    </button>
</div>
