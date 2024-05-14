<script lang="ts">
    import { RouterView } from '@/libs/Router';

    import { states } from '@/stores';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;


    $: currentStates = $states as any;
</script>


<div class="bg-scene flex flex-col w-full h-full min-w-[320px]">
    <div class="w-full overflow-hidden shrink-0 grow-0" style="height: {currentStates.safeTop + 2}px;">&nbsp;</div>
    <div class="w-full h-full shrink-1 grow-1">
        <RouterView>
            <div slot="loading" class="w-full h-full flex justify-center items-center">
                <span class="loading loading-bars text-front laoding-lg"></span>
            </div>
        </RouterView>
    </div>
    <div class="w-full overflow-hidden shrink-0 grow-0" style="height: {currentStates.safeBottom + 4}px;">&nbsp;</div>
</div>
