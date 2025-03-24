// 请求API服务
import axios from "axios";
import { useRouter } from 'vue-router'; // 使用 Vue Router 4
import { ElMessage } from 'element-plus'; // 引入 Element Plus 的 Message 组件
import configUtil from "@/utils/config"; // 假设你有配置文件

const service = axios.create({
  timeout: 30000, // 设置请求超时为30秒
});

// 获取 Vue Router 实例
const router = useRouter();

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    console.log("请求拦截器",config);

    try {
      const token = localStorage.getItem(configUtil.keys.tokenKey);
      const isLoginPage = ["/login", "/verifyToken"].includes(
        config.url.substring(config.url.lastIndexOf("/"))
      );
      
      if (token && !isLoginPage) {
        config.headers["Authorization"] = token; // 在请求头添加 token
      }
    } catch (error) {
      console.error("请求拦截器错误", error);
    }

    return config;
  },
  (error) => {
    console.error("请求错误", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    console.log("响应拦截器",response);

    const resp = response.data;

    switch (resp.code) {
      case 200:
      case "00000":
        return resp;
      case 401:
        // 登录超时处理
        handleAuthError();
        break;
      default:
        // 其他情况
        ElMessage.warning("请求失败，请稍后再试"+resp?.message);
        return resp;
    }
  },
  (error) => {
    console.error("响应错误", error);

    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        handleAuthError();
      } else if (status === 500) {
        ElMessage.warning("服务器异常，请稍后再试");
      } else if (status === 400) {
        ElMessage.warning(error.response.data.message || "请求参数错误");
      }
    } else if (error.message.includes("Network Error")) {
      ElMessage.warning("网络错误，无法连接到服务器");
    }

    return Promise.reject(error);
  }
);

// 登录超时的处理逻辑
function handleAuthError() {
  ElMessage.warning("登录超时，请重新登录");
  if (window.v1 && window.v1.isElectron()) {
    window.v1.restart(); // 如果是 Electron 应用，重启
  } else {
    router.push({ path: "/login" }); // 跳转到登录页面
  }
}

export default service;
