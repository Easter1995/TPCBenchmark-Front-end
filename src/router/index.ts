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
                        meta: {
                            title: '用户审批',
                            icon: 'Check'
                        }
                    },
                    {
                        path: 'delete',
                        name: 'delete',
                        component: () => import('@/views/userManage/delUser.vue'),
                        meta: {
                            title: '删除用户',
                            icon: 'Delete'
                        }
                    },
                ],
                meta: {
                    roles: [Roles.ADMIN]
                }
            },
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