<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-primary text-white">
            <!-- <q-toolbar>
                <q-toolbar-title>
                    <q-avatar>
                        <img
                            src="favicon.ico"
                            style="filter: brightness(100)"
                        />
                    </q-avatar>
                    How Time Flies
                </q-toolbar-title>

                <q-btn
                    dense
                    flat
                    square
                    icon="add"
                    @click="toggleAddMovieRecord"
                ></q-btn>
                <q-btn
                    dense
                    flat
                    square
                    icon="menu"
                    @click="toggleRightDrawer"
                />
            </q-toolbar> -->
        </q-header>

        <q-drawer
            v-model="rightDrawerOpen"
            side="right"
            overlay
            behavior="mobile"
            bordered
        >
            <h1>hello</h1>
        </q-drawer>

        <q-page-container>
            <q-scroll-area style="height: 100vh; width: 100vw;">
                <router-view />
            </q-scroll-area>
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
// import AddMovieRecordDialog from './components/AddMovieRecordDialog.vue';
const $q = useQuasar();
$q.dark.set(true);

const rightDrawerOpen = ref(false);
function toggleRightDrawer(): void {
    rightDrawerOpen.value = !rightDrawerOpen.value;
}

// function toggleAddMovieRecord(): void {
//     $q.dialog({
//         component: AddMovieRecordDialog,
//     });
// }
</script>
