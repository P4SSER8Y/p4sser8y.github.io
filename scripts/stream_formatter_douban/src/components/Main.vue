<script setup lang="ts">
import { onMounted, ref, computed, Ref } from 'vue';
import YAML from 'yaml';
import * as utils from '../utils';
import dayjs from 'dayjs';

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

console.log('hello world');
function active() {
    let titles = utils.get_titles();

    let info: Record<string, any> = {};
    info.year = utils.get_year();
    info.title = titles[0] ?? '?';
    record_filename.value = `${info.year}-${titles[0]}.yml`;
    if (titles[1]) {
        info.localTitle = titles[1];
        record_filename.value = `${info.year}-${titles[1]}.yml`;
    }
    record_filename.value = utils.safe_filename(record_filename.value);
    info.tags = utils.get_tags();
    info.links = [utils.get_db_link()];
    poster_filename.value = dayjs().format('YYYYMMDD-HHmmss');
    info.poster = [poster_filename.value + '.webp'];
    poster_link.value = utils.get_poster_link();
    if (poster_filename.value && poster_link.value) {
        poster_filename.value = poster_filename.value + '.' + poster_link.value?.split('.').at(-1);
        utils.resize_poster(poster_link.value, (blob) => {
            preview_buffer.value = blob;
        });
    }

    let notes: Record<string, any>[] = [];
    notes.push(utils.get_watched_note());

    object.value = { info: info, notes: notes };
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
    active();
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
        <div class="code">
            <code><pre># {{ record_filename }}</pre></code>
            <code>
                <pre>{{ msg }}</pre>
            </code>
        </div>
        <a v-if="preview" :href="preview" :download="poster_filename">
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
