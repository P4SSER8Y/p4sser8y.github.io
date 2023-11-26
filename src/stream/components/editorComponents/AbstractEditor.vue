<template>
    <component :is="MAP.get(props.description.type)!" :data="reactive(props.data)" :description="props.description">
    </component>
</template>

<script setup lang="ts">
import StringEditor from './StringEditor.vue';
import ObjectEditor from './ObjectEditor.vue';
import ListEditor from './ListEditor.vue';
import TagsEditor from './TagsEditor.vue'
import EposideEditor from './EposideEditor.vue';
import StatusEditor from './StatusEditor.vue';
import RatingEditor from './RatingEditor.vue';
import { EditorType, FieldDescription, ObjectType } from './editorDefinitions';
import { reactive } from 'vue';

const MAP = new Map<EditorType, object>([
    [EditorType.String, StringEditor],
    [EditorType.Object, ObjectEditor],
    [EditorType.List, ListEditor],
    [EditorType.Tags, TagsEditor],
    [EditorType.Eposide, EposideEditor],
    [EditorType.Status, StatusEditor],
    [EditorType.Rating, RatingEditor],
]);

const props = defineProps<{ data: any, description: FieldDescription }>();
</script>