<template>
    <q-layout view="hHh lpR fFf">
        <q-page-container>
            <router-view />
        </q-page-container>
        <q-page-sticky>
            <q-btn
                @click="openConfig"
                icon="settings"
                style="opacity: 0.25"
            ></q-btn>
        </q-page-sticky>
    </q-layout>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useDataStore } from './stores/data';
import { useViewConfigStore } from './stores/viewConfig';
import { storeToRefs } from 'pinia';
import { parseAllDocuments } from 'yaml';
import { api } from 'boot/axios';
import ViewConfigDialog from 'src/components/ViewConfigDialog.vue';
import throttle from 'lodash/throttle';

const $q = useQuasar();
$q.dark.set(true);

const viewConfig = storeToRefs(useViewConfigStore());
const data = storeToRefs(useDataStore());

onMounted(async () => {
    await update();
});

watch(viewConfig.user, throttle(update, 500, { trailing: true }));

async function update() {
    try {
        let raw = await api.get(`${viewConfig.user.value}/records.yml`);
        data.data.value = raw
            ? parseAllDocuments(raw.data)
                  .map((x) => x.toJS())
                  .filter((x) => x)
            : [];
    } catch (e) {
        data.data.value = [];
    }
}

function openConfig() {
    $q.dialog({
        component: ViewConfigDialog,
        position: 'bottom',
        noRouteDismiss: true,
        transitionShow: 'slide-down',
    });
}
</script>
