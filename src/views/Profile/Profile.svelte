<script lang="ts">
   import { onMount } from 'svelte';

   import { Avatar, Tag } from '@/components';

   import { type User, user } from '@/stores';

   import { type WordForms, nwfi } from '@/utils/numword';

   import { findTags } from '@/utils/tags';

   import { nameNormalization } from '@/utils/names';

   import { subscribe } from '@/helpers/notification';

    import { Entity, collector } from '@/helpers/entity';
    import {
        residentInfo,
    } from '@/queries/user';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;


    $: currentUser = $user as User;


    const wordForms: WordForms = {
        'год': [ 'лет', 'год', 'года', 'лет' ],
    };


    let resident: any;


    /* DATA: residentInfoHandler */
	const residentInfoHandler = new Entity({
		model: residentInfo.model,
		retriever: residentInfo.retriever,
        onSuccess: data => {
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
        },
	});

    let residentInfoLoading = residentInfoHandler.loading;


    /* sendTelegramMessage */
    function sendTelegramMessage(telegramId: string) {
        const id = telegramId.replace(/^@+/, '');
        window.location.href = 'https://t.me/' + id;
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
            <div class="shrink-1 grow-1 flex jsutify-center">
                <div class="relative mt-7 w-[132px] h-[1px]">
                    <div
                        class="absolute w-[132px] h-[132px] rounded-full overflow-hidden border-4 border-base-100 bg-front z-[11]"
                    >
                        {#if resident && !$residentInfoLoading}
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
                        {/if}
                    </div>
                    {#if resident && !$residentInfoLoading && resident.rating}
                        <div class="absolute top-[76px] left-[108px] w-[48px] h-[48px] z-[12] rounded-box flex flex-col items-center justify-center bg-info text-base-100">
                            <div class="leading-5 text-sm font-medium text-base-100">{resident.rating}</div>
                            <svg class="w-5 h-5 shrink-0 grow-0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024"><path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7c0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311h-.3v428h472.3c9.2 0 18.2-1.8 26.5-5.4c47.6-20.3 78.3-66.8 78.3-118.4c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c-.2-12.6-2-25.1-5.6-37.1zM112 528v364c0 17.7 14.3 32 32 32h65V496h-65c-17.7 0-32 14.3-32 32z" fill="currentColor"></path></svg>
                        </div>
                    {/if}
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
            {#if !resident || $residentInfoLoading}
                <div class="w-full h-full flex justify-center items-center">
                    <span class="loading loading-bars text-front laoding-lg"></span>
                </div>
            {:else}
                <div class="mt-[74px]">
                    <div class="flex justify-center">
                        <div class="text font-medium text-[23px] leading-[34px]">{nameNormalization(resident.name, 2)}</div>
                        {#if resident.link_telegram}
                            <button
                                class="mt-[2px] ml-1.5 w-8 h-8 text-info mr-[-38px]"
                                on:click="{() => {
                                    sendTelegramMessage(resident.link_telegram);
                                }}"
                            ><svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19c-.14.75-.42 1-.68 1.03c-.58.05-1.02-.38-1.58-.75c-.88-.58-1.38-.94-2.23-1.5c-.99-.65-.35-1.01.22-1.59c.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02c-.09.02-1.49.95-4.22 2.79c-.4.27-.76.41-1.08.4c-.36-.01-1.04-.2-1.55-.37c-.63-.2-1.12-.31-1.08-.66c.02-.18.27-.36.74-.55c2.92-1.27 4.86-2.11 5.83-2.51c2.78-1.16 3.35-1.36 3.73-1.36c.08 0 .27.02.39.12c.1.08.13.19.14.27c-.01.06.01.24 0 .38z" fill="currentColor"></path></svg></button>
                        {/if}
                    </div>
                    {#if resident.position}
                        <div class="px-3 text-left text-[12px] opacity-80 mt-1 text-center">{resident.position.toUpperCase()}</div>
                    {/if}
                    {#if resident.company}
                        <div class="px-3 text-left text-[12px] text-front mt-1 text-center">{resident.company.toUpperCase()}</div>
                    {/if}

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

                </div>
            {/if}
        </div>
    </div>

</div>
