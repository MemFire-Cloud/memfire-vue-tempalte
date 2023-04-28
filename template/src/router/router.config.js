import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './router'

const router = createRouter({
// 这里使用hash模式路由
  history: createWebHashHistory(),  
  routes,
})

export default router