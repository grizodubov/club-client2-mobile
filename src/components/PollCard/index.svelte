<script lang="ts">
    import { Entity, collector } from '@/helpers/entity';

    import {
        addVote,
    } from '@/queries/poll';


    export let poll: { [key: string]: any };


    let selected: number[] = [];


    /* DATA: addVoteHandler */
	const addVoteHandler = new Entity({
		model: addVote.model,
		retriever: addVote.retriever,
	});


    /* vote */
    function vote() {
        if (selected.length > 0)
            collector.get([
                [ 
                    addVoteHandler,
                    {
                        pollId: poll.id,
                        answer: selected.map((s: number) => s + 1),
                    }
                ],
            ]);
    }


    /* calculateWidth */
    function calculateWidth(votes: number): number {
        return poll.votes_max ? Math.round(votes / poll.votes_max * 80) : 0;
    }
</script>


<div class="relative bg-moderate rounded-2xl mx-3 mt-3 overflow-hidden">
    <div class="text-base-100 font-semibold text-sm p-4">{poll.text}</div>
    {#if poll.answers && poll.answers.length}
        <div>
            {#if !poll.answered}
                {#each poll.answers as answer, i}
                    <button
                        class="relative w-full px-4 pt-3 pb-11 mb-[-32px] border-b-base-200 rounded-t-2xl overflow-hidden"
                        on:click="{() => {
                            const idx = selected.indexOf(i);
                            if (idx > -1) {
                                selected.splice(idx, 1);
                            }
                            else {
                                if (poll.many) {
                                    selected.push(i);
                                }
                                else {
                                    selected = [ i ];
                                }
                            }
                            selected = [ ...selected ];
                        }}"
                    >
                        <div
                            class="absolute top-0 right-0 bottom-0 left-0 bg-base-200"
                            class:brightness-100="{i % 2 == 0}"
                            class:brightness-105="{i % 2 == 1}"
                        ></div>
                        <div class="relative w-full h-full flex justify-between items-center">
                            <div class="text-sm text-left">{answer.replace(/^\{[gyr]\}/, '')}</div>
                            {#if selected.indexOf(i) > -1}
                                <div
                                    class="border-2 border-front bg-front w-7 h-7 flex items-center justify-center text-base-100 shrink-0 grow-0"
                                    class:rounded-full="{!poll.many}"
                                    class:rounded-lg="{poll.many}"
                                >
                                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="currentColor"></path></svg>
                                </div>
                            {:else}
                                <div
                                    class="border-2 border-front w-7 h-7 shrink-0 grow-0"
                                    class:rounded-full="{!poll.many}"
                                    class:rounded-lg="{poll.many}"
                                ></div>
                            {/if}
                        </div>
                    </button>
                {/each}
            {:else if poll.show_results}
                {#each poll.answers as answer, i}
                    <div
                        class="relative w-full px-4 pt-3 pb-11 mb-[-32px] border-b-base-200 rounded-t-2xl overflow-hidden"
                    >
                        <div
                            class="absolute top-0 right-0 bottom-0 left-0 bg-base-200"
                            class:brightness-100="{i % 2 == 0}"
                            class:brightness-105="{i % 2 == 1}"
                        ></div>
                        <div class="relative w-full">
                            <div class="flex rounded-full bg-white w-full overflow-hidden">
                                <div class="bg-primary shrink-0 grow-0 rounded-full overflow-hidden" style="width: {calculateWidth(poll.votes[(i + 1).toString()])}%"></div>
                                <div class="text-sm font-semibold ml-3 shrink-0 grow-0">{poll.votes[(i + 1).toString()]}</div>
                            </div>
                            <div class="text-sm text-left mt-1">{answer.replace(/^\{[gyr]\}/, '')}</div>
                        </div>
                    </div>
                {/each}
            {/if}
            <div
                class="relative w-full px-4 py-3 border-b-base-200 rounded-t-2xl overflow-hidden"
            >
                <div
                    class="absolute top-0 right-0 bottom-0 left-0 bg-base-200"
                    class:brightness-100="{poll.answers.length % 2 == 0}"
                    class:brightness-105="{poll.answers.length % 2 == 1}"
                ></div>
                <div class="relative flex justify-center">
                    {#if poll.answered}
                        <div class="py-1">Ваш голос уже принят</div>
                    {:else}
                        <button
                            class="btn btn-front text-base-100"
                            class:btn-active="{selected.length == 0}"
                            class:opacity-60="{selected.length == 0}"
                            on:click="{() => {
                                if (selected.length > 0) {
                                    vote();
                                }
                            }}"
                        >Проголосовать</button>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>
