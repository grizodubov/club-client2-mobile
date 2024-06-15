<script lang="ts">
    import { onMount } from 'svelte';

    import { infoCreate, infoDestroy, infoShow } from '@/helpers/info';

    import { Avatar } from '@/components';

    import { InputText, InputSlider, InputTags, InputRadio, PhotoEditor } from './components';

    import { states, type User, user } from '@/stores';

    import { nameNormalization } from '@/utils/names';

    import { subscribe } from '@/helpers/notification';

    import { compareTags } from '@/utils/tags';

    import { Entity, collector } from '@/helpers/entity';

    import {
        userInfo,
        userUpdate,
    } from '@/queries/user';
 
    import {
        userLogout,
        userChangeEmail,
        userChangeEmailValidate,
        userChangePhone,
        userChangePhoneValidate,
        userChangeCredentials,
        userTerminate,
    } from '@/queries/auth';

    import {
        tagList,
    } from '@/queries/tag';

    const year = (new Date()).getFullYear();


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;


    let start = true;

    let area: any;

    let scrollPosition = 0;


    $: currentUser = $user as User;

    $: currentStates = $states as any;


    const testEmail = new RegExp('[^@]+@[^@]+\\.[^@\\.]{2,}');
    const testPhone = new RegExp('[\\d\\s\\(\\)\\-]{10,20}');


    let resident: any;

    let residentForm: any = undefined;

    $: formUpdate = resident && residentForm ? checkUpdate(resident, residentForm) : false;

    let accountEmail: string = '';
    let codeEmail: string = '';
    let flagEmail: boolean = false;
    let accountPhone: string = '';
    let codePhone: string = '';
    let flagPhone: boolean = false;
    let codeCredentials1: string = '';
    let codeCredentials2: string = '';


    $: validEmail = testEmail.test(accountEmail);
    $: validPhone = testPhone.test(accountPhone);


    let tags: any[] = [];


    /* DATA: userInfoHandler */
	const userInfoHandler = new Entity({
		model: userInfo.model,
		retriever: userInfo.retriever,
        onSuccess: data => {
            start = false;
            resident = Object.assign({}, data);
            if (!residentForm) {
                residentForm = Object.assign({}, resident);
                const temp = resident.name.split(' ', 2);
                if (temp.length == 1) {
                    residentForm.nameFirst = temp[0];
                    residentForm.nameLast = '';
                }
                else {
                    residentForm.nameFirst = temp[1];
                    residentForm.nameLast = temp[0];
                }
            }
        },
	});

    let userInfoLoading = userInfoHandler.loading;


    /* DATA: tagListHandler */
	const tagListHandler = new Entity({
		model: tagList.model,
		retriever: tagList.retriever,
        onSuccess: data => tags = data.tags,
	});


    /* DATA: userLogoutHandler */
	const userLogoutHandler = new Entity({
		model: userLogout.model,
		retriever: userLogout.retriever,
        onSuccess: () => states.push({ lockEvents: false }),
	});


    /* DATA: userChangeEmailHandler */
	const userChangeEmailHandler = new Entity({
		model: userChangeEmail.model,
		retriever: userChangeEmail.retriever,
        onSuccess: () => {
            flagEmail = true;
        },
	});

    let userChangeEmailLoading = userChangeEmailHandler.loading;


    /* DATA: userChangeEmailValidateHandler */
	const userChangeEmailValidateHandler = new Entity({
		model: userChangeEmailValidate.model,
		retriever: userChangeEmailValidate.retriever,
        onSuccess: () => {
            accountEmail = '';
            codeEmail = '';
            flagEmail = false;
        },
	});

    let userChangeEmailValidateLoading = userChangeEmailValidateHandler.loading;


    /* DATA: userChangePhoneHandler */
	const userChangePhoneHandler = new Entity({
		model: userChangePhone.model,
		retriever: userChangePhone.retriever,
        onSuccess: () => {
            flagPhone = true;
        },
	});

    let userChangePhoneLoading = userChangePhoneHandler.loading;


    /* DATA: userChangePhoneValidateHandler */
	const userChangePhoneValidateHandler = new Entity({
		model: userChangePhoneValidate.model,
		retriever: userChangePhoneValidate.retriever,
        onSuccess: () => {
            accountPhone = '';
            codePhone = '';
            flagPhone = false;
        },
	});

    let userChangePhoneValidateLoading = userChangePhoneValidateHandler.loading;


    /* DATA: userChangeCredentialsHandler */
	const userChangeCredentialsHandler = new Entity({
		model: userChangeCredentials.model,
		retriever: userChangeCredentials.retriever,
        onSuccess: () => {
            codeCredentials1 = '';
            codeCredentials2 = '';
        },
	});

    let userChangeCredentialsLoading = userChangeCredentialsHandler.loading;


    /* DATA: userUpdateHandler */
	const userUpdateHandler = new Entity({
		model: userUpdate.model,
		retriever: userUpdate.retriever,
	});

    let userUpdateLoading = userUpdateHandler.loading;


    /* DATA: userTerminateHandler */
    const userTerminateHandler = new Entity({
        model: userTerminate.model,
        retriever: userTerminate.retriever,
        onSuccess: () => states.push({ lockEvents: false }),
    });


    /* logout */
    function logout() {
        states.push({ lockEvents: true });
        collector.get([
            [ 
                userLogoutHandler,
                {}
            ],
        ]);
    }


    /* sendCode */
    function sendCode(t: string) {
        if (t == 'email') {
            collector.get([
                [ 
                    userChangeEmailHandler,
                    {
                        account: accountEmail,
                    }
                ],
            ]);
        }
        else if (t == 'phone') {
            collector.get([
                [ 
                    userChangePhoneHandler,
                    {
                        account: accountEmail,
                    }
                ],
            ]);
        }
    }


    /* change */
    function change(t: string) {
        if (t == 'email') {
            collector.get([
                [ 
                    userChangeEmailValidateHandler,
                    {
                        account: accountEmail,
                        code: codeEmail,
                    }
                ],
            ]);
        }
        else if (t == 'phone') {
            collector.get([
                [ 
                    userChangePhoneValidateHandler,
                    {
                        account: accountEmail,
                        code: codeEmail,
                    }
                ],
            ]);
        }
        else if (t == 'password') {
            collector.get([
                [ 
                    userChangeCredentialsHandler,
                    {
                        code: codeCredentials1,
                    }
                ],
            ]);
        }
    }


    /* terminate */
    function terminate() {
        states.push({ lockEvents: true });
        collector.get([
            [ 
                userTerminateHandler,
                {}
            ],
        ]);
    }


    /* blurActiveElement */
    function blurActiveElement() {
        const elem = document.activeElement as HTMLElement;
        if (elem) {
            elem.blur();
        }
    }


    /* checkUpdate */
    function checkUpdate(r: any, rf: any) {
        return (
            (
                rf.nameLast.trim() &&
                rf.nameFirst.trim()
            ) && (
                (rf.nameLast.trim() + ' ' + rf.nameFirst.trim()) != r.name ||
                rf.company != r.company ||
                rf.position != r.position ||
                rf.experience != r.experience ||
                rf.annual != r.annual ||
                rf.annual_privacy != r.annual_privacy ||
                rf.employees != r.employees ||
                rf.employees_privacy != r.employees_privacy ||
                !compareTags(rf.catalog, r.catalog) ||
                !compareTags(rf.city, r.city) ||
                !compareTags(rf.hobby, r.hobby) ||
                !compareTags(rf.tags, r.tags) ||
                !compareTags(rf.interests, r.interests) ||
                !compareTags(rf.tags_1_company_scope, r.tags_1_company_scope) ||
                !compareTags(rf.tags_1_company_needs, r.tags_1_company_needs) ||
                !compareTags(rf.tags_1_licenses, r.tags_1_licenses) ||
                !compareTags(rf.tags_1_personal_expertise, r.tags_1_personal_expertise) ||
                !compareTags(rf.tags_1_personal_needs, r.tags_1_personal_needs) ||
                !compareTags(rf.tags_1_hobbies, r.tags_1_hobbies)
            )
        );
    }


    /* update */
    function update() {
        collector.get([
            [ 
                userUpdateHandler,
                {
                    id: resident.id,
                    name: residentForm.nameLast.trim() + ' ' + residentForm.nameFirst.trim(),
                    company: residentForm.company,
                    position: residentForm.position,
                    annual: residentForm.annual,
                    annualPrivacy: residentForm.annual_privacy,
                    employees: residentForm.employees,
                    employeesPrivacy: residentForm.employees_privacy,
                    catalog: residentForm.catalog,
                    tags: residentForm.tags,
                    interests: residentForm.interests,
                    city: residentForm.city,
                    hobby: residentForm.hobby,
                    birthdate: residentForm.birthdate || residentForm.birthdate != 'не указано' ? residentForm.birthdate : null,
                    birthdatePrivacy: residentForm.birthdate_privacy,
                    experience: residentForm.experience ? parseInt(residentForm.experience) : null,
                    detail: residentForm.detail,
                    tags1CompanyScope: residentForm.tags_1_company_scope,
                    tags1CompanyNeeds: residentForm.tags_1_company_needs,
                    tags1Licenses: residentForm.tags_1_licenses,
                    tags1PersonalExpertise: residentForm.tags_1_personal_expertise,
                    tags1PersonalNeeds: residentForm.tags_1_personal_needs,
                    tags1Hobbies: residentForm.tags_1_hobbies,

                }
            ],
        ]);
    }


    /* get */
    function get() {
        collector.get([
            [ 
                userInfoHandler,
                {
                    userId: currentUser.id,
                }
            ],
        ]);
    }


    /* getTags */
    function getTags() {
        collector.get([
            [ 
                tagListHandler,
                {}
            ],
        ]);
    }


    /* moveUp */
    function moveUp() {
        if (area) {
            scrollPosition = area.scrollTop;
            setTimeout(() => { document.activeElement?.scrollIntoView({ behavior: 'instant', block: 'center' }) }, 20);
        }
    }


    /* moveDown */
    function moveDown() {
        if (area) {
            setTimeout(() => { area.scrollTo({ top: scrollPosition, behavior: 'instant' }) }, 20);
        }
    }


    /* refresh */
    function refresh() {
        get();
        getTags();
    }


    /* onMount */
	onMount(() => {
        infoCreate(PhotoEditor, undefined);
        get();
        getTags();
        const sub = subscribe('events', refresh);
        const subKeyboardShow = subscribe('keyboardShow', moveUp);
        const subKeyboardHide = subscribe('keyboardHide', moveDown);
        return () => {
            infoDestroy();
            sub.close();
            subKeyboardShow.close();
            subKeyboardHide.close();
        };
	});
</script>


<div 
    class="w-full h-full flex flex-col"
>

    <button
        class="fixed right-3 btn btn-sm btn-error text-base-100 flex z-[12]"
        style="top: {124 + currentStates.safeTop}px"
        on:click="{logout}"
    >
        <span>Выйти</span>
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M304 336v40a40 40 0 0 1-40 40H104a40 40 0 0 1-40-40V136a40 40 0 0 1 40-40h152c22.09 0 48 17.91 48 40v40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 336l80-80l-80-80"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M176 256h256"></path></svg>
    </button>

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
                        {#if resident && (!$userInfoLoading || !start)}
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
                    {#if resident && (!$userInfoLoading || !start) && resident.rating}
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
        <div class="mt-[-20px] h-[calc(100%+20px)] rounded-2xl scrollable-y" bind:this="{area}">
            {#if !resident || ($userInfoLoading && start)}
                <div class="w-full h-full flex justify-center items-center">
                    <span class="loading loading-bars text-front laoding-lg"></span>
                </div>
            {:else}
                <div class="relative mt-[74px]">
                    <div class="text font-medium text-[23px] text-center">{nameNormalization(resident.name, 2)}</div>
                    {#if resident.position}
                        <div class="px-3 text-left text-[12px] opacity-80 mt-1 text-center">{resident.position.toUpperCase()}</div>
                    {/if}
                    {#if resident.company}
                        <div class="px-3 text-left text-[12px] text-front mt-1 text-center">{resident.company.toUpperCase()}</div>
                    {/if}

                    <div class="px-3 flex justify-between mt-6">
                        <div
                            class="w-full srink-1 grow-1"
                        >
                            <InputText
                                placeholder="Имя"
                                bind:value="{residentForm.nameFirst}"
                            />
                        </div>
                        <div
                            class="w-full srink-1 grow-1 ml-1"
                        >
                            <InputText
                                placeholder="Фамилия"
                                bind:value="{residentForm.nameLast}"
                            />
                        </div>
                    </div>
                    <div class="px-3 flex justify-between mt-1">
                        <div
                            class="w-full srink-1 grow-1"
                        >
                            <InputText
                                placeholder="Компания"
                                bind:value="{residentForm.company}"
                            />
                        </div>
                        <div
                            class="w-full srink-1 grow-1 ml-1"
                        >
                            <InputText
                                placeholder="Должность"
                                bind:value="{residentForm.position}"
                            />
                        </div>
                    </div>
                    <div class="px-3 flex justify-between mt-1">
                        <div
                            class="w-full srink-1 grow-1"
                        >
                            <InputText
                                placeholder="Годовой оборот, руб."
                                bind:value="{residentForm.annual}"
                            />
                        </div>
                        <div
                            class="w-full srink-1 grow-1 ml-1"
                        >
                            <InputRadio
                                placeholder="Приватность"
                                options="{[ 'показывать', 'показывать диапазон', 'скрывать' ]}"
                                value="{residentForm.annual_privacy}"
                                on:change="{event => { residentForm.annual_privacy = event.detail; }}"
                            />
                        </div>
                    </div>
                    <div class="px-3 flex justify-between mt-1">
                        <div
                            class="w-full srink-1 grow-1"
                        >
                            <InputText
                                placeholder="Количество сотрудников"
                                bind:value="{residentForm.employees}"
                            />
                        </div>
                        <div
                            class="w-full srink-1 grow-1 ml-1"
                        >
                            <InputRadio
                                placeholder="Приватность"
                                options="{[ 'показывать', 'показывать диапазон', 'скрывать' ]}"
                                value="{residentForm.employees_privacy}"
                                on:change="{event => { residentForm.employees_privacy = event.detail; }}"
                            />
                        </div>
                    </div>
                    <div class="px-3 mt-1">
                        <InputSlider
                            placeholder="В бизнесе с"
                            min="{1985}"
                            max="{year}"
                            bind:value="{residentForm.experience}"
                        />
                    </div>
                    <div class="px-3 mt-1">
                        <InputTags
                            placeholder="Отрасли бизнеса"
                            type="catalog"
                            bind:value="{residentForm.catalog}"
                        />
                    </div>
                    <div class="px-3 mt-1">
                        <InputTags
                            placeholder="Специализация компании"
                            type="tag"
                            bind:value="{residentForm.tags_1_company_scope}"
                            splitChar="|"
                            readonly="{true}"
                        />
                    </div>
                    <div class="px-3 mt-1">
                        <InputTags
                            placeholder="Потребности компании"
                            type="interest"
                            bind:value="{residentForm.tags_1_company_needs}"
                            splitChar="|"
                            readonly="{true}"
                        />
                    </div>
                    <div class="px-3 mt-1">
                        <InputTags
                            placeholder="Допуски, лицензии, сертификаты"
                            type="catalog"
                            bind:value="{residentForm.tags_1_licenses}"
                            splitChar="|"
                            readonly="{true}"
                        />
                    </div>
                    <div class="px-3 mt-1">
                        <InputTags
                            placeholder="Личная экспертиза"
                            type="tag"
                            bind:value="{residentForm.tags_1_personal_expertise}"
                            splitChar="|"
                            readonly="{true}"
                        />
                    </div>
                    <div class="px-3 mt-1">
                        <InputTags
                            placeholder="Потребности в экспертизе"
                            type="tag"
                            bind:value="{residentForm.tags_1_personal_needs}"
                            splitChar="|"
                            readonly="{true}"
                        />
                    </div>
                    <div class="px-3 mt-1">
                        <InputTags
                            placeholder="Хобби, увлечения"
                            type="tag"
                            bind:value="{residentForm.tags_1_hobbies}"
                            splitChar="|"
                            readonly="{true}"
                        />
                    </div>
                    <!--
                    <div class="px-3 mt-1">
                        <InputTags
                            placeholder="Личная экспертиза"
                            type="tag"
                            list="{tags.map(t => { return { tag: t.tag, amount: t.interests }; })}"
                            bind:value="{residentForm.tags}"
                        />
                    </div>
                    <div class="px-3 mt-1">
                        <InputTags
                            placeholder="Потребности в экспертизе"
                            type="interest"
                            list="{tags.map(t => { return { tag: t.tag, amount: t.competency }; })}"
                            bind:value="{residentForm.interests}"
                        />
                    </div>
                    -->
                    <div class="px-3 mt-1">
                        <InputTags
                            placeholder="Город"
                            type="catalog"
                            list="{[ 'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Владивосток', 'Калининград', 'Воронеж', 'Ростов-на-Дону' ]}"
                            bind:value="{residentForm.city}"
                        />
                    </div>
                    <!--
                    <div class="px-3 mt-1">
                        <InputTags
                            placeholder="Хобби и увлечения"
                            type="catalog"
                            bind:value="{residentForm.hobby}"
                        />
                    </div>
                    -->
                    <div class="w-[160px] mt-3 ml-3">
                        <button
                            class="btn btn-front w-full text-base-100"
                            class:btn-active="{!formUpdate}"
                            class:opacity-60="{!formUpdate}"
                            on:click="{() => {
                                if (formUpdate)
                                    update();
                            }}"
                        >
                            {#if $userUpdateLoading}
                                <span class="loading loading-bars text-base-100 laoding-sm"></span>
                            {:else}
                                <span>Изменить</span>
                            {/if}
                        </button>
                    </div>

                    <!-- Смена avatar -->
                    <div class="font-semibold text-lg px-3 mt-6 mb-5">Изменить фото</div>
                    <div class="w-full px-3">
                        <div class="w-[160px]">
                            <button
                                class="btn btn-front w-full text-base-100"
                                on:click="{infoShow}"
                            >
                                <span>Выбрать</span>
                            </button>
                        </div>
                    </div>


                    <!-- Смена email-->
                    <div class="font-semibold text-lg px-3 mt-6 mb-5">Изменить email</div>
                    <div class="w-full">
                        <div class="px-3 flex justify-between">
                            <div
                                class="w-full srink-1 grow-1"
                            >
                                <InputText
                                    placeholder="Новый email"
                                    disabled="{flagEmail}"
                                    bind:value="{accountEmail}"
                                    clearButton="{true}"
                                    on:clear="{() => {
                                        accountEmail = '';
                                        flagEmail = false;
                                    }}"
                                />
                            </div>
                            <div
                                class="w-[120px] srink-0 grow-0 ml-1"
                            >
                                <InputText
                                    placeholder="Код"
                                    disabled="{!flagEmail}"
                                    bind:value="{codeEmail}"
                                />
                            </div>
                        </div>
                        <div class="relative overflow-hidden w-full h-[48px] mt-3">
                            <div
                                class="absolute h-full w-[200%] flex transition-all"
                                class:ml-0="{!flagEmail}"
                                class:ml-[-100%]="{flagEmail}"
                            >
                                <div class="w-full px-3">
                                    <div class="w-[160px]">
                                        <button
                                            class="btn btn-front w-full text-base-100"
                                            class:btn-active="{!validEmail}"
                                            class:opacity-60="{!validEmail}"
                                            on:click="{() => {
                                                if (validEmail) {
                                                    sendCode('email');
                                                }
                                            }}"
                                        >
                                            {#if $userChangeEmailLoading}
                                                <span class="loading loading-bars text-base-100 laoding-sm"></span>
                                            {:else}
                                                <span>Получить код</span>
                                            {/if}
                                        </button>
                                    </div>
                                </div>
                                <div class="w-full px-3">
                                    <div class="w-[160px]">
                                        <button
                                            class="btn btn-front w-full text-base-100"
                                            class:btn-active="{codeEmail.length != 4}"
                                            class:opacity-60="{codeEmail.length != 4}"
                                            on:click="{() => {
                                                if (codeEmail.length == 4) {
                                                    change('email');
                                                }
                                            }}"
                                        >
                                            {#if $userChangeEmailValidateLoading}
                                                <span class="loading loading-bars text-base-100 laoding-sm"></span>
                                            {:else}
                                                <span>Изменить</span>
                                            {/if}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Смена phone -->
                    <div class="font-semibold text-lg px-3 mt-6 mb-5">Изменить телефон</div>
                    <div class="w-full">
                        <div class="px-3 flex justify-between">
                            <div
                                class="w-full srink-1 grow-1"
                            >
                                <InputText
                                    placeholder="Новый телефон"
                                    disabled="{flagPhone}"
                                    bind:value="{accountPhone}"
                                    clearButton="{true}"
                                    on:clear="{() => {
                                        accountPhone = '';
                                        flagPhone = false;
                                    }}"

                                />
                            </div>
                            <div
                                class="w-[120px] srink-0 grow-0 ml-1"
                            >
                                <InputText
                                    placeholder="Код"
                                    disabled="{!flagPhone}"
                                    bind:value="{codePhone}"
                                />
                            </div>
                        </div>
                        <div class="relative overflow-hidden w-full h-[48px] mt-3">
                            <div
                                class="absolute h-full w-[200%] flex transition-all"
                                class:ml-0="{!flagPhone}"
                                class:ml-[-100%]="{flagPhone}"
                            >
                                <div class="w-full px-3">
                                    <div class="w-[160px]">
                                        <button
                                            class="btn btn-front w-full text-base-100"
                                            class:btn-active="{!validPhone}"
                                            class:opacity-60="{!validPhone}"
                                            on:click="{() => {
                                                if (validPhone) {
                                                    sendCode('email');
                                                }
                                            }}"
                                        >
                                            {#if $userChangePhoneLoading}
                                                <span class="loading loading-bars text-base-100 laoding-sm"></span>
                                            {:else}
                                                <span>Получить код</span>
                                            {/if}
                                        </button>
                                    </div>
                                </div>
                                <div class="w-full px-3">
                                    <div class="w-[160px]">
                                        <button
                                            class="btn btn-front w-full text-base-100"
                                            class:btn-active="{codePhone.length != 4}"
                                            class:opacity-60="{codePhone.length != 4}"
                                            on:click="{() => {
                                                if (codePhone.length == 4) {
                                                    change('email');
                                                }
                                            }}"
                                        >
                                            {#if $userChangePhoneValidateLoading}
                                                <span class="loading loading-bars text-base-100 laoding-sm"></span>
                                            {:else}
                                                <span>Изменить</span>
                                            {/if}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Смена password -->
                    <div class="font-semibold text-lg px-3 mt-6 mb-5">Изменить пароль</div>
                    <div class="w-full">
                        <div class="w-full px-3">
                            <InputText
                                placeholder="Новый пароль"
                                bind:value="{codeCredentials1}"
                            />
                        </div>
                        <div class="w-full px-3 mt-1">
                            <InputText
                                placeholder="Повторить новый пароль"
                                bind:value="{codeCredentials2}"
                            />
                        </div>
                        <div class="w-full px-3 mt-3">
                            <div class="w-[160px]">
                                <button
                                    class="btn btn-front w-full text-base-100"
                                    class:btn-active="{codeCredentials1.length < 4 || codeCredentials1 !== codeCredentials2}"
                                    class:opacity-60="{codeCredentials1.length < 4 || codeCredentials1 !== codeCredentials2}"
                                    on:click="{() => {
                                        if (codeCredentials1.length >= 4 && codeCredentials1 === codeCredentials2) {
                                            change('password');
                                        }
                                    }}"
                                >
                                    {#if $userChangeCredentialsLoading}
                                        <span class="loading loading-bars text-base-100 laoding-sm"></span>
                                    {:else}
                                        <span>Изменить</span>
                                    {/if}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Удаление профиля -->
                    <div class="font-semibold text-lg px-3 mt-6 mb-3">Удалить профиль</div>
                    <div class="w-full px-3 mb-6">
                        <div class="text-sm mb-4">После удаления профиля, через 2 недели его восстановление будет невозможно!</div>
                        <div class="dropdown dropdown-right">
                            <div tabindex="0" role="button" class="btn btn-sm btn-error text-base-100 flex">
                                <span>Удалить</span>
                                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M12 1.75a3.25 3.25 0 0 1 3.245 3.066L15.25 5h5.25a.75.75 0 0 1 .102 1.493L20.5 6.5h-.796l-1.28 13.02a2.75 2.75 0 0 1-2.561 2.474l-.176.006H8.313a2.75 2.75 0 0 1-2.714-2.307l-.023-.174L4.295 6.5H3.5a.75.75 0 0 1-.743-.648L2.75 5.75a.75.75 0 0 1 .648-.743L3.5 5h5.25A3.25 3.25 0 0 1 12 1.75zm6.197 4.75H5.802l1.267 12.872a1.25 1.25 0 0 0 1.117 1.122l.127.006h7.374c.6 0 1.109-.425 1.225-1.002l.02-.126L18.196 6.5zM13.75 9.25a.75.75 0 0 1 .743.648L14.5 10v7a.75.75 0 0 1-1.493.102L13 17v-7a.75.75 0 0 1 .75-.75zm-3.5 0a.75.75 0 0 1 .743.648L11 10v7a.75.75 0 0 1-1.493.102L9.5 17v-7a.75.75 0 0 1 .75-.75zm1.75-6a1.75 1.75 0 0 0-1.744 1.606L10.25 5h3.5A1.75 1.75 0 0 0 12 3.25z" fill="currentColor"></path></g></svg>
                            </div>
                            <div class="dropdown-content z-[1] flex">
                                <button
                                    tabindex="0" 
                                    class="btn btn-sm btn-error text-base-100 ml-1"
                                    on:click="{terminate}"
                                >
                                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M9 16.17L5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41L9 16.17z" fill="currentColor"></path></svg>
                                </button>
                                <button
                                    tabindex="0" 
                                    class="btn btn-sm btn-neutral text-base-100 ml-1"
                                    on:click="{blurActiveElement}"
                                >
                                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" fill="currentColor"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div>

</div>
