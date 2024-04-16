<script lang="ts">
    import { type EventsFilters, eventsFilters } from '@/stores';


    $: filters = $eventsFilters as EventsFilters;


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;
</script>


<div class="px-4 pb-[39px]">
    <div class="font-semibold text-lg mt-6 mb-5">Фильтры</div>
</div>
