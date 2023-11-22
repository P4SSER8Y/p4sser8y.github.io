<script setup lang="ts">
import ConveyGameOfLife from './ConveyGameOfLife.vue';
import { now, useLocalStorage, useUrlSearchParams } from '@vueuse/core';
import { decodeJwtPayload } from '../utils/jwt'
import { ComputedRef, Ref, computed } from 'vue';

const buildTime = new Date(parseInt(process.env.INFO_NOW ?? '') * 1000).toLocaleString();
const searchParams = useUrlSearchParams();
const token = useLocalStorage('token', '');
if (searchParams.token) {
  token.value = searchParams.token as string;
}

let name = computed(() => {
  let payload = decodeJwtPayload(token.value);
  if (payload) {
    if (payload.exp) {
      if (payload.exp > now() / 1000) {
        if (payload.name) {
          return payload.name;
        }
      }
    }
  }
  if (token.value != '') {
    token.value = '';
  }
  return 'admin';
})
let gate = new URL(process.env.GATE_LOCATION ?? '');
gate.searchParams.set('callback', window.location.origin);

const links: [string | Ref<string> | ComputedRef<string>, string][] = [
  ['stream', '/stream/'],
  ['key', '/pgp.asc'],
  [name, gate.href],
];

function makeLocalLink(link: string): string {
  return `window.location.href='${link}'`;
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
