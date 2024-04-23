<script lang="ts">
    export let tag: string;
    export let type: 'tag' | 'interest';
</script>

{#if tag == '...'}
    <div
        class="text-base-100 rounded-xl pl-1.5 pr-1.5 h-[18px] flex items-center"
        class:bg-success="{type == 'tag'}"
        class:bg-secondary="{type == 'interest'}"
    >
        <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></g></svg>
    </div>
{:else}
    <div
        class="text-base-100 rounded-xl pl-1 pr-1.5 h-[18px] flex items-center"
        class:bg-success="{type == 'tag'}"
        class:bg-secondary="{type == 'interest'}"
    >
        {#if type == 'tag'}
            <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42a.996.996 0 0 0-1.41 0l-6.59 6.59a.996.996 0 0 0 0 1.41l6.59 6.59a.996.996 0 1 0 1.41-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z" fill="currentColor"></path></svg>
        {:else}
            <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M5 13h11.17l-4.88 4.88c-.39.39-.39 1.03 0 1.42c.39.39 1.02.39 1.41 0l6.59-6.59a.996.996 0 0 0 0-1.41l-6.58-6.6a.996.996 0 1 0-1.41 1.41L16.17 11H5c-.55 0-1 .45-1 1s.45 1 1 1z" fill="currentColor"></path></svg>
        {/if}
        <div class="text-xs ml-1 leading-14 mb-[1px] font-medium">{tag}</div>
    </div>
{/if}
