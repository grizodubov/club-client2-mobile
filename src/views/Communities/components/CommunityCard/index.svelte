<script lang="ts">
    import { router } from '@/libs/Router';

    import Community from './Community.svelte';


    export let community: { [key: string]: any };


    $: childrenFlag = community.children && community.children.length;


    let open: boolean = false;
</script>


<style>
    .children {
        width: calc(100% + 16px);
        margin-left: -8px;
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 150ms;
    }

    .children.open {
        grid-template-rows: 1fr;
    }
</style>


<button
    class="w-full px-3"
    on:click="{() => {
        if (childrenFlag) {
            open = !open;
        }
        else {
            router.go('/communities/' + community.id.toString());
        }
    }}"
>
    <div class="relative rounded-2xl w-full overflow-hidden p-4">
        <div
            class="absolute w-full h-full top-0 left-0 bg-moderate transition-all"
            class:opacity-15="{!open}"
            class:opacity-30="{open}"
        >
        </div>
        <div class="relative w-full">
            <div class="flex items-start justify-start">
                <Community community="{community}" open="{open}" />
            </div>
            {#if childrenFlag}
                <div
                    class="children"
                    class:open="{open}"
                >
                    <div class="w-full overflow-hidden">
                        {#each community.children as child}
                            <button
                                class="relative w-full bg-base-100 rounded-2xl w-full overflow-hidden px-2 py-3 mt-3 first:mt-4 mb-0"
                                on:click|stopPropagation="{() => {
                                    router.go('/communities/' + child.id.toString());
                                }}"
                            >
                                <div class="absolute w-full h-full top-0 left-0 opacity-15 bg-moderate"></div>
                                <div class="relative w-full flex items-start justify-start">
                                    <Community community="{child}" />
                                </div>
                            </button>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    </div>
</button>
