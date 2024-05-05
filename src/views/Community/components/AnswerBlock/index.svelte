<script lang="ts">
    import InputArea from './InputArea.svelte';

    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;
    let className: string = '';
	export { className as class }; className;


    let text: string = '';
</script>


<div class="px-4 pb-[39px]">
    <div class="text-xs opacity-50 pt-4">{params?.text}</div>
    <div class="h-[200px] w-full pt-4">
        <InputArea bind:value="{text}" placeholder="Ваш ответ" />
    </div>
    <button
        class="btn btn-front text-base-100 mt-4"
        class:btn-active="{text.length == 0}"
        class:opacity-60="{text.length == 0}"
        on:click="{() => {
            if (text.length > 0) {
            }
        }}"
    >Отправить ответ</button>
</div>
