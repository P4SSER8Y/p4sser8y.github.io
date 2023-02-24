import { defineStore } from 'pinia';
import { Record } from 'src/components/models';

export const useDataStore = defineStore('data', {
    state: () => ({
        data: [] as Record[],
    }),

    getters: {},

    actions: {},
});
