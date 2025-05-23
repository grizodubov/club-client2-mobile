<script lang="ts">
    import { onDestroy, tick } from 'svelte';

    import { type User, user, meetings } from '@/stores';

    import { Avatar } from '@/components';

    import { nameNormalization } from '@/utils/names';

    import { infoHide } from '@/helpers/info';

    import { router } from '@/libs/Router';

    import { homePopupY } from '@/stores/scrolls';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;


    let data: {
        title: string,
        users: { [key: string]: any }[],
    } = {
        title: '',
        users: [],
    };


    let connectLoading: number = 0;

    
    let scrollArea;
    let scrollBeacon = 0;


    $: currentUser = $user as User;


    $: users = parseUsers(data.users);


    /* setScrollBeacon */
    function setScrollBeacon(e) {
        scrollBeacon = e.target.scrollTop;
    }


    /* scrollToPosition */
    async function scrollToPosition() {
        await tick();
        if (scrollArea) {
            setTimeout(() => {
                scrollArea.scrollTo({
                    left: 0,
                    top: $homePopupY,
                    behavior: 'instant',
                });
            }, 1);
        }
    }


    /* update */
    export function update(p: any) {
        if (p.users)
            data = Object.assign(data, p);
        if (p.release)
            if (connectLoading)
                connectLoading = 0;
    }


    /* parseUsers */
    function parseUsers(list) {
        const temp = [ ...list ];
        temp.sort((a: any, b: any) => {
            if (a['name'].toLowerCase() < b['name'].toLowerCase())
                return -1;
            if (a['name'].toLowerCase() > b['name'].toLowerCase())
                return 1;
            return 0;
        });
        return temp;
    }


    /* onDestroy */
    onDestroy(() => {
        if (scrollArea) {
            $homePopupY = scrollBeacon;
        }
    });
</script>


<div class="w-full h-full flex flex-col px-2">
    <div class="w-full flex justify-between items-center shrink-0 grow-0 py-4 px-2 border-b border-base-200">
        <div class="flex">
            <div class="font-medium">{data.title}</div>
        </div>
        <button
            class="w-7 h-7 text-base-300"
            on:click="{() => {
                infoHide();
            }}"
        >
            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2zm4.3 14.3a.996.996 0 0 1-1.41 0L12 13.41L9.11 16.3a.996.996 0 1 1-1.41-1.41L10.59 12L7.7 9.11A.996.996 0 1 1 9.11 7.7L12 10.59l2.89-2.89a.996.996 0 1 1 1.41 1.41L13.41 12l2.89 2.89c.38.38.38 1.02 0 1.41z" fill="currentColor"></path></svg>
        </button>
    </div>
    <div class="w-full h-full shrink-1 grow-1 pb-4 scrollable-y" on:scroll="{setScrollBeacon}" bind:this="{scrollArea}">
        {#if users.length}
            {#each [ ...users, { id: 0 } ] as user (user.id)}
                {#if user.id !== 0}
                    {#if
                        user.id != currentUser.id
                    }
                        <div
                            class="rounded-2xl border-[3px] p-2 mt-1 border-transparent"
                        >
                            <div class="flex justify-between items-stretch w-full">
                                <div
                                    class="relative w-[64px] h-[84px] self-start shrink-0 grow-0"
                                >
                                    <button
                                        class="relative top-[0px] w-[64px] h-[64px] mb-[4px]"
                                        on:click="{() => {
                                            router.go('/residents/' + user.id.toString());
                                        }}"
                                    >
                                        <Avatar
                                            user="{{
                                                id: user.id,
                                                name: user.name,
                                                avatar_hash: user.avatar_hash,
                                                roles: [ 'client' ],
                                                telegram: '',
                                            }}"
                                            online="{user.audit == 2}"
                                        />
                                    </button>
                                    {#if $meetings[user.id.toString()] && $meetings[user.id.toString()].meetings}
                                        <div class="w-full flex justify-center">
                                            <div
                                                class="text-base-100 px-[6px] py-[1px] leading-4 text-[9px] font-semibold shrink-0 grow-0 rounded-lg"
                                                class:bg-success="{$meetings[user.id.toString()] !== undefined && $meetings[user.id.toString()].favorites === true}"
                                                class:bg-error="{$meetings[user.id.toString()] !== undefined && $meetings[user.id.toString()].favorites === false}"
                                                class:bg-warning="{$meetings[user.id.toString()] === undefined || $meetings[user.id.toString()].favorites === null}"
                                            >ЗНАКОМЫ</div>
                                        </div>
                                    {/if}
                                </div>
                                <div class="ml-4 shrink-1 grow-1 w-full flex flex-col justify-between">
                                    <div class="w-full">
                                        <div class="mb-[4px] mt-[2px] flex items-center">
                                            <button
                                                class="text-left font-medium text-[16px] leading-[20px]"
                                                on:click="{() => {
                                                    router.go('/residents/' + user.id.toString());
                                                }}"
                                            >{nameNormalization(user.name, 2)}</button>
                                            {#if user.speaker}
                                                <svg class="w-5 h-5 text-moderate ml-1.5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M29.415 19L27.7 17.285A2.97 2.97 0 0 0 28 16a3 3 0 1 0-3 3a2.97 2.97 0 0 0 1.286-.3L28 20.414V28h-6v-3a7.008 7.008 0 0 0-7-7H9a7.008 7.008 0 0 0-7 7v5h28v-9.586A1.988 1.988 0 0 0 29.415 19zM4 25a5.006 5.006 0 0 1 5-5h6a5.006 5.006 0 0 1 5 5v3H4z" fill="currentColor"></path><path d="M12 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7z" fill="currentColor"></path></svg>
                                            {/if}
                                        </div>
                                        {#if user.position}
                                            <div class="text-left text-[10px] opacity-80">{user.position.toUpperCase()}</div>
                                        {/if}
                                        {#if user.company}
                                            <div class="text-left font-medium text-[10px] text-front mt-0.5">{user.company.toUpperCase()}</div>
                                        {/if}
                                        {#if user.catalog}
                                            <div class="text-left font-medium text-[10px] text-moderate mt-0.5">{user.catalog.split(/\s*,\s*/).filter(c => c).join(', ').toUpperCase()}</div>
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}
                {:else}
                    <div class="w-full h-[0px]" use:scrollToPosition></div>
                {/if}
            {/each}
        {/if}
    </div>
</div>
