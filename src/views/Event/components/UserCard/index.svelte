<script lang="ts">
    import { EVENTS } from '@/config/events.cfg';

    import { router } from '@/libs/Router';

    import { Avatar, Tag } from '@/components';

    import { nameNormalization } from '@/utils/names';


    export let user: { [key: string]: any };
    export let event: { [key: string]: any };
    export let showTags: boolean = false;


    $: currentFormat = event ? EVENTS.find(f => f.format == event.format) : undefined;

    $: position = user.position ? user.position.toUpperCase() : '';

    $: company = user.company ? user.company.toUpperCase() : '';
</script>


<button
    class="w-[264px] pl-3"
    class:h-[142px]="{!showTags}"
    class:h-[186px]="{showTags}"
    on:click="{() => { if (user.id != 12114) router.go('/residents/' + user.id.toString()); }}"
>
    <div class="relative rounded-2xl w-full h-full overflow-hidden p-4">
        <div class="absolute w-full h-full top-0 left-0 bg-{currentFormat?.color} opacity-15"></div>
        <div class="flex flex-col justify-between h-full">
            <div class="relative flex justify-between items-start w-full">
                <div class="w-[58px] flex flex-col items-center">
                    <div class="w-[58px] h-[58px] shrink-0 grow-0">
                        <Avatar user="{{
                            id: user.id,
                            name: user.name,
                            avatar_hash: user.avatar_hash,
                            roles: [ 'client' ],
                            telegram: '',
                        }}" />
                    </div>
                </div>
                <div class="ml-4 shrink-1 grow-1 w-full">
                    <div class="mb-[4px] mt-[2px]">
                        <div class="text-left font-medium text-[16px] leading-[19px]">{nameNormalization(user.name, 2)}</div>
                    </div>
                    {#if position}
                        <div class="text-left text-[10px] opacity-80">{position}</div>
                    {/if}
                    {#if company}
                        <div class="text-left text-[10px] text-front mt-0.5">{company}</div>
                    {/if}
                </div>
            </div>
            {#if showTags}
                <div class="relative overflow-hidden">
                    {#if user.tagsLinked.length > 0}
                        <div class="flex flex-wrap">
                            <div class="mt-1">
                                <Tag type="tag" tag="{user.tagsLinked[0]}" />
                            </div>
                            {#if user.tagsLinked.length > 1}
                                <div class="mt-1 ml-1">
                                    <Tag type="tag" tag="..." />
                                </div>
                            {/if}
                        </div>
                    {/if}
                    {#if user.interestsLinked.length > 0}
                        <div class="flex flex-wrap">
                            <div class="mt-1">
                                <Tag type="interest" tag="{user.interestsLinked[0]}" />
                            </div>
                            {#if user.interestsLinked.length > 1}
                                <div class="mt-1 ml-1">
                                    <Tag type="interest" tag="..." />
                                </div>
                            {/if}
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</button>
