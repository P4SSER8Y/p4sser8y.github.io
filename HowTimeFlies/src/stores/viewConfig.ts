import { defineStore } from 'pinia';

export const useViewConfigStore = defineStore('viewConfig', {
    state: () => ({
        user: '',
        detailedInfo: true,
    }),

    getters: {},

    actions: {},

    persist: true,
});
