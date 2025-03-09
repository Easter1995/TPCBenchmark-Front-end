import { createRouter, createWebHistory, RouteLocationRaw } from 'vue-router'


const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue'),
        meta: {
            login: false,
        },
    },

]

const router = createRouter({
    history: createWebHistory("/"),
    routes,
})

router.beforeEach(async (to, from, next) => {
    if (to.meta.login !== false) {
        if (to.path !== '/login') {
            return next('/login')
        }
    }
    next()
})

export default router
export const getURL = (params: RouteLocationRaw) => {
    const route = router.resolve(params)
    return route.href
}