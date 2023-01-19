<template>
    <CardLayout :data="data"></CardLayout>
</template>

<script setup lang="ts">
import CardLayout from 'src/layouts/CardLayout.vue';
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import { MovieRecord } from 'src/components/models';
const data = ref<MovieRecord[]>([]);

onMounted(async () => {
    let r = await api.post('watch', { token: 'hello' });
    data.value = (r.data ?? null)?.data;
});
</script>
