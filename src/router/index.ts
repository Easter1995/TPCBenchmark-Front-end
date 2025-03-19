import { userInfoStore } from '@/store'
import { storeToRefs } from 'pinia'
import { createRouter, createWebHistory, RouteLocationRaw } from 'vue-router'

enum Roles {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

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
            roles: [Roles.ADMIN, Roles.USER]
        }
    },
    {
        path: '/denied',
        name: 'denied',
        component: () => import('@/views/Denied.vue')
    }
]

const router = createRouter({
    history: createWebHistory("/"),
    routes,
})

router.beforeEach(async (to, from, next) => {
    const userStore = userInfoStore()
    const { isLogin, role } = storeToRefs(userStore)
    console.log('路由守卫', isLogin.value, role.value)
    if (to.path === '/login') {
        next()
        return
    }
    if (isLogin.value) {
        if (Array.isArray(to.meta.roles)) {
            if (to.meta.roles.includes(role.value)) {
                next()
            } else {
                next('/denied')
            }
        } else {
            next()
        }
    } else {
        next('/login')
    }
})

export default router
export const getURL = (params: RouteLocationRaw) => {
    const route = router.resolve(params)
    return route.href
}