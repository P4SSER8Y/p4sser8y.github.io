<script setup lang="ts">
import MorseCodeTitle from './MorseCodeTitle.vue';
</script>

<template>
  <MorseCodeTitle title="hello world"></MorseCodeTitle>
  <div>
    <button class="btn" onclick="window.location.href='/stream'">stream</button>
  </div>
</template>
