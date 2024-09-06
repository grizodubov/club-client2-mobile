<script lang="ts">
    import { onMount } from 'svelte';

    import { SafeArea } from 'capacitor-plugin-safe-area';
    import { Device } from '@capacitor/device';

    import { Avatar, TagTiny } from '@/components';

    import { SwipeDeck } from 'svelte-swipe-cards';

    import { nameNormalization } from '@/utils/names';

    import {
        type ActionPerformed,
        type PushNotificationSchema,
        PushNotifications,
        type Token
    } from '@capacitor/push-notifications';

    import { FirebaseAnalytics } from "@capacitor-community/firebase-analytics";

    import { StatusBar, Style } from '@capacitor/status-bar';

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

    import {
        userContactAdd,
        userFavorites,
        userFavoritesSet,
	} from '@/queries/user';


    /* DATA: userFavoritesHandler */
	const userFavoritesHandler = new Entity({
		model: userFavorites.model,
		retriever: userFavorites.retriever,
        onSuccess: data => {
            cards = data.users;
            cardsAmount = cards.length;
            cardsStates = cards.reduce(
                (states, card) => {
                    return { ...states, [card.id.toString()]: null }
                }, {}
            );
            if (!cardsAmount)
                cardsHide = true;
        },
	});


    /* DATA: userFavoritesSetHandler */
	const userFavoritesSetHandler = new Entity({
		model: userFavoritesSet.model,
		retriever: userFavoritesSet.retriever,
	});


    /* DATA: deviceRegisterHandler */
	const deviceRegisterHandler = new Entity({
		model: deviceRegister.model,
		retriever: deviceRegister.retriever,
	});


    /* DATA: userContactAddHandler */
	const userContactAddHandler = new Entity({
		model: userContactAdd.model,
		retriever: userContactAdd.retriever,
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


    let deck;
    let cards: any[] = [];
    let cardsAmount: number = 0;
    let cardsStates = {};
    let cardsHide = false;
    let cardsContacts = {};


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
                        cardsHide = false;
                        getFavorites();
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
                        // console.log('Push registration success, token: ' + token.value);
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


    /* getFavorites */
    function getFavorites() {
        collector.get([
            [ 
                userFavoritesHandler,
                {}
            ],
        ]);
    }


    /* setFavorites */
    function setFavorites(targetId, flag) {
        collector.get([
            [ 
                userFavoritesSetHandler,
                {
                    targetId: targetId,
                    flag: flag,
                }
            ],
        ]);
    }


    /* addContact */
    function addContact(id) {
        collector.get([
            [ 
                userContactAddHandler,
                {
                    contactId: id,
                }
            ],
        ]);
    }


    /* onMount */
	onMount(() => {
        setSafeAreas();
        setupFCM();
        // console.log('FirebaseAnalytics.setUserId: ' + userId);
        /**
         * Platform: Web/Android/iOS
         * Sets the user ID property.
         * @param userId - unique identifier of a user
         * @returns void
         * https://firebase.google.com/docs/analytics/userid
         */
        let userId_string = userId.toString();
        FirebaseAnalytics.setUserId({
            userId: userId_string,
        });
        const main = document.getElementById('main');
        if (main)
            main.addEventListener('click', blurInputs);
        const id = user.pull('id');
        if (id) {
            getFavorites();
        }
        else {
            cardsHide = true;
        }
        return () => {
            if (main)
                main.removeEventListener('click', blurInputs);
        };
	});

    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: '#0a2d3c' });



</script>


<style>
    .with-dot {
        padding-right: 10px;
        margin-left: 5px;
    }

    .with-dot:first-child {
        padding-left: 10px;
        margin-left: 0px;
    }

    .with-dot:first-child:before {
        display: inline-block;
        width: 5px;
        height: 5px;
        margin-bottom: 1px;
        border-radius: 100%;
        margin-right: 5px;
        margin-left: -10px;
        background-color: #ffbf00;
        color: #ffbf00;
        content: '';
    }

    .with-dot:after {
        display: inline-block;
        width: 5px;
        height: 5px;
        margin-bottom: 1px;
        border-radius: 100%;
        margin-left: 5px;
        margin-right: -10px;
        background-color: #ffbf00;
        color: #ffbf00;
        content: '';

    }
</style>


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
    <div class="relative w-[300px] h-[260px] mt-[-40px] shrink-0 grow-0 bg-success rounded-2xl shadow border-base-100 border-8">
        <div class="absolute top-[-48px] left-[102px] bg-base-100 text-success rounded-full w-20 h-20 flex items-center justify-center shadow">
            <svg class="w-12 h-12" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
        </div>
        <div class="text-[26px] font-medium leading-[42px] mt-[56px] w-full text-center text-base-100">Добро пожаловать!</div>
        <div class="text w-full text-center text-base-100 mt-[24px] px-6">Регистрация на мероприятие прошла успешно</div>
        <button
            class="absolute btn btn-lg btn-primary w-[160px] left-[62px] bottom-[-40px]"
            on:click="{closeEventRegistrationPopup}"
        >OK</button>
    </div>
</div>


{#if !cardsHide}
    <div
        class="absolute top-0 left-0 w-full h-full transition-opacity duration-300 z-20"
        class:opacity-0="{cardsAmount == 0}"
        class:opacity-100="{cardsAmount > 0}"
    >
        <div class="absolute bg-scene opacity-90 w-full h-full">
        </div>
        <div class="absolute w-full h-full flex flex-col jsutify-start items-center">
            <div class="text text-base-100 mt-[32px]">Оцените потенциальных партнеров</div>
            <button
                class="btn btn-sm px-2 btn-front text-base-100 mt-3"
                on:click="{() => {
                    cardsAmount = 0;
                    setTimeout(() => { cardsHide = true; }, 400);
                }}"
            >
                <span class="leading-[18px] normal-case">В другой раз</span>
            </button>
        </div>
        <div class="absolute left-[0px] right-[0px] top-[0px] bottom-[0px] m-[auto] w-[310px] h-[450px]">
            <SwipeDeck
                {cards}
                let:card
                bind:this={deck}
                threshold="{10}"
                transitionDuration="{300}"
                allowedDirections="horizontal"
                on:swipe="{(e) => {
                    console.log('swipe', e.detail.index);
                    cardsAmount = cardsAmount - 1;
                    const id = cards[e.detail.index]['id'];
                    setFavorites(id, cardsStates[id.toString()]);
                    if (!cardsAmount)
                        setTimeout(() => { cardsHide = true }, 400);
                }}"
                on:move_left="{(e) => {
                    const id = cards[e.detail.index]['id'];
                    cardsStates[id.toString()] = false;
                }}"
                on:move_right="{(e) => {
                    const id = cards[e.detail.index]['id'];
                    cardsStates[id.toString()] = true;
                }}"
            >
                <div
                    class="w-[310px] h-[450px] rounded-xl transition-colors p-4 flex flex-col items-center justify-between border-2 border-base-300 relative"
                    class:bg-front="{cardsStates[card.id.toString()] === null}"
                    class:bg-success="{cardsStates[card.id.toString()] === true}"
                    class:bg-error="{cardsStates[card.id.toString()] === false}"
                >
                    <div class="shrink-1 grow-1 flex flex-col items-center overflow-hidden">
                        <div
                            class="w-[120px] h-[120px] left-[0px] right-[0px] mx-[auto] rounded-full overflow-hidden border-4 border-base-300"
                        >
                            <Avatar
                                user="{{
                                    id: card.id,
                                    name: card.name,
                                    avatar_hash: card.avatar_hash,
                                    roles: [ 'client' ],
                                    telegram: '',
                                }}"
                                scaleLetters="2.5"
                            />
                        </div>
                        <div class="w-full h-[0px] relative">
                            <button
                                class="btn btn-sm h-[48px] px-2 btn-warning text-base-100 transition-opacity duration-300 absolute bottom-[0px] right-[0px] z-[30]"
                                class:opacity-0="{cardsContacts[card.id.toString()]}"
                                on:click="{() => {
                                    if (!cardsContacts[card.id.toString()]) {
                                        cardsContacts[card.id.toString()] = true;
                                        addContact(card.id);
                                    }
                                }}"
                            >
                                <span class="leading-[18px] normal-case">Добавить<br />в избранные</span>
                            </button>
                        </div>
                        <div class="font-medium text-[20px] leading-[28px] mt-2 text-base-100 text-center">{nameNormalization(card.name, 2)}</div>
                        <div class="text-[12px] leading-[16px] mt-1.5 text-base-100 text-center">{card.position}</div>
                        <div class="font-medium text-[15px] leading-[19px] mt-0.5 text-base-100 text-center">{card.company}</div>
                        {#if card['catalog filtered']}
                            <div class="w-full text-center text-base-100 leading-[14px] mt-2">
                                {#each card['catalog filtered'] as tag}<span class="text-[10px] font-medium uppercase with-dot">{tag}</span>{/each}
                            </div>
                        {/if}
                        <!--
                        {#if card['catalog filtered']}
                            <div class="flex flex-wrap justify-center mt-2 ml-[-8px]">
                                {#each card['catalog filtered'] as tag}
                                    <div class="ml-2 mt-0.5"><TagTiny tag="{tag}" type="catalog" /></div>
                                {/each}
                            </div>
                        {/if}
                        -->
                        <!--
                        {#if card['hobby filtered']}
                            <div class="flex flex-wrap justify-center mt-2 ml-[-8px]">
                                {#each card['hobby filtered'] as tag}
                                    <div class="ml-2 mt-0.5"><TagTiny tag="{tag}" type="hobby" /></div>
                                {/each}
                            </div>
                        {/if}
                        -->
                    </div>
                    {#if card.tags['company needs intersections'] || card.tags['company scope intersections']}
                        <div class="shrink-0 grow-0 flex flex-col items-center overflow-hidden">
                            <div class="text-xs text-base-100">Совпадения:</div>
                            {#if card.tags['company needs intersections filtered']}
                                <div class="flex flex-wrap justify-center mt-2 ml-[-8px]">
                                    {#each card.tags['company needs intersections filtered'] as tag}
                                        <div class="ml-2 mt-0.5"><TagTiny tag="{tag}" type="tag" /></div>
                                    {/each}
                                </div>
                            {/if}
                            {#if card.tags['company scope intersections filtered']}
                                <div class="flex flex-wrap justify-center mt-2 ml-[-8px]">
                                    {#each card.tags['company scope intersections filtered'] as tag}
                                        <div class="ml-2 mt-0.5"><TagTiny tag="{tag}" type="interest" /></div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    {/if}
                    <div class="absolute rounded-[14px] bg-scene h-[28px] bottom-[-48px] left-[48px] right-[48px] flex justify-between items-center">
                        <div class="h-[28px] w-[28px] bg-error rounded-[14px] flex items-center justify-center px-1.5">
                            <svg class="text-base-100 w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28L75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256L9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" fill="currentColor"></path></svg>
                        </div>
                        <div
                            class="h-[28px] bg-success rounded-[14px] flex items-center px-1.5"
                            class:w-[28px]="{!card.favorites_stats}"
                            class:justify-center="{!card.favorites_stats}"
                            class:w-[64px]="{card.favorites_stats}"
                            class:justify-around="{card.favorites_stats}"
                        >
                            <svg class="text-base-100 w-4 h-4 shrink-0 grow-0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                            {#if card.favorites_stats}
                                <span class="text-base-100 font-medium text-sm shrink-0 grow-0">{card.favorites_stats}</span>
                            {/if}
                        </div>
                    </div>
                </div>
                <svelte:fragment slot="swipe-btn">
                    <div class="absolute bottom-[-56px] w-full flex justify-between">
                        <div class="w-12 h-12 flex items-center justify-center text-base-300">
                            <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M4.31 9.5l2.963 2.963a.75.75 0 0 1-.977 1.133l-.084-.073L1.97 9.281a.75.75 0 0 1-.073-.977l.073-.084l4.242-4.243a.75.75 0 0 1 1.134.977l-.073.084L4.31 8H10a7.75 7.75 0 0 1 7.746 7.504l.004.247a.75.75 0 0 1-1.5 0a6.25 6.25 0 0 0-6.02-6.246L10 9.5H4.31l2.963 2.963L4.31 9.5z" fill="currentColor"></path></g></svg>
                        </div>
                        <div class="w-12 h-12 flex items-center justify-center text-base-300">
                            <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M15.69 9.5l-2.963 2.963a.75.75 0 0 0 .977 1.133l.084-.073l4.242-4.242a.75.75 0 0 0 .073-.977l-.073-.084l-4.242-4.243a.75.75 0 0 0-1.134.977l.073.084L15.69 8H10a7.75 7.75 0 0 0-7.746 7.504l-.004.247a.75.75 0 0 0 1.5 0a6.25 6.25 0 0 1 6.02-6.246L10 9.5h5.69z" fill="currentColor"></path></g></svg>
                        </div>
                    </div>
                    <!--
                    <div class="absolute bottom-[-56px] w-full flex justify-between">
                        <button
                            class="w-12 h-12 border-2 border-base-300 flex items-center justify-center rounded-xl bg-error"
                            on:click="{() => {
                                if (deck) {
                                    deck.swipe('left');
                                }
                            }}"
                        >
                            <svg class="text-base-100 w-6 h-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28L75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256L9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" fill="currentColor"></path></svg>
                        </button>
                        <button
                            class="w-12 h-12 border-2 border-base-300 flex items-center justify-center rounded-xl bg-success"
                            on:click="{() => {
                                if (deck) {
                                    deck.swipe('right');
                                }
                            }}"
                        >
                            <svg class="text-base-100 w-6 h-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                        </button>
                    </div>
                    -->
                </svelte:fragment>
            </SwipeDeck>
        </div>
    </div>
{/if}
