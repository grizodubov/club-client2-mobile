<script lang="ts">
    import { InputText } from './components';

    import { router } from '@/libs/Router';

	import { Entity, collector } from '@/helpers/entity';
	import {
        userValidate,
        userRegister,
    } from '@/queries/auth';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;


    const testEmail = new RegExp('[^@]+@[^@]+\\.[^@\\.]{2,}');
    const testPhone = new RegExp('[\\d\\s\\(\\)\\-]{10,20}');

    let accountNameFirst = '';
    let accountNameSecond = '';
    let accountEmail = '';
    let accountPhone = '';
    let codeEmail = '';
    let codePhone = '';
    let flagEmail = false;
    let flagPhone = false;
    let accountCredentials1 = '';
    let accountCredentials2 = '';
    let accountCompany = '';
    let accountPosition = '';

    $: flagValid = flagEmail && flagPhone;


    $: validEmail = testEmail.test(accountEmail);
    $: validPhone = testPhone.test(accountPhone);


    $: ready = validEmail && validEmail && flagValid &&
        accountNameFirst.length > 1 && accountNameSecond.length > 1 &&
        /^\d{4}$/.test(codeEmail) && /^\d{4}$/.test(codePhone) &&
        accountCredentials1.length >= 4 && accountCredentials1 == accountCredentials2;


    /* DATA: userValidateHandler */
	const userValidateHandler = new Entity({
		model: userValidate.model,
		retriever: userValidate.retriever,
        onSuccess: () => {
            flagEmail = true;
            flagPhone = true;
        },
	});

    let userValidateLoading = userValidateHandler.loading;


	/* DATA: userRegisterHandler */
	const userRegisterHandler = new Entity({
		model: userRegister.model,
		retriever: userRegister.retriever,
        onSuccess: () => {
        },
	});

    let userRegisterLoading = userRegisterHandler.loading;


    /* sendCodes */
    function sendCodes() {
        collector.get([
            [ 
                userValidateHandler,
                {
                    email: accountEmail,
                    phone: accountPhone,
                }
            ],
        ]);
    }


    /* register */
    function register() {
        collector.get([
            [ 
                userRegisterHandler,
                {
                    name: accountNameFirst + ' ' + accountNameFirst,
                    email: accountEmail,
                    phone: accountPhone,
                    emailCode: codeEmail,
                    phoneCode: codePhone,
                    company: accountCompany,
                    position: accountPosition,
                    password: accountCredentials1,
                }
            ],
        ]);
    }
</script>


<div class="w-full h-full flex flex-col justify-between">
    <!-- -->
    <div class="flex p-6 shrink-0 grow-0">
        <button
            class="px-2 py-1.5 text-sm text-base-200 transition-all shrink-0 grow-0 items-center mb-0.5"
            on:click="{() => {
                router.go('/auth');
            }}"
        >Уже зарегистрированы?</button>
    </div>
    <!-- -->
    <div class="shrink-0 grow-0">
        <div class="px-6 mb-1 flex items-center">
            <img src="/germes-logo-orange.svg" class="h-10 w-auto mt-1" alt="Гермес" />
            <div class="ml-3 text-[40px] text-base-200 whitespace-nowrap">Клуб Гермес</div>
        </div>
        <div class="px-6 text-sm text-base-200 mb-8">Регистрация для новых членов клуба</div>
        <div class="w-full px-6">
            <div class="flex justify-between">
                <div
                    class="w-full srink-1 grow-1"
                >
                    <InputText
                        placeholder="Имя"
                        bind:value="{accountNameFirst}"
                    />
                </div>
                <div
                    class="w-full srink-1 grow-1 ml-1"
                >
                    <InputText
                        placeholder="Фамилия"
                        bind:value="{accountNameSecond}"
                    />
                </div>
            </div>
            <div class="flex justify-between mt-1">
                <div
                    class="w-full srink-1 grow-1"
                >
                    <InputText
                        placeholder="Email"
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
            <div class="flex justify-between mt-1">
                <div
                    class="w-full srink-1 grow-1"
                >
                    <InputText
                        placeholder="Телефон"
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
            <div class="flex justify-between mt-1">
                <div
                    class="w-full srink-1 grow-1"
                >
                    <InputText
                        placeholder="Пароль"
                        bind:value="{accountCredentials1}"
                    />
                </div>
                <div
                    class="w-full srink-1 grow-1 ml-1"
                >
                    <InputText
                        placeholder="Повторить пароль"
                        bind:value="{accountCredentials2}"
                    />
                </div>
            </div>
            <div class="flex justify-between mt-1">
                <div
                    class="w-full srink-1 grow-1"
                >
                    <InputText
                        placeholder="Компания"
                        bind:value="{accountCompany}"
                    />
                </div>
                <div
                    class="w-full srink-1 grow-1 ml-1"
                >
                    <InputText
                        placeholder="Должность"
                        bind:value="{accountPosition}"
                    />
                </div>
            </div>
            <div class="relative overflow-hidden w-full h-[48px] mt-5">
                <div
                    class="absolute h-full w-[200%] flex transition-all"
                    class:ml-0="{!flagValid}"
                    class:ml-[-100%]="{flagValid}"
                >
                    <div class="w-full">
                        <div class="w-[160px]">
                            <button
                                class="btn btn-front w-full text-base-100"
                                class:btn-active="{!validEmail || !validPhone}"
                                class:opacity-60="{!validEmail || !validPhone}"
                                on:click="{() => {
                                    if (validEmail &&validPhone) {
                                        sendCodes();
                                    }
                                }}"
                            >
                                {#if $userValidateLoading}
                                    <span class="loading loading-bars text-base-100 loading-sm"></span>
                                {:else}
                                    <span>Получить коды</span>
                                {/if}
                            </button>
                        </div>
                    </div>
                    <div class="w-full">
                        <div class="w-[160px]">
                            <button
                                class="btn btn-front w-full text-base-100"
                                class:btn-active="{!ready}"
                                class:opacity-60="{!ready}"
                                on:click="{() => {
                                    if (ready) {
                                        register();
                                    }
                                }}"
                            >
                                {#if $userRegisterLoading}
                                    <span class="loading loading-bars text-base-100 loading-sm"></span>
                                {:else}
                                    <span>Зарегистрироваться</span>
                                {/if}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- -->
    <div class="h-[98px] p-6 shrink-0 grow-0">
    </div>
</div>
