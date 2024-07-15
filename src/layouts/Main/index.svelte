<script lang="ts">
    import { Keyboard } from '@capacitor/keyboard';
    import { Device } from '@capacitor/device';

    import { onMount } from 'svelte';

    import { states } from '@/stores';

    import { MenuButton, LogButton } from './components';

    import { RouterView } from '@/libs/Router';

    import { push as notify } from '@/helpers/notification';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;


    let showKeyboard = false;


    $: currentStates = $states as any;


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
            <MenuButton path="/home">
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M16.612 2.214a1.01 1.01 0 0 0-1.242 0L1 13.419l1.243 1.572L4 13.621V26a2.004 2.004 0 0 0 2 2h20a2.004 2.004 0 0 0 2-2V13.63L29.757 15L31 13.428zM18 26h-4v-8h4zm2 0v-8a2.002 2.002 0 0 0-2-2h-4a2.002 2.002 0 0 0-2 2v8H6V12.062l10-7.79l10 7.8V26z" fill="currentColor"></path></svg>
            </MenuButton>
            <MenuButton path="/events">
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M26 4h-4V2h-2v2h-8V2h-2v2H6c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 22H6V12h20v14zm0-16H6V6h4v2h2V6h8v2h2V6h4v4z" fill="currentColor"></path></svg>
            </MenuButton>
            <MenuButton path="/communities">
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M28 6H8c-1.2 0-2 .8-2 2v14c0 1.2.8 2 2 2h8v-2H8V8h20v14h-7.2L16 28.8l1.6 1.2l4.2-6H28c1.2 0 2-.8 2-2V8c0-1.2-.8-2-2-2z" fill="currentColor"></path><path d="M4 18H2V5c0-1.7 1.3-3 3-3h13v2H5c-.6 0-1 .4-1 1v13z" fill="currentColor"></path></svg>
            </MenuButton>
            <MenuButton path="/residents">
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M30 30h-2v-5a5.006 5.006 0 0 0-5-5v-2a7.008 7.008 0 0 1 7 7z" fill="currentColor"></path><path d="M22 30h-2v-5a5.006 5.006 0 0 0-5-5H9a5.006 5.006 0 0 0-5 5v5H2v-5a7.008 7.008 0 0 1 7-7h6a7.008 7.008 0 0 1 7 7z" fill="currentColor"></path><path d="M20 2v2a5 5 0 0 1 0 10v2a7 7 0 0 0 0-14z" fill="currentColor"></path><path d="M12 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7z" fill="currentColor"></path></svg>
            </MenuButton>
            <LogButton>
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M28.707 19.293L26 16.586V13a10.014 10.014 0 0 0-9-9.95V1h-2v2.05A10.014 10.014 0 0 0 6 13v3.586l-2.707 2.707A1 1 0 0 0 3 20v3a1 1 0 0 0 1 1h7v.777a5.152 5.152 0 0 0 4.5 5.199A5.006 5.006 0 0 0 21 25v-1h7a1 1 0 0 0 1-1v-3a1 1 0 0 0-.293-.707zM19 25a3 3 0 0 1-6 0v-1h6zm8-3H5v-1.586l2.707-2.707A1 1 0 0 0 8 17v-4a8 8 0 0 1 16 0v4a1 1 0 0 0 .293.707L27 20.414z" fill="currentColor"></path></svg>
            </LogButton>
        </div>
        <div class="w-full overflow-hidden shrink-0 grow-0" style="height: {currentStates.safeBottom + 2}px;">&nbsp;</div>
    {/if}
</div>
