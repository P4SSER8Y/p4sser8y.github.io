<script setup lang="ts">
import { Ref, onMounted, reactive, ref } from 'vue';
import { init_db, list_investors, new_investor, drop_db, Investor, new_transaction, Bus } from '../utility/db';
import InvestorCard from '../components/InvestorCard.vue';
import BankCard from '../components/BankCard.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

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
    update_investors();
    if (investors.value?.length == 0) {
        router.push({ path: '/' });
    }
}

function update_investors() {
    investors.value = list_investors().filter((x) => x.id >= 0);
}

function go_home() {
    drop_db();
    router.push({ name: 'home' });
}

onMounted(() => {
    init();
});
</script>
<template>
    <q-page class="full-height column justify-center items-center content-center">
        <div class="full-width row no-wrap justify-center items-center content-center">
            <div v-if="investors" class="grid-container self-center">
                <template v-for="item in GRID_ALIGNED[investors.length]" class="grid-item">
                    <div v-if="item == null"></div>
                    <InvestorCard v-else-if="item >= 0" :investor="investors[item]" class=""> </InvestorCard>
                    <BankCard v-else @click="go_home"></BankCard>
                </template>
            </div>
        </div>
    </q-page>
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
