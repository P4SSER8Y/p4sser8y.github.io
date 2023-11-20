<template>
    <q-card flat>
        <q-img v-if="poster" :src="poster" @error="nextPoster" :ratio="3 / 4" fit="cover" loading="lazy"></q-img>
        <q-slide-transition>
            <q-card-section v-if="viewConfig.detailedInfo.value" class="text-body2">
                <div class="text-h6 text-weight-bold">
                    {{ props.data.info.title }}
                </div>
                <div v-if="props.data.info.localTitle" class="text-subtitle1">
                    {{ props.data.info.localTitle }}
                </div>
                <q-rating v-if="latestNote" :model-value="latestNote.rate" color="red" no-dimming max="5"
                    icon="favorite_border" icon-selected="favorite" readonly></q-rating>
                <div v-if="latestNote">
                    {{ formatted_date(latestNote.timestamp) }}
                    <q-badge v-if="sortedNotes && sortedNotes.length > 1">
                        {{ sortedNotes.length }}
                    </q-badge>
                </div>
                <div v-if="props.data.info.tags">
                    <q-chip v-for="(tag, index) in props.data.info.tags" :key="index" dense outline>{{ tag }}</q-chip>
                </div>
            </q-card-section>
        </q-slide-transition>
    </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { MovieRecord } from '../models/models';
import dayjs from 'dayjs';
import { useViewConfigStore } from '../stores/viewConfig';
import { storeToRefs } from 'pinia';
// import DatabaseLink from './DatabaseLink.vue';

const viewConfig = storeToRefs(useViewConfigStore());
const props = defineProps<{
    data: MovieRecord;
}>();
const poster_idx = ref(0);
const poster = computed(() => {
    if (!props.data.info.poster) return null;
    if (
        poster_idx.value < 0 ||
        poster_idx.value >= props.data.info.poster.length
    )
        return null;
    let link = formatAssets(props.data.info.poster[poster_idx.value]);
    return link;
});

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

function formatAssets(link: string | undefined): string | null {
    if (!link || link.length == 0) {
        return null;
    }
    if (link.startsWith('http://') || link.startsWith('https://')) {
        return link;
    } else {
        return `${process.env.STREAM_MEDIA_BASE}/${link}`;
    }
}

function nextPoster() {
    if (poster_idx.value >= (props.data.info.poster?.length ?? 0)) {
        poster_idx.value = -1;
    }
    else {
        poster_idx.value++;
    }
}
</script>
