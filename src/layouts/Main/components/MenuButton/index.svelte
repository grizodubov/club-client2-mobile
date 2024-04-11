<script lang="ts">
    import { router, currentRoute } from '@/libs/Router';


    export let path: string;
</script>


<button
    class="w-10 h-10 flex items-center justify-center transition-all"
    class:text-base-300="{$currentRoute.path != path}"
    class:text-front="{$currentRoute.path == path}"
    on:click="{() => {
        if ($currentRoute.path != path)
            router.go(path);
    }}"
>
    <slot />
</button>
