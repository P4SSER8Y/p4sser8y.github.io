<template>
    <a v-if="type" :href="href">
        <q-avatar rounded size="sm">
            <IconFont v-if="type.type == IconType.iconFont" :name="type.icon" width="100%"></IconFont>
            <img v-if="type.type == IconType.img" :src="type.icon" width="100%">
        </q-avatar>
    </a>
</template>

<script setup lang="ts">
import IconFont from 'src/assets/IconFont.vue';
import { computed } from 'vue';

enum IconType {
    iconFont,
    img,
}

interface Type {
    abbr: string;
    hrefPrefix: string;
    hrefSuffix: string;
    icon: string;
    type: IconType;
}

const WTF: Type[] = [
    {
        abbr: 'db:',
        icon: 'icon-douban',
        hrefPrefix: 'https://movie.douban.com/subject/',
        hrefSuffix: '/',
        type: IconType.iconFont,
    },
    {
        abbr: 'imdb:',
        icon: 'icon-imdb',
        hrefPrefix: 'https://www.imdb.com/title/',
        hrefSuffix: '/',
        type: IconType.iconFont,
    },
    {
        abbr: 'moe:',
        icon: 'assets/moegirl.ico',
        hrefPrefix: 'https://zh.moegirl.org.cn/',
        hrefSuffix: '',
        type: IconType.img,
    },
];

const props = defineProps<{
    link: string;
}>();

const type = computed(() => {
    for (let entry of WTF) {
        if (props.link.toLowerCase().startsWith(entry.abbr)) {
            return entry;
        }
    }
    return undefined;
});

const href = computed(() =>
    type.value
        ? type.value.hrefPrefix +
        props.link.slice(type.value.abbr.length) +
        type.value.hrefSuffix
        : undefined
);
</script>
