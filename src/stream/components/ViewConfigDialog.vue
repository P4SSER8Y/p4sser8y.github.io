<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card class="q-dialog-plugin">
            <q-card-section>
                <q-btn-toggle v-bind:model-value="viewConfig.lastPage.value" spread @update:model-value="switchPage"
                    :options="[
                        { icon: 'timeline', value: 'timeline' },
                        { icon: 'view_comfy', value: 'posterWall' },
                    ]"></q-btn-toggle>
            </q-card-section>
            <q-separator />
            <q-card-section>
                <div class="text-h5">Configuration</div>
            </q-card-section>
            <q-card-section>
                <div class="main text-h6">
                    <span> Information </span>
                    <q-toggle v-model="viewConfig.detailedInfo.value">
                    </q-toggle>

                    <span> Merge Same Movie </span>
                    <q-toggle v-model="viewConfig.merged.value"> </q-toggle>

                    <span class="text">Timeline Format</span>
                    <q-btn-toggle v-model="viewConfig.classifyFormat.value" toggle-color="primary" text-color="primary" push
                        no-caps rounded :options="[
                            { label: 'Y', value: 'YYYY' },
                            { label: 'YM', value: 'YYYY-MM' },
                            { label: 'YMD', value: 'YYYY-MM-DD ddd' },
                        ]">
                    </q-btn-toggle>

                    <span class="text"> Home </span>
                    <q-btn href="/" no-caps> Go </q-btn>

                    <span class="text"> User </span>
                    <q-btn href="/" no-caps> {{ user ?? "???" }}</q-btn>
                </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
                <div class="text-h5">About</div>
            </q-card-section>
            <q-card-section>
                <div>
                    Powered by
                    <a class="text-white" href="https://quasar.dev/">
                        Quasar
                    </a>
                </div>
                <div v-if="now">
                    Build at {{ now }}
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { useViewConfigStore } from '../stores/viewConfig';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue';
import { decodeJwtPayload } from '../../utils/jwt';

const router = useRouter();

const { dialogRef, onDialogHide } = useDialogPluginComponent();

const viewConfig = storeToRefs(useViewConfigStore());

const now = process.env.INFO_NOW ? ((new Date(parseInt(process.env.INFO_NOW) * 1000)).toLocaleString()) : null;

const token = useLocalStorage('token', '');

const user = computed(() => decodeJwtPayload(token.value)?.name)

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
