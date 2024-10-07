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
    class="fixed transition-all duration-0 t-0 l-0 overflow-hidden z-30"
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
        class="absolute ease-out transition-all duration-300 w-[calc(100%-40px)] max-h-[calc(100%-276px)] bottom-[106px] left-0 bg-base-100 border-4 border-base-100 rounded-l-2xl scrollable-y"
        class:ml-[100%]="{!open}"
        class:ml-[40px]="{open}"
    >
        <slot />
    </div>
</div>
