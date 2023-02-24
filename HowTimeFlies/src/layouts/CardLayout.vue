<template>
    <div class="wrapper" ref="main">
        <PreviewCard
            v-for="(item, index) in sortedData"
            :data="item"
            :width="elementWidth"
            :key="index"
            class="item"
        >
        </PreviewCard>
    </div>
</template>

<style scoped>
.wrapper {
    display: grid;
    grid-template-columns: repeat(v-bind(col), v-bind(cssElementWidth));
    grid-gap: v-bind(cssGap);
}

.item {
    margin: v-bind(cssGap);
}
</style>

<script setup lang="ts">
import { Record, get_latest_timestamp } from 'src/components/models';
import PreviewCard from 'src/components/PreviewCard.vue';
import { computed, ref, onMounted, onUnmounted } from 'vue';

const props = withDefaults(
    defineProps<{
        data: Record[];
        gap?: number;
        maxElementWidth?: number;
    }>(),
    {
        gap: 2,
        maxElementWidth: 256,
    }
);

const elementWidth = ref(256);
const main = ref<null | Element>(null);
const col = ref(2);
const cssGap = computed(() => props.gap + 'px');
const cssElementWidth = computed(() => elementWidth.value + 'px');

const sortedData = computed(() => {
    let temp = props.data;
    return temp.sort((a, b) =>
        get_latest_timestamp(b).diff(get_latest_timestamp(a))
    );
});

onMounted(() => {
    foobar();
    window.addEventListener('resize', foobar);
});

onUnmounted(() => {
    window.removeEventListener('resize', foobar);
});

function foobar() {
    let clientWidth = main.value?.clientWidth ?? 0 * 0.95;
    let cellWidth = props.maxElementWidth + 2 * props.gap;
    if (clientWidth > 2 * cellWidth) {
        col.value = Math.round(clientWidth / cellWidth);
        elementWidth.value = clientWidth / col.value;
    } else {
        col.value = 2;
        elementWidth.value = (clientWidth - col.value * props.gap * 2) / 2;
    }
}
</script>
