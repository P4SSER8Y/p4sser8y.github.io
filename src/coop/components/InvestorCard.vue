<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Investor, get_balance, Bus } from '../utility/db';

let props = defineProps<{
    investor: Investor;
}>();

const balance = ref(0);

function update(id: number | null) {
    if (id && id != props.investor.id) return;
    balance.value = get_balance(props.investor.id);
}

onMounted(() => update(props.investor.id));
Bus.on('update', update);
</script>

<template>
    <q-card class="card">
        <q-card-section>
            {{ props.investor.name }}
        </q-card-section>
        <q-card-section class="center">
            {{ balance }}
        </q-card-section>
    </q-card>
</template>

<style scoped>
@media (orientation: landscape) {
    .card {
        height: 33.33dvmin;
        width: 44.44dvmin;
    }
}

@media (orientation: portrait) {
    .card {
        height: 24.75dvmin;
        width: 33.33dvmin;
    }
}
</style>
