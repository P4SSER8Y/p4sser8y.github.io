<template>
    <ErrorNotFound v-if="classifiedData.length == 0"></ErrorNotFound>
    <q-timeline v-else layout="dense">
        <q-timeline-entry v-for="item in classifiedData" :key="item.title">
            <template v-slot:title>
                <div class="text-h4">
                    {{ item.title }}
                    <q-badge rounded color="secondary" :label="item.records.length" align="top" />
                </div>
            </template>
            <CardLayout :data="item.records"></CardLayout>
        </q-timeline-entry>
    </q-timeline>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useViewConfigStore } from '../stores/viewConfig';
import { useDataStore } from '../stores/data';
import {
    classify_by_timestamp_format,
    get_latest_timestamp,
    Record,
    sever_record,
} from '../models/models';
import CardLayout from '../layouts/CardLayout.vue';
import ErrorNotFound from './ErrorNotFound.vue';

const viewConfig = storeToRefs(useViewConfigStore());
const data = storeToRefs(useDataStore());

onMounted(async () => {
    viewConfig.lastPage.value = 'timeline';
});

interface ClassifiedMovieRecords {
    title: string;
    records: Record[];
}

const splitedRecords = computed(() =>
    data.data.value
        .map((x) =>
            classify_by_timestamp_format(x, viewConfig.classifyFormat.value)
        )
        .reduce((a, b) => a.concat(b))
        .map(sever_record)
        .reduce((a, b) => a.concat(b))
);

const classifiedData = computed(() => {
    let map = new Map<string, Record[]>();
    for (let record of splitedRecords.value) {
        let key = get_latest_timestamp(record).format(
            viewConfig.classifyFormat.value
        );
        let values = map.get(key) ?? [];
        values.push(record);
        map.set(key, values);
    }

    let tmp: ClassifiedMovieRecords[] = [];
    map.forEach((v, k) => {
        tmp.push({ title: k, records: v });
    });
    tmp.sort((b, a) => {
        if (a.title > b.title) return 1;
        else if (a.title < b.title) return -1;
        else return 0;
    });
    return tmp;
});
</script>
