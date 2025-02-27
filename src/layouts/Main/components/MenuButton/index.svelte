<script lang="ts">
    import { router, currentRoute } from '@/libs/Router';


    export let path: string;
    export let binding: number = 0;
</script>


<button
    class="w-10 h-10 relative flex items-center justify-center transition-all"
    class:text-base-300="{$currentRoute.path != path}"
    class:text-front="{$currentRoute.path == path}"
    on:click="{() => {
        if ($currentRoute.path != path)
            router.go(path);
    }}"
>
    <slot />
    {#if binding}
        <div class="absolute w-[18px] h-[18px] bg-error text-base-100 flex items-center justify-center text-[10px] font-medium rounded-full bottom-[1px] right-[-5px]"><span>{binding}</span></div>
    {/if}
</button>
