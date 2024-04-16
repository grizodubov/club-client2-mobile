<script lang="ts">
    import { type User } from '@/stores/';
    
    import { nameInitials } from '@/utils/names';


    export let user: User;


    $: initials = nameInitials(user.name, 2);
</script>


{#if user.avatar_hash}
    <div class="w-full h-full rounded-full overflow-hidden">
        <img class="w-full h-full" src="https://media.clubgermes.ru/n/{user.avatar_hash}.jpg" alt="{user.name}" />
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
        <span class="text-lg">{initials}</span>
    </div>
{/if}
