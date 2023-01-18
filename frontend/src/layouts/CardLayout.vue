<template>
    <VueFlexWaterfall :col="4" align-content="center">
        <MoviePreviewCard
            style="margin: 5px"
            v-for="(item, index) in sortedData"
            :data="item"
            :width="256"
            :key="index"
        >
        </MoviePreviewCard>
    </VueFlexWaterfall>
</template>

<script setup lang="ts">
import { MovieRecord } from 'src/components/models';
import { VueFlexWaterfall } from 'vue-flex-waterfall';
import MoviePreviewCard from 'src/components/MoviePreviewCard.vue';
import dayjs from 'dayjs';
import { computed } from 'vue';

const data: MovieRecord[] = JSON.parse(
    JSON.stringify([
        {
            info: {
                title: '功夫',
                poster: './assets/p2770509393.webp',
                links: ['db:1291543', 'imdb:tt0373074'],
                tags: ['动作', '喜剧', '玄幻'],
            },
            notes: [
                { rate: 5, timestamp: dayjs('2023-01-14').unix() },
                { rate: 5, timestamp: dayjs('2013-09-27').unix() },
            ],
            wtf: 'abc',
        },
        {
            info: {
                title: 'Avatar: The Way of Water',
                chineseTitle: '阿凡达：水之道',
                poster: './assets/p2882761032.webp',
            },
            notes: [{ rate: 2, timestamp: dayjs('2022-12-31').unix() }],
        },
        {
            info: {
                title: '少林足球',
                poster: './assets/p2170788277.webp',
                links: ['imdb:tt0286112'],
                tags: [],
            },
            notes: [
                { rate: 4, timestamp: dayjs('2023-01-15').unix() },
                { rate: 5, timestamp: dayjs('2014-04-20').unix() },
            ],
        },
    ])
);
console.log(data);

const sortedData = computed(() => {
    let temp = data;
    const fn = (x: MovieRecord) =>
        x.notes ? Math.max(...x.notes.map((x) => x.timestamp)) : -1;
    return temp.sort((a, b) => fn(b) - fn(a));
});
</script>
