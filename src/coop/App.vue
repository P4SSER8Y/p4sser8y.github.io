<script setup lang="ts">
import { Ref, onMounted, reactive, ref } from 'vue';
import { init_db, list_investors, new_investor, drop_db, Investor, new_transaction, Bus } from './utility/db';
import InvestorCard from './components/InvestorCard.vue';

const investors: Ref<Investor[] | null> = ref([]);
const GRID_ALIGNED = [
    [null, null, null, null, -1, null, null, null, null],
    [null, null, null, null, -1, null, null, null, null],
    [null, 0, null, null, -1, null, null, 1, null],
    [null, 0, null, null, -1, null, 1, null, 2],
    [0, null, 1, null, -1, null, 2, null, 3],
    [null, 0, null, 1, -1, 2, 3, null, 4],
    [0, null, 1, 2, -1, 3, 4, null, 5],
    [0, null, 1, 2, -1, 3, 4, 5, 6],
    [0, 1, 2, 3, -1, 4, 5, 6, 7],
];

function init() {
    init_db();
    test();
}

function update_investors() {
    investors.value = list_investors().filter((x) => x.id >= 0);
}

function test() {
    drop_db();
    init_db();
    new_investor(0, 'alpha', '');
    new_investor(1, 'bravo', '');
    new_investor(2, 'charlie', '');
    new_investor(3, 'delta', '');
    new_investor(4, 'echo', '');
    new_investor(5, 'foxtrot', '');
    new_investor(6, 'golf', '');
    new_investor(7, 'hotel', '');
    update_investors();

    new_transaction(-1, 0, 1500);
    new_transaction(-1, 1, 1500);
    new_transaction(0, 1, 500);
    new_transaction(1, 0, 250);
}

onMounted(() => {
    init();
});
</script>

<template>
    <q-layout view="hHh lpR fFf">
        <q-page-container>
            <div
                class="full-width row no-wrap justify-center items-center content-center"
                :style="{ width: '100dvw', height: '100dvh' }"
            >
                <div v-if="investors" class="grid-container self-center">
                    <template v-for="item in GRID_ALIGNED[investors.length]" class="grid-item">
                        <div v-if="item == null"></div>
                        <InvestorCard v-else-if="item >= 0" :investor="investors[item]" class=""> </InvestorCard>
                        <div v-else>bank</div>
                    </template>
                </div>
            </div>
        </q-page-container>
    </q-layout>
</template>

<style scoped>
.grid-container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-gap: 15px;
}

.grid-item {
    width: 100%;
    height: 100%;
}
</style>
