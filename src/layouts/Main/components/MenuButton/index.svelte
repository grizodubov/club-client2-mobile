<script lang="ts">
    import { router, currentRoute } from '@/libs/Router';


    export let path: string;
    export let binding: string | number = 0;
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
        <div
            class="absolute text-base-100 flex items-center justify-center text-[10px] font-medium rounded-full right-[-5px]"
            class:w-[18px]="{typeof binding == 'number'}"
            class:h-[18px]="{typeof binding == 'number'}"
            class:bg-error="{typeof binding == 'number'}"
            class:bottom-[1px]="{typeof binding == 'number'}"
            class:w-[24px]="{typeof binding == 'string'}"
            class:h-[24px]="{typeof binding == 'string'}"
            class:bg-[#00a96e]="{typeof binding == 'string'}"
            class:bottom-[3px]="{typeof binding == 'string'}"
        ><span>{binding}</span></div>
    {/if}
</button>
