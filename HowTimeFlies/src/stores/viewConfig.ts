import { defineStore } from 'pinia';

export const useViewConfigStore = defineStore('viewConfig', {
    state: () => ({
        user: '',
        detailedInfo: true,
        merged: true,
    }),

    getters: {},

    actions: {},

    persist: true,
});
