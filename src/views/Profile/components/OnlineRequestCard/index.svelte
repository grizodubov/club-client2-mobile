<script lang="ts">
    import { type User, user } from '@/stores';

    import { router } from '@/libs/Router';

    import { Entity, collector } from '@/helpers/entity';

    import { ModalConfirmation } from '..';

    import {
        userMeetingRequestAdd,
    } from '@/queries/user';


    export let check: boolean | null;
    export let checkRequest: boolean | null;
    export let targetId: number;
    export let status: 'золотой' | 'серебряный' | 'бронзовый';


    let checkRequestControl: boolean | null = null;

    updateCheckReuquestControl(checkRequest);

    $: checkRequest, updateCheckReuquestControl(checkRequest);


    $: currentUser = $user as User;


    let confirmationShow = false;


    /* DATA: userMeetingRequestAddHandler */
	const userMeetingRequestAddHandler = new Entity({
		model: userMeetingRequestAdd.model,
		retriever: userMeetingRequestAdd.retriever,
        onSuccess: () => {
            checkRequestControl = !checkRequestControl;
        },
	});

    let loadingUpdate = userMeetingRequestAddHandler.loading;


    function updateCheckReuquestControl(r) {
        checkRequestControl = r;
    }
    

    /* update */
    function update() {
        collector.get([
            [ 
                userMeetingRequestAddHandler,
                {
                    targetId: targetId,
                    active: !checkRequest,
                }
            ],
        ]);
    }
</script>


<div
    class="w-full mt-2 mb-4"
>
    <div class="relative rounded-2xl w-full p-3 overflow-hidden">
        <div class="absolute w-full h-full top-0 left-0 bg-success brightness-75 opacity-15"></div>
        <div class="relative w-full">
            <div class="flex justify-between items-start">
                <div class="relative w-[66px] h-[66px] rounded-box flex flex-col items-center justify-center shrink-0 grow-0">
                    <div class="absolute w-[66px] h-[66px] rounded-box bg-success brightness-75 top-0 left-0"></div>
                    <svg class="relative w-9 h-9 text-base-100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16"><g fill="none"><path d="M10 7a2 2 0 1 1-4 0a2 2 0 0 1 4 0zM1 4.75C1 3.784 1.784 3 2.75 3h10.5c.966 0 1.75.784 1.75 1.75v6.5A1.75 1.75 0 0 1 13.25 13H2.75A1.75 1.75 0 0 1 1 11.25v-6.5zM11 12h2.25a.75.75 0 0 0 .75-.75v-6.5a.75.75 0 0 0-.75-.75H2.75a.75.75 0 0 0-.75.75v6.5c0 .414.336.75.75.75H5v-1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1z" fill="currentColor"></path></g></svg>
                    <div class="relative text-xs font-medium mb-0.5 text-base-100">онлайн</div>
                </div>
                <div class="shrink-1 grow-1 w-full ml-3">
                    <div class="mt-1 flex items-start text-success">
                        <div class="text-xs leading-4 text-left">Онлайн-встреча</div>
                    </div>
                    {#if check}
                        <div class="flex mt-2">
                            <div class="relative flex justify-start items-center rounded-[12px] h-6 bg-base-100 bg-opacity-50 grow-0">
                                <div class="ml-1.5 w-3.5 h-3.5 rounded-full overflow-hidden bg-success"></div>
                                <div class="ml-1.5 mr-2.5 text-xs leading-6 font-medium">назначена онлайн-встреча</div>
                            </div>
                        </div>
                    {:else}
                        {#if checkRequest}
                            <div class="flex mt-2">
                                <div class="relative flex justify-start items-center rounded-[12px] h-6 bg-base-100 bg-opacity-50 grow-0">
                                    <div class="ml-1.5 w-3.5 h-3.5 rounded-full overflow-hidden bg-warning"></div>
                                    <div class="ml-1.5 mr-2.5 text-xs leading-6 font-medium">запрошена онлайн-встреча</div>
                                </div>
                            </div>
                        {:else}
                            <div class="text-sm leading-4 mt-1">Бизнес-знакомства без привязки к географии</div>
                        {/if}
                    {/if}
                </div>
            </div>
            <div class="relative mt-3 flex flex-col items-start">
                {#if $loadingUpdate || checkRequestControl != checkRequest}
                    <div class="w-full h-[32px] flex justify-center items-center">
                        <span class="loading loading-xs loading-bars text-front"></span>
                    </div>
                {:else}
                    {#if check}
                        <button
                            class="btn btn-sm btn-front text-base-100"
                            on:click="{() => {
                                router.go('/meetings');
                            }}"
                        >Перейти ко встречам</button>
                    {:else}
                        {#if checkRequest}
                            <button
                                class="btn btn-sm btn-front text-base-100"
                                on:click="{() => {
                                    confirmationShow = true;
                                }}"
                            >Отменить запрос</button>
                        {:else}
                            <button
                                class="btn btn-sm btn-front text-base-100"
                                on:click="{() => {
                                    confirmationShow = true;
                                }}"
                            >Запросить онлайн-встречу</button>
                        {/if}
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
        {#if checkRequest}
            <div class="w-7 h-7 text-error mt-2.5">
                <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12L17 15.59z" fill="currentColor"></path></svg>
            </div>
            <div class="text-center text-sm px-3">Отменить запрос на онлайн-встречу?</div>
            <button
                class="btn btn-sm btn-front text-base-100 flex shrink-0 grow-0 mb-2.5"
                on:click="{() => {
                    update();
                    confirmationShow = false;
                }}"
            >Отменить</button>
        {:else}
            <!--{#if currentUser.status != status && (currentUser.status == 'бронзовый' || (currentUser.status == 'серебряный' && status == 'золотой'))}-->
            {#if currentUser.status != status && currentUser.status == 'бронзовый'}
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
                <div class="text-center text-sm px-3">Отправить запрос на онлайн-встречу?</div>
                <button
                    class="btn btn-sm btn-front text-base-100 flex shrink-0 grow-0 mb-2.5"
                    on:click="{() => {
                        update();
                        confirmationShow = false;
                    }}"
                >Подтвердить</button>
            {/if}
        {/if}
    </div>
</ModalConfirmation>
