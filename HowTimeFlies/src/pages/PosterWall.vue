<template>
    <ErrorNotFound v-if="filteredData.length == 0"></ErrorNotFound>
    <CardLayout v-else :data="filteredData"></CardLayout>
</template>

<script setup lang="ts">
import ErrorNotFound from './ErrorNotFound.vue';
import CardLayout from 'src/layouts/CardLayout.vue';
import { onMounted, computed } from 'vue';
import { MovieRecord } from 'src/components/models';
import { useMeta } from 'quasar';
import { useViewConfigStore } from 'src/stores/viewConfig';
import { storeToRefs } from 'pinia';
import { useDataStore } from 'src/stores/data';

const data = storeToRefs(useDataStore());
const viewConfig = storeToRefs(useViewConfigStore());

const filteredData = computed(() => {
    if (viewConfig.merged.value) {
        return data.data.value;
    } else {
        let tmp: MovieRecord[] = [];
        for (let movie of data.data.value ?? []) {
            for (let record of movie.notes ?? []) {
                tmp.push({
                    info: movie.info,
                    notes: [record],
                });
            }
        }
        return tmp;
    }
});

onMounted(async () => {
    viewConfig.lastPage.value = 'posterWall';
});

useMeta(() => {
    return {
        title:
            'How Time Flies' +
            (viewConfig.user.value && viewConfig.user.value.length > 0
                ? ' - ' + viewConfig.user.value
                : ''),
    };
});
</script>
