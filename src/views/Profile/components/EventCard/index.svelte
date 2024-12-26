<script lang="ts">
    import { EVENTS } from '@/config/events.cfg';
    import { type Event } from './types';

    import { toDateText } from '@/utils/dates';

    import { type User, user } from '@/stores';

    import { Entity, collector } from '@/helpers/entity';

    import { ModalConfirmation } from './..';

    import {
        eventConnection,
        eventConnectionResponse,
    } from '@/queries/event';


    export let event: Event;
    export let targetId: number;
    export let status: 'золотой' | 'серебряный' | 'бронзовый';


    $: currentUser = $user as User;

    $: currentFormat = EVENTS.find(f => f.format == event.format);

    $: currentDate = toDateText(event.time_event).split(/\s+/);


    let confirmationShow = false;


    /* DATA: eventConnectionHandler */
	const eventConnectionHandler = new Entity({
		model: eventConnection.model,
		retriever: eventConnection.retriever,
	});

    let eventConnectionLoading = eventConnectionHandler.loading;
    
    
    /* DATA: eventConnectionResponseHandler */
	const eventConnectionResponseHandler = new Entity({
		model: eventConnectionResponse.model,
		retriever: eventConnectionResponse.retriever,
	});

    let eventConnectionResponseLoading = eventConnectionResponseHandler.loading;


    /* connect */
    function connect(eventId) {
        collector.get([
            [ 
                eventConnectionHandler,
                {
                    eventId: eventId,
                    userId: targetId,
                }
            ],
        ]);
    }


    /* sendResponse */
    function sendResponse(eventId, userId, resp) {
        collector.get([
            [ 
                eventConnectionResponseHandler,
                {
                    timeNotify: null,
                    eventId: eventId,
                    userId: userId,
                    resp: resp,
                }
            ],
        ]);
    }
</script>


<div
    class="w-full mt-2 first:mt-0"
>
    <div class="relative rounded-2xl w-full p-3 overflow-hidden">
        <div class="absolute w-full h-full top-0 left-0 bg-{currentFormat?.color} opacity-15"></div>
        <div class="relativet w-full">
            <div class="flex justify-between items-start">
                <div class="relative w-[66px] h-[66px] rounded-box flex flex-col items-center justify-center shrink-0 grow-0">
                    <div class="absolute w-[66px] h-[66px] rounded-box bg-{currentFormat?.color} top-0 left-0"></div>
                    <div class="relative text-2xl leading-7 font-bold text-base-100">{currentDate[0]}</div>
                    <div class="relative text-xs font-medium mb-0.5 text-base-100">{currentDate[1]}</div>
                </div>
                <div class="shrink-1 grow-1 ml-3">
                    <div class="mt-1 flex items-start text-{currentFormat?.color}">
                        <div class="w-4 h-4 shrink-0 grow-0">{@html currentFormat?.icon}</div>
                        <div class="text-xs leading-4 ml-1.5 text-left">{currentFormat?.name}</div>
                    </div>
                    <div class="text-sm font-semibold mt-1 leading-[18px] w-full text-left">{event.name}</div>
                    {#if event.user.confirmation}
                        <div class="flex mt-2">
                            <div class="relative flex justify-start items-center rounded-[12px] h-6 bg-base-100 bg-opacity-50 grow-0">
                                {#if event.user.confirmation.audit == 2}
                                    <div class="ml-1.5 w-3.5 h-3.5 rounded-full overflow-hidden bg-success"></div>
                                    <div class="ml-1.5 mr-2.5 text-xs leading-6 font-medium">пришёл</div>
                                {:else if event.user.confirmation.audit == 0}
                                    <div class="ml-1.5 w-3.5 h-3.5 rounded-full overflow-hidden bg-error"></div>
                                    <div class="ml-1.5 mr-2.5 text-xs leading-6 font-medium">не придёт</div>
                                {:else}
                                    <div class="ml-1.5 w-3.5 h-3.5 rounded-full overflow-hidden bg-warning"></div>
                                    <div class="ml-1.5 mr-2.5 text-xs leading-6 font-medium">планирует прийти</div>
                                {/if}
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
            <div class="relative mt-3 flex flex-col items-start">
                {#if event.user.connection}
                    {#if event.user.connection.response === null}
                        {#if event.user.connection.creator_id == currentUser.id}
                            <div class="flex items-center">
                                <svg class="w-5 h-5 mr-2 text-info" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 352 512"><path d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78c16.52 18.85 42.36 58.23 52.21 91.45c.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78c9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176C352 78.61 272.91-.3 175.45 0C73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80c0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112c8.84 0 16 7.16 16 16s-7.16 16-16 16z" fill="currentColor"></path></svg>
                                <span class="leading-8 text-sm font-semibold">Вы предложили встречу</span>
                            </div>
                        {:else}
                            <div class="flex items-center">
                                <svg class="w-5 h-5 mr-2 text-info" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 352 512"><path d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78c16.52 18.85 42.36 58.23 52.21 91.45c.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78c9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176C352 78.61 272.91-.3 175.45 0C73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80c0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112c8.84 0 16 7.16 16 16s-7.16 16-16 16z" fill="currentColor"></path></svg>
                                <span class="leading-8 text-sm font-semibold">Предложил встречу</span>
                            </div>
                        {/if}
                    {:else if event.user.connection.response}
                        {#if event.user.connection.creator_id == currentUser.id}
                            <div class="flex items-center">
                                <svg class="w-5 h-5 mr-2 text-success" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 352 512"><path d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78c16.52 18.85 42.36 58.23 52.21 91.45c.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78c9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176C352 78.61 272.91-.3 175.45 0C73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80c0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112c8.84 0 16 7.16 16 16s-7.16 16-16 16z" fill="currentColor"></path></svg>
                                <span class="leading-8 text-sm font-semibold">Согласился на встречу</span>
                            </div>
                        {:else}
                            <div class="flex items-center">
                                <svg class="w-5 h-5 mr-2 text-success" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 352 512"><path d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78c16.52 18.85 42.36 58.23 52.21 91.45c.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78c9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176C352 78.61 272.91-.3 175.45 0C73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80c0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112c8.84 0 16 7.16 16 16s-7.16 16-16 16z" fill="currentColor"></path></svg>
                                <span class="leading-8 text-sm font-semibold">Вы согласились провести встречу</span>
                            </div>
                        {/if}
                    {:else}
                        {#if event.user.connection.creator_id == currentUser.id}
                            <div class="flex items-center">
                                <svg class="w-5 h-5 mr-2 text-error" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 352 512"><path d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78c16.52 18.85 42.36 58.23 52.21 91.45c.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78c9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176C352 78.61 272.91-.3 175.45 0C73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80c0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112c8.84 0 16 7.16 16 16s-7.16 16-16 16z" fill="currentColor"></path></svg>
                                <span class="leading-8 text-sm font-semibold">Отказался от встречи</span>
                            </div>
                        {:else}
                            <div class="flex items-center">
                                <svg class="w-5 h-5 mr-2 text-error" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 352 512"><path d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78c16.52 18.85 42.36 58.23 52.21 91.45c.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78c9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176C352 78.61 272.91-.3 175.45 0C73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80c0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112c8.84 0 16 7.16 16 16s-7.16 16-16 16z" fill="currentColor"></path></svg>
                                <span class="leading-8 text-sm font-semibold">Вы отказались от встречи</span>
                            </div>
                        {/if}
                    {/if}
                    {#if event.user.connection.creator_id != currentUser.id}
                        {#if $eventConnectionResponseLoading}
                            <div class="w-full h-[32px] flex justify-center items-center mt-3">
                                <span class="loading loading-xs loading-bars text-front"></span>
                            </div>
                        {:else}
                            {#if event.user.connection.response === null}
                                <div class="flex justify-between w-full mt-3">
                                    <button
                                        class="btn btn-sm btn-success flex shrink-0 grow-0"
                                        on:click="{() => {
                                            sendResponse(event.id, targetId, true);
                                        }}"
                                    >Согласиться</button>
                                    <button
                                        class="btn btn-sm btn-error flex shrink-0 grow-0"
                                        on:click="{() => {
                                            sendResponse(event.id, targetId, false);
                                        }}"
                                    >Отклонить</button>
                                </div>
                            {:else}
                                <div class="flex mt-3">
                                    <button
                                        class="btn btn-sm btn-front text-base-100 flex shrink-0 grow-0"
                                        on:click="{() => {
                                            sendResponse(event.id, targetId, null);
                                        }}"
                                    >Передумать</button>
                                </div>
                            {/if}
                        {/if}
                    {/if}
                {:else}
                    {#if $eventConnectionLoading}
                        <div class="w-full h-[32px] flex justify-center items-center">
                            <span class="loading loading-xs loading-bars text-front"></span>
                        </div>
                    {:else}
                        <button
                            class="btn btn-sm btn-front text-base-100"
                            on:click="{() => {
                                confirmationShow = true;
                            }}"
                        >{#if event.user.confirmation}Назначить встречу{:else}Пригласить и назначить встречу{/if}</button>
                    {/if}
                {/if}
            </div>
        </div>
    </div>
</div>

<ModalConfirmation
    bind:open="{confirmationShow}"
>
    <div class="flex flex-col w-full h-full justify-between items-center">
        {#if currentUser.status != status && (currentUser.status == 'бронзовый' || (currentUser.status == 'серебряный' && status == 'золотой'))}
            <div class="w-7 h-7 text-error mt-2.5">
                <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16"><g fill="none"><path d="M9.626 5.07a5.493 5.493 0 0 0-3.299 1.847A2.751 2.751 0 1 1 9.626 5.07zM5.6 8c-.384.75-.6 1.6-.6 2.5c0 1.31.458 2.512 1.222 3.457C3.555 13.653 2 11.803 2 10v-.5A1.5 1.5 0 0 1 3.5 8h2.1zm4.275.5a.625.625 0 1 1 1.25 0a.625.625 0 0 1-1.25 0zm1.125 4a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 1 0v2zm-5-2a4.5 4.5 0 1 1 9 0a4.5 4.5 0 0 1-9 0zm1 0a3.5 3.5 0 1 0 7 0a3.5 3.5 0 0 0-7 0z" fill="currentColor"></path></g></svg>
            </div>
            <div class="text-center text-sm px-3">
                {#if currentUser.status == 'бронзовый'}
                    Чтобы договориться о встрече с обладателем серебряного или золотого статуса Клуба, обратитесь к вашему комьюнити-менеджеру
                {:else}
                    Чтобы договориться о встрече с обладателем золотого статуса Клуба, обратитесь к вашему комьюнити-менеджеру
                {/if}
            </div>
            <button
                class="btn btn-sm btn-warning text-base-100 flex shrink-0 grow-0 mb-2.5"
                on:click="{() => {
                    confirmationShow = false;
                }}"
            >Закрыть</button>
        {:else}
            <div class="w-7 h-7 text-success mt-2.5">
                <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M14.755 15a2.249 2.249 0 0 1 2.248 2.249v.918a2.75 2.75 0 0 1-.512 1.6C14.945 21.93 12.42 23 9 23c-3.422 0-5.945-1.072-7.487-3.236a2.75 2.75 0 0 1-.51-1.596v-.92A2.249 2.249 0 0 1 3.253 15h11.502zm4.3-13.596a.75.75 0 0 1 1.023.279A12.694 12.694 0 0 1 21.75 8c0 2.254-.586 4.424-1.683 6.336a.75.75 0 1 1-1.301-.746A11.194 11.194 0 0 0 20.25 8c0-1.983-.513-3.89-1.475-5.573a.75.75 0 0 1 .28-1.023zM9 3.004a5 5 0 1 1 0 10a5 5 0 0 1 0-10zm6.589.396a.75.75 0 0 1 1.023.28A8.713 8.713 0 0 1 17.75 8c0 1.538-.398 3.02-1.143 4.328a.75.75 0 1 1-1.304-.743A7.213 7.213 0 0 0 16.25 8a7.213 7.213 0 0 0-.942-3.578a.75.75 0 0 1 .28-1.022z" fill="currentColor"></path></g></svg>
            </div>
            <div class="text-center text-sm px-3">{#if event.user.confirmation}Назначить встречу?{:else}Пригласить и назначить встречу?{/if}</div>
            <button
                class="btn btn-sm btn-front text-base-100 flex shrink-0 grow-0 mb-2.5"
                on:click="{() => {
                    connect(event.id);
                    confirmationShow = false;
                }}"
            >Подтвердить</button>
        {/if}
    </div>
</ModalConfirmation>
