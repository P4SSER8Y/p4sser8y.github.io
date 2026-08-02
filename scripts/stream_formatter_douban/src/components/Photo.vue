<script setup lang="ts">
import { onMounted, ref, computed, Ref } from 'vue';
import * as utils from '../utils';
import dayjs from 'dayjs';

const poster_filename: Ref<string | null> = ref(null);
const preview_buffer: Ref<Blob | null> = ref(null);
const info = ref('');
const info_showed = ref(false);

function active() {
    poster_filename.value = dayjs().format('YYYYMMDD-HHmmss') + '.avif';
    let link = utils.get_photo_img();
    console.log('[DBFMT] photo link:', link);
    if (link) {
        utils.resize_poster(link, (blob) => {
            preview_buffer.value = blob;
        });
    }
}

async function copy() {
    if (!poster_filename.value) return;
    try {
        await navigator.clipboard.writeText(poster_filename.value);
        info.value = 'COPIED';
    } catch (e) {
        info.value = 'FAILED';
    }
    info_showed.value = true;
}

const preview = computed(() => {
    if (!preview_buffer.value) return null;
    return window.URL.createObjectURL(preview_buffer.value);
});

onMounted(() => {
    setTimeout(active, 1000);
});
</script>

<template>
    <var-space direction="column">
        <var-snackbar v-model:show="info_showed" :duration="1000">{{ info }}</var-snackbar>
        <var-button type="primary" mode="outline" style="width: 100%" @click="copy">
            {{ poster_filename ?? '抓图中…' }}
        </var-button>
        <var-button type="primary" mode="text" style="width: 100%" @click="active">重新抓取</var-button>
        <a v-if="preview" :href="preview" :download="poster_filename">
            <var-divider description="小图" />
            <img :src="preview" />
        </a>
        <var-skeleton v-else loading card :rows="0"></var-skeleton>
    </var-space>
</template>
