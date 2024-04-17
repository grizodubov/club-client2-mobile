<script lang="ts">
    import { RouterView } from '@/libs/Router';

    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;
</script>


<div class="bg-scene w-full h-full min-w-[320px]">
    <RouterView>
        <div slot="loading" class="w-full h-full flex justify-center items-center">
            <span class="loading loading-bars text-front laoding-lg"></span>
        </div>
    </RouterView>
</div>
