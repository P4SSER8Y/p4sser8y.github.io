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
                        { icon: 'view_comfy', value: 'posterWall' },
                    ]"
                ></q-btn-toggle>
            </q-card-section>
            <q-separator />
            <q-card-section>
                <div class="text-h5">Configuration</div>
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
                            { label: 'YMD', value: 'YYYY-MM-DD ddd' },
                        ]"
                    >
                    </q-btn-toggle>
                </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
                <div class="text-h5">About</div>
            </q-card-section>
            <q-card-section>
                Powered by
                <a href="https://quasar.dev/"
                    ><q-chip outline color="secondary">
                        <q-avatar
                            icon="img:https://cdn.quasar.dev/logo-v2/svg/logo.svg"
                        />
                        Quasar
                    </q-chip></a
                >
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

const { dialogRef, onDialogHide } = useDialogPluginComponent();

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
