<script setup lang="ts">
import { onMounted, ref, computed, Ref } from 'vue';
import YAML from 'yaml';
import * as utils from '../utils';
import dayjs from 'dayjs';

type Mode = 'movie' | 'tv';

const object = ref({});
const msg = computed(() => {
    return YAML.stringify(object.value);
});
const info = ref('');
const info_showed = ref(false);
const poster_link: Ref<string | null> = ref(null);
const poster_filename: Ref<string | null> = ref(null);
const preview_buffer: Ref<Blob | null> = ref(null);
const record_filename: Ref<string | null> = ref(null);
const mode: Ref<Mode> = ref(utils.get_type());
const user_touched = ref(false);
const api_episodes: Ref<number | null> = ref(null);

function switchMode(m: Mode) {
    user_touched.value = true;
    mode.value = m;
    active();
}

function active() {
    let titles = utils.get_titles();
    console.log("[DBFMT] get_titles: ", titles);

    let info: Record<string, any> = {};
    info.year = utils.get_year();
    console.log("[DBFMT] get_year: ", info.year);
    info.title = titles[0] ?? '?';
    console.log("[DBFMT] get_title: ", info.title);
    if (titles[1]) {
        info.localTitle = titles[1];
    }
    let fnTitle = titles[1] ?? titles[0] ?? '?';
    record_filename.value = `${info.year}-${fnTitle}.yml`;
    if (mode.value === 'tv') {
        let season = utils.get_season();
        if (season) {
            info.season = season;
            record_filename.value = `${info.year}-S${season}-${fnTitle}.yml`;
        }
        let ecount = api_episodes.value ?? utils.get_episodes_count();
        if (ecount) info.eposides = ecount;
        let series = utils.get_series();
        if (series) info.series = series;
    }
    record_filename.value = utils.safe_filename(record_filename.value);
    info.tags = utils.get_tags();
    console.log("[DBFMT] get tags: ", info.tags);
    info.links = [utils.get_db_link()];
    console.log("[DBFMT] get links: ", info.links);
    poster_filename.value = dayjs().format('YYYYMMDD-HHmmss');
    info.poster = [poster_filename.value + '.avif'];
    console.log("[DBFMT] create poster name: ", info.poster);
    poster_link.value = utils.get_poster_link();
    console.log("[DBFMT] create poster link: ", poster_link.value);
    if (poster_filename.value && poster_link.value) {
        poster_filename.value = poster_filename.value + '.' + poster_link.value?.split('.').at(-1);
        utils.resize_poster(poster_link.value, (blob) => {
            preview_buffer.value = blob;
        });
    }

    let notes: Record<string, any>[] = [];
    let watched = utils.get_watched_note();
    if (mode.value === 'tv') {
        notes.push({
            status: 'ing',
            rate: watched.rate,
            eposides: [{
                eposide: '1',
                timestamp: watched.timestamp,
            }],
        });
    } else {
        notes.push(watched);
    }

    object.value = { type: mode.value, info: info, notes: notes };
}

function copy() {
    navigator.clipboard.writeText(msg.value);
    info.value = 'COPIED';
    info_showed.value = true;
}

function download_record() {
    if (!record_filename.value || !msg.value) return;
    const url = URL.createObjectURL(new Blob([msg.value], { type: 'application/yaml' }));
    let tmp = document.createElement('a');
    tmp.href = url;
    tmp.download = record_filename.value;
    tmp.click();
    URL.revokeObjectURL(url);
}

const preview = computed(() => {
    if (!preview_buffer.value) return null;
    return window.URL.createObjectURL(preview_buffer.value);
});

onMounted(() => {
    setTimeout(active, 3000);
    // API 探测类型，若用户未手动切换则自动校正
    let id = utils.get_subject_id();
    if (id) {
        utils.fetch_subject_meta(id).then((meta) => {
            if (meta) {
                api_episodes.value = meta.episodes;
                if (!user_touched.value && meta.type !== mode.value) {
                    console.log("[DBFMT] api type:", meta.type, "-> auto switch");
                    mode.value = meta.type;
                    active();
                }
            }
        });
    }
});
</script>

<template>
    <var-space direction="column">
        <var-snackbar v-model:show="info_showed" :duration="1000">{{ info }}</var-snackbar>
        <var-button-group type="primary" mode="outline" style="width: 100%">
            <var-button @click="active">刷新</var-button>
            <var-button @click="copy">拷贝</var-button>
            <var-button @click="download_record" :disabled="!record_filename">下载</var-button>
        </var-button-group>
        <var-button-group type="warning" mode="outline" style="width: 100%">
            <var-button :type="mode === 'movie' ? 'warning' : 'default'" @click="switchMode('movie')">Movie</var-button>
            <var-button :type="mode === 'tv' ? 'warning' : 'default'" @click="switchMode('tv')">TV</var-button>
        </var-button-group>
        <div class="code">
            <code><pre># {{ record_filename }}</pre></code>
            <code>
                <pre>{{ msg }}</pre>
            </code>
        </div>
        <a v-if="preview" :href="preview" :download="poster_filename">
            <var-divider description="小图" />
            <img :src="preview" />
        </a>
        <var-skeleton v-else loading card :rows="0"></var-skeleton>
    </var-space>
</template>

<style scoped>
.code {
    border: 1px solid var(--button-primary-color);
    border-radius: 5px;
    padding: 0.5rem;
    color: var(--button-primary-color);
}
</style>
