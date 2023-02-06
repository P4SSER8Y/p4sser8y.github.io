<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card class="q-dialog-plugin">
            <q-card-section>
                <q-btn-toggle
                    v-bind:model-value="viewConfig.lastPage.value"
                    spread
                    @update:model-value="switchPage"
                    :options="[
                        { icon: 'timeline', value: 'timeline' },
                        { icon: 'date_range', value: 'posterWall' },
                    ]"
                ></q-btn-toggle>
            </q-card-section>
            <q-card-section>
                <div class="main text-h6">
                    <span>User</span>
                    <q-input v-model="viewConfig.user.value" dense> </q-input>

                    <span> Information </span>
                    <q-toggle v-model="viewConfig.detailedInfo.value">
                    </q-toggle>

                    <span> Merge Same Movie </span>
                    <q-toggle v-model="viewConfig.merged.value"> </q-toggle>

                    <span class="text">Timeline Format</span>
                    <q-btn-toggle
                        v-model="viewConfig.classifyFormat.value"
                        toggle-color="primary"
                        text-color="primary"
                        push
                        no-caps
                        rounded
                        :options="[
                            { label: 'Y', value: 'YYYY' },
                            { label: 'YM', value: 'YYYY-MM' },
                        ]"
                    >
                    </q-btn-toggle>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { useViewConfigStore } from 'src/stores/viewConfig';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter();

const { dialogRef } = useDialogPluginComponent();

const viewConfig = storeToRefs(useViewConfigStore());

function switchPage(page: string) {
    router.push(`/${page}`);
}
</script>

<style scoped>
.main {
    display: grid;
    grid-template-columns: max-content auto;
    justify-items: left;
    align-items: end;
}
</style>
