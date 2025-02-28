<template lang=""></template>
<script>
import configUtil from "@/utils/config.js";
export default {
  data() {
    return {
      // 你可以在这里定义一些响应式的数据
    };
  },
  methods: {
    InitWebSocket() {
      console.log("InitWebSocket!");
      const socketUrl = `${
        import.meta.env.VITE_BASE_API
      }/${localStorage.getItem(configUtil.keys.tokenKey)}`;
      console.log("socket链接：" + socketUrl);
      this.ws = new WebSocket(socketUrl);

      this.ws.onopen = () => {
        console.log("WebSocket连接已建立");
      };

      this.ws.onmessage = (event) => {
        console.log("收到消息：" + event.data);
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket发生错误:", error);
      };

      this.ws.onclose = () => {
        console.log("WebSocket连接已关闭");
      };
    },
  },
  mounted() {
    console.log("Socket.vue --- > Mounted");
    this.InitWebSocket(); // 在组件挂载时初始化 WebSocket
  },
};
</script>
<style lang=""></style>
