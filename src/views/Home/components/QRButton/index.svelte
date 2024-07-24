<script lang="ts">
    import { Entity, collector } from '@/helpers/entity';

    import {
		QRShow,
	} from '@/queries/qr';


    let url = '';
    let flag = false;


    /* DATA: QRShowHandler */
	const QRShowHandler = new Entity({
		model: QRShow.model,
		retriever: QRShow.retriever,
        onSuccess: (data: any) => url = data.url,
	});


    /* show*/
    function show() {
        collector.get([
            [ 
                QRShowHandler,
                {}
            ],
        ]);
        flag = true;
    }
</script>


<button
    class="relative transition-all text-base-100"
    on:click="{() => {
        show();
    }}"
>
    <slot />
</button>
<div
    class="fixed w-full h-full flex items-center justify-center z-40 left-[0px] top-[0px] transition-all"
    class:hidden="{!flag}"
    class:opacity-0="{!flag}"
    class:opacity-100="{flag}"
>
    <button
        class="absolute opacity-30 bg-scene w-full h-full top-[0px] left-[0px]"
        on:click="{() => { flag = false; }}"
    ></button>
    <div class="relative w-[220px] h-[220px] shrink-0 grow-0 bg-base-100 rounded-2xl">
        {#if url}
            <div class="w-full h-full flex items-center justify-center">
                <img src="{url}" alt="" class="w-[180px] h-[180px]" />
            </div>
        {:else}
            <div class="w-full h-full flex items-center justify-center">
                <span class="loading loading-bars text-front"></span>
            </div>
        {/if}
    </div>
</div>
