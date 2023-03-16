import { defineStore } from 'pinia';
import { Record } from 'src/models/models';

export const useDataStore = defineStore('data', {
    state: () => ({
        data: [] as Record[],
    }),

    getters: {},

    actions: {},
});
