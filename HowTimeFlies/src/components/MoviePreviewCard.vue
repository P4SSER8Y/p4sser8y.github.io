<template>
    <q-card flat>
        <q-img
            v-if="props.data.info.poster"
            :src="formatAssets(props.data.info.poster)"
            :ratio="3 / 4"
            fit="cover"
            loading="lazy"
        ></q-img>
        <q-card-section v-if="viewConfig.detailedInfo.value" class="text-body2">
            <div class="text-h6 text-weight-bold">
                {{ props.data.info.title }}
            </div>
            <div v-if="props.data.info.localTitle" class="text-subtitle1">
                {{ props.data.info.localTitle }}
            </div>
            <q-rating
                v-if="latestNote"
                :model-value="latestNote.rate"
                color="red"
                no-dimming
                max="5"
                icon="favorite_border"
                icon-selected="favorite"
                readonly
            ></q-rating>
            <div v-if="latestNote">
                {{ formatted_date(latestNote.timestamp) }}
                <q-badge v-if="sortedNotes && sortedNotes.length > 1">
                    {{ sortedNotes.length }}
                </q-badge>
            </div>
            <div v-if="props.data.info.tags">
                <q-chip
                    v-for="(tag, index) in props.data.info.tags"
                    :key="index"
                    dense
                    outline
                    >{{ tag }}</q-chip
                >
            </div>
            <div>
                <DatabaseLink
                    v-for="(item, index) in props.data.info.links"
                    :link="item"
                    :key="index"
                ></DatabaseLink>
            </div>
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MovieRecord } from '../models/models';
import dayjs from 'dayjs';
import { useViewConfigStore } from 'src/stores/viewConfig';
import { storeToRefs } from 'pinia';
import DatabaseLink from './DatabaseLink.vue';

const viewConfig = storeToRefs(useViewConfigStore());
const props = defineProps<{
    data: MovieRecord;
}>();

function formatted_date(timestamp: string): string {
    return dayjs(timestamp).format('YYYY-MM-DD');
}

const sortedNotes = computed(() => {
    if (!props.data.notes) return null;
    let temp = props.data.notes;
    temp.sort((a, b) => dayjs(b.timestamp).diff(a.timestamp));
    return temp;
});

const latestNote = computed(() =>
    sortedNotes.value
        ? sortedNotes.value?.length > 0
            ? sortedNotes.value[0]
            : null
        : null
);

function formatAssets(link: string): string {
    return `${process.env.HTF_DATA_BASE_URL}/${viewConfig.user.value}/assets/${link}`;
}
</script>
