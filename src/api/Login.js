import request from "@/utils/request";
import { createApp } from 'vue';


export default {
    // 登录
    login(params, agent, client) {
        console.log("调用login"+params+agent+client);

        console.log('API URL:', import.meta.env.VITE_BASE_API); // 输出 BASE_API
        console.log('WebSocket URL:', import.meta.env.VITE_WS_URL); // 输出 WS_URL
        console.log('Project Name:', import.meta.env.VITE_PROJECT_NAME); // 输出 PROJECT_NAME
        console.log('App Title:', import.meta.env.VITE_APP_TITLE); // 输出 APP_TITLE
      return request({
        url: `${import.meta.env.VITE_BASE_API}/login`,
        method: "post",
        data: {
          username: params.username,
          password: params.password,
          uuid: params.uuid,
          code: params.code,
          hwinfo: params.hwinfo
        },
        headers: {
          Agent: agent,
          Client: client,
        }
      });
    },
    // 权限
    auth() {
      return request({
        url: `${Vue.prototype.$apiUrl}/getUserInfo`,
        method: "get"
      });
    },
    // 退出登录
    logout() {
      return request({
        url: `${Vue.prototype.$apiUrl}/logout`,
        method: "get"
      });
    },
    verifyToken(token) {
      return request({
        url: `${Vue.prototype.$apiUrl}/api/verifyToken`,
        method: "post",
        data: {
          token: token
        }
      });
    },
    getProfile(userId) {
      return request({
        url: `${Vue.prototype.$apiUrl}/userProfile/userId/${userId}`,
        method: "get"
      });
    },
    brokerList() {
      return request({
        url: `${Vue.prototype.$apiUrl}/broker`,
        method: 'get'
      })
    },
    chatReceiver() {
      console.log("chatReceiver被调用！！！")
      return request({
        url: `${Vue.prototype.$apiUrl}/chatReceiver`,
        method: 'get'
      })
    },
    saveProfile(obj) {
      return request({
        url: `${Vue.prototype.$apiUrl}/userProfile`,
        method: "post",
        data: obj
      });
    }
  };