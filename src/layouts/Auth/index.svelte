<script lang="ts">
    import { SafeArea } from 'capacitor-plugin-safe-area';

    import { onMount } from 'svelte';

    import { RouterView } from '@/libs/Router';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;


    let top = 0;
    let bottom = 4;


    async function setSafeAreas() {
        const safeAreaData = await SafeArea.getSafeAreaInsets();
        const { insets } = safeAreaData;
        if (insets.top)
            top = insets.top;
        if (insets.bottom)
            top = insets.bottom + 4;
    }


    /* onMount */
	onMount(() => {
        setSafeAreas();
	});
</script>


<div class="bg-scene w-full h-full min-w-[320px]" style="padding-top: {top}px; padding-bottom: {bottom}px">
    <RouterView>
        <div slot="loading" class="w-full h-full flex justify-center items-center">
            <span class="loading loading-bars text-front laoding-lg"></span>
        </div>
    </RouterView>
</div>
