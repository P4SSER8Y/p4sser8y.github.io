<script setup lang="ts">
import MorseCodeTitle from './MorseCodeTitle.vue';
import ConveyGameOfLife from './ConveyGameOfLife.vue';
</script>

<template>
  <!-- <MorseCodeTitle title="hello world"></MorseCodeTitle> -->
  <div class="grid grid-cols-1 grid-rows-1 h-screen w-screen" style="position: absolute;">
    <div class="gradient"></div>
  </div>
  <div class="grid grid-cols-1 grid-rows-1 h-screen w-screen">
    <div class="flex flex-col justify-center gap-4">
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

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.gradient {
  @apply place-self-center self-center;
  overflow: hidden;
  --size: 250px;
  width: var(--size);
  height: var(--size);
  filter: blur(calc(var(--size) / 5));
  background-image: linear-gradient(rgba(55, 235, 169, 0.85), #5b37eb);
  animation: rotate 5s linear infinite;
  border-radius: 30% 70% 70% 30%/30% 30% 70% 70%;
}

@media (min-width: 720px) {
  .gradient {
    --size: 500px;
  }
}

/* This is just to transition when you change the viewport size. */
* {
  transition: all 0.25s ease-out;
}

button {
  @apply backdrop-blur-xl;
}
</style>
