<script setup lang="ts">
import MorseCodeTitle from './MorseCodeTitle.vue';
import ConveyGameOfLife from './ConveyGameOfLife.vue';

const now = new Date(parseInt(import.meta.env.INFO_NOW) * 1000).toLocaleString();

const links: [string, string][] = [
  ["stream", "stream/"],
  ["key", "pgp.asc"],
  // ["admin", "admin"],
];

function makeLocalLink(link: string): string {
  return `window.location.href='/${link}'`;
}
</script>

<template>
  <!-- <MorseCodeTitle title="hello world"></MorseCodeTitle> -->
  <div class="text-xs fixed z-100 bottom-0 right-0 group transition duration-200 text-slate-700 hover:text-slate-50 active:text-slate-50 focus:text-slate-50">
    <span> ◪ </span>
    <span class="hidden group-hover:contents group-focus:contents group-active:contents"> Build: {{ now }} </span>
  </div>
  <div class="grid grid-cols-1 grid-rows-1 h-screen w-screen">
    <div class="flex flex-col justify-center gap-4">
      <ConveyGameOfLife :width="28" :height="21" class="place-self-end self-center"></ConveyGameOfLife>
      <span class="flex flex-row place-self-center self-center place-content-center gap-2">
        <button v-for="link in links" :onclick="makeLocalLink(link[1])" class="place-self-center self-center basis-1">
          {{ link[0] }}
        </button>
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

* {
  transition: all 0.25s ease-out;
}

button {
  @apply btn w-full btn-xs btn-ghost backdrop-blur-xl;
}
</style>
