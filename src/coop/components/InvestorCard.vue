<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Investor, get_balance, Bus } from '../utility/db';

let props = defineProps<{
    investor: Investor;
}>();

const el_card = ref(null);
const balance = ref(0);
const investor = props.investor;

function update(id: number | null) {
    if (id && id != props.investor.id) return;
    balance.value = get_balance(props.investor.id);
}

onMounted(() => update(props.investor.id));

defineExpose({
    investor,
});
Bus.on('update', update);
</script>

<template>
    <q-card class="card" ref="el_card">
        <q-card-section>
            <div class="name">{{ props.investor.name }}</div>
        </q-card-section>
        <q-card-section class="center">
            {{ balance }}
        </q-card-section>
    </q-card>
</template>

<style scoped>
.name {
    width: 100%;
    font-size: 1.5rem;
}
</style>
