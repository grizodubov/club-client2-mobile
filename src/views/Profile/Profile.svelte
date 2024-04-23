<script lang="ts">
   import { onMount } from 'svelte';

   import { Avatar } from '@/components';

   import { type User, user } from '@/stores';

   import { findTags } from '@/utils/tags';

   import { nameNormalization } from '@/utils/names';

   import { subscribe } from '@/helpers/notification';

    import { Entity, collector } from '@/helpers/entity';
    import {
        residentsList,
    } from '@/queries/user';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;


    $: currentUser = $user as User;


    let resident: any;


    /* DATA: residentsListHandler */
	const residentsListHandler = new Entity({
		model: residentsList.model,
		retriever: residentsList.retriever,
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

    let residentsListLoading = residentsListHandler.loading;


    /* get */
    function get() {
        collector.get([
            [ 
                residentsListHandler,
                {}
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
                <div class="mt-6 w-[156px] h-[156px]">
                    <div
                        class="absolute w-[156px] h-[156px] rounded-full overflow-hidden paddin-2 border-0 border-front bg-front z-[11]"
                    >
                        {#if resident && !$residentsListLoading}
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

            {#if !resident || $residentsListLoading}
                <div class="w-full h-full flex justify-center items-center">
                    <span class="loading loading-bars text-front laoding-lg"></span>
                </div>
            {:else}

                <div class="h-80"></div>
            {/if}

        </div>
    </div>

</div>
