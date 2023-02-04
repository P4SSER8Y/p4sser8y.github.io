import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/:user',
        component: () => import('pages/CardView.vue'),
        children: [],
    },
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/CardView.vue'),
    },
];

export default routes;
