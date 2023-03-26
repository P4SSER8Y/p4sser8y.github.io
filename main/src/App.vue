<script setup lang="ts">
import MorseCodeTitle from './MorseCodeTitle.vue';
import ConveyGameOfLife from './ConveyGameOfLife.vue';
</script>

<template>
  <!-- <MorseCodeTitle title="hello world"></MorseCodeTitle> -->
  <div class="grid grid-cols-1 grid-rows-1 h-screen w-screen bg-[url('https://api.dujin.org/bing/1920.php')] bg-cover bg-center">
    <div class="flex flex-col justify-center gap-4 backdrop-blur-md backdrop-brightness-75 backdrop-saturate-75">
      <ConveyGameOfLife :width="28" :height="21" class="place-self-end self-center"></ConveyGameOfLife>
      <span class="flex flex-row place-self-center self-center">
        <button class="btn w-full btn-xs btn-outline btn-ghost" onclick="window.location.href='/stream'">stream</button>
      </span>
    </div>
  </div>
</template>

<style scoped lang="postcss">
@supports (-webkit-touch-callout: none) {
  .h-screen {
    height: -webkit-fill-available;
  }
}
</style>
