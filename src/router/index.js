import Vue from 'vue'
import Router from 'vue-router'
// import apiLogin from '@/api/login_login'
// import { Message } from 'element-ui'

Vue.use(Router)

// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

const router = new Router({
  routes: [
    // 登录
    {
      path: '/',
      component: () => import('@/views/KKLogin/Index.vue'),
      redirect: '/login',
      children: [
        {
          path: '/login',
          component: () => import('@/views/KKLogin/Login.vue')
        }
      ]
    },
    // K线
    {
      path: '/',
      component: () => import('@/views/KKKLine/Index.vue'),
      redirect: '/kline',
      children: [
        {
          path: '/kline',
          component: () => import('@/views/KKKLine/KLine.vue')
        }
      ]
    },
    // 四分屏
    {
      path: '/',
      component: () => import('@/views/KKFourScreen/Index.vue'),
      redirect: '/fourscreen',
      children: [
        {
          path: '/fourscreen',
          component: () => import('@/views/KKFourScreen/FourScreen.vue')
        }
      ]
    },
    // 模拟
    {
      path: '/',
      component: () => import('@/views/KKSimulation/Index.vue'),
      redirect: '/simulation',
      children: [
        {
          path: '/simulation/dashboard',
          component: () => import('@/views/Dashboard/Dashboard.vue')
        },
        {
          path: '/simulation/kline',
          component: () => import('@/views/KKSimulation/KLine.vue')
        },
        {
          path: '/simulation/klinevertical',
          component: () => import('@/views/KKSimulation/KLineVertical.vue')
        },
         // 聊天
         {
          path: '/simulation/chat',
          component: () => import('@/views/KKSimulation/Chat.vue'),
        },
        {
          path: '/simulation/main',
          component: () => import('@/views/KKSimulation/Main.vue')
        },
        {
          path: '/simulation/chatitem',
          component: () => import('@/views/KKSimulation/ChatItem.vue')
        },
        {
          path: '/simulation/setting',
          component: () => import('@/views/KKSimulation/Setting.vue')
        },
      ]

    },
    {
      path: '/main',
      component: () => import('@/views/Index.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: '/dashboard',
          component: () => import('@/views/Dashboard/Dashboard.vue')
        },
        // 菜单管理
        {
          path: '/power/menu',
          component: () => import('@/views/KKPower/Menu.vue'),
        },
        // 菜单管理 - 添加
        {
          path: '/power/menu/add',
          component: () => import('@/views/KKPower/Menu/Add.vue')
        },
        // 菜单管理 - 编辑
        {
          path: '/power/menu/edit',
          component: () => import('@/views/KKPower/Menu/Edit.vue')
        },
        // 角色管理
        {
          path: '/power/role',
          component: () => import('@/views/KKPower/Role.vue'),
        },
        // 角色管理 - 添加
        {
          path: '/power/role/add',
          component: () => import('@/views/KKPower/Role/Add.vue')
        },
        // 角色管理 - 编辑
        {
          path: '/power/role/edit',
          component: () => import('@/views/KKPower/Role/Edit.vue')
        },
        // 通道管理
        {
          path: '/power/channel',
          component: () => import('@/views/KKPower/Channel.vue'),
        },
        // 用户管理
        {
          path: '/power/admin',
          component: () => import('@/views/KKPower/Admin.vue'),
        },
        // 用户管理 - 添加
        {
          path: '/power/admin/add',
          component: () => import('@/views/KKPower/Admin/Add.vue'),
        },
        // 用户管理 - 编辑
        {
          path: '/power/admin/edit',
          component: () => import('@/views/KKPower/Admin/Edit.vue'),
        },
        // 表头设置
        {
          path: '/power/tablehead',
          component: () => import('@/views/KKPower/TableHead.vue'),
        },
        // 表头设置 - 添加
        {
          path: '/power/tablehead/add',
          component: () => import('@/views/KKPower/TableHead/Add.vue'),
        },
        // 表头设置 - 编辑
        {
          path: '/power/tablehead/edit',
          component: () => import('@/views/KKPower/TableHead/Edit.vue'),
        },
        // 交易管理 - 询价单
        {
          path: '/trade/enquiry',
          component: () => import('@/views/KKTrade/Enquiry.vue')
        },
        // 交易管理 - 当前持仓单
        {
          path: '/trade/bonds',
          component: () => import('@/views/KKTrade/Bonds.vue')
        },
        // 交易管理 - 成交回报
        {
          path: '/trade/reward',
          component: () => import('@/views/KKTrade/Reward.vue')
        },
        // 交易管理 - 违约成交
        {
          path: '/trade/break',
          component: () => import('@/views/KKTrade/Break.vue')
        },
        {
          path: '/trade/risk',
          component: () => import('@/views/KKTrade/Risk.vue')
        },
        {
          path: '/order/main',
          component: () => import('@/views/KKChatOrder/OrderMain.vue')
        },
      ]
    }
  ],
  // 导航激活样式
  linkActiveClass: 'active-link'
})
export default router
