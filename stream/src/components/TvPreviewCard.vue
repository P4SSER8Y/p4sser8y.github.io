<template>
    <q-card flat>
        <q-img v-if="poster" :src="poster" @error="nextPoster" :ratio="3 / 4" fit="cover" loading="lazy"></q-img>
        <q-slide-transition>
            <q-card-section v-if="viewConfig.detailedInfo.value" class="text-body2">
                <div class="text-h6 text-weight-bold">
                    {{ props.data.info.title }}
                    <q-badge v-if="props.data.info.season" align="top" outline rounded>
                        {{ props.data.info.season }}
                    </q-badge>
                </div>
                <div v-if="props.data.info.localTitle" class="text-subtitle1">
                    {{ props.data.info.localTitle }}
                </div>
                <q-rating v-if="latestNote?.rate" :model-value="latestNote.rate" color="red" no-dimming max="5"
                    icon="favorite_border" icon-selected="favorite" readonly></q-rating>
                <div v-if="latestNote">
                    {{ formatted_date(get_note_timestamp(latestNote)) }}
                    <q-badge v-if="sortedNotes && sortedNotes.length > 1">
                        {{ sortedNotes.length }}
                    </q-badge>
                    <q-badge :color="statusColor">
                        {{ eposideInfo }}
                    </q-badge>
                </div>
                <div v-if="props.data.info.tags">
                    <q-chip v-for="(tag, index) in props.data.info.tags" :key="index" dense outline>
                        {{ tag }}
                    </q-chip>
                </div>
            </q-card-section>
        </q-slide-transition>
    </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { TvNote, TvRecord } from '../models/models';
import dayjs, { Dayjs } from 'dayjs';
import { useViewConfigStore } from 'src/stores/viewConfig';
import { storeToRefs } from 'pinia';
import DatabaseLink from './DatabaseLink.vue';

const viewConfig = storeToRefs(useViewConfigStore());
const props = defineProps<{
    data: TvRecord;
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

function formatted_date(timestamp: string | Dayjs): string {
    return dayjs(timestamp).format('YYYY-MM-DD');
}

function get_note_timestamp(note: TvNote) {
    return note.eposides
        .map((x) => dayjs(x.timestamp))
        .reduce((a, b) => (a > b ? a : b));
}

const sortedNotes = computed(() => {
    let temp = props.data.notes;
    temp?.sort((a, b) => get_note_timestamp(a).diff(get_note_timestamp(b)));
    return temp;
});

const latestNote = computed(() => sortedNotes?.value?.at(0));

const eposideInfo = computed(
    () =>
        `${latestNote.value?.eposides.at(0)?.eposide ?? '?'} / ${props.data.info.eposides ?? '?'
        }`
);

const statusColor = computed(
    () =>
        new Map([
            ['ing', 'green-10'],
            ['suspended', 'yellow-10'],
            ['abandoned', 'red-10'],
            ['done', 'primary'],
        ]).get(latestNote.value?.status ?? '') ?? 'primary'
);

function formatAssets(link: string | undefined): string | null {
    if (!link || link.length == 0) {
        return null;
    }
    if (link.startsWith('http://') || link.startsWith('https://')) {
        return link;
    } else {
        return `${process.env.STREAM_DATA_BASE_URL}/${viewConfig.user.value}/assets/${link}`;
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
