<template>
    <a v-if="type" :href="href">
        <q-avatar rounded size="sm">
            <IconFont :name="type.icon" width="100%"></IconFont>
        </q-avatar>
    </a>
</template>

<script setup lang="ts">
import IconFont from 'src/assets/IconFont.vue';
import { computed } from 'vue';

interface Type {
    abbr: string;
    hrefPrefix: string;
    hrefSuffix: string;
    icon: string;
}

const WTF: Type[] = [
    {
        abbr: 'db:',
        icon: 'icon-douban',
        hrefPrefix: 'https://movie.douban.com/subject/',
        hrefSuffix: '/',
    },
    {
        abbr: 'imdb:',
        icon: 'icon-imdb',
        hrefPrefix: 'https://www.imdb.com/title/',
        hrefSuffix: '/',
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
