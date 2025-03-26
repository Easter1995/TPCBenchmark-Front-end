import { userInfoStore } from '@/store'
import path from 'path'
import { storeToRefs } from 'pinia'
import { createRouter, createWebHistory, RouteLocationRaw } from 'vue-router'

enum Roles {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

const routes = [
    {
        path: '/',
        redirect: '/tpc',
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue')
    },
    {
        path: '/tpc',
        name: 'home',
        component: () => import('@/views/BasicLayout.vue'),
        children: [
            {
                path: '', // 默认子路由
                name: 'home-default',
                component: () => import('@/views/sysManage/index.vue')
            },
            // 用户管理
            {
                path: '/usermanage',
                name: 'usermanage',
                redirect: '/usermanage/approve',
                children: [
                    {
                        path: 'approve',
                        name: 'approve',
                        component: () => import('@/views/userManage/approveUser.vue'),
                    },
                    {
                        path: 'delete',
                        name: 'delete',
                        component: () => import('@/views/userManage/delUser.vue'),
                    },
                ],
                meta: {
                    roles: [Roles.ADMIN]
                }
            },
            // 数据管理
            {
                path: '/datamanage',
                name: 'datamanage',
                redirect: '/datamanage/import',
                children: [
                    {
                        path: 'import',
                        name: 'import',
                        component: () => import('@/views/dataManage/Import.vue'),
                    },
                    {
                        path: 'export',
                        name: 'export',
                        component: () => import('@/views/dataManage/Export.vue'),
                    }
                ]
            }
        ]
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
    // console.log('路由守卫', isLogin.value, role.value)
    if (to.path === '/login') {
        next()
        return
    }
    if (isLogin.value) {
        if (Array.isArray(to.meta.roles)) {
            if (to.meta.roles.includes(role.value)) {
                console.log('路由守卫生效')
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