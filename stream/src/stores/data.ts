import { defineStore } from 'pinia';
import { Record } from '../models/models';

export const useDataStore = defineStore('data', {
    state: () => ({
        data: [] as Record[],
    }),

    getters: {},

    actions: {},
});
