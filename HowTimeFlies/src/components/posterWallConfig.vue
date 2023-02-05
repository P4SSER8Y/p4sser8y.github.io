<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card class="q-dialog-plugin">
            <q-card-section>
                <q-input
                    borderless
                    v-model="viewConfig.user.value"
                    label="user"
                >
                </q-input>
            </q-card-section>
            <q-card-section>
                <q-toggle v-model="viewConfig.detailedInfo.value">
                    Information
                </q-toggle>
            </q-card-section>
            <q-card-section>
                <q-toggle v-model="viewConfig.merged.value">
                    Merge Same Movie
                </q-toggle>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { useViewConfigStore } from 'src/stores/viewConfig';
import { storeToRefs } from 'pinia';

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
    useDialogPluginComponent();

const viewConfig = storeToRefs(useViewConfigStore());

function onOKClicked() {
    onDialogOK();
}

function onCancelClicked() {
    onDialogCancel();
}
</script>
