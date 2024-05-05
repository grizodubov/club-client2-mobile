<script lang="ts">
    import { type User } from '@/stores/';
    
    import { nameInitials } from '@/utils/names';


    export let user: User;
    export let scaleLetters: '1.1' | '1.2' | '1.3' | '1.4' | '1.5' | '2' | '2.5' | '3' | '3.5' | '4' | '4.5' | '5' | undefined = undefined;


    $: initials = nameInitials(user.name, 2);
</script>


{#if user.avatar_hash}
    <div class="w-full h-full rounded-full overflow-hidden">
        <img class="w-full h-full" src="https://media.clubgermes.ru/n/{user.avatar_hash}.jpg" alt="" />
    </div>
{:else}
    <div
        class="w-full h-full rounded-full overflow-hidden text-neutral-content flex justify-center items-center"
        class:bg-success="{user.id % 6 == 0}"
        class:bg-info="{user.id % 6 == 1}"
        class:bg-warning="{user.id % 6 == 2}"
        class:bg-secondary="{user.id % 6 == 3}"
        class:bg-accent="{user.id % 6 == 4}"
        class:bg-primary="{user.id % 6 == 5}"
    >
        <span
            class="text-lg"
            class:scale-[1.1]="{scaleLetters == '1.1'}"
            class:scale-[1.2]="{scaleLetters == '1.2'}"
            class:scale-[1.3]="{scaleLetters == '1.3'}"
            class:scale-[1.4]="{scaleLetters == '1.4'}"
            class:scale-[1.5]="{scaleLetters == '1.5'}"
            class:scale-[2]="{scaleLetters == '2'}"
            class:scale-[2.5]="{scaleLetters == '2.5'}"
            class:scale-[3]="{scaleLetters == '3'}"
            class:scale-[3.5]="{scaleLetters == '3.5'}"
            class:scale-[4]="{scaleLetters == '4'}"
            class:scale-[4.5]="{scaleLetters == '4.5'}"
            class:scale-[5]="{scaleLetters == '5'}"
        >{initials}</span>
    </div>
{/if}
