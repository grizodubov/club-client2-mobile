<script lang="ts">
    import { nameNormalization } from '@/utils/names';

    import { logHide } from '@/helpers/log';

    import { router } from '@/libs/Router';

    import { toDateText } from '@/utils/dates';

    import { Entity, collector } from '@/helpers/entity';

    import { Avatar } from '@/components';

    import {
		notificationView,
        notificationViewAll,
	} from '@/queries/notification';

    import {
        eventConnectionResponse
    } from '@/queries/event';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;


    /* DATA: notificationViewHandler */
	const notificationViewHandler = new Entity({
		model: notificationView.model,
		retriever: notificationView.retriever,
        onSuccess: () => {
            if (data.onRefresh)
                data.onRefresh();
        },
	});


    /* DATA: notificationViewAllHandler */
	const notificationViewAllHandler = new Entity({
		model: notificationViewAll.model,
		retriever: notificationViewAll.retriever,
        onSuccess: () => {
            if (data.onRefresh)
                data.onRefresh();
        },
	});


    /* DATA: eventConnectionResponseHandler */
	const eventConnectionResponseHandler = new Entity({
		model: eventConnectionResponse.model,
		retriever: eventConnectionResponse.retriever,
        /*
        onSuccess: () => {
            if (data.onRefresh)
                data.onRefresh();
        },
        */
	});


    let data: {
        notifications: { [key: string]: any }[],
        connections: { [key: string]: any },
        onRefresh: any,
    } = {
        notifications: [],
        connections: {},
        onRefresh: null,
    };


    /* update */
    export function update(p: any) {
        if (p.notifications)
            data = Object.assign(data, p);
    }


    /* view */
    function view(t) {
        collector.get([
            [ 
                notificationViewHandler,
                {
                    timeNotify: t,
                }
            ],
        ]);
    }


    /* viewAll */
    function viewAll() {
        collector.get([
            [ 
                notificationViewAllHandler,
                {}
            ],
        ]);
    }


    /* sendResponse */
    function sendResponse(t, eventId, userId, resp) {
        collector.get([
            [ 
                eventConnectionResponseHandler,
                {
                    timeNotify: t,
                    eventId: eventId,
                    userId: userId,
                    resp: resp,
                }
            ],
        ]);
    }


    /* toFeedDate */
    export function toFeedDate(n: number) {
        const monthes = {
            'MS': [
                'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
            ],
        };
        const d = new Date(n);
        return d.getDate().toString() + ' ' + monthes['MS'][d.getMonth()] + ' ' + d.getFullYear().toString() + ' г. ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    }
</script>


<div class="w-full h-full flex flex-col">
    <div class="w-full flex justify-between items-center shrink-0 grow-0 py-4 px-2 border-b border-base-200">
        <button
            class="btn btn-sm bg-base-300 flex shrink-0 grow-0"
            on:click="{() => {
                viewAll();
            }}"
        >
            <span>Прочитать все</span>
        </button>
        <button
            class="w-7 h-7 text-base-300"
            on:click="{() => {
                logHide();
            }}"
        >
            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2zm4.3 14.3a.996.996 0 0 1-1.41 0L12 13.41L9.11 16.3a.996.996 0 1 1-1.41-1.41L10.59 12L7.7 9.11A.996.996 0 1 1 9.11 7.7L12 10.59l2.89-2.89a.996.996 0 1 1 1.41 1.41L13.41 12l2.89 2.89c.38.38.38 1.02 0 1.41z" fill="currentColor"></path></svg>
        </button>
    </div>
    <div class="w-full h-full shrink-1 grow-1 pb-3 scrollable-y">
        {#each data.notifications as n (n.time_notify_key)}
            <div
                class="w-full px-3 mt-3"
            >



                {#if n.event == 'connection_add'}
                    <div class="rounded-2xl w-full overflow-hidden p-3 bg-base-200">
                        <div
                            class="text-xs w-full mb-1"
                            class:opacity-50="{n.time_view}"
                        >{toFeedDate(n.time_notify)}</div>
                        <div class="w-full flex items-start">
                            <button
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/residents/' + n.data.initiator.id.toString());
                                    logHide();
                                }}"
                                class="w-8 h-8 shrink-0 grow-0 mt-0.5 mr-2.5"
                                class:opacity-50="{n.time_view}"
                            >
                                <Avatar
                                    user="{{
                                        id: n.data.initiator.id,
                                        name: n.data.initiator.name,
                                        avatar_hash: n.data.initiator.hash,
                                        roles: [ 'client' ],
                                        telegram: '',
                                    }}"
                                />
                                </button>
                            <div
                                class="text-sm w-full shrink-1 grow-1"
                                class:opacity-50="{n.time_view}"
                            ><button
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/residents/' + n.data.initiator.id.toString());
                                    logHide();
                                }}"
                                class="font-semibold text-moderate"
                            >{nameNormalization(n.data.initiator.name, 2)}</button> предложил Вам личную встречу на мероприятии <span class="font-semibold text-moderate">{toDateText(n.data.event.time_event).split(/\s+/)[0]} {toDateText(n.data.event.time_event).split(/\s+/)[1]}</span></div>
                        </div>
                        <!--
                        <div class="flex justify-between mt-2">
                            <button
                                class="btn btn-sm bg-base-300 flex shrink-0 grow-0"
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/residents/' + n.data.initiator.id.toString());
                                    logHide();
                                }}"
                            >
                                <span class:opacity-50="{n.time_view}">В профиль</span>
                                <svg class="w-4 h-4" class:opacity-50="{n.time_view}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M16 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7z" fill="currentColor"></path><path d="M26 30h-2v-5a5 5 0 0 0-5-5h-6a5 5 0 0 0-5 5v5H6v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7z" fill="currentColor"></path></svg>
                            </button>
                            <button
                                class="btn btn-sm bg-base-300 flex shrink-0 grow-0"
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/events/' + n.data.event.id.toString());
                                    logHide();
                                }}"
                            >
                                <span class:opacity-50="{n.time_view}">К событию</span>
                                <svg class="w-4 h-4" class:opacity-50="{n.time_view}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M26 4h-4V2h-2v2h-8V2h-2v2H6c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 22H6V12h20v14zm0-16H6V6h4v2h2V6h8v2h2V6h4v4z" fill="currentColor"></path></svg>
                            </button>
                        </div>
                        -->
                        {#if
                            !data.connections[n.data.event.id.toString()] ||
                            !data.connections[n.data.event.id.toString()][n.data.initiator.id.toString()] ||
                            data.connections[n.data.event.id.toString()][n.data.initiator.id.toString()]['response'] === null
                        }
                            <div class="flex justify-between items-center mt-2">
                                <button
                                    class="btn btn-sm btn-success flex shrink-0 grow-0"
                                    on:click="{() => {
                                        sendResponse(n.time_notify_key, n.data.event.id, n.data.initiator.id, true);
                                    }}"
                                >
                                    <span class:opacity-50="{n.time_view}">Согласиться</span>
                                </button>
                                <button
                                    class="btn btn-sm btn-error flex shrink-0 grow-0"
                                    on:click="{() => {
                                        sendResponse(n.time_notify_key, n.data.event.id, n.data.initiator.id, false);
                                    }}"
                                >
                                    <span class:opacity-50="{n.time_view}">Отклонить</span>
                                </button>
                            </div>
                        {:else}
                            <div class="flex justify-between items-center mt-2">
                                {#if data.connections[n.data.event.id.toString()][n.data.initiator.id.toString()]['response']}
                                    <div class="text-success font-semibold text-sm">Вы согласились</div>
                                {:else}
                                    <div class="text-error font-semibold text-sm">Вы отказались</div>
                                {/if}
                                <button
                                    class="btn btn-sm bg-base-300 flex shrink-0 grow-0"
                                    on:click="{() => {
                                        sendResponse(n.time_notify_key, n.data.event.id, n.data.initiator.id, null);
                                    }}"
                                >
                                    <span>Передумать</span>
                                </button>
                            </div>
                        {/if}
                    </div>


                {:else if n.event == 'connection_response'}
                    <div class="rounded-2xl w-full overflow-hidden p-3 bg-base-200">
                        <div
                            class="text-xs w-full mb-1"
                            class:opacity-50="{n.time_view}"
                        >{toFeedDate(n.time_notify)}</div>
                        <div class="w-full flex items-start">
                            <button
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/residents/' + n.data.initiator.id.toString());
                                    logHide();
                                }}"
                                class="w-8 h-8 shrink-0 grow-0 mt-0.5 mr-2.5"
                                class:opacity-50="{n.time_view}"
                            >
                                <Avatar
                                    user="{{
                                        id: n.data.initiator.id,
                                        name: n.data.initiator.name,
                                        avatar_hash: n.data.initiator.hash,
                                        roles: [ 'client' ],
                                        telegram: '',
                                    }}"
                                />
                                </button>
                            <div
                                class="text-sm w-full shrink-1 grow-1"
                                class:opacity-50="{n.time_view}"
                            ><button
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/residents/' + n.data.initiator.id.toString());
                                    logHide();
                                }}"
                                class="font-semibold text-moderate"
                            >{nameNormalization(n.data.initiator.name, 2)}</button> {#if n.data.response}согласился с Вашим предложением{:else}отказался от Вашего предложения{/if} о личной встрече на мероприятии <span class="font-semibold text-moderate">{toDateText(n.data.event.time_event).split(/\s+/)[0]} {toDateText(n.data.event.time_event).split(/\s+/)[1]}</span></div>
                        </div>
                        <div class="flex justify-between mt-2">
                            <button
                                class="btn btn-sm bg-base-300 flex shrink-0 grow-0"
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/residents/' + n.data.initiator.id.toString());
                                    logHide();
                                }}"
                            >
                                <span class:opacity-50="{n.time_view}">В профиль</span>
                                <svg class="w-4 h-4" class:opacity-50="{n.time_view}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M16 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7z" fill="currentColor"></path><path d="M26 30h-2v-5a5 5 0 0 0-5-5h-6a5 5 0 0 0-5 5v5H6v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7z" fill="currentColor"></path></svg>
                            </button>
                            <button
                                class="btn btn-sm bg-base-300 flex shrink-0 grow-0"
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/events/' + n.data.event.id.toString());
                                    logHide();
                                }}"
                            >
                                <span class:opacity-50="{n.time_view}">К событию</span>
                                <svg class="w-4 h-4" class:opacity-50="{n.time_view}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M26 4h-4V2h-2v2h-8V2h-2v2H6c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 22H6V12h20v14zm0-16H6V6h4v2h2V6h8v2h2V6h4v4z" fill="currentColor"></path></svg>
                            </button>
                        </div>
                    </div>



                {:else if n.event == 'online_response'}
                    <div class="rounded-2xl w-full overflow-hidden p-3 bg-base-200">
                        <div
                            class="text-xs w-full mb-1"
                            class:opacity-50="{n.time_view}"
                        >{toFeedDate(n.time_notify)}</div>
                        <div class="w-full flex items-start">
                            <button
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/residents/' + n.data.initiator.id.toString());
                                    logHide();
                                }}"
                                class="w-8 h-8 shrink-0 grow-0 mt-0.5 mr-2.5"
                                class:opacity-50="{n.time_view}"
                            >
                                <Avatar
                                    user="{{
                                        id: n.data.initiator.id,
                                        name: n.data.initiator.name,
                                        avatar_hash: n.data.initiator.hash,
                                        roles: [ 'client' ],
                                        telegram: '',
                                    }}"
                                />
                                </button>
                            <div
                                class="text-sm w-full shrink-1 grow-1"
                                class:opacity-50="{n.time_view}"
                            ><button
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/residents/' + n.data.initiator.id.toString());
                                    logHide();
                                }}"
                                class="font-semibold text-moderate"
                            >{nameNormalization(n.data.initiator.name, 2)}</button> {#if n.data.response}согласился с Вашим предложением{:else}отказался от Вашего предложения{/if} провести онлайн-встречу</div>
                        </div>
                        <div class="flex justify-between mt-2">
                            <button
                                class="btn btn-sm bg-base-300 flex shrink-0 grow-0"
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/residents/' + n.data.initiator.id.toString());
                                    logHide();
                                }}"
                            >
                                <span class:opacity-50="{n.time_view}">В профиль</span>
                                <svg class="w-4 h-4" class:opacity-50="{n.time_view}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M16 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7z" fill="currentColor"></path><path d="M26 30h-2v-5a5 5 0 0 0-5-5h-6a5 5 0 0 0-5 5v5H6v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7z" fill="currentColor"></path></svg>
                            </button>
                        </div>
                    </div>
                
                
                
                {:else if n.event == 'online_confirmation'}
                    <div class="rounded-2xl w-full overflow-hidden p-3 bg-base-200">
                        <div
                            class="text-xs w-full mb-1"
                            class:opacity-50="{n.time_view}"
                        >{toFeedDate(n.time_notify)}</div>
                        <div class="w-full flex items-start">
                            <button
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/residents/' + n.data.initiator.id.toString());
                                    logHide();
                                }}"
                                class="w-8 h-8 shrink-0 grow-0 mt-0.5 mr-2.5"
                                class:opacity-50="{n.time_view}"
                            >
                                <Avatar
                                    user="{{
                                        id: n.data.initiator.id,
                                        name: n.data.initiator.name,
                                        avatar_hash: n.data.initiator.hash,
                                        roles: [ 'client' ],
                                        telegram: '',
                                    }}"
                                />
                                </button>
                            <div
                                class="text-sm w-full shrink-1 grow-1"
                                class:opacity-50="{n.time_view}"
                            ><button
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/residents/' + n.data.initiator.id.toString());
                                    logHide();
                                }}"
                                class="font-semibold text-moderate"
                            >{nameNormalization(n.data.initiator.name, 2)}</button> принял Ваше предложение провести онлайн-встречу</div>
                        </div>
                        <div class="flex justify-between mt-2">
                            <button
                                class="btn btn-sm bg-base-300 flex shrink-0 grow-0"
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/residents/' + n.data.initiator.id.toString());
                                    logHide();
                                }}"
                            >
                                <span class:opacity-50="{n.time_view}">В профиль</span>
                                <svg class="w-4 h-4" class:opacity-50="{n.time_view}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M16 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7z" fill="currentColor"></path><path d="M26 30h-2v-5a5 5 0 0 0-5-5h-6a5 5 0 0 0-5 5v5H6v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7z" fill="currentColor"></path></svg>
                            </button>
                            <button
                                class="btn btn-sm bg-base-300 flex shrink-0 grow-0"
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/meetings/');
                                    logHide();
                                }}"
                            >
                                <span class:opacity-50="{n.time_view}">Ко встречам</span>
                                <svg class="w-4 h-4" class:opacity-50="{n.time_view}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M26 4h-4V2h-2v2h-8V2h-2v2H6c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 22H6V12h20v14zm0-16H6V6h4v2h2V6h8v2h2V6h4v4z" fill="currentColor"></path></svg>
                            </button>
                        </div>
                    </div>



                {:else if n.event == 'online_request'}
                    <div class="rounded-2xl w-full overflow-hidden p-3 bg-base-200">
                        <div
                            class="text-xs w-full mb-1"
                            class:opacity-50="{n.time_view}"
                        >{toFeedDate(n.time_notify)}</div>
                        <div class="w-full flex items-start">
                            <button
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/residents/' + n.data.initiator.id.toString());
                                    logHide();
                                }}"
                                class="w-8 h-8 shrink-0 grow-0 mt-0.5 mr-2.5"
                                class:opacity-50="{n.time_view}"
                            >
                                <Avatar
                                    user="{{
                                        id: n.data.initiator.id,
                                        name: n.data.initiator.name,
                                        avatar_hash: n.data.initiator.hash,
                                        roles: [ 'client' ],
                                        telegram: '',
                                    }}"
                                />
                                </button>
                            <div
                                class="text-sm w-full shrink-1 grow-1"
                                class:opacity-50="{n.time_view}"
                            ><button
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/residents/' + n.data.initiator.id.toString());
                                    logHide();
                                }}"
                                class="font-semibold text-moderate"
                            >{nameNormalization(n.data.initiator.name, 2)}</button> предложил провести онлайн-встречу</div>
                        </div>
                        <div class="flex justify-between mt-2">
                            <button
                                class="btn btn-sm bg-base-300 flex shrink-0 grow-0"
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/residents/' + n.data.initiator.id.toString());
                                    logHide();
                                }}"
                            >
                                <span class:opacity-50="{n.time_view}">В профиль</span>
                                <svg class="w-4 h-4" class:opacity-50="{n.time_view}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M16 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7z" fill="currentColor"></path><path d="M26 30h-2v-5a5 5 0 0 0-5-5h-6a5 5 0 0 0-5 5v5H6v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7z" fill="currentColor"></path></svg>
                            </button>
                            <button
                                class="btn btn-sm bg-base-300 flex shrink-0 grow-0"
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/meetings/');
                                    logHide();
                                }}"
                            >
                                <span class:opacity-50="{n.time_view}">Ко встречам</span>
                                <svg class="w-4 h-4" class:opacity-50="{n.time_view}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M26 4h-4V2h-2v2h-8V2h-2v2H6c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 22H6V12h20v14zm0-16H6V6h4v2h2V6h8v2h2V6h4v4z" fill="currentColor"></path></svg>
                            </button>
                        </div>
                    </div>

            

                {:else if n.event == 'online_manager_confirmation'}
                    <div class="rounded-2xl w-full overflow-hidden p-3 bg-base-200">
                        <div
                            class="text-xs w-full mb-1"
                            class:opacity-50="{n.time_view}"
                        >{toFeedDate(n.time_notify)}</div>
                        <div class="w-full flex items-start">
                            <button
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/residents/' + n.data.recepient.id.toString());
                                    logHide();
                                }}"
                                class="w-8 h-8 shrink-0 grow-0 mt-0.5 mr-2.5"
                                class:opacity-50="{n.time_view}"
                            >
                                <Avatar
                                    user="{{
                                        id: n.data.recepient.id,
                                        name: n.data.recepient.name,
                                        avatar_hash: n.data.recepient.hash,
                                        roles: [ 'client' ],
                                        telegram: '',
                                    }}"
                                />
                                </button>
                            <div
                                class="text-sm w-full shrink-1 grow-1"
                                class:opacity-50="{n.time_view}"
                            ><button
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/residents/' + n.data.recepient.id.toString());
                                    logHide();
                                }}"
                                class="font-semibold text-moderate"
                            >{nameNormalization(n.data.recepient.name, 2)}, согласовано время онлайн-встречи</button></div>
                        </div>
                        <div class="flex justify-between mt-2">
                            <button
                                class="btn btn-sm bg-base-300 flex shrink-0 grow-0"
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/residents/' + n.data.recepient.id.toString());
                                    logHide();
                                }}"
                            >
                                <span class:opacity-50="{n.time_view}">В профиль</span>
                                <svg class="w-4 h-4" class:opacity-50="{n.time_view}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M16 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7z" fill="currentColor"></path><path d="M26 30h-2v-5a5 5 0 0 0-5-5h-6a5 5 0 0 0-5 5v5H6v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7z" fill="currentColor"></path></svg>
                            </button>
                            <button
                                class="btn btn-sm bg-base-300 flex shrink-0 grow-0"
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/meetings/');
                                    logHide();
                                }}"
                            >
                                <span class:opacity-50="{n.time_view}">Ко встречам</span>
                                <svg class="w-4 h-4" class:opacity-50="{n.time_view}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M26 4h-4V2h-2v2h-8V2h-2v2H6c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 22H6V12h20v14zm0-16H6V6h4v2h2V6h8v2h2V6h4v4z" fill="currentColor"></path></svg>
                            </button>
                        </div>
                    </div>

    

                {:else if n.event == 'arrive'}
                    <div class="rounded-2xl w-full overflow-hidden p-3 bg-base-200">
                        <div
                            class="text-xs w-full mb-1"
                            class:opacity-50="{n.time_view}"
                        >{toFeedDate(n.time_notify)}</div>
                        <div class="w-full flex items-start">
                            <button
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/residents/' + n.data.user.id.toString());
                                    logHide();
                                }}"
                                class="w-8 h-8 shrink-0 grow-0 mt-0.5 mr-2.5"
                                class:opacity-50="{n.time_view}"
                            >
                                <Avatar
                                    user="{{
                                        id: n.data.user.id,
                                        name: n.data.user.name,
                                        avatar_hash: n.data.user.hash,
                                        roles: [ 'client' ],
                                        telegram: '',
                                    }}"
                                />
                                </button>
                            <div
                                class="text-sm w-full shrink-1 grow-1"
                                class:opacity-50="{n.time_view}"
                            ><button
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/residents/' + n.data.user.id.toString());
                                    logHide();
                                }}"
                                class="font-semibold text-moderate"
                            >{nameNormalization(n.data.user.name, 2)}</button> прибыл на мероприятие <span class="font-semibold text-moderate">{toDateText(n.data.event.time_event).split(/\s+/)[0]} {toDateText(n.data.event.time_event).split(/\s+/)[1]}</span> (назначена встреча)</div>
                        </div>
                        <div class="flex justify-between mt-2">
                            <button
                                class="btn btn-sm bg-base-300 flex shrink-0 grow-0"
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/residents/' + n.data.user.id.toString());
                                    logHide();
                                }}"
                            >
                                <span>В профиль</span>
                                <svg class="w-4 h-4" class:opacity-50="{n.time_view}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M16 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7z" fill="currentColor"></path><path d="M26 30h-2v-5a5 5 0 0 0-5-5h-6a5 5 0 0 0-5 5v5H6v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7z" fill="currentColor"></path></svg>
                            </button>
                            <button
                                class="btn btn-sm bg-base-300 flex shrink-0 grow-0"
                                on:click="{() => {
                                    view(n.time_notify_key);
                                    router.go('/events/' + n.data.event.id.toString());
                                    logHide();
                                }}"
                            >
                                <span>К событию</span>
                                <svg class="w-4 h-4" class:opacity-50="{n.time_view}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M26 4h-4V2h-2v2h-8V2h-2v2H6c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 22H6V12h20v14zm0-16H6V6h4v2h2V6h8v2h2V6h4v4z" fill="currentColor"></path></svg>
                            </button>
                        </div>
                    </div>
                {/if}



            </div>
        {/each}
    </div>
</div>
