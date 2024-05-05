<script lang="ts">
    import { InputText } from './components';

    import { router } from '@/libs/Router';

	import { Entity, collector } from '@/helpers/entity';
	import {
		userLogin,
        userSetCode,
        userValidateCode,
    } from '@/queries/auth';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;


    const testEmail = new RegExp('[^@]+@[^@]+\\.[^@\\.]{2,}');
    const testPhone = new RegExp('[\\d\\s\\(\\)\\-]{10,20}');


	/* DATA: userLoginHandler */
	const userLoginHandler = new Entity({
		model: userLogin.model,
		retriever: userLogin.retriever,
	});

	/* DATA: userSetCodeHandler */
	const userSetCodeHandler = new Entity({
		model: userSetCode.model,
		retriever: userSetCode.retriever,
	});

	/* DATA: userValidateCodeHandler */
	const userValidateCodeHandler = new Entity({
		model: userValidateCode.model,
		retriever: userValidateCode.retriever,
	});


    let step = 1;
    let code = false;

    let waitFlag = false;

    let accessId: string = '';
    let accessCode: string = '';


    $: validPhone = testPhone.test(accessId);
    $: validEmail = testEmail.test(accessId);


    /* sendCode */
    function sendCode() {
        waitFlag = true;
        setTimeout(() => { waitFlag = false; }, 10000);
        accessCode = '';
        collector.get([
  			[ 
                userSetCodeHandler,
                {
                    type: step == 1 ? 'mobile' : 'email',
                    account: accessId,
                }
            ],
  		]);
    }


    /* submit */
    function submit() {
        if (step == 3) {
            collector.get([
                [ 
                    userLoginHandler,
                    {
                        account: accessId,
                        password: accessCode,
                    }
                ],
            ]);
        }
        else {
            collector.get([
                [ 
                    userValidateCodeHandler,
                    {
                        type: step == 1 ? 'mobile' : 'email',
                        account: accessId,
                        code: accessCode,
                    }
                ],
            ]);
        }
    }
</script>


<div class="w-full h-full flex flex-col justify-between">
    <!-- -->
    <div class="flex p-6 shrink-0 grow-0">
        <button
            class="border-b-2 px-2 py-1.5 text-sm text-base-200 transition-all"
            class:border-scene="{step != 1}"
            class:border-front="{step == 1}"
            on:click="{() => { 
                if (step != 1) {
                    accessId = '';
                    accessCode = '';
                    code = false;
                    step = 1;
                }
            }}"
        >Телефон</button>
        <button
            class="ml-5 border-b-2 px-2 py-1.5 text-sm text-base-200 transition-all"
            class:border-scene="{step != 2}"
            class:border-front="{step == 2}"
            on:click="{() => {
                if (step != 2) {
                    accessId = '';
                    accessCode = '';
                    code = false;
                    step = 2;
                }
            }}"
        >Email</button>
        <button
            class="ml-5 border-b-2 border-b px-2 py-1.5 text-sm text-base-200 transition-all"
            class:border-scene="{step != 3}"
            class:border-front="{step == 3}"
            on:click="{() => {
                if (step != 3) {
                    accessId = '';
                    accessCode = '';
                    code = false;
                    step = 3;
                }
            }}"
        >Пароль</button>
    </div>
    <!-- -->
    <div class="shrink-0 grow-0">
        <div class="px-6 mb-1 flex items-center">
            <img src="/germes-logo-orange.svg" class="h-10 w-auto mt-1" alt="Гермес" />
            <div class="ml-3 text-[40px] text-base-200 whitespace-nowrap">Клуб Гермес</div>
        </div>
        <div class="px-6 text-sm text-base-200 mb-8">Войдите, чтобы продолжить</div>
        <div class="relative overflow-hidden w-full h-[200px]">
            <div
                class="absolute h-full w-[300%] flex transition-all"
                class:ml-0="{step == 1}"
                class:ml-[-100%]="{step == 2}"
                class:ml-[-200%]="{step == 3}"
            >
                <div class="w-full">
                    <div class="px-6">
                        <div class="w-[240px] mb-1">
                            <InputText
                                placeholder="Телефон"
                                disabled="{code}"
                                bind:value="{accessId}"
                            />
                        </div>
                    </div>
                    <div class="relative overflow-hidden w-full h-[132px]">
                        <div
                            class="absolute h-full w-[200%] flex transition-all"
                            class:ml-0="{!code}"
                            class:ml-[-100%]="{code}"
                        >
                            <div class="flex flex-col w-full px-6">
                                <div class="mt-5 w-[160px]">
                                    <button
                                        class="btn btn-front w-full text-base-100"
                                        class:btn-active="{!validPhone}"
                                        class:opacity-60="{!validPhone}"
                                        on:click="{() => {
                                            if (validPhone) {
                                                code = true;
                                                sendCode();
                                            }
                                        }}"
                                    >Получить код</button>
                                </div>
                            </div>
                            <div class="flex flex-col w-full px-6">
                                <div class="w-[200px] flex justify-between">
                                    <div class="w-[140px]">
                                        <InputText
                                            placeholder="Код"
                                            bind:value="{accessCode}"
                                        />
                                    </div>
                                </div>
                                <div class="mt-5 w-[160px]">
                                    <button
                                        class="btn btn-front w-full text-base-100"
                                        class:btn-active="{accessCode.length != 4}"
                                        class:opacity-60="{accessCode.length != 4}"
                                        on:click="{() => {
                                            if (accessCode.length == 4)
                                                submit();
                                        }}"
                                    >Войти</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full">
                    <div class="px-6">
                        <div class="w-[240px] mb-1">
                            <InputText
                                placeholder="Email"
                                disabled="{code}"
                                bind:value="{accessId}"
                            />
                        </div>
                    </div>
                    <div class="relative overflow-hidden w-full h-[132px]">
                        <div
                            class="absolute h-full w-[200%] flex transition-all"
                            class:ml-0="{!code}"
                            class:ml-[-100%]="{code}"
                        >
                            <div class="flex flex-col w-full px-6">
                                <div class="mt-5 w-[160px]">
                                    <button
                                        class="btn btn-front w-full text-base-100"
                                        class:btn-active="{!validEmail}"
                                        class:opacity-60="{!validEmail}"
                                        on:click="{() => {
                                            if (validEmail) {
                                                code = true;
                                                sendCode();
                                            }
                                        }}"
                                    >Получить код</button>
                                </div>
                            </div>
                            <div class="flex flex-col w-full px-6">
                                <div class="w-[200px] flex justify-between">
                                    <div class="w-[140px]">
                                        <InputText
                                            placeholder="Код"
                                            bind:value="{accessCode}"
                                        />
                                    </div>
                                </div>
                                <div class="mt-5 w-[160px]">
                                    <button
                                        class="btn btn-front w-full text-base-100"
                                        class:btn-active="{accessCode.length != 4}"
                                        class:opacity-60="{accessCode.length != 4}"
                                        on:click="{() => {
                                            if (accessCode.length == 4)
                                                submit();
                                        }}"
                                    >Войти</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full">
                    <div class="flex flex-col w-full px-6">
                        <div class="w-[240px] mb-1">
                            <InputText
                                placeholder="Телефон / Email"
                                disabled="{code}"
                                bind:value="{accessId}"
                            />
                        </div>
                        <div class="w-[240px]">
                            <InputText
                                placeholder="Пароль"
                                bind:value="{accessCode}"
                            />
                        </div>
                        <div class="mt-5 w-[160px]">
                            <button
                                class="btn btn-front w-full text-base-100"
                                class:btn-active="{(!validPhone && !validEmail) || accessCode.length < 4}"
                                class:opacity-60="{(!validPhone && !validEmail) || accessCode.length < 4}"
                                on:click="{() => {
                                    if ((validPhone || validEmail) && accessCode.length > 3)
                                        submit();
                                }}"
                            >Войти</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- -->
    <div class="p-6 shrink-0 grow-0">
        <button
            class="px-2 py-1.5 text-sm text-base-200 transition-all shrink-0 grow-0 items-center mb-0.5"
            on:click="{() => {
                router.go('/register');
            }}"
        >Регистрация</button>
    </div>
</div>
