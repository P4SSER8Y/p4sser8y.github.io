<script setup lang="ts">
import ConveyGameOfLife from './ConveyGameOfLife.vue';
import { useLocalStorage, useUrlSearchParams } from '@vueuse/core';
import { Base64 } from 'js-base64'

const now = new Date(parseInt(process.env.INFO_NOW ?? '') * 1000).toLocaleString();
const searchParams = useUrlSearchParams();
const token = useLocalStorage('token', '');
if (searchParams.token) {
  token.value = searchParams.token as string;
}

let payload = decodePayload(token.value);
let gate = new URL(process.env.GATE_LOCATION ?? '');
gate.searchParams.set('callback', window.location.origin);

const links: [string, string][] = [
  ['stream', '/stream/'],
  ['key', '/pgp.asc'],
  [payload?.name ?? 'admin', gate.href],
];

function makeLocalLink(link: string): string {
  return `window.location.href='${link}'`;
}

function decodePayload(token: string | null): object | null {
  let m = token?.trim().match(/^\s*([0-9a-zA-Z\+\-]+)\.([0-9a-zA-Z\+\-]+)\.([0-9a-zA-Z\+\-]+)\s*/);
  if (!m) {
    return null;
  }
  let payload = JSON.parse(Base64.decode(m[2]));
  return payload;
}
</script>

<template>
  <!-- <MorseCodeTitle title="hello world"></MorseCodeTitle> -->
  <div
    class="tw-text-xs tw-fixed tw-z-100 tw-bottom-5 tw-left-1/2 -tw-translate-x-1/2 tw-transition tw-text-gray-700 tw-duration-200 hover:tw-text-inherit focus:tw-text-inherit active:tw-text-inherit">
    <span> Build: {{ now }} </span>
  </div>
  <div class="tw-grid tw-grid-cols-1 tw-grid-rows-1 tw-h-screen tw-w-screen">
    <div class="tw-flex tw-flex-col tw-justify-center tw-gap-4">
      <ConveyGameOfLife :width="28" :height="21" class="tw-place-self-end tw-self-center"></ConveyGameOfLife>
      <span class="tw-flex tw-flex-row tw-place-self-center tw-self-center tw-place-content-center tw-gap-2">
        <button v-for="link in links" :onclick="makeLocalLink(link[1])"
          class="tw-place-self-center tw-self-center tw-basis-1">
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
  @apply tw-btn tw-w-full tw-btn-xs tw-btn-ghost tw-backdrop-blur-xl;
}
</style>
