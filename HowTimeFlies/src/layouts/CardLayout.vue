<template>
    <VueFlexWaterfall :col="col" align-content="center" ref="main">
        <PreviewCard
            :style="'margin: ' + props.margin + 'px'"
            v-for="(item, index) in sortedData"
            :data="item"
            :width="elementWidth"
            :key="index"
        >
        </PreviewCard>
    </VueFlexWaterfall>
</template>

<script setup lang="ts">
import { Record, get_latest_timestamp } from 'src/components/models';
import { VueFlexWaterfall } from 'vue-flex-waterfall';
import PreviewCard from 'src/components/PreviewCard.vue';
import { computed, ref, onMounted, onUnmounted } from 'vue';

const props = withDefaults(
    defineProps<{
        data: Record[];
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
    let clientWidth = main.value?.$el.clientWidth * 0.95;
    let cellWidth = props.maxElementWidth + 2 * props.margin;
    if (clientWidth > 2 * cellWidth) {
        col.value = Math.round(clientWidth / cellWidth);
        elementWidth.value = clientWidth / col.value;
    } else {
        col.value = 2;
        elementWidth.value = (clientWidth - col.value * props.margin * 2) / 2;
    }
}
</script>
