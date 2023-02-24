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
                <q-badge v-if="props.data.info.season" align="top" outline rounded>
                    {{ props.data.info.season }}
                </q-badge>
            </div>
            <div v-if="props.data.info.localTitle" class="text-subtitle1">
                {{ props.data.info.localTitle }}
            </div>
            <q-rating
                v-if="latestNote?.rate"
                :model-value="latestNote.rate"
                color="red"
                no-dimming
                max="5"
                icon="favorite_border"
                icon-selected="favorite"
                readonly
            ></q-rating>
            <div v-if="latestNote">
                {{ formatted_date(get_note_timestamp(latestNote)) }}
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
import { computed, onMounted } from 'vue';
import { TvNote, TvRecord } from './models';
import dayjs, { Dayjs } from 'dayjs';
import { useViewConfigStore } from 'src/stores/viewConfig';
import { storeToRefs } from 'pinia';
import DatabaseLink from './DatabaseLink.vue';

const viewConfig = storeToRefs(useViewConfigStore());
const props = defineProps<{
    data: TvRecord;
}>();

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

function formatAssets(link: string): string {
    return `${viewConfig.user.value}/assets/${link}`;
}
</script>
