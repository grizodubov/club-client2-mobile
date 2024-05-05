<script lang="ts">
    import { type CommunityFilters, communityFilters } from '@/stores';


    $: filters = $communityFilters as CommunityFilters;


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;
</script>


<div class="px-4 pb-[39px]">
</div>
