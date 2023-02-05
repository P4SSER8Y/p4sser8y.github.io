import { defineStore } from 'pinia';
import { MovieRecord } from 'src/components/models';

export const useDataStore = defineStore('data', {
    state: () => ({
        data: [] as MovieRecord[],
    }),

    getters: {},

    actions: {},
});
