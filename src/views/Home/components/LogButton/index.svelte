<script lang="ts">
    import { onMount } from 'svelte';

    import { bindings } from '@/stores';

    import { subscribe } from '@/helpers/notification';

    import { Entity, collector } from '@/helpers/entity';

    import { logCreate, logDestroy, logShow, logUpdate } from '@/helpers/log';

    import Log from '../../../../layouts/Main/components/Log/index.svelte';

    import {
		notificationList,
	} from '@/queries/notification';


    let notifications: any[] = [];
    let connections: any = {};


    $: amount = ($bindings as any).notifications;


    /* DATA: notificationListHandler */
	const notificationListHandler = new Entity({
		model: notificationList.model,
		retriever: notificationList.retriever,
        onSuccess: data => {
            notifications = data.notifications;
            connections = data.connections;
            logUpdate({
                notifications: notifications,
                connections: connections,
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
                    timeBreakpoint: notifications.length ? notifications[notifications.length - 1].time_notify_key : null,
                    limit: null,
                }
            ],
        ]);
    }


    /* onMount */
	onMount(() => {
        logCreate(Log, {
            notifications: notifications,
            connections: connections,
            onRefresh: refresh,
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
    class="relative transition-all text-base-100"
    on:click="{() => {
        logUpdate({
            notifications: notifications,
            connections: connections,
            onRefresh: refresh,
        });
        logShow();
    }}"
>
    <slot />
    {#if amount}
        <div class="absolute w-[18px] h-[18px] bg-secondary text-base-100 flex items-center justify-center text-[10px] font-medium rounded-full top-[0px] right-[8px]"><span>{amount}</span></div>
    {/if}
</button>
