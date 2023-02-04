<template>
    <ErrorNotFound v-if="data.length == 0"></ErrorNotFound>
    <CardLayout v-else :data="data"></CardLayout>
</template>

<script setup lang="ts">
import ErrorNotFound from './ErrorNotFound.vue';
import CardLayout from 'src/layouts/CardLayout.vue';
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import { MovieRecord } from 'src/components/models';
import { useMeta } from 'quasar';
import { parseAllDocuments } from 'yaml';
import { useRoute } from 'vue-router';

const route = useRoute();
const data = ref<MovieRecord[]>([]);
const user = ref(route.params.user);

onMounted(async () => {
    await update();
});

useMeta(() => {
    return {
        title:
            'How Time Flies' +
            (user.value && user.value.length > 0 ? ' - ' + user.value : ''),
    };
});

async function update() {
    let raw = await api.get(`${user.value}/records.yml`);
    data.value = raw
        ? parseAllDocuments(raw.data)
              .map((x) => x.toJS())
              .filter((x) => x)
        : [];
}
</script>
