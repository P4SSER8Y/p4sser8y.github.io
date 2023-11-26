<template>
    <q-card>
        <q-card-section>
            {{ props.description.label }}
        </q-card-section>
        <q-card-section>
            <AbstractEditor v-for="item, index in props.data" :data="formatData(item, index)"
                :description="formatDescription(props.description.node, index)">
            </AbstractEditor>
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import AbstractEditor from './AbstractEditor.vue';
import { FieldDescription, ListType } from './editorDefinitions';
const props = defineProps<{ data: any, description: ListType }>();

function formatData(data: any, index: number) {
    if (typeof data === 'object') {
        return data;
    }
    return props.data;
}

function formatDescription(description: FieldDescription, index: number) {
    return Object.assign({}, description, {id: index});
}
</script>
