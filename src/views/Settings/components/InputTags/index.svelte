<script lang="ts">
    import { fade } from 'svelte/transition';

    import { Device } from '@capacitor/device';

    import { onMount } from 'svelte';

    import { subscribe } from '@/helpers/notification';

    import { Tag } from '@/components';


    export let placeholder: string;
    export let type: 'tag' | 'interest' | 'catalog';
    export let value: string;
    export let list: any[] = [];


    let focus = false;
    let valueTag = '';

    let deviceInfo: any = {};

    let input: any;


    let suggestions: any[] = [];


    $: valueSplitted = value.split(/\s*,\s*/).map((v: string) => v.trim().toLowerCase()).filter(v => v);


    /* addTag */
    function addTag(tag: string) {
        const t = tag.trim().toLowerCase();
        if (tag && valueSplitted.indexOf(t) == -1) {
            value = value + ',' + tag;
            valueTag = '';
        }
    }


    /* deleteTag */
    function deleteTag(tag: string) {
        const t = tag.trim().toLowerCase();
        const i = valueSplitted.indexOf(t);
        if (i > -1) {
            const temp = value.split(/\s*,\s*/);
            temp.splice(i, 1);
            value = temp.join(',');
        }
    }


    /* createSuggestions */
    function createSuggestions() {
        const temp: any[] = [];
        const test = valueTag.trim().toLowerCase();
        if (test.length >= 2) {
            list.forEach((t: any) => {
                const tt = typeof t === 'string' ? t.toLowerCase() : t.tag.toLowerCase();
                if (tt.indexOf(test) > -1)
                    temp.push(t);
            });
            if (temp.length) {
                temp.sort((a, b) => {
                    if (typeof a == 'string') {
                        if (a.toLowerCase() > b.toLowerCase())
                            return 1;
                        if (a.toLowerCase() < b.toLowerCase())
                            return -1;
                        return 0;
                    }
                    else {
                        if (a.amount < b.amount)
                            return 1;
                        if (a.amount > b.amount)
                            return -1;
                        if (a.tag.toLowerCase() > b.tag.toLowerCase())
                            return 1;
                        if (a.tag.toLowerCase() < b.tag.toLowerCase())
                            return -1;
                        return 0;
                    }
                });
                suggestions = temp;
                return;
            }
        }
        suggestions = [];
    }


    /* getDeviceInfo */
    const getDeviceInfo = async () => {
        return await Device.getInfo();
    };


    /* getDevice */
    async function getDevice() {
        deviceInfo = await getDeviceInfo();
    }


    /* blur */
    function blur() {
        if (input && focus && deviceInfo.platform && (deviceInfo.platform == 'ios' || deviceInfo.platform == 'android'))
            input.blur();
    }


    /* scrollOnMobbile */
    function scrollOnMobile() {
        if (input && focus && deviceInfo.platform && (deviceInfo.platform == 'ios' || deviceInfo.platform == 'android'))
            input.scrollIntoView({ block: 'center' });
    }


     /* onMount */
     onMount(() => {
        getDevice();
        const sub = subscribe('forceBlur', blur);
        return () => {
            sub.close();
        };
	});
</script>


<style>
    .flex-gap > * {
        margin: 6px 0 0 8px;
    }

    .flex-gap {
        display: inline-flex;
        flex-wrap: wrap;
        margin: -6px 0 0 -8px;
        width: calc(100% + 8px);
    }
</style>


<div
    class="relative w-full overflow-hidden pt-7"
>
    <div
        class="absolute top-0 h-full w-full pt-1 pl-[14px] bg-base-200 text-xs opacity-50"
        class:border-transparent="{!focus}"
        class:border-neutral="{focus}"
    >
        <span>{placeholder}</span>
    </div>
    {#if valueSplitted.length}
        <div class="relative pl-[14px] pr-3 mb-4">
            <div class="flex-gap">
                {#each valueSplitted as tag}
                    <div class="mt-1"><Tag
                        type="{type}"
                        tag="{tag}"
                        deleteButton="{true}"
                        on:delete="{() => {
                            deleteTag(tag);
                        }}"
                    /></div>
                {/each}
            </div>
        </div>
    {/if}
    <div
        class="relative h-16 w-full overflow-hidden"
    >
        <div
            class="absolute top-0 h-full w-full pt-1 pl-3 bg-base-200 text-xs border-l-2"
            class:border-transparent="{!focus}"
            class:border-neutral="{focus}"
        >
        </div>
        <input
            type="text"
            class="absolute top-0 left-[2px] h-full w-[calc(100%-2px)] px-3 m-0 bg-transparent
                outline-none border-0 focus:outline-none focus:border-0 shadow-none focus:shadow-none"
            bind:value="{valueTag}"
            on:focus="{() => {
                focus = true;
                createSuggestions();
                scrollOnMobile();
            }}"
            on:blur="{() => {
                focus = false;
                suggestions = [];
            }}"
            on:keyup="{() => {
                createSuggestions();
            }}"
            bind:this="{input}"
        />
        {#if valueTag.length}
            <button
                class="absolute rounded-lg w-8 h-8 top-[18px] right-2 flex items-center justify-center bg-primary text-base-100"
                in:fade="{{ duration: 100 }}"
                out:fade="{{ duration: 100 }}"
                on:click="{() => {
                    addTag(valueTag);
                }}"
            >
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M17 15V8h-2v7H8v2h7v7h2v-7h7v-2z" fill="currentColor"></path></svg>
            </button>
        {/if}
    </div>
</div>
{#if suggestions.length}
    <ul
        class="absolute w-[calc(100%-24px)] max-h-[200px] overflow-y-auto z-[15] bg-base-300 border-l-2 border-l-scene"
        in:fade="{{ duration: 100 }}"
        out:fade="{{ duration: 100 }}"
    >
        {#each suggestions as s}
            <li class="relative w-full first:mt-1.5 last:mb-1.5">
                <button
                    class="w-full flex items-center justify-between"
                    on:mousedown="{() => {
                        valueTag = typeof s == 'string' ? s : s.tag;
                    }}"
                >
                    {#if typeof s === 'string'}
                        <span class="mx-2 py-1 text-sm text-left overflow-hidden">{s}</span>
                    {:else}
                        <span class="mx-2 py-1 text-sm text-left shrink-1 grow-1 overflow-hidden">{s.tag}</span>
                        <span class="mx-2 py-1 text-sm text-right shrink-0 grow-0 w-8 opacity-50">{s.amount}</span>
                    {/if}
                </button>
            </li>
        {/each}
    </ul>
{/if}
