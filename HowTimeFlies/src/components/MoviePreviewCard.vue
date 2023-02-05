<template>
    <div :style="'width:' + props.width + 'px'">
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
                <div v-if="props.data.info.chineseTitle" class="text-subtitle1">
                    {{ props.data.info.chineseTitle }}
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
                    <a v-if="doubanLink" :href="doubanLink">
                        <q-avatar rounded size="sm">
                            <IconFont
                                name="icon-douban"
                                width="100%"
                            ></IconFont>
                        </q-avatar>
                    </a>
                    <a v-if="imdbLink" :href="imdbLink">
                        <q-avatar rounded size="sm">
                            <IconFont name="icon-imdb" width="100%"></IconFont>
                        </q-avatar>
                    </a>
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MovieRecord } from './models';
import dayjs from 'dayjs';
import IconFont from 'src/assets/IconFont.vue';
import { useViewConfigStore } from 'src/stores/viewConfig';
import { storeToRefs } from 'pinia';

const viewConfig = storeToRefs(useViewConfigStore());
const props = defineProps<{
    width: number;
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

function parseLink(
    link: string,
    prefix: string,
    urlPrefix: string,
    urlSuffix: string
): string | null {
    if (link.toLowerCase().startsWith(prefix)) {
        return urlPrefix + link.slice(prefix.length) + urlSuffix;
    } else {
        return null;
    }
}

function parseDoubanLink(link: string): string | null {
    return parseLink(link, 'db:', 'https://movie.douban.com/subject/', '/');
}

function parseImdbLink(link: string): string | null {
    return parseLink(link, 'imdb:', 'https://www.imdb.com/title/', '/');
}

const doubanLink = computed(() =>
    props.data.info.links
        ?.map(parseDoubanLink)
        .filter((x) => x)
        .at(0)
);

const imdbLink = computed(() =>
    props.data.info.links
        ?.map(parseImdbLink)
        .filter((x) => x)
        .at(0)
);

function formatAssets(link: string): string {
    return `${viewConfig.user.value}/assets/${link}`;
}
</script>
