//请求api服务 2025/2/4
import axios from "axios";

const service = axios.create({
    timeout: 30000
  }); //30秒超时时间

  //请求拦截器
service.interceptors.request.use(config => {
    try {
    //console.log("get:" + localStorage.getItem(configUtil.keys.tokenKey));
    console.log("请求拦截器");
      if (
        localStorage.getItem(configUtil.keys.tokenKey) &&
        !["/login", "/verifyToken"].includes(
          config.url.substring(config.url.lastIndexOf("/"))
        )
      ) {
        config.headers["Authorization"] = localStorage.getItem(
          configUtil.keys.tokenKey
        );
      }
    } catch (error) {}
    return config;
  });


  service.interceptors.response.use(
    response => {
        console.log("响应拦截器");
      const resp = response.data;
      // console.log(JSON.stringify(resp))
      switch (resp.code) {
        case 200:
        case "00000":
          return resp;
        case 401:
          // Message({
          //   message: '登录超时，请重新登录',
          //   type: 'warning',
          //   durations: 3 * 1000
          // })
          if (window.v1 && window.v1.isElectron()) {
            window.v1.restart();
          } else {
            Router.push({ path: "/login" });
          }
          break;
        default:
          // if (response.request && response.request.responseType === 'arraybuffer') {
          //   return resp
          // }
          return resp;
      }
    },
    error => {
      console.log(error);
      if (error.toString().indexOf("401") !== -1) {
        if (window.v1 && window.v1.isElectron()) {
          window.v1.restart();
        } else {
          Router.push({ path: "/login" });
        }
        Message({
          message: "登录超时，请重新登录",
          type: "warning",
          durations: 3 * 1000
        });
      } else if (error.toString().indexOf("500") !== -1) {
        Message({
          message: error.response.data.message || "服务器异常（500）",
          type: "warning",
          durations: 3 * 1000
        });
      } else if (error.toString().indexOf("400") !== -1) {
        Message({
          message: `${error.response.data.message}`,
          type: "warning",
          durations: 3 * 1000
        });
      }
      if (error.toString().indexOf("Error: Network Error") !== -1) {
        Message({
          message: `网络错误，无法链接`,
          type: "warning",
          durations: 3 * 1000
        });
      }
      return Promise.reject(error);
    }
  );

  export default service;