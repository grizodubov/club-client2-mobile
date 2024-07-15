<script lang="ts">
    import { onMount } from 'svelte';

    import { subscribe } from '@/helpers/notification';

    import { Entity, collector } from '@/helpers/entity';

    import { logCreate, logDestroy, logShow, logUpdate } from '@/helpers/log';

    import Log from './../Log/index.svelte';

    import {
		notificationList,
	} from '@/queries/notification';


    let notifications: any[] = [];


    /* DATA: notificationListHandler */
	const notificationListHandler = new Entity({
		model: notificationList.model,
		retriever: notificationList.retriever,
        onSuccess: data => {
            notifications = data.notifications;
            logUpdate({
                notifications: notifications,
            });
        },
	});


    /* get */
    function get() {
        collector.get([
            [ 
                notificationListHandler,
                {
                    timeBreakpoint: null,
                    limit: 50,
                }
            ],
        ]);
    }

    
    /* refresh */
    function refresh() {
        collector.get([
            [ 
                notificationListHandler,
                {
                    timeBreakpoint: null,
                    limit: 50,
                }
            ],
        ]);
    }


    /* onMount */
	onMount(() => {
        logCreate(Log, {
            notifications: [],
        });
        get();
		const sub = subscribe('events', refresh);
		return () => {
            logDestroy();
            sub.close();
        };
	});
</script>


<button
    class="w-10 h-10 flex items-center justify-center transition-all text-scene ml-5 rounded-full bg-base-300"
    on:click="{logShow}"
>
    <slot />
</button>
