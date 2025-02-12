<template lang="">
  <h1>这是主界面</h1>
  <button @click="goToTest1">切换1</button>
  <button @click="goToTest2">切换2</button>
  <div class="d-flex" id="app" style:width="300px">
    <div class="container-fluid h-100">
      <div class="row h-100">
        <!-- 侧边栏 -->
        <div class="col-md-3 col-12 p-0" id="aside-left">
          <div class="aside-left" id="animateAsideLeft">
            <div class="scrollbar-aside">
              <!-- Sidebar 组件内容 -->
              <SideBar></SideBar>
            </div>
          </div>
        </div>
        <!-- 主内容区域 -->
        <div class="col-md-9 col-12 p-0" id="main-content">
          <el-main>
            <router-view></router-view>
          </el-main>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from "./SideBar.vue";
import { useRouter } from "vue-router"; // 使用 Vue Router 4
// 获取 Vue Router 实例
export default {
  name: "MainView", // 确保组件名称与路由匹配
  components: {
    SideBar,
  },
  setup() {
    // 获取 Vue Router 实例
    const router = useRouter();

    const goToTest1 = () => {
      router.push("/MainView/Test1"); // 使用绝对路径
    };

    const goToTest2 = () => {
      router.push("/MainView/Test2"); // 使用绝对路径
    };

    return {
      goToTest1,
      goToTest2,
    };
  },
  methods: {},
};
</script>
<style lang="css">
#sidebar {
  -webkit-app-region: drag; /* 设置该区域为可拖动 */
}
</style>
