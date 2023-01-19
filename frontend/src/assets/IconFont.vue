<template>
    <svg class="icon">
        <use :href="id"></use>
    </svg>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import 'src/3rdparty/iconfont';

const props = defineProps<{
    name: string;
    width?: string;
    height?: string;
}>();

const width = computed(() => (props.width ? props.width : '100%'));
const height = computed(() => (props.height ? props.height : '100%'));

const id = ref(`#${props.name}`);
</script>

<style scoped>
.icon {
    width: v-bind(width);
    height: v-bind(height);
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
</style>
