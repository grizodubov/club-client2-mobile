<script lang="ts">
    export let poll: { [key: string]: any };

    let selected: number | undefined = undefined;
</script>


<div class="relative bg-moderate rounded-2xl mx-3 mt-3 overflow-hidden">
    <div class="text-base-100 font-semibold text-sm p-4">{poll.question}</div>
    <div>
        {#each poll.answers as answer, i}
            <button
                class="relative w-full px-4 pt-3 pb-11 mb-[-32px] border-b-base-200 rounded-t-2xl overflow-hidden"
                on:click="{() => { selected = i; }}"
            >
                <div
                    class="absolute top-0 right-0 bottom-0 left-0 bg-base-200"
                    class:brightness-100="{i % 2 == 0}"
                    class:brightness-105="{i % 2 == 1}"
                ></div>
                <div class="relative w-full h-full flex justify-between items-center">
                    <div class="text-sm">{answer}</div>
                    {#if selected === i}
                        <div class="rounded-full border-2 border-front bg-front w-7 h-7 flex items-center justify-center text-base-100">
                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                        </div>
                    {:else}
                        <div class="rounded-full border-2 border-front w-7 h-7"></div>
                    {/if}
                </div>
            </button>
        {/each}
        <div
            class="relative w-full px-4 py-3 border-b-base-200 rounded-t-2xl overflow-hidden"
        >
            <div
                class="absolute top-0 right-0 bottom-0 left-0 bg-base-200"
                class:brightness-100="{poll.answers.length % 2 == 0}"
                class:brightness-105="{poll.answers.length % 2 == 1}"
            ></div>
            <div class="relative flex justify-center">
                <button
                    class="btn btn-front text-base-100"
                    class:btn-active="{selected === undefined}"
                    class:opacity-60="{selected === undefined}"
                    on:click="{() => {
                        if (selected !== undefined) {
                        }
                    }}"
                >Проголосовать</button>
            </div>
        </div>
    </div>
</div>
