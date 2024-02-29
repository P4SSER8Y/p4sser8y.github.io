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
        <var-button-group type="primary" mode="outline" style="width: 100%">
            <var-button @click="active">刷新</var-button>
            <var-button @click="copy">拷贝</var-button>
        </var-button-group>
        <div class="code">
            <code>
                <pre>{{ msg }}</pre>
            </code>
        </div>
    </var-space>
</template>

<style scoped>
.code {
    border: 1px solid var(--button-primary-color);
    border-radius: 5px;
    padding: .5rem;
    color: var(--button-primary-color);
}
</style>
