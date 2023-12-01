import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('../layouts/MovieLayout.vue'),
        props: true,
        children: [
            {
                path: 'posterWall',
                component: () => import('../pages/PosterWall.vue'),
                props: true,
            },
            {
                path: 'calendar',
                component: () => import('../pages/CalendarWall.vue'),
                props: true,
            },
            {
                path: 'timeline',
                component: () => import('../pages/TimelineWall.vue'),
                props: true,
            },
            {
                path: ':catchAll(.*)',
                component: () => import('../pages/RedirectToHome.vue'),
                props: true,
            },
            {
                path: '',
                component: () => import('../pages/RedirectToHome.vue'),
                props: true,
            },
        ],
    },
    {
        path: '/:catchAll(.*)*',
        component: () => import('../pages/ErrorNotFound.vue'),
    },
];

export default routes;
