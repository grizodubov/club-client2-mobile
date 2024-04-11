<script lang="ts">
    import { type User } from './types';


    export let user: User;


    $: initials = user.name.split(/\s+/, 2).map((n: string) => n.charAt(0).toUpperCase()).join('');
</script>



{#if user.avatar_hash}
    <div class="w-full h-full rounded-full overflow-hidden">
        <img class="w-full h-full" src="https://media.clubgermes.ru/n/{user.avatar_hash}.jpg" alt="{user.name}" />
    </div>
{:else}
    <div class="w-full h-full rounded-full overflow-hidden bg-neutral text-neutral-content flex justify-center items-center">
        <span>{initials}</span>
    </div>
{/if}
