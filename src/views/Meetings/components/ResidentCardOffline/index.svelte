<script lang="ts">
    import { Avatar } from '@/components';

    import { router } from '@/libs/Router';

    import { nameNormalization } from '@/utils/names';

    import { ModalConfirmation } from './..';

    import { Entity, collector } from '@/helpers/entity';

    import {
        offlineConnectionResponse,
        offlineConnectionMark,
    } from '@/queries/event';

    import { type User, user } from '@/stores';


    $: currentUser = $user as User;


    export let resident: { [key: string]: any };
    export let connection: { [key: string]: any };
    export let archive: boolean;


    $: position = resident.position ? resident.position.toUpperCase() : '';

    $: company = resident.company ? resident.company.toUpperCase() : '';

    $: catalog = resident.catalog ? resident.catalog.split(/\s*,\s*/).filter(c => c).join(', ').toUpperCase() : '';

    $: mark = connection.user_1_id == currentUser.id ? connection.user_rating_1 : connection.user_rating_2;

    $: response = connection.user_1_id == currentUser.id ? connection.response_1 : connection.response_2;

    $: responsePartner = connection.user_1_id == currentUser.id ? connection.response_2 : connection.response_1;


    let confirmationShow = false;
    let confirmationMark: number = 0;
    let confirmationText: string[] = [];
    

    /* DATA: offlineConnectionResponseHandler */
	const offlineConnectionResponseHandler = new Entity({
		model: offlineConnectionResponse.model,
		retriever: offlineConnectionResponse.retriever,
	});

    let offlineConnectionResponseLoading = offlineConnectionResponseHandler.loading;


    /* DATA: eventConnectionMarkHandler */
	const offlineConnectionMarkHandler = new Entity({
		model: offlineConnectionMark.model,
		retriever: offlineConnectionMark.retriever,
	});

    let offlineConnectionMarkLoading = offlineConnectionMarkHandler.loading;


    /* sendResponse */
    function sendResponse(connectionId, resp) {
        collector.get([
            [ 
                offlineConnectionResponseHandler,
                {
                    connectionId: connectionId,
                    resp: resp,
                }
            ],
        ]);
    }


    /* sendMark */
    function sendMark(connectionId, mark, comment) {
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
        if (connection.user_1_id == currentUser.id)
            connection.user_rating_1 = mark;
        if (connection.user_2_id == currentUser.id)
            connection.user_rating_2 = mark;
    }
</script>


<div
    class="relative rounded-2xl p-3 bg-base-100"
>
    <div class="flex items-start justify-start">
        <div class="flex flex-col items-center">
            <button
                class="w-[54px] h-[54px] shrink-0 grow-0 relative"        
                on:click="{() => { router.go('/residents/' + resident.id.toString()); }}"
            >
                <Avatar
                    user="{{
                        id: resident.id,
                        name: resident.name,
                        avatar_hash: resident.avatar_hash,
                        roles: [ 'client' ],
                        telegram: '',
                    }}"
                    scaleLetters="1.1"
                />
                {#if resident.favorites_flag === true}
                    <div class="absolute top-[0px] left-[0px] w-[18px] h-[18px] text-base-100 flex items-center justify-center bg-success rounded-full">
                        <svg class="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                    </div>
                {:else if resident.favorites_flag === false}
                    <div class="absolute top-[0px] left-[0px] w-[18px] h-[18px] text-base-100 flex items-center justify-center bg-error rounded-full">
                        <svg class="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28L75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256L9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" fill="currentColor"></path></svg>
                    </div>
                {:else}
                    <div class="absolute top-[0px] left-[0px] w-[18px] h-[18px] text-base-100 flex items-center justify-center bg-warning rounded-full">
                        <svg class="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 384 512"><path d="M202.021 0C122.202 0 70.503 32.703 29.914 91.026c-7.363 10.58-5.093 25.086 5.178 32.874l43.138 32.709c10.373 7.865 25.132 6.026 33.253-4.148c25.049-31.381 43.63-49.449 82.757-49.449c30.764 0 68.816 19.799 68.816 49.631c0 22.552-18.617 34.134-48.993 51.164c-35.423 19.86-82.299 44.576-82.299 106.405V320c0 13.255 10.745 24 24 24h72.471c13.255 0 24-10.745 24-24v-5.773c0-42.86 125.268-44.645 125.268-160.627C377.504 66.256 286.902 0 202.021 0zM192 373.459c-38.196 0-69.271 31.075-69.271 69.271c0 38.195 31.075 69.27 69.271 69.27s69.271-31.075 69.271-69.271s-31.075-69.27-69.271-69.27z" fill="currentColor"></path></svg>
                    </div>
                {/if}
            </button>
            <!--
            {#if mark !== null}
                <button
                    class="w-6 h-6 mt-2"
                    on:click="{() => {
                        sendMark(connection.id, null, null);
                    }}"
                >
                    {#if mark == 2}
                        <svg class="w-6 h-6 text-success" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M10.788 3.102c.495-1.003 1.926-1.003 2.421 0l2.358 4.778l5.273.766c1.107.16 1.549 1.522.748 2.303l-3.816 3.719l.901 5.25c.19 1.104-.968 1.945-1.959 1.424l-4.716-2.48l-4.715 2.48c-.99.52-2.148-.32-1.96-1.423l.901-5.251l-3.815-3.72c-.801-.78-.359-2.141.748-2.302L8.43 7.88l2.358-4.778z" fill="currentColor"></path></g></svg>
                    {:else if mark == 1}
                        <svg class="w-6 h-6 text-warning" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M12 2.35c-.482 0-.964.25-1.212.752L8.43 7.88l-5.273.766c-1.107.16-1.55 1.522-.748 2.303l3.815 3.719l-.9 5.25c-.15.874.544 1.583 1.331 1.582c.208 0 .422-.05.63-.158l4.714-2.479l4.715 2.479c.99.52 2.148-.32 1.96-1.423l-.902-5.251l3.816-3.72c.8-.78.359-2.141-.748-2.302l-5.273-.766l-2.358-4.778a1.335 1.335 0 0 0-1.21-.752zm0 14.993V4.042l2.257 4.572a1.35 1.35 0 0 0 1.016.739l5.05.734l-3.654 3.562a1.35 1.35 0 0 0-.388 1.195l.862 5.029l-4.516-2.375a1.35 1.35 0 0 0-.627-.155z" fill="currentColor"></path></g></svg>
                    {:else if mark == 0}
                        <svg class="w-6 h-6 text-error" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M10.788 3.102c.495-1.003 1.926-1.003 2.421 0l2.358 4.778l5.273.766c1.107.16 1.549 1.522.748 2.303l-3.816 3.719l.901 5.25c.19 1.104-.968 1.945-1.959 1.424l-4.716-2.48l-4.715 2.48c-.99.52-2.148-.32-1.96-1.423l.901-5.251l-3.815-3.72c-.801-.78-.359-2.141.748-2.302L8.43 7.88l2.358-4.778zm1.21.937L9.74 8.614a1.35 1.35 0 0 1-1.016.739l-5.05.734l3.654 3.562c.318.31.463.757.388 1.195l-.862 5.029l4.516-2.375a1.35 1.35 0 0 1 1.257 0l4.516 2.375l-.862-5.03a1.35 1.35 0 0 1 .388-1.194l3.654-3.562l-5.05-.734a1.35 1.35 0 0 1-1.016-.739L11.998 4.04z" fill="currentColor"></path></g></svg>
                    {/if}
                </button>
            {/if}
            -->
        </div>
        <div class="ml-3 shrink-1 grow-1 w-full">
            <div class="flex items-center h-[24px]">
                <div class="text-left font-medium text-[16px] leading-[24px] whitespace-nowrap overflow-hidden pr-0.5">{nameNormalization(resident.name, 2)}</div>
            </div>
            {#if position}
                <div class="text-left text-[10px] opacity-80 mt-0.5">{position}</div>
            {/if}
            {#if company}
                <div class="text-left font-medium text-[10px] text-front mt-0.5">{company}</div>
            {/if}
            {#if catalog}
                <div class="text-left font-medium text-[10px] leading-[14px] text-moderate mt-0.5">{catalog}</div>
            {/if}
            {#if responsePartner !== null}
                <div class="flex mt-1.5">
                    {#if responsePartner}
                        <div class="flex justify-start items-center h-5">
                            <svg class="w-3.5 h-3.5 text-success" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 352 512"><path d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78c16.52 18.85 42.36 58.23 52.21 91.45c.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78c9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176C352 78.61 272.91-.3 175.45 0C73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80c0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112c8.84 0 16 7.16 16 16s-7.16 16-16 16z" fill="currentColor"></path></svg>
                            <span class="ml-1.5 text-xs leading-5 font-medium">Согласился</span>
                        </div>
                    {:else}
                        <div class="flex justify-start items-center h-5">
                            <svg class="w-3.5 h-3.5 text-error" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 352 512"><path d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78c16.52 18.85 42.36 58.23 52.21 91.45c.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78c9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176C352 78.61 272.91-.3 175.45 0C73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80c0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112c8.84 0 16 7.16 16 16s-7.16 16-16 16z" fill="currentColor"></path></svg>
                            <span class="ml-1.5 text-xs leading-5 font-medium">Отказался</span>
                        </div>
                    {/if}
                </div>
            {/if}
            {#if response !== null}
                <div class="flex mt-1.5">
                    {#if response}
                        <div class="flex justify-start items-center h-5">
                            <svg class="w-3.5 h-3.5 text-success" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 352 512"><path d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78c16.52 18.85 42.36 58.23 52.21 91.45c.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78c9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176C352 78.61 272.91-.3 175.45 0C73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80c0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112c8.84 0 16 7.16 16 16s-7.16 16-16 16z" fill="currentColor"></path></svg>
                            <span class="ml-1.5 text-xs leading-5 font-medium">Вы согласились</span>
                        </div>
                    {:else}
                        <div class="flex justify-start items-center h-5">
                            <svg class="w-3.5 h-3.5 text-error" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 352 512"><path d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78c16.52 18.85 42.36 58.23 52.21 91.45c.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78c9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176C352 78.61 272.91-.3 175.45 0C73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80c0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112c8.84 0 16 7.16 16 16s-7.16 16-16 16z" fill="currentColor"></path></svg>
                            <span class="ml-1.5 text-xs leading-5 font-medium">Вы отказались</span>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
    <!--
    {#if !archive && connection.creator_id != currentUser.id}
        {#if $offlineConnectionResponseLoading}
            <div class="w-full h-[32px] flex justify-center items-center mt-3">
                <span class="loading loading-xs loading-bars text-front"></span>
            </div>
        {:else}
            {#if response === null}
                <div class="flex justify-between w-full mt-3">
                    <button
                        class="btn btn-sm btn-success flex shrink-0 grow-0"
                        on:click="{() => {
                            sendResponse(connection.id, true);
                        }}"
                    >Согласиться</button>
                    <button
                        class="btn btn-sm btn-error flex shrink-0 grow-0"
                        on:click="{() => {
                            sendResponse(connection.id, false);
                        }}"
                    >Отклонить</button>
                </div>
            {:else}
                <div class="flex mt-3">
                    <button
                        class="btn btn-sm btn-front text-base-100 flex shrink-0 grow-0"
                        on:click="{() => {
                            sendResponse(connection.id, null);
                        }}"
                    >Передумать</button>
                </div>
            {/if}
        {/if}
    {/if}
    -->
    {#if archive && connection.state && mark === null}
        <div class="text-center text-sm font-semibold mt-3 leading-[18px]">Оцените встречу:</div>
        {#if $offlineConnectionMarkLoading}
            <div class="w-full h-[32px] flex justify-center items-center mt-3">
                <span class="loading loading-xs loading-bars text-front"></span>
            </div>
        {:else}
            {#if mark === null}
                <div class="flex justify-around w-full mt-3">
                    <button
                        class="btn btn-sm btn-error shrink-0 grow-0"
                        on:click="{() => {
                            confirmationShow = true;
                            confirmationText = [];
                            confirmationMark = 0;
                        }}"
                    >
                        <svg class="w-5 h-5 text-base-100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M10.788 3.102c.495-1.003 1.926-1.003 2.421 0l2.358 4.778l5.273.766c1.107.16 1.549 1.522.748 2.303l-3.816 3.719l.901 5.25c.19 1.104-.968 1.945-1.959 1.424l-4.716-2.48l-4.715 2.48c-.99.52-2.148-.32-1.96-1.423l.901-5.251l-3.815-3.72c-.801-.78-.359-2.141.748-2.302L8.43 7.88l2.358-4.778zm1.21.937L9.74 8.614a1.35 1.35 0 0 1-1.016.739l-5.05.734l3.654 3.562c.318.31.463.757.388 1.195l-.862 5.029l4.516-2.375a1.35 1.35 0 0 1 1.257 0l4.516 2.375l-.862-5.03a1.35 1.35 0 0 1 .388-1.194l3.654-3.562l-5.05-.734a1.35 1.35 0 0 1-1.016-.739L11.998 4.04z" fill="currentColor"></path></g></svg>
                    </button>
                    <button
                        class="btn btn-sm btn-warning shrink-0 grow-0"
                        on:click="{() => {
                            confirmationShow = true;
                            confirmationText = [];
                            confirmationMark = 1;
                        }}"
                    >
                        <svg class="w-5 h-5 text-base-100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M12 2.35c-.482 0-.964.25-1.212.752L8.43 7.88l-5.273.766c-1.107.16-1.55 1.522-.748 2.303l3.815 3.719l-.9 5.25c-.15.874.544 1.583 1.331 1.582c.208 0 .422-.05.63-.158l4.714-2.479l4.715 2.479c.99.52 2.148-.32 1.96-1.423l-.902-5.251l3.816-3.72c.8-.78.359-2.141-.748-2.302l-5.273-.766l-2.358-4.778a1.335 1.335 0 0 0-1.21-.752zm0 14.993V4.042l2.257 4.572a1.35 1.35 0 0 0 1.016.739l5.05.734l-3.654 3.562a1.35 1.35 0 0 0-.388 1.195l.862 5.029l-4.516-2.375a1.35 1.35 0 0 0-.627-.155z" fill="currentColor"></path></g></svg>
                    </button>
                    <button
                        class="btn btn-sm btn-success shrink-0 grow-0"
                        on:click="{() => {
                            confirmationShow = true;
                            confirmationText = [];
                            confirmationMark = 2;
                        }}"
                    >
                        <svg class="w-5 h-5 text-base-100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M10.788 3.102c.495-1.003 1.926-1.003 2.421 0l2.358 4.778l5.273.766c1.107.16 1.549 1.522.748 2.303l-3.816 3.719l.901 5.25c.19 1.104-.968 1.945-1.959 1.424l-4.716-2.48l-4.715 2.48c-.99.52-2.148-.32-1.96-1.423l.901-5.251l-3.815-3.72c-.801-.78-.359-2.141.748-2.302L8.43 7.88l2.358-4.778z" fill="currentColor"></path></g></svg>
                    </button>
                </div>
            {/if}
        {/if}
    {/if}
</div>

<ModalConfirmation
    bind:open="{confirmationShow}"
>
    <div class="flex flex-col w-full h-full justify-around items-center">
        <div
            class="w-6 h-6 mt-2"
        >
            {#if confirmationMark == 2}
                <svg class="w-6 h-6 text-success" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M10.788 3.102c.495-1.003 1.926-1.003 2.421 0l2.358 4.778l5.273.766c1.107.16 1.549 1.522.748 2.303l-3.816 3.719l.901 5.25c.19 1.104-.968 1.945-1.959 1.424l-4.716-2.48l-4.715 2.48c-.99.52-2.148-.32-1.96-1.423l.901-5.251l-3.815-3.72c-.801-.78-.359-2.141.748-2.302L8.43 7.88l2.358-4.778z" fill="currentColor"></path></g></svg>
            {:else if confirmationMark == 1}
                <svg class="w-6 h-6 text-warning" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M12 2.35c-.482 0-.964.25-1.212.752L8.43 7.88l-5.273.766c-1.107.16-1.55 1.522-.748 2.303l3.815 3.719l-.9 5.25c-.15.874.544 1.583 1.331 1.582c.208 0 .422-.05.63-.158l4.714-2.479l4.715 2.479c.99.52 2.148-.32 1.96-1.423l-.902-5.251l3.816-3.72c.8-.78.359-2.141-.748-2.302l-5.273-.766l-2.358-4.778a1.335 1.335 0 0 0-1.21-.752zm0 14.993V4.042l2.257 4.572a1.35 1.35 0 0 0 1.016.739l5.05.734l-3.654 3.562a1.35 1.35 0 0 0-.388 1.195l.862 5.029l-4.516-2.375a1.35 1.35 0 0 0-.627-.155z" fill="currentColor"></path></g></svg>
            {:else if confirmationMark == 0}
                <svg class="w-6 h-6 text-error" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M10.788 3.102c.495-1.003 1.926-1.003 2.421 0l2.358 4.778l5.273.766c1.107.16 1.549 1.522.748 2.303l-3.816 3.719l.901 5.25c.19 1.104-.968 1.945-1.959 1.424l-4.716-2.48l-4.715 2.48c-.99.52-2.148-.32-1.96-1.423l.901-5.251l-3.815-3.72c-.801-.78-.359-2.141.748-2.302L8.43 7.88l2.358-4.778zm1.21.937L9.74 8.614a1.35 1.35 0 0 1-1.016.739l-5.05.734l3.654 3.562c.318.31.463.757.388 1.195l-.862 5.029l4.516-2.375a1.35 1.35 0 0 1 1.257 0l4.516 2.375l-.862-5.03a1.35 1.35 0 0 1 .388-1.194l3.654-3.562l-5.05-.734a1.35 1.35 0 0 1-1.016-.739L11.998 4.04z" fill="currentColor"></path></g></svg>
            {/if}
        </div>
        <div class="w-full px-3">
            <div class="text-center text-sm mb-4 opacity-60">Укажите недостатки встречи, если они были:</div>
            <button
                class="flex items-start mt-3"
                on:click="{() => {
                    if (confirmationText.indexOf('всё прошло отлично') == -1) {
                        confirmationText = [ ...confirmationText, 'всё прошло отлично' ];
                    }
                    else {
                        confirmationText = confirmationText.filter(t => t != 'всё прошло отлично');
                    }
                }}"
            >
                <div
                    class="rounded-full w-6 h-6 border-2 border-success transition-all duration-200 flex items-center justify-center shrink-0 grow-0"
                    class:bg-success="{confirmationText.indexOf('всё прошло отлично') > -1}"
                >
                    <svg class="w-3 h-3 text-base-100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                </div>
                <div class="ml-3 text-left text-sm mt-[1px] font-medium">всё прошло отлично</div>
            </button>
            <button
                class="flex items-start mt-3"
                on:click="{() => {
                    if (confirmationText.indexOf('недостаточная организация и подготовка') == -1) {
                        confirmationText = [ ...confirmationText, 'недостаточная организация и подготовка' ];
                    }
                    else {
                        confirmationText = confirmationText.filter(t => t != 'недостаточная организация и подготовка');
                    }
                }}"
            >
                <div
                    class="rounded-full w-6 h-6 border-2 border-error transition-all duration-200 flex items-center justify-center shrink-0 grow-0"
                    class:bg-error="{confirmationText.indexOf('недостаточная организация и подготовка') > -1}"
                >
                    <svg class="w-3 h-3 text-base-100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                </div>
                <div class="ml-3 text-left text-sm mt-[1px] font-medium">недостаточная организация встречи</div>
            </button>
            <button
                class="flex items-start mt-3"
                on:click="{() => {
                    if (confirmationText.indexOf('нет пользы для бизнеса') == -1) {
                        confirmationText = [ ...confirmationText, 'нет пользы для бизнеса' ];
                    }
                    else {
                        confirmationText = confirmationText.filter(t => t != 'нет пользы для бизнеса');
                    }
                }}"
            >
                <div
                    class="rounded-full w-6 h-6 border-2 border-error transition-all duration-200 flex items-center justify-center shrink-0 grow-0"
                    class:bg-error="{confirmationText.indexOf('нет пользы для бизнеса') > -1}"
                >
                    <svg class="w-3 h-3 text-base-100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                </div>
                <div class="ml-3 text-left text-sm mt-[1px] font-medium">нет пользы для бизнеса</div>
            </button>
            <button
                class="flex items-start mt-3"
                on:click="{() => {
                    if (confirmationText.indexOf('некомфортный личный контакт') == -1) {
                        confirmationText = [ ...confirmationText, 'некомфортный личный контакт' ];
                    }
                    else {
                        confirmationText = confirmationText.filter(t => t != 'некомфортный личный контакт');
                    }
                }}"
            >
                <div
                    class="rounded-full w-6 h-6 border-2 border-error transition-all duration-200 flex items-center justify-center shrink-0 grow-0"
                    class:bg-error="{confirmationText.indexOf('некомфортный личный контакт') > -1}"
                >
                    <svg class="w-3 h-3 text-base-100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                </div>
                <div class="ml-3 text-left text-sm mt-[1px] font-medium">некомфортный личный контакт</div>
            </button>
        </div>
        <div class="flex my-2">
            <button
                class="btn btn-sm btn-front text-base-100 flex shrink-0 grow-0"
                on:click="{() => {
                    sendMark(connection.id, confirmationMark, confirmationText);
                    confirmationShow = false;
                }}"
            >Отправить оценку</button>
        </div>
    </div>
</ModalConfirmation>
