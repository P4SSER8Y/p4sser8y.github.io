<template>
    <ErrorNotFound v-if="classifiedData.length == 0"></ErrorNotFound>
    <q-timeline v-else layout="dense">
        <q-timeline-entry v-for="item in classifiedData" :key="item.title">
            <template v-slot:title>
                <div class="text-h4">
                    {{ item.title }}
                    <q-badge
                        rounded
                        color="secondary"
                        :label="item.records.length"
                        align="top"
                    />
                </div>
            </template>
            <CardLayout :data="item.records"></CardLayout>
        </q-timeline-entry>
    </q-timeline>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useViewConfigStore } from 'src/stores/viewConfig';
import { useDataStore } from 'src/stores/data';
import { MovieRecord } from 'src/components/models';
import dayjs from 'dayjs';
import CardLayout from 'src/layouts/CardLayout.vue';
import ErrorNotFound from './ErrorNotFound.vue';

const viewConfig = storeToRefs(useViewConfigStore());
const data = storeToRefs(useDataStore());

onMounted(async () => {
    viewConfig.lastPage.value = 'timeline';
});

interface ClassifiedMovieRecords {
    title: string;
    records: MovieRecord[];
}

const classifiedData = computed(() => {
    let map = new Map<string, MovieRecord[]>();
    for (let movie of data.data.value ?? []) {
        for (let record of movie.notes ?? []) {
            let key = dayjs(record.timestamp).format(
                viewConfig.classifyFormat.value
            );
            let value: MovieRecord = {
                info: movie.info,
                notes: [record],
            };
            let values: MovieRecord[] = map.get(key) ?? [];
            values.push(value);
            map.set(key, values);
        }
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
