<template>
    <div :style="'width:' + props.width + 'px'">
        <component :is="card" :data="props.data" style="height:100%"></component>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { isMovieRecord, isTvRecord, Record } from '../models/models';
import MoviePreviewCard from './MoviePreviewCard.vue';
import TvPreviewCard from './TvPreviewCard.vue';

const card = computed(() => {
    if (isMovieRecord(props.data)) {
        return MoviePreviewCard;
    } else if (isTvRecord(props.data)) {
        return TvPreviewCard;
    } else {
        return undefined;
    }
});

const props = defineProps<{
    width: number;
    data: Record;
}>();
</script>
