<template>
    <q-layout view="hHh lpR fFf">
        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
const $q = useQuasar();
$q.dark.set(true);
</script>
