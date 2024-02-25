<script setup lang="ts">
import { Ref, onMounted, reactive, ref } from 'vue';
import { init_db, list_investors, new_investor, drop_db, Investor, new_transaction, Bus } from './utility/db';
import InvestorCard from './components/InvestorCard.vue';

const investors: Ref<Investor[] | null> = ref([]);

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
    new_investor(0, 'alice', '');
    new_investor(1, 'tifa', '');
    new_investor(2, 'vector', '');
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
            <div class="fit row wrap justify-center items-center content-center">
                <InvestorCard v-for="item in investors" :investor="item" class="p-"></InvestorCard>
            </div>
        </q-page-container>
    </q-layout>
</template>
