import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';
import Welcome from '../pages/Welcome.vue';
import Desk from '../pages/Desk.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: Welcome,
        props: { ing: false },
    },
    {
        path: '/desk',
        name: 'desk',
        component: Desk,
    },
];

export default () => {
    const Router = createRouter({
        routes: routes,
        history: createWebHashHistory(),
    });
    return Router;
};
