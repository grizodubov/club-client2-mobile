<script lang="ts">
    import { Device } from '@capacitor/device';

    import { onMount } from 'svelte';

    import { subscribe } from '@/helpers/notification';


    export let placeholder: string;
    export let value: string;
    export let disabled: boolean = false;


    let focus: boolean = false;

    let deviceInfo: any = {};

    let input: any;


    /* getDeviceInfo */
    const getDeviceInfo = async () => {
        return await Device.getInfo();
    };


    /* getDevice */
    async function getDevice() {
        deviceInfo = await getDeviceInfo();
    }


    /* blur */
    function blur() {
        if (input && focus && deviceInfo.platform && (deviceInfo.platform == 'ios' || deviceInfo.platform == 'android'))
            input.blur();
    }


    /* onMount */
    onMount(() => {
        getDevice();
        const sub = subscribe('forceBlur', blur);
        return () => {
            sub.close();
        };
	});
</script>


<div class="relative h-full w-full overflow-hidden">
    <div
        class="absolute top-0 h-full w-full pt-1 pl-3 bg-base-200 text-xs border-l-2 opacity-90"
        class:border-transparent="{!focus}"
        class:border-neutral="{focus}"
    >
        <span
            class="opacity-30"
        >{placeholder}</span>
    </div>
    <textarea
        class="absolute top-0 left-[2px] h-full w-[calc(100%-2px)] px-3 m-0 bg-transparent
            outline-none border-0 focus:outline-none focus:border-0 shadow-none focus:shadow-none
            leading-[20px] pt-[22px] pb-[6px] resize-none"
        disabled="{disabled}"
        on:click|stopPropagation
        bind:value="{value}"
        on:focus="{() => {
            focus = true;
        }}"
        on:blur="{() => {
            focus = false;
        }}"
        bind:this="{input}"
    />
</div>
