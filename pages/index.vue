<template>
    <div class="mx-auto max-w-2xl w-full">
        <TimelineScroller>
            <Greeting />
            <Public />
        </TimelineScroller>
    </div>
</template>


<script setup lang="ts">
import Greeting from "~/components/headers/greeting.vue";
import Public from "~/components/timelines/public.vue";
import TimelineScroller from "~/components/timelines/timeline-scroller.vue";

definePageMeta({
    layout: "app",
});
</script>