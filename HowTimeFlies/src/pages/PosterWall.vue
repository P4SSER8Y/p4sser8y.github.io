<template>
    <ErrorNotFound v-if="data.length == 0"></ErrorNotFound>
    <CardLayout v-else :data="data"></CardLayout>

    <q-page-sticky>
        <q-btn
            @click="openConfig"
            icon="settings"
            style="opacity: 0.25"
        ></q-btn>
    </q-page-sticky>
</template>

<script setup lang="ts">
import ErrorNotFound from './ErrorNotFound.vue';
import CardLayout from 'src/layouts/CardLayout.vue';
import { ref, onMounted, watch } from 'vue';
import { api } from 'boot/axios';
import { MovieRecord } from 'src/components/models';
import { useMeta, useQuasar } from 'quasar';
import { parseAllDocuments } from 'yaml';
import { useRoute } from 'vue-router';
import PosterWallConfig from '../components/posterWallConfig.vue';
import { useViewConfigStore } from 'src/stores/viewConfig';
import { storeToRefs } from 'pinia';

const viewConfig = storeToRefs(useViewConfigStore());
const $q = useQuasar();

const route = useRoute();
const data = ref<MovieRecord[]>([]);

onMounted(async () => {
    await update();
});

watch(viewConfig.user, update);

useMeta(() => {
    return {
        title:
            'How Time Flies' +
            (viewConfig.user.value && viewConfig.user.value.length > 0
                ? ' - ' + viewConfig.user.value
                : ''),
    };
});

async function update() {
    let raw = await api.get(`${viewConfig.user.value}/records.yml`);
    data.value = raw
        ? parseAllDocuments(raw.data)
              .map((x) => x.toJS())
              .filter((x) => x)
        : [];
}

function openConfig() {
    $q.dialog({ component: PosterWallConfig });
}
</script>
