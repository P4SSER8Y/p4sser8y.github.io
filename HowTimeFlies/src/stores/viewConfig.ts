import { defineStore } from 'pinia';

export const useViewConfigStore = defineStore('viewConfig', {
    state: () => ({
        user: '',
        detailedInfo: true,
        merged: true,
        lastPage: '',
        classifyFormat: 'YYYY-MM',
    }),

    getters: {},

    actions: {},

    persist: true,
});
