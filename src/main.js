// import { createApp } from 'vue';  // 从 'vue' 中引入 createApp           // 导入根组件
// import router from './router';     // 导入路由
// import store from './store';       // 导入 store

// const app = createApp(App);      // 创建 Vue 应用实例
// app.use(router);                 // 使用路由登录
// app.use(store);                  // 使用状态管理
// app.mount('#app');               // 挂载应用到 #app 元素上
import { createApp } from 'vue'
import App from './App.vue'
import md5 from "js-md5";


// Vue.prototype.$md5 = md5;

// 创建 Vue 应用实例
const app = createApp(App)
console.log(window);

console.log("window"+window);
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
// 将 md5 函数挂载到全局属性
app.config.globalProperties.$md5 = md5

// 输出调试信息
console.log("11111222222")

// 挂载 Vue 应用
app.mount('#app')
