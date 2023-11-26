<template>
    <q-card>
        <q-card-section>
            {{ props.description.label }}
        </q-card-section>
        <q-card-section class="row q-g-2">
            <q-chip v-for="item,index in props.data" dense outline>
                {{ item }}
                <q-popup-edit v-model="props.data[index]" auto-save v-slot="scope">
                    <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set"></q-input>
                </q-popup-edit>
            </q-chip>
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import { FieldDescription, ListType } from './editorDefinitions';
const props = defineProps<{ data: any, description: ListType }>();

function formatData(data: any, index: number) {
    if (typeof data === 'object') {
        return data;
    }
    return props.data;
}

function formatDescription(description: FieldDescription, index: number) {
    return Object.assign({}, description, { id: index, label: `${index}` });
}
</script>
