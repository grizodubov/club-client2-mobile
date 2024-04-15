<script lang="ts">
    import { router, RouterView, currentRoute } from '@/libs/Router';

    import { user, states, type Modal, modal } from '@/stores';

    let userId = user.pull('id');


    $: $user, userChange();


    $: modalData = $modal as Modal;


    /* userChange */
    function userChange() {
        const id = user.pull('id');
        //console.log('user_id: ', id);
        if (userId != id) {
            userId = id;
            if (states.pull('api')) {
                const currentUrl = currentRoute.extract('url');
                //console.log('url: ', currentUrl, userId);
                if (currentUrl) {
                    if (userId) {
                        const url = router.record('onLogin', '/', true);
                        if (typeof url === 'string')
                            router.go(url);
                    }
                    else {
                        router.go('/');
                    }
                }
            }
        }
    }
</script>


<main>
    <RouterView>
        <div slot="loading" class="flex items-center justify-center h-full">
            Loading...
        </div>
    </RouterView>
</main>

<div id="modal">
    {#if modalData.component}
        <svelte:component this="{modalData.component}" params="{modalData.params}" />
    {/if}
</div>
