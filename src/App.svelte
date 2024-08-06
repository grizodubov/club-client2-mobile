<script lang="ts">
    import { onMount } from 'svelte';

    import { SafeArea } from 'capacitor-plugin-safe-area';
    import { Device } from '@capacitor/device';

    import {
        type ActionPerformed,
        type PushNotificationSchema,
        PushNotifications,
        type Token
     } from '@capacitor/push-notifications';

    import {
        BarcodeScanner,
    } from '@capacitor-mlkit/barcode-scanning';

    import { register } from 'swiper/element/bundle';

    import { router, RouterView, currentRoute } from '@/libs/Router';

    import { user, states } from '@/stores';

    import { type Modal, modal } from '@/helpers/modal';

    import { type Info, info } from '@/helpers/info';

    import { type Log, log } from '@/helpers/log';

    import { subscribe, push as notify } from '@/helpers/notification';

    import { alertsSetup, alertsPush, notificationsSetup, notificationsPush } from '@/components';

    import { Entity, collector } from '@/helpers/entity';
    import {
		deviceRegister,
	} from '@/queries/auth';

    import { closeEventRegistrationPopup } from '@/helpers/popups';


    /* DATA: deviceRegisterHandler */
	const deviceRegisterHandler = new Entity({
		model: deviceRegister.model,
		retriever: deviceRegister.retriever,
	});


    /* web components */
    register();


    let userId = user.pull('id');

    let main:any;


    $: $user, userChange();


    $: modalData = $modal as Modal;

    $: infoData = $info as Info;

    $: logData = $log as Log;

    $: statesO = $states as any;


    /* userChange */
    function userChange() {
        const id = user.pull('id');
        //console.log('user_id: ', id);
        if (userId != id) {
            userId = id;
            if (states.pull('api')) {
                const currentUrl = currentRoute.extract('url');
                //console.log('url: ', currentUrl, userId);
                if (currentUrl) {
                    if (userId) {
                        const url = router.record('onLogin', '/', true);
                        if (typeof url === 'string')
                            router.go(url);
                    }
                    else {
                        router.go('/');
                    }
                }
            }
        }
    }


    /* pushNotification */
    function pushNotification(data: any) {
        notificationsPush(data.message, data.onClick);
    }


    /* pushAlert */
    function pushAlert(data: any) {
        alertsPush(data.message);
    }


    /* blurInputs */
    function blurInputs() {
        notify('forceBlur', '');
    }


    /* getDeviceId */
    const getDeviceId = async () => {
        return await Device.getId();
    };


    /* getDeviceInfo */
    const getDeviceInfo = async () => {
        return await Device.getInfo();
    };


    /* setSafeAreas */
    async function setSafeAreas() {
        const deviceInfo = await getDeviceInfo();
        let top = 0;
        let bottom = 0;
        if (typeof deviceInfo === 'object' && deviceInfo.platform && deviceInfo.platform == 'ios') {
            const safeAreaData = await SafeArea.getSafeAreaInsets();
            const { insets } = safeAreaData;
            top = insets.top ? insets.top : 0;
            bottom = insets.bottom ? insets.bottom : 0;
        }
        states.push({
            safeTop: top,
            safeBottom: bottom,
            displayHeight: window.innerHeight,
        });

        /* Alerts */
        alertsSetup({
            max: 1,
            duration: 6000,
            top: top + 32,
            right: 'calc(50% - 150px)',
        });

        /* Notifications */
        notificationsSetup({
            max: 1,
            duration: 6000,
            top: top + 24,
            right: 12,
        });

        // subscriptions
        subscribe('notifications', pushNotification);
        subscribe('alerts', pushAlert);

        /*
        pushNotification(
            {
                message: 'Вот такое сообщение',
                onClick: () => { router.go('/residents'); },
            }
        );
        */
    }


    /* setupFCM */
    async function setupFCM() {
        const deviceId = await getDeviceId();
        const deviceInfo = await getDeviceInfo();
        if (typeof deviceInfo === 'object') {
            if (deviceInfo.platform && (deviceInfo.platform == 'ios' || deviceInfo.platform == 'android')) {
                PushNotifications.requestPermissions().then(result => {
                    if (result.receive === 'granted') {
                        PushNotifications.register();
                    }
                });

                PushNotifications.addListener('registration',
                    (token: Token) => {
                        collector.get([
                            [ 
                                deviceRegisterHandler,
                                {
                                    deviceId: typeof deviceId === 'object' ? deviceId.identifier : null,
                                    deviceInfo: JSON.stringify(deviceInfo),
                                    deviceToken: token.value,
                                }
                            ],
                        ]);
                    }
                );

                /*
                PushNotifications.addListener('registrationError',
                    (error: any) => {
                        alert('Error on registration: ' + JSON.stringify(error));
                    }
                );
                */

                PushNotifications.addListener('pushNotificationReceived',
                    (notification: PushNotificationSchema) => {
                        //alert('notification\n' + JSON.stringify(notification, null, ' '));
                        if (notification.body) {
                            pushNotification({ 
                                message: notification.body,
                                onClick: notification.data && notification.data.link ? () => { router.go(notification.data.link); } : null,
                            });
                        }
                        else {
                            if (notification.data && notification.data && notification.data.link)
                                router.go(notification.data.link);
                        }
                    }
                );

                PushNotifications.addListener('pushNotificationActionPerformed',
                    (action: ActionPerformed) => {
                        //alert('action\n' + JSON.stringify(action, null, ' '));
                        if (action.notification && action.notification.data && action.notification.data.link) {
                            setTimeout(() => { router.go(action.notification.data.link); }, 100);
                        }
                    }
                );

            }
            else {
                collector.get([
                    [ 
                        deviceRegisterHandler,
                        {
                            deviceId: typeof deviceId === 'object' ? deviceId.identifier : null,
                            deviceInfo: JSON.stringify(deviceInfo),
                            deviceToken: null,
                        }
                    ],
                ]);
            }
        }
        else {
            collector.get([
                [ 
                    deviceRegisterHandler,
                    {
                        deviceId: typeof deviceId === 'object' ? deviceId.identifier : null,
                        deviceInfo: null,
                        deviceToken: null,
                    }
                ],
            ]);
        }
    }


    /* stopSCan */
    async function stopScan() {
        const deviceInfo = await getDeviceInfo();
        if (typeof deviceInfo === 'object') {
            if (deviceInfo.platform && (deviceInfo.platform == 'ios' || deviceInfo.platform == 'android')) {
                document.querySelector('html')?.classList.remove('barcode-scanner-active');
                await BarcodeScanner.removeAllListeners();
                await BarcodeScanner.stopScan();
            }
            else {
                document.querySelector('html')?.classList.remove('barcode-scanner-active');
            }
        }
    }


    /* onMount */
	onMount(() => {
        setSafeAreas();
        setupFCM();
        if (main)
            main.addEventListener('click', blurInputs);
        return () => {
            if (main)
                main.removeEventListener('click', blurInputs);
        };
	});
</script>


<main bind:this="{main}">
    <RouterView>
        <div slot="loading" class="w-full h-full flex justify-center items-center">
            <span class="loading loading-bars text-front"></span>
        </div>
    </RouterView>
</main>

<div id="modal">
    {#if modalData.component}
        <svelte:component this="{modalData.component}" params="{modalData.params}" />
    {/if}
</div>

<div id="info">
    {#if infoData.component}
        <svelte:component this="{infoData.component}" params="{infoData.params}" bind:this="{infoData.componentInstance}" />
    {/if}
</div>

<div id="log">
    {#if logData.component}
        <svelte:component this="{logData.component}" params="{logData.params}" bind:this="{logData.componentInstance}" />
    {/if}
</div>

<div id="barcode-scanner-ui">
    <div
        id="barcode-scanner-target"
    >
    </div>
    <button
            class="w-7 h-7 text-base-300 absolute right-[24px]"
            style="top: {(statesO.safeTop + 24).toString()}px"
            on:click="{stopScan}"
        >
        <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2zm4.3 14.3a.996.996 0 0 1-1.41 0L12 13.41L9.11 16.3a.996.996 0 1 1-1.41-1.41L10.59 12L7.7 9.11A.996.996 0 1 1 9.11 7.7L12 10.59l2.89-2.89a.996.996 0 1 1 1.41 1.41L13.41 12l2.89 2.89c.38.38.38 1.02 0 1.41z" fill="currentColor"></path></svg>
    </button>
</div>

<div id="event-registration-popup" class="fixed w-full h-full items-center justify-center z-50 left-[0px] top-[0px]">
    <button
        class="absolute opacity-30 bg-scene w-full h-full top-[0px] left-[0px]"
        on:click="{closeEventRegistrationPopup}"
    ></button>
    <div class="relative w-[300px] h-[240px] mt-[-40px] shrink-0 grow-0 bg-success rounded-2xl shadow border-base-100 border-8">
        <div class="absolute top-[-48px] left-[102px] bg-base-100 text-success rounded-full w-20 h-20 flex items-center justify-center shadow">
            <svg class="w-12 h-12" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
        </div>
        <div class="text-[30px] font-medium leading-[42px] mt-[56px] w-full text-center text-base-100">Регистрация успешна!</div>
        <button
            class="absolute btn btn-lg btn-primary w-[160px] left-[62px] bottom-[-40px]"
            on:click="{closeEventRegistrationPopup}"
        >OK</button>
    </div>
</div>
