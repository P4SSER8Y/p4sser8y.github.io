<template>
    <div>
        rate
        <q-rating v-model="value" :max="5" :min="1" color="red" icon="favorite_border" icon-selected="favorite" no-reset>
        </q-rating>
    </div>
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
