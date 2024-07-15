<script lang="ts">
    import { nameNormalization } from '@/utils/names';

    import { logHide } from '@/helpers/log';

    import { router } from '@/libs/Router';

    import { toDateText } from '@/utils/dates';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;


    let data: {
        notifications: { [key: string]: any }[],
    } = {
        notifications: [],
    };


    /* update */
    export function update(p: any) {
        if (p.notifications)
            data = Object.assign(data, p);
    }
</script>


<div class="w-full h-full flex flex-col">
    <div class="w-full flex justify-between items-center shrink-0 grow-0 py-4 px-2 border-b border-base-200">
        <div class="flex">
            
        </div>
        <button
            class="w-7 h-7 text-base-300"
            on:click="{() => {
                logHide();
            }}"
        >
            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2zm4.3 14.3a.996.996 0 0 1-1.41 0L12 13.41L9.11 16.3a.996.996 0 1 1-1.41-1.41L10.59 12L7.7 9.11A.996.996 0 1 1 9.11 7.7L12 10.59l2.89-2.89a.996.996 0 1 1 1.41 1.41L13.41 12l2.89 2.89c.38.38.38 1.02 0 1.41z" fill="currentColor"></path></svg>
        </button>
    </div>
    <div class="w-full h-full shrink-1 grow-1 pb-3 scrollable-y">
        {#each data.notifications as n (n.time_notify)}
            <div
                class="w-full px-3 mt-3"
            >
                <div class="rounded-2xl w-full overflow-hidden p-3 bg-base-200">
                    <div class="text-sm w-full"><span class="font-semibold">{nameNormalization(n.data.initiator.name, 2)}</span> предложил Вам личную встречу на мероприятии <span class="font-semibold">{toDateText(n.data.event.time_event).split(/\s+/)[0]} {toDateText(n.data.event.time_event).split(/\s+/)[1]}</span></div>
                    <div class="flex justify-between mt-2">
                        <button
                            class="btn btn-sm bg-base-300 flex shrink-0 grow-0"
                            on:click="{() => {}}"
                        >
                            <span>В профиль</span>
                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M16 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7z" fill="currentColor"></path><path d="M26 30h-2v-5a5 5 0 0 0-5-5h-6a5 5 0 0 0-5 5v5H6v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7z" fill="currentColor"></path></svg>
                        </button>
                        <button
                            class="btn btn-sm bg-base-300 flex shrink-0 grow-0"
                            on:click="{() => {}}"
                        >
                            <span>К событию</span>
                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M26 4h-4V2h-2v2h-8V2h-2v2H6c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 22H6V12h20v14zm0-16H6V6h4v2h2V6h8v2h2V6h4v4z" fill="currentColor"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>
