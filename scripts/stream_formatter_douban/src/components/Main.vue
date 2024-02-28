<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import YAML from 'yaml';
import * as utils from '../utils';

const object = ref({});
const msg = computed(() => {
    return YAML.stringify(object.value);
});
const info = ref('');
const info_showed = ref(false);

console.log('hello world');
function active() {
    let titles = utils.get_titles();

    let info: Record<string, any> = {};
    info.year = utils.get_year();
    info.title = titles[0] ?? '?';
    info.tags = utils.get_tags();
    info.links = [utils.get_db_link()];
    if (titles[1]) info.localTitle = titles[1];

    let notes: Record<string, any>[] = [];
    notes.push(utils.get_watched_note());

    object.value = { info: info, notes: notes };
}

function copy() {
    navigator.clipboard.writeText(msg.value);
    info.value = 'COPIED';
    info_showed.value = true;
}

onMounted(() => {
    active();
});
</script>

<template>
    <var-space direction="column">
        <var-snackbar v-model:show="info_showed" :duration="1000">{{ info }}</var-snackbar>
        <var-button type="primary" style="width: 100%" @click="active">refresh</var-button>
        <var-button type="primary" style="width: 100%" @click="copy">copy</var-button>
        <var-input readonly textarea variant="outlined" v-model="msg" />
    </var-space>
</template>

<style scoped></style>
