<script setup lang="ts">
import MorseCodeTitle from './MorseCodeTitle.vue';
import ConveyGameOfLife from './ConveyGameOfLife.vue';
import { useLocalStorage, useUrlSearchParams } from '@vueuse/core';
import { Base64 } from 'js-base64'

const now = new Date(parseInt(import.meta.env.INFO_NOW) * 1000).toLocaleString();
const searchParams = useUrlSearchParams();
const token = useLocalStorage('token', undefined);
if (searchParams.token) {
  token.value = searchParams.token as string;
}

let payload = decodePayload(token.value);
let gate = new URL(import.meta.env.GATE_LOCATION);
gate.searchParams.set('callback', window.location.origin);

const links: [string, string][] = [
  ["stream", "/stream/"],
  ["key", "/pgp.asc"],
  [ payload?.name ?? "admin", gate.href],
];

function makeLocalLink(link: string): string {
  return `window.location.href='${link}'`;
}

function decodePayload(token: string | null): object | null {
  let m = token?.trim().match(/^\s*([0-9a-zA-Z\+\-]+)\.([0-9a-zA-Z\+\-]+)\.([0-9a-zA-Z\+\-]+)\s*/);
  if (!m)
  {
    return null;
  }
  let payload = JSON.parse(Base64.decode(m[2]));
  return payload;
}
</script>

<template>
  <!-- <MorseCodeTitle title="hello world"></MorseCodeTitle> -->
  <div
    class="text-xs fixed z-100 bottom-5 left-1/2 -translate-x-1/2 transition text-gray-700 duration-200 hover:text-inherit focus:text-inherit active:text-inherit">
    <span> Build: {{ now }} </span>
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
