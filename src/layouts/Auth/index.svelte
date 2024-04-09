<script lang="ts">
    import { RouterView } from '@/libs/Router';

    // svelte-ignore unused-export-let
    export let params = undefined;
</script>


<div class="bg-dark w-full h-full">
    <RouterView>
        <div slot="loading" class="flex justify-center pt-24">
            Loading...
        </div>
    </RouterView>
</div>
