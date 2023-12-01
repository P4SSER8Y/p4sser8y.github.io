<template>
    <div :style="'width:' + props.width + 'px'" @click="edit">
        <component :is="card" :data="props.data" style="height: 100%"></component>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { isMovieRecord, isTvRecord, Record } from '../models/models';
import MoviePreviewCard from './MoviePreviewCard.vue';
import TvPreviewCard from './TvPreviewCard.vue';
import { useQuasar } from 'quasar';
import Editor from './Editor.vue';
import { useLocalStorage } from '@vueuse/core';

const $q = useQuasar();
const token = useLocalStorage('token', '');

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

function edit() {
    if (token?.value.length > 0) {
        $q.dialog({
            component: Editor,
            componentProps: {
                data: props.data,
                previewWidth: props.width,
            },
        });
    }
}
</script>
