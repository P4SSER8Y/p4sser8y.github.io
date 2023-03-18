<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useTitle } from '@vueuse/core';
import { MorseGenerator } from './morse.js';

const props = defineProps<{ title: string }>();
const title = ref(' ');
useTitle(title);

let timer: number = NaN;

onMounted(() => {
  timer = setInterval(updateTitle, 300);
});

onUnmounted(() => {
  clearInterval(timer);
  timer = NaN;
});

let morse = computed(() => {
  return new MorseGenerator(props.title);
});

let cnt = 0;
function updateTitle() {
  cnt -= 1;
  if (cnt <= 0) {
    let ret = morse.value.getSequence();
    title.value = ret[0] ? title.value.slice(-9).concat(ret[0]) : title.value.concat(' ');
    cnt = ret[1];
  }
}
</script>
