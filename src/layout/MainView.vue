<template lang="">
  <h1>这是主界面</h1>
  <div class="d-flex" id="app">
    <!-- 左侧导航栏 -->
    <!-- <div
      id="sidebar"
      class="bg-dark text-white p-3"
      style="width: 250px; height: 100vh"
    >
      <h2>导航栏</h2>
      <ul class="list-unstyled">
        <li><a href="#" class="text-white">主页</a></li>
        <li><a href="#" class="text-white">关于</a></li>
        <li><a href="#" class="text-white">服务</a></li>
        <li><a href="#" class="text-white">联系我们</a></li>
      </ul>
    </div> -->

    <!-- 右侧主界面 -->
    <div class="container-fluid h-100">
      <SideBar></SideBar>
      <div class="row h-100">
        <!-- 侧边栏 -->
        <div class="col-md-3 col-12 p-0" id="aside-left">
          <div class="aside-left" id="animateAsideLeft">
            <div class="scrollbar-aside">
              <!-- Sidebar 组件内容 -->
              <sidebar></sidebar>
            </div>
          </div>
        </div>
        <!-- 主内容区域 -->
        <el-main>
          <div
            class="main-content"
            id="animateContent"
            :style="'padding-left:' + asideLeftWidth + ';'"
          >
            <!-- Topbar (如果需要的话) -->
            <topbar v-if="false"></topbar>
            <div class="scrollbar-content h-100">
              <main-content>
                <slot></slot>
              </main-content>
            </div>
          </div>
        </el-main>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "MainView", // 确保组件名称与路由匹配
  components: {
    SideBar,
  },
};

import SideBar from "./SideBar.vue";
</script>
<style lang="css">
#sidebar {
  -webkit-app-region: drag; /* 设置该区域为可拖动 */
}
</style>
