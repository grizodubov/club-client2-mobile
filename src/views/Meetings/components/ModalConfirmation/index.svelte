<script lang="ts">
    import { onMount } from 'svelte';


    const eventName = 'WebkitTransition' in document.documentElement.style ? 'webkitTransitionEnd' : 'transitionend';


    export let open: boolean;

    let delay = false;
    let wrapper;


    onMount(() => {
		wrapper.addEventListener(
            eventName,
            () => {
                delay = false;
            }
        );
	});
</script>


<div
    bind:this="{wrapper}"
    class="fixed transition-all duration-0 top-0 left-0 w-full h-full overflow-hidden z-30"
    class:w-0="{!open}"
    class:h-0="{!open}"
    class:delay-300="{delay}"
    class:w-full="{open}"
    class:h-full="{open}"
>
    <button
        class="absolute ease-out transition-opacity duration-200 w-full h-full top-0 left-0 bg-[#000000]"
        class:opacity-0="{!open}"
        class:opacity-50="{open}"
        on:click="{() => {
            delay = true;
            open = false;
        }}"
    ></button>
    <div
        class="absolute ease-out transition-all duration-300 w-[300px] h-[360px] left-[calc(50%-150px)] top-[calc(50%-200px)] bg-base-100 border-4 border-base-100 rounded-2xl"
        class:opacity-0="{!open}"
        class:opacity-100="{open}"
        class:mt-[-20px]="{!open}"
        class:mt-[0px]="{open}"
    >
        <slot />
    </div>
</div>
