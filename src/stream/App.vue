<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-page-sticky>
      <q-btn @click="openConfig" iconsrc="settings" style="opacity: 0.25"></q-btn>
    </q-page-sticky>
  </q-layout>
  <!-- <div v-for="i of fireflyQuantity" class="firefly" :key="i"></div> -->
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useDataStore } from './stores/data';
import { storeToRefs } from 'pinia';
import { api, netlify } from './boot/axios';
import ViewConfigDialog from './components/ViewConfigDialog.vue';

// const fireflyQuantity = 37;

const $q = useQuasar();
$q.dark.set(true);

const data = storeToRefs(useDataStore());

onMounted(async () => {
  await update();
});

async function update() {
  try {
    let raw = await api!.get(process.env.STREAM_RECORD_PATH!);
    data.data.value = raw.data;
  } catch (e) {
    data.data.value = [];
  }
}

function openConfig() {
  $q.dialog({
    component: ViewConfigDialog,
    position: 'bottom',
    noRouteDismiss: true,
    transitionShow: 'slide-down',
  });
}
</script>

<style lang="sass">
@use "sass:math"
$fireflyQuantity: 37

.firefly
  position: fixed
  left: 50%
  top: 50%
  width: 0.4vw
  height: 0.4vw
  margin: -0.2vw 0 0 9.8vw
  animation: ease 200s alternate infinite
  pointer-events: none

  &::before,
  &::after
    content: ''
    position: absolute
    width: 100%
    height: 100%
    border-radius: 50%
    transform-origin: -10vw

  &::before
    background: black
    opacity: 0.4
    animation: drift ease alternate infinite

  &::after
    background: white
    opacity: 0
    box-shadow: 0 0 0vw 0vw yellow
    animation: drift ease alternate infinite, flash ease infinite


// Randomize Fireflies Motion
@for $i from 1 through $fireflyQuantity

  $steps: random(12) + 16
  $rotationSpeed: random(10) + 8s

  .firefly:nth-child(#{$i})
    animation-name: move#{$i}

    &::before
      animation-duration: #{$rotationSpeed}

    &::after
      animation-duration: #{$rotationSpeed}, random(6000) + 5000ms
      animation-delay: 0ms, random(8000) + 500ms

  @keyframes move#{$i}
    @for $step from 0 through $steps
      #{$step * math.div(100, $steps)}%
        transform: translateX(random(100) - 50vw) translateY(random(100) - 50vh) scale(math.div(random(75), 100) + .25)

@keyframes drift
  0%
    transform: rotate(0deg)
  100%
    transform: rotate(360deg)

@keyframes flash
  0%, 30%, 100%
    opacity: 0
    box-shadow: 0 0 0vw 0vw yellow
  5%
    opacity: 1
    box-shadow: 0 0 2vw 0.4vw yellow
</style>
