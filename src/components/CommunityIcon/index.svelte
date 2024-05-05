<script lang="ts">
    export let id: number;
    export let name: string;
    export let avatarHash: string | null = null;
    export let scaleLetter: '1.1' | '1.2' | '1.3' | '1.4' | '1.5' | '2' | '2.5' | '3' | '3.5' | '4' | '4.5' | '5' | undefined = undefined;


    $: letterFirst = name ? name.replace(/[^A-Za-zАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя]+/g, '').charAt(0).toUpperCase() : '';
</script>


{#if avatarHash}
    <div class="w-full h-full rounded-box overflow-hidden border-4 border-moderate bg-moderate">
        <img class="w-full h-full" src="https://media.clubgermes.ru/n/{avatarHash}.jpg" alt="{name}" />
    </div>
{:else}
    <div
        class="w-full h-full rounded-box overflow-hidden text-neutral-content flex justify-center items-center border-4 border-moderate bg-moderate"
        class:bg-success="{id % 6 == 0}"
        class:bg-info="{id % 6 == 1}"
        class:bg-warning="{id % 6 == 2}"
        class:bg-secondary="{id % 6 == 3}"
        class:bg-accent="{id % 6 == 4}"
        class:bg-primary="{id % 6 == 5}"
    >
        <span
            class="text-lg"
            class:scale-[1.1]="{scaleLetter == '1.1'}"
            class:scale-[1.2]="{scaleLetter == '1.2'}"
            class:scale-[1.3]="{scaleLetter == '1.3'}"
            class:scale-[1.4]="{scaleLetter == '1.4'}"
            class:scale-[1.5]="{scaleLetter == '1.5'}"
            class:scale-[2]="{scaleLetter == '2'}"
            class:scale-[2.5]="{scaleLetter == '2.5'}"
            class:scale-[3]="{scaleLetter == '3'}"
            class:scale-[3.5]="{scaleLetter == '3.5'}"
            class:scale-[4]="{scaleLetter == '4'}"
            class:scale-[4.5]="{scaleLetter == '4.5'}"
            class:scale-[5]="{scaleLetter == '5'}"
        >{letterFirst}</span>
    </div>
{/if}
