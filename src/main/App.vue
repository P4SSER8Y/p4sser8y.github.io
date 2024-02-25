<script setup lang="ts">
import ConveyGameOfLife from './ConveyGameOfLife.vue';
import { now, useLocalStorage } from '@vueuse/core';
import { decodeJwtPayload } from '../utils/jwt'
import { ComputedRef, Ref, computed } from 'vue';
import { raven } from '../utils/raven';

const buildTime = new Date(parseInt(process.env.INFO_NOW ?? '') * 1000).toLocaleString();
const token = useLocalStorage('token', '');

let name = computed(() => {
  let payload = decodeJwtPayload(token.value);
  if (payload) {
    if (payload.exp) {
      if (payload.exp > now() / 1000) {
        if (payload.n) {
          return payload.n;
        }
      }
    }
  }
  if (token.value != '') {
    token.value = '';
  }
  return 'admin';
})
const links: [string | Ref<string> | ComputedRef<string>, string | (() => void)][] = [
  ['stream', '/stream/'],
  ['key', '/pgp.asc'],
  ['coop', '/coop/'],
  [name, triggerRaven],
];

function makeLocalLink(link: string | any): string | any {
  if (typeof link === 'string')
    return `window.location.href='${link}'`;
  else
    return link;
}

function triggerRaven() {
    raven(process.env.GATE_LOCATION).then((token) => console.log(decodeJwtPayload(token))).catch((e) => console.log(e));
}
</script>

<template>
  <!-- <MorseCodeTitle title="hello world"></MorseCodeTitle> -->
  <div
    class="tw-text-xs tw-fixed tw-z-100 tw-bottom-5 tw-left-1/2 -tw-translate-x-1/2 tw-transition tw-text-gray-700 tw-duration-200 hover:tw-text-inherit focus:tw-text-inherit active:tw-text-inherit">
    <span> Build: {{ buildTime }} </span>
  </div>
  <div class="tw-grid tw-grid-cols-1 tw-grid-rows-1 tw-h-screen tw-w-screen">
    <div class="tw-flex tw-flex-col tw-justify-center tw-gap-4">
      <ConveyGameOfLife :width="28" :height="21" class="tw-place-self-end tw-self-center"></ConveyGameOfLife>
      <span class="tw-flex tw-flex-row tw-place-self-center tw-self-center tw-place-content-center tw-gap-2">
        <button v-for="link in links" :onclick="makeLocalLink(link[1])"
          class="tw-place-self-center tw-self-center tw-basis-1">
          {{ (typeof link[0] === 'string') ? link[0] : link[0].value }}
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
  @apply tw-btn tw-w-full tw-btn-xs tw-btn-ghost tw-backdrop-blur-xl;
}
</style>
