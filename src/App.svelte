<script lang="ts">
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

    import { subscribe } from '@/helpers/notification';

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
                        pushNotification(JSON.stringify(notification))
                    }
                );

                PushNotifications.addListener('pushNotificationActionPerformed',
                    (notification: ActionPerformed) => {
                        pushNotification(JSON.stringify(notification));
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
	});
</script>


<main>
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
