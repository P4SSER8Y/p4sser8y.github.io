<template>
    <VueFlexWaterfall :col="col" align-content="center" ref="main">
        <MoviePreviewCard
            :style="'margin: ' + props.margin + 'px'"
            v-for="(item, index) in sortedData"
            :data="item"
            :width="elementWidth"
            :key="index"
        >
        </MoviePreviewCard>
    </VueFlexWaterfall>
</template>

<script setup lang="ts">
import { MovieRecord } from 'src/components/models';
import { VueFlexWaterfall } from 'vue-flex-waterfall';
import MoviePreviewCard from 'src/components/MoviePreviewCard.vue';
import { computed, ref, onMounted, onUnmounted } from 'vue';
import dayjs from 'dayjs';

const props = withDefaults(
    defineProps<{
        data: MovieRecord[];
        margin?: number;
        maxElementWidth?: number;
    }>(),
    {
        margin: 2,
        maxElementWidth: 256,
    }
);

const elementWidth = ref(256);
const main = ref<null | VueFlexWaterfall>(null);
const col = ref(2);

const sortedData = computed(() => {
    let temp = props.data;
    const fn = (x: MovieRecord) =>
        x.notes
            ? Math.max(...x.notes.map((x) => dayjs(x.timestamp).unix()))
            : 0;
    return temp.sort((a, b) => fn(b) - fn(a));
});

onMounted(() => {
    foobar();
    window.addEventListener('resize', foobar);
});

onUnmounted(() => {
    window.removeEventListener('resize', foobar);
});

function foobar() {
    let clientWidth = main.value?.$el.clientWidth;
    if (clientWidth > 2 * (props.maxElementWidth + 2 * props.margin)) {
        elementWidth.value = props.maxElementWidth;
        col.value = Math.floor(
            clientWidth / (elementWidth.value + 2 * props.margin)
        );
    } else {
        col.value = 2;
        elementWidth.value = (clientWidth - col.value * props.margin * 2) / 2;
    }
}
</script>
