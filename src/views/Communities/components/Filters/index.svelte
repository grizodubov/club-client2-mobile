<script lang="ts">
    import { type CommunitiesFilters, communitiesFilters } from '@/stores';


    $: filters = $communitiesFilters as CommunitiesFilters;


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;
</script>


<div class="px-4 pb-[39px]">
</div>
