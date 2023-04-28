const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'login',
        // 懒加载路由
        component: () => import('../pages/Login/index.vue'),
    },
    {
        path: '/sinUp',
        name: 'sinUp',
        // 懒加载路由
        component: () => import('../pages/SinUp/index.vue'),
    },
    {
        path: '/profile',
        name: 'profile',
        // 懒加载路由
        component: () => import('../pages/Profile/index.vue'),
    },
    {
        path: '/updateProfile',
        name: 'updateProfile',
        // 懒加载路由
        component: () => import('../pages/UpdateProfile/index.vue'),
    },
    {
        path: '/crud',
        name: 'crud',
        component: () => import('../pages/CRUD/index.vue'),
    },
    {
        path: '/chatroom',
        name: 'chatroom',
        component: () => import('../pages/Chatroom/index.vue'),
    },
    {
        path: '/filestorage',
        name: 'filestorage',
        component: () => import('../pages/Filestorage/index.vue'),
    }
]

export default routes