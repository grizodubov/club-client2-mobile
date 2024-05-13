<script lang="ts">
    import { SafeArea } from 'capacitor-plugin-safe-area';
    import { onMount } from 'svelte';

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


    /* Alerts */
    alertsSetup({
        max: 1,
        duration: 5000,
        top: 24,
        right: 'calc(50% - 150px)',
    });


    /* Notifications */
    notificationsSetup({
        max: 1,
        duration: 5000,
        top: 24,
        right: 24,
    });


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
        notificationsPush(data.message);
    }


    /* pushAlert */
    function pushAlert(data: any) {
        alertsPush(data.message);
    }


    /* blurInputs */
    function blurInputs() {
        notify('forceBlur', '');
    }


    // subscriptions
    subscribe('notifications', pushNotification);
    subscribe('alerts', pushAlert);


    /* getDeviceId */
    const getDeviceId = async () => {
        return await Device.getId();
    };


    /* getDeviceInfo */
    const getDeviceInfo = async () => {
        return await Device.getInfo();
    };


    async function setSafeAreas() {
        const safeAreaData = await SafeArea.getSafeAreaInsets();
        const {insets} = safeAreaData;

        alert(JSON.stringify(insets));
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
                        if (notification.body) {
                            pushNotification({ message: notification.body });
                        }
                        else {
                            if (notification.data && notification.data && notification.data.link)
                                router.go(notification.data.link);
                        }
                    }
                );

                PushNotifications.addListener('pushNotificationActionPerformed',
                    (action: ActionPerformed) => {
                        pushNotification({ action: action.notification.body });
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
        setupFCM();
        setSafeAreas();
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
