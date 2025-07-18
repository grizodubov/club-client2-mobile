<script lang="ts">
    import { Keyboard } from '@capacitor/keyboard';
    import { Device } from '@capacitor/device';

    import { onMount } from 'svelte';

    import { states, bindings, meetings } from '@/stores';

    import { MenuButton } from './components';

    import { RouterView } from '@/libs/Router';

    import { push as notify } from '@/helpers/notification';

    import { Entity, collector } from '@/helpers/entity';

    import {
		meetingsFlags,
	} from '@/queries/user';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;


    /* DATA: meetingsFlagsHandler */
	const meetingsFlagsHandler = new Entity({
		model: meetingsFlags.model,
		retriever: meetingsFlags.retriever,
        onSuccess: data => {
            $meetings = data.flags;
        },
	});


    let showKeyboard = false;


    $: currentStates = $states as any;

    $: amount = ($bindings as any).notifications;

    $: amount2 = ($bindings as any).pendings + ($bindings as any).requests;


    /* getDeviceInfo */
    const getDeviceInfo = async () => {
        return await Device.getInfo();
    };


    /* setKeyboard */
    async function setKeyboard() {
        const deviceInfo = await getDeviceInfo();
        if (typeof deviceInfo === 'object')
            if (deviceInfo.platform && (deviceInfo.platform == 'ios' || deviceInfo.platform == 'android')) {
                Keyboard.addListener('keyboardWillShow', () => {
                    showKeyboard = true;
                });
                Keyboard.addListener('keyboardWillHide', () => {
                    showKeyboard = false;
                });
                Keyboard.addListener('keyboardDidShow', (info: any) => {
                    states.push({ keyboardHeight: info.keyboardHeight });
                    notify('keyboardShow', '');
                });
                Keyboard.addListener('keyboardDidHide', () => {
                    notify('keyboardHide', '');
                });
            }
    }


    /* getMeetingsFlags */
    function getMeetingsFlags() {
        collector.get([
            [ 
                meetingsFlagsHandler,
                {}
            ],
        ]);
    }


    getMeetingsFlags();

    /* onMount */
	onMount(() => {
        setKeyboard();
    });
</script>


<div class="bg-scene flex flex-col w-full h-full min-w-[320px]">
    {#if currentStates.safeTop}
        <div class="w-full overflow-hidden shrink-0 grow-0 bg-front" style="height: {currentStates.safeTop}px;">&nbsp;</div>
    {/if}
    <div
        class="shrink-1 grow-1 w-full h-full bg-base-100 overflow-hidden"
        class:rounded-b-2xl="{!showKeyboard}"
    >
        <RouterView>
            <div slot="loading" class="w-full h-full flex justify-center items-center">
                <span class="loading loading-bars text-front"></span>
            </div>
        </RouterView>
    </div>
    {#if !showKeyboard}
        <div class="shrink-0 grow-0 flex justify-around px-4 py-6">
            <MenuButton path="/home" binding="{amount}">
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M16.612 2.214a1.01 1.01 0 0 0-1.242 0L1 13.419l1.243 1.572L4 13.621V26a2.004 2.004 0 0 0 2 2h20a2.004 2.004 0 0 0 2-2V13.63L29.757 15L31 13.428zM18 26h-4v-8h4zm2 0v-8a2.002 2.002 0 0 0-2-2h-4a2.002 2.002 0 0 0-2 2v8H6V12.062l10-7.79l10 7.8V26z" fill="currentColor"></path></svg>
            </MenuButton>
            <MenuButton path="/events">
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M26 4h-4V2h-2v2h-8V2h-2v2H6c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 22H6V12h20v14zm0-16H6V6h4v2h2V6h8v2h2V6h4v4z" fill="currentColor"></path></svg>
            </MenuButton>
            <MenuButton path="/partners">
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 640 512"><path d="M32 224h32v192H32a31.962 31.962 0 0 1-32-32V256a31.962 31.962 0 0 1 32-32zm512-48v272a64.063 64.063 0 0 1-64 64H160a64.063 64.063 0 0 1-64-64V176a79.974 79.974 0 0 1 80-80h112V32a32 32 0 0 1 64 0v64h112a79.974 79.974 0 0 1 80 80zm-280 80a40 40 0 1 0-40 40a39.997 39.997 0 0 0 40-40zm-8 128h-64v32h64zm96 0h-64v32h64zm104-128a40 40 0 1 0-40 40a39.997 39.997 0 0 0 40-40zm-8 128h-64v32h64zm192-128v128a31.962 31.962 0 0 1-32 32h-32V224h32a31.962 31.962 0 0 1 32 32z" fill="currentColor"></path></svg>
            </MenuButton>
            <MenuButton path="/meetings" binding="{amount2}">
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M8 9a4 4 0 1 1 4-4a4 4 0 0 1-4 4zm0-6a2 2 0 1 0 2 2a2 2 0 0 0-2-2z" fill="currentColor"></path><path d="M24 9a4 4 0 1 1 4-4a4 4 0 0 1-4 4zm0-6a2 2 0 1 0 2 2a2 2 0 0 0-2-2z" fill="currentColor"></path><path d="M26 30h-4a2 2 0 0 1-2-2v-7h2v7h4v-9h2v-6a1 1 0 0 0-1-1h-6.42L16 20l-4.58-8H5a1 1 0 0 0-1 1v6h2v9h4v-7h2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1-2-2v-6a3 3 0 0 1 3-3h7.58L16 16l3.42-6H27a3 3 0 0 1 3 3v6a2 2 0 0 1-2 2v7a2 2 0 0 1-2 2z" fill="currentColor"></path></svg>
            </MenuButton>
            <MenuButton path="/residents">
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M30 30h-2v-5a5.006 5.006 0 0 0-5-5v-2a7.008 7.008 0 0 1 7 7z" fill="currentColor"></path><path d="M22 30h-2v-5a5.006 5.006 0 0 0-5-5H9a5.006 5.006 0 0 0-5 5v5H2v-5a7.008 7.008 0 0 1 7-7h6a7.008 7.008 0 0 1 7 7z" fill="currentColor"></path><path d="M20 2v2a5 5 0 0 1 0 10v2a7 7 0 0 0 0-14z" fill="currentColor"></path><path d="M12 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7z" fill="currentColor"></path></svg>
            </MenuButton>
            <MenuButton path="/communities">
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M28 6H8c-1.2 0-2 .8-2 2v14c0 1.2.8 2 2 2h8v-2H8V8h20v14h-7.2L16 28.8l1.6 1.2l4.2-6H28c1.2 0 2-.8 2-2V8c0-1.2-.8-2-2-2z" fill="currentColor"></path><path d="M4 18H2V5c0-1.7 1.3-3 3-3h13v2H5c-.6 0-1 .4-1 1v13z" fill="currentColor"></path></svg>
            </MenuButton>
        </div>
        <div class="w-full overflow-hidden shrink-0 grow-0" style="height: {currentStates.safeBottom + 2}px;">&nbsp;</div>
    {/if}
</div>
