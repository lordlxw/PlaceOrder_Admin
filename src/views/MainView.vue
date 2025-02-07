<template lang="">
  <h1>这是主界面</h1>
  <div class="d-flex" id="app">
    <!-- 左侧导航栏 -->
    <div
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
    </div>

    <!-- 右侧主界面 -->
    <div id="main-content" class="flex-grow-1 p-4">
      <h1>主界面内容</h1>
      <p>这里是主界面，可以放置其他组件。</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "MainView", // 确保组件名称与路由匹配
};
</script>
<style lang="css">
#sidebar {
  -webkit-app-region: drag; /* 设置该区域为可拖动 */
}
</style>
