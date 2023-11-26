<template>
    <AbstractEditor :data="data" :description="TvFieldDescription">
    </AbstractEditor>
    <q-card-section style="white-space: pre;">
        {{ JSON.stringify(data, null, 4) }}
    </q-card-section>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { TvRecord } from '../models/models';
import StringEditor from '../components/editorComponents/StringEditor.vue'
import AbstractEditor from './editorComponents/AbstractEditor.vue';
import { TvFieldDescription } from './editorComponents/editorDefinitions';
const props = defineProps<{ data: TvRecord, label: string }>();

const data = reactive(props.data);
console.log(data)

const title = ref(props.data.info.title);
const localTitle = ref(props.data.info.localTitle);

watch(data, () => {
    console.log(data);
})

</script>