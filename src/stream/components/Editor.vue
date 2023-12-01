<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide" full-width>
        <q-card>
            <q-card-section horizontal>
                <q-card-section>
                    <PreviewCard :data="data" :width="props.previewWidth"> </PreviewCard>
                    <q-expansion-item dense label="raw">
                        <q-card style="white-space: pre">
                            {{ JSON.stringify(data, null, 4) }}
                        </q-card>
                    </q-expansion-item>
                    <q-card-actions align="around" class="q-gutter-sm" vertical>
                        <q-btn @click="clickOk" color="green" class="full-width"> OK </q-btn>
                        <q-btn @click="clickCancel" color="red" dense class="full-width"> Cancel </q-btn>
                    </q-card-actions>
                </q-card-section>
                <q-list bordered>
                    <AbstractEditor :data="data" :description="description!" class="full-width"> </AbstractEditor>
                </q-list>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { computed, reactive } from 'vue';
import { TvRecord, isMovieRecord, isTvRecord } from '../models/models';
import AbstractEditor from './editorComponents/AbstractEditor.vue';
import { MovieFieldDescription, TvFieldDescription } from './editorComponents/editorDefinitions';
import PreviewCard from './PreviewCard.vue';
const props = defineProps<{ data: TvRecord; label: string; previewWidth: number }>();
defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const data = reactive(props.data);

const description = computed(() => {
    if (isTvRecord(props.data)) {
        return TvFieldDescription;
    } else if (isMovieRecord(props.data)) {
        return MovieFieldDescription;
    } else {
        return null;
    }
});

function clickOk() {
    onDialogOK(props.data);
}

function clickCancel() {
    onDialogCancel();
}
</script>
