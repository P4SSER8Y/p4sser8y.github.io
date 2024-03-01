<template>
    <q-page style="width: 100%; height: 100%">
        <div class="column">
            <h1 class="text-center" style="width: 100%">Monopoly Bank</h1>
            <div class="row no-wrap justify-center items-center content-start">
                <q-btn v-if="!route.params.ing" label="GO" size="xl" @click="go"></q-btn>
            </div>
            <div class="row no-wrap justify-center items-center content-start">
                <q-btn label="wtf"></q-btn>
            </div>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { Ref, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { drop_db, init_db, list_investors, Bus, Investor, new_investor } from '../utility/db';

const investors: Ref<Investor[]> = ref([]);
const route = useRoute();
const router = useRouter();

onMounted(async () => {
    Bus.on('update', update);
    init_db();
});

onUnmounted(async () => {
    Bus.off('update', update);
});

watch(investors, () => {
    if (!route.params.ing && investors.value.length > 0) {
        router.push({ name: 'desk' });
    }
});

function reset() {
    drop_db();
    router.push({ name: 'home' });
}

function update() {
    investors.value = list_investors().filter((x) => x.id >= 0);
}

function go() {
    new_investor(1, 'alice', '');
    new_investor(2, 'bob', '');

    router.push({ name: 'desk' });
}
</script>
