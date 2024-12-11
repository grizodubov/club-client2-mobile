<script lang="ts">
    import { fade } from 'svelte/transition';

    import { ResidentCardOnline } from './..';


    export let connections: any;
    export let archive: boolean;
</script>


<div
    class="mb-3 mx-3 mt-3"
    in:fade="{{ duration: 100 }}"
>
    <div class="relative rounded-2xl w-full p-3 overflow-hidden">
        <div class="absolute w-full h-full top-0 left-0 bg-base-300 opacity-50"></div>
        <div class="relative w-full">
            <div class="text-sm font-semibold mt-1 leading-[18px] w-full text-left">Онлайн-встречи</div>
            {#each connections as item (item.user.id)}
                <div
                    class="mt-3"
                    in:fade="{{ duration: 100 }}"
                >
                    <ResidentCardOnline
                        resident="{item.user}"
                        connection="{item.connection}"
                        archive="{archive}"
                    />
                </div>
            {/each}
        </div>
    </div>
</div>
