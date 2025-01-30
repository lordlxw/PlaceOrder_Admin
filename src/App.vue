<template>
  <div id="app">
    <Login />
  </div>

  <!-- <div id="app">
    <h1>测试 Login.vue 组件</h1>
  </div> -->
</template>

<script>
import Login from "./views/Login.vue";

export default {
  name: "App",
  components: {
    Login,
  },
};
</script>

<style>
/* 全局样式 */
body {
  margin: 0;
  /* font-family: "Roboto", sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f4f8;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #333;
  background-image: url("https://source.unsplash.com/random/1600x900");
  background-size: cover;
  background-position: center; */
}
</style>
