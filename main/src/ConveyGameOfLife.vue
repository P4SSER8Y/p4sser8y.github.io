<template>
  <div class="main tooltip" :data-tip="alive_count">
    <span v-for="i in count" :class="(state[i] == 1 ? 'block-on' : 'block-off') + ' block'"></span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue';
const props = defineProps<{ width: number; height: number }>();
const count = ref(0);
const alive_count = ref(0);
let timer: number = undefined;
let a: Array<number> = undefined;
let b: Array<number> = undefined;
let state: Array<number> = undefined;

onMounted(() => {
  initMap();
  timer = setInterval(step, 250);
});

onUnmounted(() => {
  clearInterval(timer);
  timer = undefined;
});

function index(x: number, y: number) {
  x = (x + props.width) % props.width;
  y = (y + props.height) % props.height;
  return y * props.width + x;
}

function initMap() {
  count.value = props.width * props.height;
  a = new Array<number>(count.value);
  b = new Array<number>(count.value);
  state = reactive(new Array<number>(count.value));
  for (let y = 0; y < props.height; y += 1) {
    for (let x = 0; x < props.width; x += 1) {
      b[index(x, y)] = Math.random() < 0.5 ? 1 : 0;
    }
  }
  step();
}

function neightborCount(x: number, y: number) {
  const MAP = [
    [-1, -1],
    [-1, 0],
    [-1, +1],
    [0, -1],
    [0, +1],
    [+1, -1],
    [+1, 0],
    [+1, +1],
  ];
  let sum = 0;
  for (let v of MAP) {
    sum += a[index(x + v[0], y + v[1])];
  }
  return sum;
}

function step() {
  let t = a;
  a = b;
  b = t;
  let alive = 0;
  for (let x = 0; x < props.width; x++) {
    for (let y = 0; y < props.height; y++) {
      let idx = index(x, y);
      let me = a[idx];
      let n = neightborCount(x, y);
      if (me == 0) {
        b[idx] = n == 3 ? 1 : 0;
      } else {
        b[idx] = n == 2 || n == 3 ? 1 : 0;
      }
      state[idx] = b[idx];
      alive += b[idx];
    }
  }
  alive_count.value = alive;
}
</script>

<style scoped lang="postcss">
.main {
  @apply inline-grid gap-1 content-center;
  grid-template-rows: repeat(v-bind('props.height'), minmax(1px, 1fr));
  grid-template-columns: repeat(v-bind('props.width'), minmax(1px, 1fr));
}

.block {
  @apply align-middle inline-block mask mask-squircle w-2 h-2 md:w-4 md:h-4;
  aspect-ratio: 1;
}

.block-on {
  @apply bg-secondary drop-shadow-2xl;
}

.block-off {
  @apply opacity-0;
}
</style>
