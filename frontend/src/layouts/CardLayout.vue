<template>
    <VueFlexWaterfall :col="4" align-content="center">
        <MoviePreviewCard
            style="margin: 5px"
            v-for="(item, index) in sortedData"
            :data="item"
            :width="256"
            :key="index"
        >
        </MoviePreviewCard>
    </VueFlexWaterfall>
</template>

<script setup lang="ts">
import { MovieRecord } from 'src/components/models';
import { VueFlexWaterfall } from 'vue-flex-waterfall';
import MoviePreviewCard from 'src/components/MoviePreviewCard.vue';
import { computed } from 'vue';

const props = defineProps<{
    data: MovieRecord[];
}>();

const sortedData = computed(() => {
    let temp = props.data;
    const fn = (x: MovieRecord) =>
        x.notes ? Math.max(...x.notes.map((x) => x.timestamp)) : -1;
    return temp.sort((a, b) => fn(b) - fn(a));
});
</script>
