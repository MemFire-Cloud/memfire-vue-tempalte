import { createApp } from 'vue'
// 引入路由
import router from './router/router.config'
import './style.css'
import Antd from "ant-design-vue";
import 'ant-design-vue/dist/antd.css';
import * as Icons from "@ant-design/icons-vue";

// main.ts
import "tailwindcss/tailwind.css"
import App from './App.vue'

const app = createApp(App).use(Antd);
 
app.use(router);
 
 
app.mount("#app");