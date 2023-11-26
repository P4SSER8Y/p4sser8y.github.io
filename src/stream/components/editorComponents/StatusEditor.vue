<template>
    <q-select v-model="value" :label="description.label" :options="options" dense options-dense></q-select>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { StatusType } from './editorDefinitions';

const props = defineProps<{ data: any, description: StatusType }>();
const value = computed({
    get() {
        return props.data[props.description.id];
    },
    set(value) {
        props.data[props.description.id] = value;
    }
})
const options = [
    'ing',
    'done',
    'abandoned',
]
</script>
