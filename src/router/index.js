import { createRouter, createWebHashHistory } from 'vue-router';
import MainView from '../layout/MainView.vue';
import LoginView from '../views/Login.vue';
import Test1 from '../components/VueComponent1.vue';
import Test2 from '../components/VueComponent2.vue';

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),  // 使用 Hash 模式
  routes: [
    {
      path: '/',
      component: LoginView,
      name:'LoginView2'
    },
    {
      path: '/MainView',
      component: MainView,
      name: 'MainView', 
      children: [
        {
          path: 'Test1',  // 当访问 /Test1 时展示 Test1 组件
          component: Test1,
          name: 'Test1'
        },
        {
          path: 'Test2',  // 当访问 /Test2 时展示 Test2 组件
          component: Test2,
          name: 'Test2'
        }
      ]
    },
    {
      path: '/login',
      component: LoginView,
      name:'LoginView'
    },
    {
      path: '/C:/Users/admin/Desktop/PlaceOrder_Admin/PlaceOrder_Admin/dist/index.html',
      component: LoginView,
      name:'LoginView3'
    },
    
  ]
});

// 全局路由守卫：在每次路由切换前执行
router.beforeEach((to, from, next) => {
  // 记录日志
  console.log(`正在从 ${from.path} 跳转到 ${to.path}`);
  
  // 你可以在这里添加更多的日志信息，比如时间戳、用户信息等
  // 例如，记录跳转的时间：
  const timestamp = new Date().toISOString();
  console.log(`跳转时间: ${timestamp}`);
  
  // 调用 next() 来继续执行路由导航
  next();
});

export default router;