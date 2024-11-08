<script lang="ts">
    import { onMount } from 'svelte';

    import { SafeArea } from 'capacitor-plugin-safe-area';
    import { Device } from '@capacitor/device';

    import { Avatar, UserAgreement } from '@/components';

    import { SwipeDeck } from 'svelte-swipe-cards';

    import { nameNormalization } from '@/utils/names';

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

    import { type User, user, states } from '@/stores';

    import { type Modal, modal } from '@/helpers/modal';

    import { type Info, info } from '@/helpers/info';

    import { type Log, log } from '@/helpers/log';

    import { subscribe, push as notify } from '@/helpers/notification';

    import { alertsSetup, alertsPush, notificationsSetup, notificationsPush } from '@/components';

    import { Entity, collector } from '@/helpers/entity';
    import {
		deviceRegister,
        legalSubmit,
	} from '@/queries/auth';

    import { closeEventRegistrationPopup } from '@/helpers/popups';

    import {
        userContactAdd,
	} from '@/queries/user';

    import {
        connectionsHot,
	} from '@/queries/connection';

    import {
        offlineConnectionMark,
        eventConnectionMark,
    } from '@/queries/event';


    /* DATA: connectionsHotHandler */
	const connectionsHotHandler = new Entity({
		model: connectionsHot.model,
		retriever: connectionsHot.retriever,
        onSuccess: data => {
            cardsAmount = data.events.length + data.offline.length;
            cards = [ ...data.events, ...data.offline ]
            cardsStates = cards.reduce(
                (states, card) => {
                    return { ...states, [card.connection.id.toString()]: null }
                }, {}
            );
            cardsComments = cards.reduce(
                (states, card) => {
                    return { ...states, [card.connection.id.toString()]: [] }
                }, {}
            );
            if (!cardsAmount)
                cardsShow = false;
        },
	});


    /* DATA: eventConnectionMarkHandler */
	const offlineConnectionMarkHandler = new Entity({
		model: offlineConnectionMark.model,
		retriever: offlineConnectionMark.retriever,
	});


    /* DATA: eventConnectionMarkHandler */
	const eventConnectionMarkHandler = new Entity({
		model: eventConnectionMark.model,
		retriever: eventConnectionMark.retriever,
	});


    /* DATA: userFavoritesSetHandler */
	//const userFavoritesSetHandler = new Entity({
	//	model: userFavoritesSet.model,
	//	retriever: userFavoritesSet.retriever,
	//});


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


    /* DATA: legalSubmitHandler */
	const legalSubmitHandler = new Entity({
		model: legalSubmit.model,
		retriever: legalSubmit.retriever,
	});


    /* web components */
    register();


    let userId = user.pull('id');

    $: currentUser = $user as User;

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
    let cardsComments = {};
    let cardsShow = true;
    //let cardsContacts = {};

    let legalShow = true;


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
                        cardsShow = true;
                        getConnections();
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


    /* getConnections */
    function getConnections() {
        collector.get([
            [ 
                connectionsHotHandler,
                {}
            ],
        ]);
    }


    /* sendMark */
    function sendMark(event, connectionId, mark, comment) {
        if (event) {
            collector.get([
                [ 
                    eventConnectionMarkHandler,
                    {
                        connectionId: connectionId,
                        mark: mark,
                        comment: comment === null ? null : comment.join(', '),
                    }
                ],
            ]);
        }
        else {
            collector.get([
                [ 
                    offlineConnectionMarkHandler,
                    {
                        connectionId: connectionId,
                        mark: mark,
                        comment: comment === null ? null : comment.join(', '),
                    }
                ],
            ]);
        }
    }


    /* setFavorites */
    /*
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
    */


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


    /* submitLegal */
    function submitLegal() {
        collector.get([
            [ 
                legalSubmitHandler,
                {}
            ],
        ]);
    }


    /* onMount */
	onMount(() => {
        setSafeAreas();
        setupFCM();
        if (main)
            main.addEventListener('click', blurInputs);
        const id = user.pull('id');
        if (id) {
            getConnections();
        }
        else {
            cardsShow = false;
        }
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


{#if currentUser.id && !currentUser.legal}
    <div
        class="absolute top-0 left-0 w-full h-full transition-opacity duration-300 z-[21]"
        class:opacity-0="{!legalShow}"
        class:opacity-100="{legalShow}"
    >
        <div class="absolute bg-scene opacity-90 w-full h-full">
        </div>
        <div class="absolute w-full h-full flex flex-col justify-start items-center">
            <div class="text text-base-100 mt-10 shrink-0 grow-0 mb-3">Ознакомьтесь с соглашениями</div>
            <div class="flex justify-center w-full shrink-0 grow-0 mb-5">
                <div class="text-warning shrink-0 grow-0 text-xs w-[42%] text-center">Политика конфиденциальности</div>
            </div>
            <div class="w-[90%] h-full bg-base-200 shrink-1 grow-1 rounded-lg overflow-hidden">
                <pre class="w-full h-full text-xs whitespace-pre-wrap p-4 overflow-y-auto"><UserAgreement /></pre>
            </div>
            <button
                class="rounded-lg px-5 btn-front text-base-100 mt-2.5 mb-12 text-sm font-semibold h-[32px] leading-[32px] py-0 shrink-0 grow-0 mt-5"
                on:click="{() => {
                    legalShow = false;
                    setTimeout(() => { submitLegal(); }, 400);
                }}"
            >
                <span class="normal-case">Принять</span>
            </button>
        </div>
    </div>
{/if}


{#if currentUser.id && cardsShow}
    <div
        class="absolute top-0 left-0 w-full h-full transition-opacity duration-300 z-20"
        class:opacity-0="{cardsAmount == 0}"
        class:opacity-100="{cardsAmount > 0 && currentUser.legal}"
    >
        <div class="absolute bg-scene opacity-90 w-full h-full">
        </div>
        <div class="absolute w-full h-full flex flex-col justify-end items-center">
            <div class="text text-base-100 mb-10 text-sm text-center px-6">Выберите пункты опроса и сдвиньте карточку направо или налево.</div>
        </div>
        <div class="absolute w-full h-full flex flex-col justify-start items-center">
            <div class="text text-base-100 mt-10">Дайте оценку личному контакту</div>
            <button
                class="rounded-lg px-4 btn-scene text-base-300 mt-2.5 text-[11px] font-semibold h-[26px] leading-[26px] py-0"
                on:click="{() => {
                    cardsAmount = 0;
                    setTimeout(() => { cardsShow = false; }, 400);
                }}"
            >
                <span class="normal-case">В другой раз</span>
            </button>
        </div>
        <div class="absolute left-[0px] right-[0px] top-[-10px] bottom-[0px] m-[auto] w-[310px] h-[470px]">
            <SwipeDeck
                {cards}
                let:card
                bind:this={deck}
                threshold="{30}"
                transitionDuration="{300}"
                allowedDirections="horizontal"
                on:swipe="{(e) => {
                    //console.log('swipe', e.detail.index);
                    cardsAmount = cardsAmount - 1;
                    const id = cards[e.detail.index]['connection']['id'];
                    //setFavorites(id, cardsStates[id.toString()]);
                    sendMark(cards[e.detail.index]['event'] ? true : false, id, cardsStates[id.toString()] ? 2 : 0, cardsComments[id.toString()]);
                    if (!cardsAmount)
                        setTimeout(() => { cardsShow = false }, 400);
                }}"
                on:move_left="{(e) => {
                    const id = cards[e.detail.index]['connection']['id'];
                    cardsStates[id.toString()] = false;
                }}"
                on:move_right="{(e) => {
                    const id = cards[e.detail.index]['connection']['id'];
                    cardsStates[id.toString()] = true;
                }}"
            >
                <div
                    class="w-[310px] h-[470px] rounded-xl transition-colors py-3 px-4 flex flex-col items-center justify-between border-2 border-base-300 relative"
                    class:bg-front="{cardsStates[card.connection.id.toString()] === null}"
                    class:bg-success="{cardsStates[card.connection.id.toString()] === true}"
                    class:bg-error="{cardsStates[card.connection.id.toString()] === false}"
                >
                    <div class="shrink-1 grow-1 flex flex-col items-center overflow-hidden">
                        <div
                            class="w-[112px] h-[112px] left-[0px] right-[0px] mx-[auto] rounded-full overflow-hidden border-4 border-base-300"
                        >
                            <Avatar
                                user="{{
                                    id: card.user.id,
                                    name: card.user.name,
                                    avatar_hash: card.user.avatar_hash,
                                    roles: [ 'client' ],
                                    telegram: '',
                                }}"
                                scaleLetters="2.5"
                            />
                        </div>
                        <div class="font-medium text-[20px] leading-[28px] mt-1 text-base-100 text-center">{nameNormalization(card.user.name, 2)}</div>
                        <div class="text-[12px] leading-[16px] text-base-100 mt-[1px] text-center opacity-85">{card.user.position}</div>
                        <div class="font-medium text-[15px] leading-[19px] mt-[2px] text-base-100 text-center opacity-85">{card.user.company}</div>
                        {#if card.event}
                            <div class="font-semibold leading-[19px] mt-3 text-center text-xs">ВСТРЕЧА НА МЕРОПРИЯТИИ</div>
                            <div class="font-semibold text-center text-xs text-center leading-[14px] mt-[1px]">{card.event.name}</div>
                        {:else}
                            <div class="font-semibold text-[15px] leading-[19px] mt-3 text-center text-xs">ОБМЕН КОНТАКТАМИ</div>
                        {/if}
                    </div>

                    <div class="mb-1">
                        <div class="text-center text-sm text-center leading-[14px] mb-4">Укажите недостатки встречи, если они были:</div>
                        <button
                            class="flex items-start"
                            on:click="{() => {
                                if (cardsComments[card.connection.id.toString()].indexOf('всё прошло отлично') == -1) {
                                    cardsComments[card.connection.id.toString()] = [ ...cardsComments[card.connection.id.toString()], 'всё прошло отлично' ];
                                }
                                else {
                                    cardsComments[card.connection.id.toString()] = cardsComments[card.connection.id.toString()].filter(t => t != 'всё прошло отлично');
                                }
                            }}"
                        >
                            <div
                                class="rounded-full w-6 h-6 border-2 border-base-300 bg-base-100 transition-all duration-200 flex items-center justify-center shrink-0 grow-0"
                                class:text-base-100="{cardsComments[card.connection.id.toString()].indexOf('всё прошло отлично') == -1}"
                                class:text-success="{cardsComments[card.connection.id.toString()].indexOf('всё прошло отлично') > -1}"
                            >
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                            </div>
                            <div class="ml-3 text-left mt-[2px] leading-5 font-medium text-base-100">всё прошло отлично</div>
                        </button>
                        <button
                            class="flex items-start mt-2"
                            on:click="{() => {
                                if (cardsComments[card.connection.id.toString()].indexOf('недостаточная организация и подготовка') == -1) {
                                    cardsComments[card.connection.id.toString()] = [ ...cardsComments[card.connection.id.toString()], 'недостаточная организация и подготовка' ];
                                }
                                else {
                                    cardsComments[card.connection.id.toString()] = cardsComments[card.connection.id.toString()].filter(t => t != 'недостаточная организация и подготовка');
                                }
                            }}"
                        >
                            <div
                                class="rounded-full w-6 h-6 border-2 border-base-300 bg-base-100 transition-all duration-200 flex items-center justify-center shrink-0 grow-0"
                                class:text-base-100="{cardsComments[card.connection.id.toString()].indexOf('недостаточная организация и подготовка') == -1}"
                                class:text-error="{cardsComments[card.connection.id.toString()].indexOf('недостаточная организация и подготовка') > -1}"
                            >
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                            </div>
                            <div class="ml-3 text-left mt-[2px] leading-5 font-medium text-base-100">недостаточная организация встречи</div>
                        </button>
                        <button
                            class="flex items-start mt-2"
                            on:click="{() => {
                                if (cardsComments[card.connection.id.toString()].indexOf('нет пользы для бизнеса') == -1) {
                                    cardsComments[card.connection.id.toString()] = [ ...cardsComments[card.connection.id.toString()], 'нет пользы для бизнеса' ];
                                }
                                else {
                                    cardsComments[card.connection.id.toString()] = cardsComments[card.connection.id.toString()].filter(t => t != 'нет пользы для бизнеса');
                                }
                            }}"
                        >
                            <div
                                class="rounded-full w-6 h-6 border-2 border-base-300 bg-base-100 transition-all duration-200 flex items-center justify-center shrink-0 grow-0"
                                class:text-base-100="{cardsComments[card.connection.id.toString()].indexOf('нет пользы для бизнеса') == -1}"
                                class:text-error="{cardsComments[card.connection.id.toString()].indexOf('нет пользы для бизнеса') > -1}"
                            >
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                            </div>
                            <div class="ml-3 text-left mt-[2px] leading-5 font-medium text-base-100">нет пользы для бизнеса</div>
                        </button>
                        <button
                            class="flex items-start mt-2"
                            on:click="{() => {
                                if (cardsComments[card.connection.id.toString()].indexOf('некомфортный личный контакт') == -1) {
                                    cardsComments[card.connection.id.toString()] = [ ...cardsComments[card.connection.id.toString()], 'некомфортный личный контакт' ];
                                }
                                else {
                                    cardsComments[card.connection.id.toString()] = cardsComments[card.connection.id.toString()].filter(t => t != 'некомфортный личный контакт');
                                }
                            }}"
                        >
                            <div
                                class="rounded-full w-6 h-6 border-2 border-base-300 bg-base-100 transition-all duration-200 flex items-center justify-center shrink-0 grow-0"
                                class:text-base-100="{cardsComments[card.connection.id.toString()].indexOf('некомфортный личный контакт') == -1}"
                                class:text-error="{cardsComments[card.connection.id.toString()].indexOf('некомфортный личный контакт') > -1}"
                            >
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                            </div>
                            <div class="ml-3 text-left mt-[2px] leading-5 font-medium text-base-100">некомфортный личный контакт</div>
                        </button>
                    </div>

                    <div class="absolute rounded-[14px] h-[28px] bottom-[-52px] left-[24px] right-[24px] flex justify-between items-center">
                        <div class="h-[28px] w-[100px] text-center bg-error rounded-[14px] flex items-center justify-center px-1.5 text-xs font-medium text-base-100">негативно</div>
                        <div class="h-[28px] w-[100px] text-center bg-success rounded-[14px] flex items-center justify-center px-1.5 text-xs font-medium text-base-100">позитивно</div>
                    </div>
                </div>
                <svelte:fragment slot="swipe-btn">
                    <div class="absolute bottom-[-52px] w-full flex justify-between">
                        <div class="w-12 h-12 flex items-center justify-center text-base-300">
                            <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M4.31 9.5l2.963 2.963a.75.75 0 0 1-.977 1.133l-.084-.073L1.97 9.281a.75.75 0 0 1-.073-.977l.073-.084l4.242-4.243a.75.75 0 0 1 1.134.977l-.073.084L4.31 8H10a7.75 7.75 0 0 1 7.746 7.504l.004.247a.75.75 0 0 1-1.5 0a6.25 6.25 0 0 0-6.02-6.246L10 9.5H4.31l2.963 2.963L4.31 9.5z" fill="currentColor"></path></g></svg>
                        </div>
                        <div class="w-12 h-12 flex items-center justify-center text-base-300">
                            <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M15.69 9.5l-2.963 2.963a.75.75 0 0 0 .977 1.133l.084-.073l4.242-4.242a.75.75 0 0 0 .073-.977l-.073-.084l-4.242-4.243a.75.75 0 0 0-1.134.977l.073.084L15.69 8H10a7.75 7.75 0 0 0-7.746 7.504l-.004.247a.75.75 0 0 0 1.5 0a6.25 6.25 0 0 1 6.02-6.246L10 9.5h5.69z" fill="currentColor"></path></g></svg>
                        </div>
                    </div>
                </svelte:fragment>
            </SwipeDeck>
        </div>
    </div>
{/if}
