<template>
    <ErrorNotFound v-if="filteredData.length == 0"></ErrorNotFound>
    <CardLayout v-else :data="filteredData"></CardLayout>
</template>

<script setup lang="ts">
import ErrorNotFound from './ErrorNotFound.vue';
import CardLayout from '../layouts/CardLayout.vue';
import { onMounted, computed } from 'vue';
import { Record, sever_record } from '../models/models';
import { useMeta } from 'quasar';
import { useViewConfigStore } from '../stores/viewConfig';
import { storeToRefs } from 'pinia';
import { useDataStore } from '../stores/data';

const data = storeToRefs(useDataStore());
const viewConfig = storeToRefs(useViewConfigStore());

const filteredData = computed(() => {
    if (viewConfig.merged.value) {
        return data.data.value;
    } else {
        let tmp: Record[] = [];
        for (let record of data.data.value ?? []) {
            tmp = tmp.concat(sever_record(record));
        }
        return tmp;
    }
});

onMounted(async () => {
    viewConfig.lastPage.value = 'posterWall';
});

useMeta(() => {
    return {
        title: 'How Time Flies'
    };
});
</script>
