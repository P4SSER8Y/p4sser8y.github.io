<template>
    <q-card class="q-m-md bordered">
        <q-card-section v-if="props.description.label">
            {{ props.description.label }}
        </q-card-section>
        <q-card-section>
            <AbstractEditor v-for="item in props.description.node"
                :data="(typeof props.data[item.id] === 'object' ? props.data[item.id] : props.data)" :description="item">
                {{ item.label }}
            </AbstractEditor>
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { ObjectType } from './editorDefinitions';
import AbstractEditor from './AbstractEditor.vue';
const props = defineProps<{ data: any, description: ObjectType }>();
</script>
