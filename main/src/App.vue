<script setup lang="ts">
import MorseCodeTitle from './MorseCodeTitle.vue';
</script>

<template>
  <MorseCodeTitle title="hello world"></MorseCodeTitle>
  <div class="grid grid-cols-1 grid-rows-1 h-screen w-screen">
    <span class="grid grid-cols-2 gap-4 place-self-center align-self-center">
      <button class="btn w-full" onclick="window.location.href='/stream'">stream</button>
      <!-- <button class="btn w-full" onclick="window.location.href='/log'">log</button> -->
    </span>
  </div>
</template>
