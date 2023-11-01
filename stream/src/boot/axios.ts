import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $axios: AxiosInstance;
    }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

let api: AxiosInstance | undefined = undefined;
let netlify: AxiosInstance | undefined = undefined;
if (process.env.NETLIFY) {
    netlify = axios.create({ baseURL: '/.netlify/functions' });
} else {
    api = axios.create({ baseURL: process.env.STREAM_DATA_BASE_URL });
}

export default boot(({ app }) => {
    app.config.globalProperties.$axios = axios;
    app.config.globalProperties.$api = api;
    app.config.globalProperties.$netlify = netlify;
});

export { api, netlify };
