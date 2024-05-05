<script lang="ts">
    import { register } from 'swiper/element/bundle';

    import { router, RouterView, currentRoute } from '@/libs/Router';

    import { user, states } from '@/stores';

    import { type Modal, modal } from '@/helpers/modal';

    import { subscribe } from '@/helpers/notification';

    import { alertsSetup, alertsPush, notificationsSetup, notificationsPush } from '@/components';


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
