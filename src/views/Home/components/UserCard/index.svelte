<script lang="ts">
    import { router } from '@/libs/Router';

    import { Avatar, Tag } from '@/components';

    import { nameNormalization } from '@/utils/names';

    import { meetings } from '@/stores';


    export let user: { [key: string]: any };
    export let showTags: boolean = false;


    $: position = user.position ? user.position.toUpperCase() : '';

    $: company = user.company ? user.company.toUpperCase() : '';

    $: catalog = user.catalog ? cropCatalog(user.catalog) : '';

    $: flag_meetings = $meetings[user.id.toString()] && $meetings[user.id.toString()].meetings;
    $: flag_favorites = $meetings[user.id.toString()] !== undefined ? $meetings[user.id.toString()].favorites : null;


    /* cropCatalog */
    function cropCatalog(c) {
        const parts = c.split(/\s*,\s*/).filter(c => c);
        const ln = parts.length;
        let result = '';
        for (let i = 0; i < ln; i++) {
            if (result.length)
                result += ', ';
            result += parts[i];
            if (result.length > 100 && i < ln - 1) {
                result += '…';
                break;
            }
        }
        return result.toUpperCase();
    }
</script>


<button
    class="w-[284px] h-[172px] pl-3"
    on:click="{() => { if (user.id != 12114) router.go('/residents/' + user.id.toString()); }}"
>
    <div class="relative rounded-2xl w-full h-full overflow-hidden p-3.5">
        <div class="absolute w-full h-full top-0 left-0 bg-base-300 opacity-40"></div>
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
                    {#if flag_meetings}
                        <div class="w-full flex justify-center mt-[3px]">
                            <div
                                class="text-base-100 px-[5px] py-[1px] leading-3 text-[8px] font-semibold shrink-0 grow-0 rounded-lg"
                                class:bg-success="{flag_favorites === true}"
                                class:bg-error="{flag_favorites === false}"
                                class:bg-warning="{flag_favorites === null}"
                            >ЗНАКОМЫ</div>
                        </div>
                    {/if}
                </div>
                <div class="ml-4 shrink-1 grow-1 w-full">
                    <div class="mb-[4px] mt-[2px]">
                        <div class="text-left font-medium text-[16px] leading-[19px]">{nameNormalization(user.name, 2)}</div>
                    </div>
                    {#if position}
                        <div class="text-left text-[10px] opacity-80">{position}</div>
                    {/if}
                    {#if company}
                        <div class="text-left font-medium text-[10px] text-front mt-0.5">{company}</div>
                    {/if}
                </div>
            </div>
            {#if catalog}
                <div class="text-left font-medium text-[10px] leading-[14px] text-moderate mt-0.5">{catalog}</div>
            {/if}
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
