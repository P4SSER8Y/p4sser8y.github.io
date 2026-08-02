<script setup lang="ts">
import Main from './components/Main.vue';
import Photo from './components/Photo.vue';

const isPhoto = location.pathname.startsWith('/photos/photo/');
</script>

<template>
    <h2>
        <i class>WTF</i>
        · · · · · ·
    </h2>
    <Photo v-if="isPhoto" />
    <Main v-else />
</template>

<style scoped></style>
