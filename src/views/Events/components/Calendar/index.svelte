<script lang="ts">
</script>

<div class="h-[120px] overflow-y-hidden">
    <div class="carousel carousel-center w-full h-[120px]">
        {#each [1,2,3,4,5,6,7,8,9] as event}
            <div
                class="carousel-item bg-front text-base-100"
            >
                <div class="px-7 border-2 border-success">{event}</div>
            </div>
        {/each}
    </div>
</div>
