<script lang="ts">
    import { Avatar } from '@/components';

    import { router } from '@/libs/Router';

    import { nameNormalization } from '@/utils/names';


    export let resident: { [key: string]: any };
    export let contact: boolean = false;


    $: position = resident.position ? resident.position.toUpperCase() : '';

    $: company = resident.company ? resident.company.toUpperCase() : '';
</script>


<button
    on:click="{() => { router.go('/residents/' + resident.id.toString()); }}"
    class="flex items-start justify-start px-3"
>
    <div class="w-[68px] h-[68px] shrink-0 grow-0">
        <Avatar
            user="{{
                id: resident.id,
                name: resident.name,
                avatar_hash: resident.avatar_hash,
                roles: [ 'client' ],
                telegram: '',
            }}"
            scaleLetters="1.1"
        />
    </div>
    <div class="ml-4 shrink-1 grow-1 w-full">
        <div class="flex items-center h-[28px]">
            <div class="text-left font-medium text-[16px] leading-[28px] whitespace-nowrap overflow-hidden">{nameNormalization(resident.name, 2)}</div>
            {#if resident.rating}
                <div class="w-5 h-5 ml-2.5 text-info">
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024"><path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7c0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311h-.3v428h472.3c9.2 0 18.2-1.8 26.5-5.4c47.6-20.3 78.3-66.8 78.3-118.4c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c-.2-12.6-2-25.1-5.6-37.1zM112 528v364c0 17.7 14.3 32 32 32h65V496h-65c-17.7 0-32 14.3-32 32z" fill="currentColor"></path></svg>
                </div>
            {/if}
            {#if resident.tagsLinked.length > 0 || resident.interestsLinked.length > 0}
                <div class="w-5 h-5 ml-2.5 text-success">
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 640 512"><path d="M434.7 64h-85.9c-8 0-15.7 3-21.6 8.4l-98.3 90c-.1.1-.2.3-.3.4c-16.6 15.6-16.3 40.5-2.1 56c12.7 13.9 39.4 17.6 56.1 2.7c.1-.1.3-.1.4-.2l79.9-73.2c6.5-5.9 16.7-5.5 22.6 1c6 6.5 5.5 16.6-1 22.6l-26.1 23.9L504 313.8c2.9 2.4 5.5 5 7.9 7.7V128l-54.6-54.6c-5.9-6-14.1-9.4-22.6-9.4zM544 128.2v223.9c0 17.7 14.3 32 32 32h64V128.2h-96zm48 223.9c-8.8 0-16-7.2-16-16s7.2-16 16-16s16 7.2 16 16s-7.2 16-16 16zM0 384h64c17.7 0 32-14.3 32-32V128.2H0V384zm48-63.9c8.8 0 16 7.2 16 16s-7.2 16-16 16s-16-7.2-16-16c0-8.9 7.2-16 16-16zm435.9 18.6L334.6 217.5l-30 27.5c-29.7 27.1-75.2 24.5-101.7-4.4c-26.9-29.4-24.8-74.9 4.4-101.7L289.1 64h-83.8c-8.5 0-16.6 3.4-22.6 9.4L128 128v223.9h18.3l90.5 81.9c27.4 22.3 67.7 18.1 90-9.3l.2-.2l17.9 15.5c15.9 13 39.4 10.5 52.3-5.4l31.4-38.6l5.4 4.4c13.7 11.1 33.9 9.1 45-4.7l9.5-11.7c11.2-13.8 9.1-33.9-4.6-45.1z" fill="currentColor"></path></svg>
                </div>
            {/if}
            {#if contact}
                <div class="w-5 h-5 ml-2.5 text-warning">
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45L7.77 18l1.12-4.81l-3.73-3.23l4.92-.42L12 5l1.92 4.53l4.92.42l-3.73 3.23L16.23 18z" fill="currentColor"></path></svg>
                </div>
            {/if}
        </div>
        {#if position}
            <div class="text-left text-[10px] opacity-80">{position}</div>
        {/if}
        {#if company}
            <div class="text-left text-[10px] text-front mt-0.5">{company}</div>
        {/if}
    </div>
</button>
