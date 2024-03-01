<template>
    <q-layout view="hHh lpR fFf" class="main">
        <q-page-container :style="{width: '100%', height: '100%'}">
            <router-view v-slot="{ Component, route }">
                <transition name="fade">
                    <component :is="Component" :key="$route.path"></component>
                </transition>
            </router-view>
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts"></script>

<style scoped>
.main{
    overflow: hidden;
    width: 100dvw;
    height: 100dvh
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
