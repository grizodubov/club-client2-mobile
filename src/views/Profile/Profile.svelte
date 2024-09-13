<script lang="ts">
   import { onMount } from 'svelte';

   import { Avatar, Tag } from '@/components';

   import { type User, user, states } from '@/stores';

   import { type WordForms, nwfi } from '@/utils/numword';

   import { findTags } from '@/utils/tags';

   import { nameNormalization } from '@/utils/names';

   import { subscribe } from '@/helpers/notification';

    import { Entity, collector } from '@/helpers/entity';
    import {
        residentInfo,
    } from '@/queries/user';

    import {
		userContactAdd,
        userContactDel,
        userProfileView,
        userFavoritesSet,
	} from '@/queries/user';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;


    $: currentUser = $user as User;

    $: currentStates = $states as any;


    const wordForms: WordForms = {
        'год': [ 'лет', 'год', 'года', 'лет' ],
    };


    let resident: any;

    let suggestions: any = {};

    let contact: any;

    let start = true;

    let flagView = false;


    /* DATA: residentInfoHandler */
	const residentInfoHandler = new Entity({
		model: residentInfo.model,
		retriever: residentInfo.retriever,
        onSuccess: data => {
            start = false;
            const cUser = data.residents.find((r: { [key: string]: any }) => r.id == currentUser.id);
            const temp = data.residents.find((r: { [key: string]: any }) => r.id == params?.id);
            if (temp) {
                if (cUser) {
                    temp.tagsLinked = findTags(cUser.tags, temp.interests);
                    temp.interestsLinked = findTags(cUser.interests, temp.tags);
                }
                else {
                    temp.tagsLinked = [];
                    temp.interestsLinked = [];
                }
            }
            resident = temp;
            const temp2 = {};
            if (data.suggestions['company scope']) {
                temp2['company scope'] = data.suggestions['company scope'].reduce(
                    (acc, tag) => {
                        return Object.assign(acc, { [tag]: true } );
                    },
                    {}
                );
            }
            if (data.suggestions['company needs']) {
                temp2['company needs'] = data.suggestions['company needs'].reduce(
                    (acc, tag) => {
                        return Object.assign(acc, { [tag]: true } );
                    },
                    {}
                );
            }
            suggestions = temp2;
            console.log(suggestions);
            if (temp) {
                contact = data.contacts[temp.id.toString()] ? data.contacts[temp.id.toString()] : undefined;
            }
            else {
                contact = undefined;
            }
            if (!flagView)
                view();
        },
	});

    let residentInfoLoading = residentInfoHandler.loading;


    /* DATA: userContactAddHandler */
	const userContactAddHandler = new Entity({
		model: userContactAdd.model,
		retriever: userContactAdd.retriever,
	});


    /* DATA: userProfileViewHandler */
	const userProfileViewHandler = new Entity({
		model: userProfileView.model,
		retriever: userProfileView.retriever,
        onSuccess: () => flagView = true,
	});
    
    
	/* DATA: userContactDelHandler */
	const userContactDelHandler = new Entity({
		model: userContactDel.model,
		retriever: userContactDel.retriever,
	});


    /* DATA: userFavoritesSetHandler */
	const userFavoritesSetHandler = new Entity({
		model: userFavoritesSet.model,
		retriever: userFavoritesSet.retriever,
	});


    /* sendTelegramMessage */
    function sendTelegramMessage(telegramId: string) {
        const id = telegramId.replace(/^@+/, '');
        window.location.href = 'https://t.me/' + id;
    }


    /* addContact */
    function addContact() {
        if (resident)
            collector.get([
                [ 
                    userContactAddHandler,
                    {
                        contactId: resident.id,
                    }
                ],
            ]);
    }


    /* delContact */
    function delContact() {
        if (resident)
            collector.get([
                [ 
                    userContactDelHandler,
                    {
                        contactId: resident.id,
                    }
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


    /* view */
    function view() {
        if (resident)
            collector.get([
                [ 
                    userProfileViewHandler,
                    {
                        userId: resident.id,
                    }
                ],
            ]);
    }


    /* get */
    function get() {
        collector.get([
            [ 
                residentInfoHandler,
                {
                    userId: params?.id,
                }
            ],
        ]);
    }

    
    /* refresh */
    function refresh() {
        get();
    }


    /* onMount */
	onMount(() => {
        get();
        const sub = subscribe('events', refresh);
        return () => {
            sub.close();
        };
	});
</script>


<div 
    class="w-full h-full flex flex-col"
>
    {#if contact && contact.contact}
        <button
            class="fixed right-4 btn btn-sm h-[48px] px-2 btn-error text-base-100 flex z-[12]"
            style="top: {102 + currentStates.safeTop}px"
            on:click="{delContact}"
        >
            <!--<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45L7.77 18l1.12-4.81l-3.73-3.23l4.92-.42L12 5l1.92 4.53l4.92.42l-3.73 3.23L16.23 18z" fill="currentColor"></path></svg>-->
            <span class="leading-[18px] normal-case">Удалить<br />из избранных</span>
            <!--
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            -->
        </button>
    {:else}
        <button
            class="fixed right-3 btn btn-sm h-[48px] px-2 btn-warning text-base-100 flex z-[12]"
            style="top: {102 + currentStates.safeTop}px"
            on:click="{addContact}"
        >
            <!--<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45L7.77 18l1.12-4.81l-3.73-3.23l4.92-.42L12 5l1.92 4.53l4.92.42l-3.73 3.23L16.23 18z" fill="currentColor"></path></svg>-->
            <span class="leading-[18px] normal-case">Добавить<br />в избранные</span>
            <!--
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M17 15V8h-2v7H8v2h7v7h2v-7h7v-2z" fill="currentColor"></path></svg>
            -->
        </button>
    {/if}
    {#if resident && (!start || !$residentInfoLoading)}
        <!-- {#if resident.favorites_flag === null} -->
            <div
                class="fixed left-3 h-[40px] z-[13] flex"
                style="top: {110 + currentStates.safeTop}px"
            >
                <button
                    class="w-[40px] h-[40px] bg-error rounded-full text-base-100 flex items-center justify-center border-2 border-base-100"
                    on:click="{() => {
                        setFavorites(resident.id, false);
                    }}"
                >
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28L75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256L9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" fill="currentColor"></path></svg>
                </button>
                <button
                    class="w-[40px] h-[40px] bg-warning rounded-full text-base-100 flex items-center justify-center border-2 border-base-100 ml-1"
                    on:click="{() => {
                        setFavorites(resident.id, null);
                    }}"
                >
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 384 512"><path d="M202.021 0C122.202 0 70.503 32.703 29.914 91.026c-7.363 10.58-5.093 25.086 5.178 32.874l43.138 32.709c10.373 7.865 25.132 6.026 33.253-4.148c25.049-31.381 43.63-49.449 82.757-49.449c30.764 0 68.816 19.799 68.816 49.631c0 22.552-18.617 34.134-48.993 51.164c-35.423 19.86-82.299 44.576-82.299 106.405V320c0 13.255 10.745 24 24 24h72.471c13.255 0 24-10.745 24-24v-5.773c0-42.86 125.268-44.645 125.268-160.627C377.504 66.256 286.902 0 202.021 0zM192 373.459c-38.196 0-69.271 31.075-69.271 69.271c0 38.195 31.075 69.27 69.271 69.27s69.271-31.075 69.271-69.271s-31.075-69.27-69.271-69.27z" fill="currentColor"></path></svg>
                </button>
                <button
                    class="w-[40px] h-[40px] bg-success rounded-full text-base-100 flex items-center justify-center border-2 border-base-100 ml-1"
                    on:click="{() => {
                        setFavorites(resident.id, true);
                    }}"
                >
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                </button>
            </div>
        <!-- {/if} -->
    {/if}
    <div class="bg-front w-full h-[112px] flex flex-col justify-between shrink-0 grow-0">
        <div class="flex justify-between items-start">
            <div class="w-[56px] h-[56px] ml-4 mt-4 shrink-0 grow-0 flex items-center justify-center">
                <button
                    class="text-base-100 w-8 h-8 flex items-center justify-center"
                    on:click="{() => {
                        history.back();
                    }}"
                >
                    <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M14 26l1.41-1.41L7.83 17H28v-2H7.83l7.58-7.59L14 6L4 16l10 10z" fill="currentColor"></path></svg>
                </button>
            </div>
            <div class="shrink-1 grow-1 w-full flex justify-center">
                <div class="relative mt-7 w-[132px] h-[1px]">
                    <div
                        class="absolute w-[132px] h-[132px] rounded-full border-4 border-base-100 bg-front z-[11]"
                    >
                        {#if resident && (!start || !$residentInfoLoading)}
                            <Avatar
                                user="{{
                                    id: resident.id,
                                    name: resident.name,
                                    avatar_hash: resident.avatar_hash,
                                    roles: [ 'client' ],
                                    telegram: '',
                                }}"
                                scaleLetters="2.5"
                            />
                            {#if resident.favorites_flag === true}
                                <div class="absolute top-[0px] left-[0px] w-7 h-7 text-base-100 flex items-center justify-center bg-success rounded-full">
                                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                                </div>
                            {:else if resident.favorites_flag === false}
                                <div class="absolute top-[0px] left-[0px] w-7 h-7 text-base-100 flex items-center justify-center bg-error rounded-full">
                                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28L75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256L9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" fill="currentColor"></path></svg>
                                </div>
                            {:else}
                                <div class="absolute top-[0px] left-[0px] w-7 h-7 text-base-100 flex items-center justify-center bg-warning rounded-full">
                                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 384 512"><path d="M202.021 0C122.202 0 70.503 32.703 29.914 91.026c-7.363 10.58-5.093 25.086 5.178 32.874l43.138 32.709c10.373 7.865 25.132 6.026 33.253-4.148c25.049-31.381 43.63-49.449 82.757-49.449c30.764 0 68.816 19.799 68.816 49.631c0 22.552-18.617 34.134-48.993 51.164c-35.423 19.86-82.299 44.576-82.299 106.405V320c0 13.255 10.745 24 24 24h72.471c13.255 0 24-10.745 24-24v-5.773c0-42.86 125.268-44.645 125.268-160.627C377.504 66.256 286.902 0 202.021 0zM192 373.459c-38.196 0-69.271 31.075-69.271 69.271c0 38.195 31.075 69.27 69.271 69.27s69.271-31.075 69.271-69.271s-31.075-69.27-69.271-69.27z" fill="currentColor"></path></svg>
                                </div>
                            {/if}
                        {/if}
                    </div>
                </div>
            </div>
            <div class="w-[56px] h-[56px] mr-4 mt-4 shrink-0 grow-0 flex items-center justify-center">
                &nbsp;
            </div>
        </div>
        <div class="bg-base-100 rounded-t-2xl h-5"></div>
    </div>

    <div class="shrink-0 grow-0 h-[calc(100%-112px)]">
        <div class="mt-[-20px] h-[calc(100%+20px)] rounded-2xl scrollable-y">
            {#if !resident || (start && $residentInfoLoading)}
                <div class="w-full h-full flex justify-center items-center">
                    <span class="loading loading-bars text-front"></span>
                </div>
            {:else}
                <div class="mt-[74px]">
                    <div
                        class="flex justify-center items-center"
                        class:mr-[-44px]="{resident.rating}"
                    >
                        <div class="text font-medium text-[23px] leading-[34px]">{nameNormalization(resident.name, 2)}</div>
                        {#if resident.rating}
                            <div class="w-[36px] h-[36px] rounded-xl flex flex-col items-center justify-center bg-info text-base-100 ml-2">
                                <div class="leading-[14px] text-xs font-semibold text-base-100 mb-[2px]">{resident.rating}</div>
                                <svg class="w-3.5 h-3.5 shrink-0 grow-0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024"><path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7c0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311h-.3v428h472.3c9.2 0 18.2-1.8 26.5-5.4c47.6-20.3 78.3-66.8 78.3-118.4c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c-.2-12.6-2-25.1-5.6-37.1zM112 528v364c0 17.7 14.3 32 32 32h65V496h-65c-17.7 0-32 14.3-32 32z" fill="currentColor"></path></svg>
                            </div>
                        {/if}
                    </div>
                    {#if resident.show && resident.link_telegram}
                        <div class="flex justify-center my-2">
                            <button
                                class="flex items-center rounded-full bg-info text-base-100 px-3 h-7"
                                on:click="{() => {
                                    sendTelegramMessage(resident.link_telegram);
                                }}"
                            >
                                <span class="text-sm mb-[2px] pr-2">Отправить сообщение</span>
                                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 448 512"><path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9l-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9l190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284L16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z" fill="currentColor"></path></svg>
                            </button>
                        </div>
                    {/if}
                    {#if resident.position}
                        <div class="px-3 text-left text-[12px] opacity-80 mt-1 text-center">{resident.position.toUpperCase()}</div>
                    {/if}
                    {#if resident.company}
                        <div class="px-3 text-left text-[12px] text-front mt-1 text-center">{resident.company.toUpperCase()}</div>
                    {/if}

                    {#if resident.show}

                        <div class="px-4 mt-4 mb-4 flex flex-col items-center">
                            <div class="flex items-center opacity-50">
                                <div class="w-5 h-5 shrink-0 grow-0">
                                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M10.5 8a3 3 0 1 0 0 6a3 3 0 0 0 0-6zM9 11a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0zM2 7.25A2.25 2.25 0 0 1 4.25 5h12.5A2.25 2.25 0 0 1 19 7.25v7.5A2.25 2.25 0 0 1 16.75 17H4.25A2.25 2.25 0 0 1 2 14.75v-7.5zm2.25-.75a.75.75 0 0 0-.75.75V8h.75A.75.75 0 0 0 5 7.25V6.5h-.75zm-.75 6h.75a2.25 2.25 0 0 1 2.25 2.25v.75h8v-.75a2.25 2.25 0 0 1 2.25-2.25h.75v-3h-.75a2.25 2.25 0 0 1-2.25-2.25V6.5h-8v.75A2.25 2.25 0 0 1 4.25 9.5H3.5v3zm14-4.5v-.75a.75.75 0 0 0-.75-.75H16v.75c0 .414.336.75.75.75h.75zm0 6h-.75a.75.75 0 0 0-.75.75v.75h.75a.75.75 0 0 0 .75-.75V14zm-14 .75c0 .414.336.75.75.75H5v-.75a.75.75 0 0 0-.75-.75H3.5v.75zm.901 3.75A2.999 2.999 0 0 0 7 20h10.25A4.75 4.75 0 0 0 22 15.25V10c0-1.11-.603-2.08-1.5-2.599v7.849a3.25 3.25 0 0 1-3.25 3.25H4.401z" fill="currentColor"></path></g></svg>
                                </div>
                                <div class="text-xs leading-4 ml-[5px] text-left">Годовой оборот</div>
                            </div>
                            {#if resident.annual != 'не указано' && resident.annual != 'скрыто'}
                                <div class="font-medium text-[22px] text-moderate leading-7">{resident.annual}</div>
                            {:else}
                                <div class="italic opacity-50">{resident.annual}</div>
                            {/if}
                        </div>

                        <div class="px-4 mb-4 flex flex-col items-center">
                            <div class="flex items-center opacity-50">
                                <div class="w-5 h-5 shrink-0 grow-0">
                                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M18 30h-4a2 2 0 0 1-2-2v-7a2 2 0 0 1-2-2v-6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v6a2 2 0 0 1-2 2v7a2 2 0 0 1-2 2zm-5-18a.94.94 0 0 0-1 1v6h2v9h4v-9h2v-6a.94.94 0 0 0-1-1z" fill="currentColor"></path><path d="M16 9a4 4 0 1 1 4-4a4 4 0 0 1-4 4zm0-6a2 2 0 1 0 2 2a2 2 0 0 0-2-2z" fill="currentColor"></path></svg>
                                </div>
                                <div class="text-xs leading-4 ml-[5px] text-left">Количество сотрудников</div>
                            </div>
                            {#if resident.employees != 'не указано' && resident.employees != 'скрыто'}
                                <div class="font-medium text-[22px] text-moderate leading-7">{resident.employees}</div>
                            {:else}
                                <div class="italic opacity-50">{resident.employees}</div>
                            {/if}
                        </div>

                    {/if}

                    <div class="px-4 mb-4 flex flex-col items-center">
                        <div class="flex items-center opacity-50">
                            <div class="w-5 h-5 shrink-0 grow-0">
                                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M15.78 3.737a2.25 2.25 0 0 0-1.56 0L9.913 5.33a.25.25 0 0 0-.163.234v2.793a4.75 4.75 0 0 0-1.5 0V5.563a1.75 1.75 0 0 1 1.143-1.641L13.7 2.33a3.75 3.75 0 0 1 2.6 0l4.307 1.592a1.75 1.75 0 0 1 1.143 1.641v10.67a1.75 1.75 0 0 1-1.143 1.642l-4.018 1.484c.105-.292.161-.604.161-.927v-.731l3.337-1.233a.25.25 0 0 0 .163-.235V5.563a.25.25 0 0 0-.163-.234L15.78 3.737zm-4.01 3.93a.75.75 0 1 1 .49-1.418l2.658.92a.25.25 0 0 0 .163 0l2.65-.92a.75.75 0 1 1 .492 1.418l-2.65.919a1.75 1.75 0 0 1-1.145 0l-2.659-.919zm-6 7a.75.75 0 0 1 .49-1.418l2.74.948l2.732-.947a.75.75 0 1 1 .49 1.417l-2.472.857v2.7a.75.75 0 0 1-1.5 0v-2.7l-2.48-.857zM10.3 9.53a3.75 3.75 0 0 0-2.6 0l-4.307 1.592a1.75 1.75 0 0 0-1.143 1.641v5.67a1.75 1.75 0 0 0 1.143 1.642L7.7 21.666c.839.31 1.761.31 2.6 0l4.307-1.592a1.75 1.75 0 0 0 1.143-1.642v-5.67a1.75 1.75 0 0 0-1.143-1.641L10.3 9.529zm-2.08 1.407a2.25 2.25 0 0 1 1.56 0l4.307 1.592a.25.25 0 0 1 .163.234v5.67a.25.25 0 0 1-.163.235L9.78 20.259a2.25 2.25 0 0 1-1.56 0l-4.307-1.592a.25.25 0 0 1-.163-.235v-5.67a.25.25 0 0 1 .163-.234l4.307-1.592z" fill="currentColor"></path></g></svg>
                            </div>
                            <div class="text-xs leading-4 ml-[5px] text-left">Отрасль</div>
                        </div>
                        {#if resident.catalog}
                            <div class="flex flex-wrap justify-center mt-1">
                                {#each resident.catalog.split(/\s*,\s*/) as tag}
                                    <div class="ml-2 mt-1"><Tag type="catalog" tag="{tag}" /></div>
                                {/each}
                            </div>
                        {:else}
                            <div class="italic opacity-50">не указано</div>
                        {/if}
                    </div>

                    <!--

                    <div class="px-4 mb-4 flex flex-col items-center">
                        <div class="flex items-center opacity-50">
                            <div class="w-5 h-5 shrink-0 grow-0">
                                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M7 6.253V7H4.25A2.25 2.25 0 0 0 2 9.25v8.497a2.25 2.25 0 0 0 2.25 2.25h15.5a2.25 2.25 0 0 0 2.25-2.25V9.25A2.25 2.25 0 0 0 19.75 7H17v-.747a2.25 2.25 0 0 0-2.25-2.25h-5.5A2.25 2.25 0 0 0 7 6.253zm2.25-.75h5.5a.75.75 0 0 1 .75.75V7h-7v-.747a.75.75 0 0 1 .75-.75zm-2.25 3h1.5V8.5h7v.003H17V8.5h2.75a.75.75 0 0 1 .75.75v2.25h-3v-.75a.75.75 0 0 0-1.5 0v.75H8v-.75a.75.75 0 0 0-1.5 0v.75h-3V9.25a.75.75 0 0 1 .75-.75H7v.003zM16 13v1.25a.75.75 0 0 0 1.5 0V13h3v4.747a.75.75 0 0 1-.75.75H4.25a.75.75 0 0 1-.75-.75V13h3v1.25a.75.75 0 0 0 1.5 0V13h8z" fill="currentColor"></path></g></svg>
                            </div>
                            <div class="text-xs leading-4 ml-[5px] text-left">Чем могу быть полезен (компетенция)</div>
                        </div>
                        {#if resident.tags}
                            <div class="flex flex-wrap justify-center mt-1">
                                {#each resident.tags.split(/\s*,\s*/) as tag}
                                    <div class="ml-2 mt-1"><Tag type="tag" tag="{tag}" /></div>
                                {/each}
                            </div>
                        {:else}
                            <div class="italic opacity-50">не указано</div>
                        {/if}
                    </div>

                    <div class="px-4 mb-4 flex flex-col items-center">
                        <div class="flex items-center opacity-50">
                            <div class="w-5 h-5 shrink-0 grow-0">
                                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M10.591 2.513a3.75 3.75 0 0 1 2.818 0l7.498 3.04A1.75 1.75 0 0 1 22 7.175V16.5c0-1.462-.57-2.79-1.5-3.775V7.773l-7.75 2.992v1.712a5.502 5.502 0 0 0-1.5 2.379v-4.092L3.5 7.75v9.078a.25.25 0 0 0 .156.231l7.499 3.04c.024.01.048.02.072.028l.212.086a1.5 1.5 0 0 0 1.035.035c.394.424.854.785 1.364 1.067l-.43.174a3.75 3.75 0 0 1-2.817 0l-7.498-3.04A1.75 1.75 0 0 1 2 16.827V7.176a1.75 1.75 0 0 1 1.093-1.622l7.498-3.04zm2.254 1.39a2.25 2.25 0 0 0-1.69 0L9.24 4.68l7.527 2.927l2.669-1.03l-6.592-2.673zm1.846 4.505L7.215 5.5L4.59 6.564l7.411 2.882l2.69-1.038zM22 16.563v-.062v.062zm-1.832 2.545a4.5 4.5 0 1 0-1.06 1.06l2.612 2.613a.75.75 0 1 0 1.06-1.06l-2.612-2.613zm-.668-2.607a3 3 0 1 1-6 0a3 3 0 0 1 6 0z" fill="currentColor"></path></g></svg>
                            </div>
                            <div class="text-xs leading-4 ml-[5px] text-left">Какие ищу ресурсы (интерес)</div>
                        </div>
                        {#if resident.interests}
                            <div class="flex flex-wrap justify-center mt-1">
                                {#each resident.interests.split(/\s*,\s*/) as tag}
                                    <div class="ml-2 mt-1"><Tag type="interest" tag="{tag}" /></div>
                                {/each}
                            </div>
                        {:else}
                            <div class="italic opacity-50">не указано</div>
                        {/if}
                    </div>

                    -->

                    {#if resident.show}

                        {#if suggestions['company scope'] || suggestions['company needs']}
                            <div class="px-4 mb-4 flex flex-col items-center">
                                <div class="flex items-center text-warning opacity-90">
                                    <div class="w-5 h-5 shrink-0 grow-0">
                                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 576 512"><path d="M259.3 17.8L194 150.2L47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103l-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5l105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2L316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" fill="currentColor"></path></svg>
                                    </div>
                                    <div class="text-xs leading-4 ml-[5px] text-left">Совпадения c Вами по тегам</div>
                                </div>
                                <div class="flex flex-wrap justify-center mt-1">
                                    {#if suggestions['company scope']}
                                        {#each resident.tags_1_company_scope.split(/\s*\+\s*/) as tag}
                                            {#if suggestions['company scope'][tag]}
                                                <div class="ml-2 mt-1"><Tag type="tag" tag="{tag}" hit="{true}" /></div>
                                            {/if}
                                        {/each}
                                    {/if}
                                    {#if suggestions['company needs']}
                                        {#each resident.tags_1_company_needs.split(/\s*\+\s*/) as tag}
                                            {#if suggestions['company needs'][tag]}
                                                <div class="ml-2 mt-1"><Tag type="interest" tag="{tag}" hit="{true}" /></div>
                                            {/if}
                                        {/each}
                                    {/if}
                                </div>
                            </div>
                        {/if}

                        <div class="px-4 mb-4 flex flex-col items-center">
                            <div class="flex items-center opacity-50">
                                <div class="w-5 h-5 shrink-0 grow-0">
                                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M7 6.253V7H4.25A2.25 2.25 0 0 0 2 9.25v8.497a2.25 2.25 0 0 0 2.25 2.25h15.5a2.25 2.25 0 0 0 2.25-2.25V9.25A2.25 2.25 0 0 0 19.75 7H17v-.747a2.25 2.25 0 0 0-2.25-2.25h-5.5A2.25 2.25 0 0 0 7 6.253zm2.25-.75h5.5a.75.75 0 0 1 .75.75V7h-7v-.747a.75.75 0 0 1 .75-.75zm-2.25 3h1.5V8.5h7v.003H17V8.5h2.75a.75.75 0 0 1 .75.75v2.25h-3v-.75a.75.75 0 0 0-1.5 0v.75H8v-.75a.75.75 0 0 0-1.5 0v.75h-3V9.25a.75.75 0 0 1 .75-.75H7v.003zM16 13v1.25a.75.75 0 0 0 1.5 0V13h3v4.747a.75.75 0 0 1-.75.75H4.25a.75.75 0 0 1-.75-.75V13h3v1.25a.75.75 0 0 0 1.5 0V13h8z" fill="currentColor"></path></g></svg>
                                </div>
                                <div class="text-xs leading-4 ml-[5px] text-left">Специализация компании</div>
                            </div>
                            {#if resident.tags_1_company_scope}
                                <div class="flex flex-wrap justify-center mt-1">
                                    {#each resident.tags_1_company_scope.split(/\s*\+\s*/) as tag}
                                        <div class="ml-2 mt-1"><Tag type="tag" tag="{tag}" hit="{suggestions['company scope'] && suggestions['company scope'][tag]}" /></div>
                                    {/each}
                                </div>
                            {:else}
                                <div class="italic opacity-50">не указано</div>
                            {/if}
                        </div>
                        <div class="px-4 mb-4 flex flex-col items-center">
                            <div class="flex items-center opacity-50">
                                <div class="w-5 h-5 shrink-0 grow-0">
                                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M10.591 2.513a3.75 3.75 0 0 1 2.818 0l7.498 3.04A1.75 1.75 0 0 1 22 7.175V16.5c0-1.462-.57-2.79-1.5-3.775V7.773l-7.75 2.992v1.712a5.502 5.502 0 0 0-1.5 2.379v-4.092L3.5 7.75v9.078a.25.25 0 0 0 .156.231l7.499 3.04c.024.01.048.02.072.028l.212.086a1.5 1.5 0 0 0 1.035.035c.394.424.854.785 1.364 1.067l-.43.174a3.75 3.75 0 0 1-2.817 0l-7.498-3.04A1.75 1.75 0 0 1 2 16.827V7.176a1.75 1.75 0 0 1 1.093-1.622l7.498-3.04zm2.254 1.39a2.25 2.25 0 0 0-1.69 0L9.24 4.68l7.527 2.927l2.669-1.03l-6.592-2.673zm1.846 4.505L7.215 5.5L4.59 6.564l7.411 2.882l2.69-1.038zM22 16.563v-.062v.062zm-1.832 2.545a4.5 4.5 0 1 0-1.06 1.06l2.612 2.613a.75.75 0 1 0 1.06-1.06l-2.612-2.613zm-.668-2.607a3 3 0 1 1-6 0a3 3 0 0 1 6 0z" fill="currentColor"></path></g></svg>
                                </div>
                                <div class="text-xs leading-4 ml-[5px] text-left">Потребности компании</div>
                            </div>
                            {#if resident.tags_1_company_needs}
                                <div class="flex flex-wrap justify-center mt-1">
                                    {#each resident.tags_1_company_needs.split(/\s*\+\s*/) as tag}
                                        <div class="ml-2 mt-1"><Tag type="interest" tag="{tag}" hit="{suggestions['company needs'] && suggestions['company needs'][tag]}" /></div>
                                    {/each}
                                </div>
                            {:else}
                                <div class="italic opacity-50">не указано</div>
                            {/if}
                        </div>
                        <div class="px-4 mb-4 flex flex-col items-center">
                            <div class="flex items-center opacity-50">
                                <div class="w-5 h-5 shrink-0 grow-0">
                                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M18 10a4 4 0 0 1 3 6.648v4.6a.75.75 0 0 1-1.09.67l-.09-.055L18 20.591l-1.82 1.272a.75.75 0 0 1-1.172-.51l-.007-.105v-4.602A4 4 0 0 1 18 10zm1.5 7.71a3.99 3.99 0 0 1-1.5.291a3.99 3.99 0 0 1-1.5-.291v2.099l1.071-.747a.75.75 0 0 1 .759-.06l.1.06l1.07.747V17.71zm-.25-14.706a2.75 2.75 0 0 1 2.745 2.582l.005.168l.001 5.246a5.027 5.027 0 0 0-1.5-1.331L20.5 5.754a1.25 1.25 0 0 0-1.122-1.244l-.128-.006H4.75a1.25 1.25 0 0 0-1.244 1.122l-.006.128v9.5c0 .647.492 1.18 1.122 1.243l.128.007l8.922.001l.123.203l.134.196l.071.094l-.001 1.006H4.75a2.75 2.75 0 0 1-2.745-2.583L2 15.254v-9.5a2.75 2.75 0 0 1 2.582-2.745l.168-.005h14.5zM18 11.5a2.5 2.5 0 1 0 0 5.001a2.5 2.5 0 0 0 0-5.001zm-6.75 1a.75.75 0 0 1 .102 1.493L11.25 14h-4.5a.75.75 0 0 1-.102-1.493l.102-.007h4.5zm6-5.5a.75.75 0 0 1 .102 1.493l-.102.007H6.75a.75.75 0 0 1-.102-1.493L6.75 7h10.5z" fill="currentColor"></path></g></svg>
                                </div>
                                <div class="text-xs leading-4 ml-[5px] text-left">Допуски, лицензии, сертификаты</div>
                            </div>
                            {#if resident.tags_1_licenses}
                                <div class="flex flex-wrap justify-center mt-1">
                                    {#each resident.tags_1_licenses.split(/\s*\+\s*/) as tag}
                                        <div class="ml-2 mt-1"><Tag type="catalog" tag="{tag}" /></div>
                                    {/each}
                                </div>
                            {:else}
                                <div class="italic opacity-50">не указано</div>
                            {/if}
                        </div>
                        <div class="px-4 mb-4 flex flex-col items-center">
                            <div class="flex items-center opacity-50">
                                <div class="w-5 h-5 shrink-0 grow-0">
                                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M7 6.253V7H4.25A2.25 2.25 0 0 0 2 9.25v8.497a2.25 2.25 0 0 0 2.25 2.25h15.5a2.25 2.25 0 0 0 2.25-2.25V9.25A2.25 2.25 0 0 0 19.75 7H17v-.747a2.25 2.25 0 0 0-2.25-2.25h-5.5A2.25 2.25 0 0 0 7 6.253zm2.25-.75h5.5a.75.75 0 0 1 .75.75V7h-7v-.747a.75.75 0 0 1 .75-.75zm-2.25 3h1.5V8.5h7v.003H17V8.5h2.75a.75.75 0 0 1 .75.75v2.25h-3v-.75a.75.75 0 0 0-1.5 0v.75H8v-.75a.75.75 0 0 0-1.5 0v.75h-3V9.25a.75.75 0 0 1 .75-.75H7v.003zM16 13v1.25a.75.75 0 0 0 1.5 0V13h3v4.747a.75.75 0 0 1-.75.75H4.25a.75.75 0 0 1-.75-.75V13h3v1.25a.75.75 0 0 0 1.5 0V13h8z" fill="currentColor"></path></g></svg>
                                </div>
                                <div class="text-xs leading-4 ml-[5px] text-left">Личная экспертиза</div>
                            </div>
                            {#if resident.tags_1_personal_expertise}
                                <div class="flex flex-wrap justify-center mt-1">
                                    {#each resident.tags_1_personal_expertise.split(/\s*\+\s*/) as tag}
                                        <div class="ml-2 mt-1"><Tag type="tag" tag="{tag}" /></div>
                                    {/each}
                                </div>
                            {:else}
                                <div class="italic opacity-50">не указано</div>
                            {/if}
                        </div>
                        <div class="px-4 mb-4 flex flex-col items-center">
                            <div class="flex items-center opacity-50">
                                <div class="w-5 h-5 shrink-0 grow-0">
                                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M10.591 2.513a3.75 3.75 0 0 1 2.818 0l7.498 3.04A1.75 1.75 0 0 1 22 7.175V16.5c0-1.462-.57-2.79-1.5-3.775V7.773l-7.75 2.992v1.712a5.502 5.502 0 0 0-1.5 2.379v-4.092L3.5 7.75v9.078a.25.25 0 0 0 .156.231l7.499 3.04c.024.01.048.02.072.028l.212.086a1.5 1.5 0 0 0 1.035.035c.394.424.854.785 1.364 1.067l-.43.174a3.75 3.75 0 0 1-2.817 0l-7.498-3.04A1.75 1.75 0 0 1 2 16.827V7.176a1.75 1.75 0 0 1 1.093-1.622l7.498-3.04zm2.254 1.39a2.25 2.25 0 0 0-1.69 0L9.24 4.68l7.527 2.927l2.669-1.03l-6.592-2.673zm1.846 4.505L7.215 5.5L4.59 6.564l7.411 2.882l2.69-1.038zM22 16.563v-.062v.062zm-1.832 2.545a4.5 4.5 0 1 0-1.06 1.06l2.612 2.613a.75.75 0 1 0 1.06-1.06l-2.612-2.613zm-.668-2.607a3 3 0 1 1-6 0a3 3 0 0 1 6 0z" fill="currentColor"></path></g></svg>
                                </div>
                                <div class="text-xs leading-4 ml-[5px] text-left">Потребности в экспертизе</div>
                            </div>
                            {#if resident.tags_1_personal_needs}
                                <div class="flex flex-wrap justify-center mt-1">
                                    {#each resident.tags_1_personal_needs.split(/\s*\+\s*/) as tag}
                                        <div class="ml-2 mt-1"><Tag type="interest" tag="{tag}" /></div>
                                    {/each}
                                </div>
                            {:else}
                                <div class="italic opacity-50">не указано</div>
                            {/if}
                        </div>
                        <div class="px-4 mb-4 flex flex-col items-center">
                            <div class="flex items-center opacity-50">
                                <div class="w-5 h-5 shrink-0 grow-0">
                                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M13.72 9.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l4.5-4.5zM17.75 2A4.25 4.25 0 0 1 22 6.25v1C22 15.396 15.396 22 7.25 22h-1A4.25 4.25 0 0 1 2 17.75v-1C2 8.604 8.604 2 16.75 2h1zm2.75 4.25a2.75 2.75 0 0 0-2.75-2.75h-1c-.403 0-.802.018-1.196.053l4.893 4.893c.035-.394.053-.793.053-1.196v-1zm-.347 4.024l-6.427-6.427a13.27 13.27 0 0 0-9.902 9.977l6.352 6.352a13.269 13.269 0 0 0 9.977-9.902zm-16.61 5.391c-.028.358-.043.72-.043 1.085v1a2.75 2.75 0 0 0 2.75 2.75h1c.365 0 .727-.015 1.085-.044l-4.791-4.791z" fill="currentColor"></path></g></svg>
                                </div>
                                <div class="text-xs leading-4 ml-[5px] text-left">Хобби, увлечения</div>
                            </div>
                            {#if resident.tags_1_hobbies}
                                <div class="flex flex-wrap justify-center mt-1">
                                    {#each resident.tags_1_hobbies.split(/\s*\+\s*/) as tag}
                                        <div class="ml-2 mt-1"><Tag type="catalog" tag="{tag}" /></div>
                                    {/each}
                                </div>
                            {:else}
                                <div class="italic opacity-50">не указано</div>
                            {/if}
                        </div>


                        <div class="px-4 mb-4 flex flex-col items-center">
                            <div class="flex items-center opacity-50">
                                <div class="w-5 h-5 shrink-0 grow-0">
                                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M5.843 4.568a8.707 8.707 0 1 1 12.314 12.314l-1.187 1.174c-.875.858-2.01 1.962-3.406 3.312a2.25 2.25 0 0 1-3.128 0l-3.491-3.396c-.439-.431-.806-.794-1.102-1.09a8.707 8.707 0 0 1 0-12.314zm11.253 1.06A7.207 7.207 0 1 0 6.904 15.822L8.39 17.29a753.98 753.98 0 0 0 3.088 3a.75.75 0 0 0 1.043 0l3.394-3.3c.47-.461.863-.85 1.18-1.168a7.207 7.207 0 0 0 0-10.192zM12 7.999a3.002 3.002 0 1 1 0 6.004a3.002 3.002 0 0 1 0-6.003zm0 1.5a1.501 1.501 0 1 0 0 3.004a1.501 1.501 0 0 0 0-3.003z" fill="currentColor"></path></g></svg>
                                </div>
                                <div class="text-xs leading-4 ml-[5px] text-left">Город</div>
                            </div>
                            {#if resident.city}
                                <div class="font-medium text-[22px] text-moderate leading-7">
                                    {resident.city.split(/\s*,\s*/).join(', ')}
                                </div>
                            {:else}
                                <div class="italic opacity-50">не указано</div>
                            {/if}
                        </div>

                        <div class="px-4 mb-4 flex flex-col items-center">
                            <div class="flex items-center opacity-50">
                                <div class="w-5 h-5 shrink-0 grow-0">
                                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M8.75 3h6.5a.75.75 0 0 1 .743.648L16 3.75V7h1.75A3.25 3.25 0 0 1 21 10.25v6.5A3.25 3.25 0 0 1 17.75 20H6.25A3.25 3.25 0 0 1 3 16.75v-6.5A3.25 3.25 0 0 1 6.25 7H8V3.75a.75.75 0 0 1 .648-.743L8.75 3h6.5h-6.5zm9 5.5H6.25a1.75 1.75 0 0 0-1.75 1.75v6.5c0 .966.784 1.75 1.75 1.75h11.5a1.75 1.75 0 0 0 1.75-1.75v-6.5a1.75 1.75 0 0 0-1.75-1.75zm-3.25-4h-5V7h5V4.5z" fill="currentColor"></path></g></svg>
                                </div>
                                <div class="text-xs leading-4 ml-[5px] text-left">Стаж</div>
                            </div>
                            {#if resident.experience}
                                <div class="font-medium text-[22px] text-moderate leading-7">
                                    {(new Date().getFullYear() - parseInt(resident.experience)).toString() + ' ' + wordForms['год'][nwfi(new Date().getFullYear() - parseInt(resident.experience))]}
                                </div>
                            {:else}
                                <div class="italic opacity-50">не указано</div>
                            {/if}
                        </div>

                        <!--
                        <div class="px-4 mb-4 flex flex-col items-center">
                            <div class="flex items-center opacity-50">
                                <div class="w-5 h-5 shrink-0 grow-0">
                                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M13.72 9.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l4.5-4.5zM17.75 2A4.25 4.25 0 0 1 22 6.25v1C22 15.396 15.396 22 7.25 22h-1A4.25 4.25 0 0 1 2 17.75v-1C2 8.604 8.604 2 16.75 2h1zm2.75 4.25a2.75 2.75 0 0 0-2.75-2.75h-1c-.403 0-.802.018-1.196.053l4.893 4.893c.035-.394.053-.793.053-1.196v-1zm-.347 4.024l-6.427-6.427a13.27 13.27 0 0 0-9.902 9.977l6.352 6.352a13.269 13.269 0 0 0 9.977-9.902zm-16.61 5.391c-.028.358-.043.72-.043 1.085v1a2.75 2.75 0 0 0 2.75 2.75h1c.365 0 .727-.015 1.085-.044l-4.791-4.791z" fill="currentColor"></path></g></svg>
                                </div>
                                <div class="text-xs leading-4 ml-[5px] text-left">Интересы, хобби</div>
                            </div>
                            {#if resident.hobby}
                                <div class="font-medium text-[22px] text-moderate leading-7">
                                    {resident.hobby.split(/\s*,\s*/).join(', ')}
                                </div>
                            {:else}
                                <div class="italic opacity-50">не указано</div>
                            {/if}
                        </div>
                        -->

                        <div class="px-4 mb-5 flex flex-col items-center">
                            <div class="flex items-center opacity-50">
                                <div class="w-5 h-5 shrink-0 grow-0">
                                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M12 1c-.95 0-1.585.682-1.937 1.282c-.361.619-.563 1.374-.563 1.968c0 .494.063 1.174.432 1.746C10.342 6.63 11.038 7 12 7s1.658-.37 2.068-1.004c.37-.572.432-1.252.432-1.746c0-.594-.202-1.35-.563-1.968C13.586 1.682 12.95 1 12 1zm-1 3.25c0-.31.121-.805.358-1.21c.248-.424.487-.54.642-.54c.155 0 .394.116.642.54c.237.405.358.9.358 1.21c0 .41-.062.73-.193.932c-.09.14-.27.318-.807.318c-.538 0-.717-.178-.807-.318C11.063 4.98 11 4.66 11 4.25zm9.5 6v8.25h.75a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5h.75v-8.25A2.25 2.25 0 0 1 5.75 8h12.5a2.25 2.25 0 0 1 2.25 2.25zm-15.5 0v2.091l2.447 1.58a1.25 1.25 0 0 0 1.356 0l1.747-1.128a2.75 2.75 0 0 1 2.9-.05l2.009 1.199a1.25 1.25 0 0 0 1.359-.05L19 12.36v-2.11a.75.75 0 0 0-.75-.75H5.75a.75.75 0 0 0-.75.75zm12.68 4.87a2.75 2.75 0 0 1-2.99.11l-2.008-1.2a1.25 1.25 0 0 0-1.319.023l-1.747 1.128a2.75 2.75 0 0 1-2.982 0L5 14.126V18.5h14v-4.307l-1.32.926z" fill="currentColor"></path></g></svg>
                                </div>
                                <div class="text-xs leading-4 ml-[5px] text-left">Дата рождения</div>
                            </div>
                            {#if resident.birthdate != 'не указано' && resident.birthdate != 'скрыто'}
                                <div class="font-medium text-[22px] text-moderate leading-7">{resident.birthdate}</div>
                            {:else}
                                <div class="italic opacity-50">{resident.birthdate}</div>
                            {/if}
                        </div>

                    {:else}

                        <div class="p-4 mx-3 mt-8 mb-5 bg-base-200 rounded-2xl flex items-start">
                            <svg class="w-6 h-6 text-info shrink-0 grow-0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42s-42-18.804-42-42s18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z" fill="currentColor"></path></svg>
                            <span class="text-sm ml-3">Подробная информация в профиле доступна только членам клуба и кандидатам во время пробного периода!</span>
                        </div>

                    {/if}

                </div>
            {/if}
        </div>
    </div>

</div>
