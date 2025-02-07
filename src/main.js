// import { createApp } from 'vue';  // 从 'vue' 中引入 createApp           // 导入根组件
// import router from './router';     // 导入路由
// import store from './store';       // 导入 store

// const app = createApp(App);      // 创建 Vue 应用实例
// app.use(router);                 // 使用路由登录
// app.use(store);                  // 使用状态管理
// app.mount('#app');               // 挂载应用到 #app 元素上
// 引入路由配置
import router from './router'; // 引入路由实例
import { createApp } from 'vue'
import App from './App.vue'
import md5 from "js-md5";
// 引入 Element Plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// Vue.prototype.$md5 = md5;

// 创建 Vue 应用实例
const app = createApp(App)
console.log(window);
app.use(ElementPlus);
app.use(router);

console.log("window"+window);
// 设置全局属性
app.config.globalProperties.$md5 = md5;
app.config.globalProperties.$apiUrl = import.meta.env.VITE_BASE_API;
app.config.globalProperties.$wsUrl = import.meta.env.VITE_WS_URL;
app.config.globalProperties.$appType = import.meta.env.VITE_PROJECT_NAME;

console.log('API URL:', import.meta.env.VITE_BASE_API);  // 输出 BASE_API
console.log('WebSocket URL:', import.meta.env.VITE_WS_URL); // 输出 WS_URL
console.log('Project Name:', import.meta.env.VITE_PROJECT_NAME); // 输出 PROJECT_NAME
console.log('App Title:', import.meta.env.VITE_APP_TITLE); // 输出 PROJECT_NAME


// main.js 或者 main.ts
// 判断是否是 Electron 环境
var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(' electron/') > -1) {
  // 如果是 Electron 环境，执行此块代码
  console.log("当前是 Electron 环境");
  document.body.classList.add("electron");  // 添加 electron 类
} else {
  // 如果不是 Electron 环境，执行此块代码
  console.log("当前不是 Electron 环境");
}

// 输出调试信息
console.log("11111222222")

// 挂载 Vue 应用
app.mount('#app')
