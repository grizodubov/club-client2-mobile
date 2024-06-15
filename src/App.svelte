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

    import { register } from 'swiper/element/bundle';

    import { router, RouterView, currentRoute } from '@/libs/Router';

    import { user, states } from '@/stores';

    import { type Modal, modal } from '@/helpers/modal';

    import { type Info, info } from '@/helpers/info';

    import { subscribe, push as notify } from '@/helpers/notification';

    import { alertsSetup, alertsPush, notificationsSetup, notificationsPush } from '@/components';

    import { Entity, collector } from '@/helpers/entity';
    import {
		deviceRegister,
	} from '@/queries/auth';


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
                        if (action.notification && action.notification.data && action.notification.data.link)
                            setTimeout(() => { router.go(action.notification.data.link); }, 100);
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
            <span class="loading loading-bars text-front laoding-lg"></span>
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
