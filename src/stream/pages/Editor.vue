<template>
    <div class="tw-w-screen tw-h-screen">
        <q-card>
            <q-card-section>
                <div class="text-h6">
                    {{ id }}
                </div>
            </q-card-section>
            <component v-if="data.type == 'movie'" :is="MovieEditor" :data="data" :label="id"></component>
            <component v-if="data.type == 'tv'" :is="TvEditor" :data="data" :label="id"></component>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import { useUrlSearchParams } from '@vueuse/core';
import { reactive, ref } from 'vue';
import { MovieRecord, TvRecord } from '../models/models';
import MovieEditor from '../components/MovieEditor.vue'
import TvEditor from '../components/TvEditor.vue'

let data = reactive<MovieRecord | TvRecord>(JSON.parse('{"type": "tv", "info": {"title": "\\u846c\\u9001\\u306e\\u30d5\\u30ea\\u30fc\\u30ec\\u30f3", "localTitle": "\\u846c\\u9001\\u7684\\u8299\\u8389\\u83b2", "links": ["db:36093351"], "eposides": 28, "poster": ["20231104-211926-thumbnail.webp"], "season": 1, "tags": ["\\u52a8\\u753b", "\\u5192\\u9669", "\\u65e5\\u672c"], "year": 2023}, "notes": [{"status": "ing", "where": "local", "rate": 5, "eposides": [{"eposide": 12, "timestamp": "2023-11-25 14:00"}, {"eposide": 11, "timestamp": "2023-11-18 14:00"}, {"eposide": 10, "timestamp": "2023-11-11 13:00"}, {"eposide": 9, "timestamp": "2023-11-05 14:50"}, {"eposide": 8, "timestamp": "2023-11-05 14:25"}, {"eposide": 7, "timestamp": "2023-11-05 14:00"}, {"eposide": 6, "timestamp": "2023-11-05 00:17"}, {"eposide": 5, "timestamp": "2023-11-04 23:46"}, {"eposide": 4, "timestamp": "2023-11-04 23:24"}, {"eposide": 3, "timestamp": "2023-11-04 22:20"}, {"eposide": 2, "timestamp": "2023-11-04 21:54"}, {"eposide": 1, "timestamp": "2023-11-04 21:15"}]}]}'));

const searchParams = useUrlSearchParams('hash');
const id = ref((typeof searchParams.id === 'string' && searchParams.id.length > 0) ? searchParams.id : '');
</script>
