<template>
    <q-input v-model="value" :label="description.label" :dense="true"></q-input>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { StringType } from './editorDefinitions';

const props = defineProps<{ data: any, description: StringType }>();
const value = computed({
    get() {
        return props.data[props.description.id];
    },
    set(value) {
        props.data[props.description.id] = value;
    }
})
</script>
