import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('src/layouts/MovieLayout.vue'),
        props: true,
        children: [
            {
                path: 'posterWall',
                component: () => import('src/pages/PosterWall.vue'),
                props: true,
            },
            {
                path: 'calendar',
                component: () => import('src/pages/CalendarWall.vue'),
                props: true,
            },
            {
                path: 'timeline',
                component: () => import('src/pages/TimelineWall.vue'),
                props: true,
            },
            {
                path: ':catchAll(.*)',
                component: () => import('src/pages/RedirectToHome.vue'),
                props: true,
            },
            {
                path: '',
                component: () => import('src/pages/RedirectToHome.vue'),
                props: true,
            },
        ],
    },
    {
        path: '/:catchAll(.*)*',
        component: () => import('src/pages/ErrorNotFound.vue'),
    },
];

export default routes;
