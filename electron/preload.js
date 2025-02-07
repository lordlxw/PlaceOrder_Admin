const { contextBridge, ipcRenderer } = require("electron");
// let isElectron;
// var userAgent = navigator.userAgent.toLowerCase();
// if (userAgent.indexOf(' electron/') > -1) {
//   // 如果是 Electron 环境，执行此块代码
//   console.log("当前是 Electron 环境");
//   document.body.classList.add("electron");  // 添加 electron 类
//   isElectron=true;
// } else {
//   // 如果不是 Electron 环境，执行此块代码
//   console.log("当前不是 Electron 环境");
//   isElectron=false;
// }
//暴露给渲染进程使用window.electronApi.send("",object)
contextBridge.exposeInMainWorld('v1',{
  isElectron: () => true,
  sendMessageToMain: async (channel, data) => {
    console.log("调用主进程，channel: " + channel + " data: " + JSON.stringify(data));
    try {
      // 使用 ipcRenderer.invoke 发送并等待主进程的响应
      const response = await ipcRenderer.invoke(channel, data);
      console.log("主进程返回的响应:", response);
    } catch (error) {
      console.error("与主进程通信时发生错误:", error);
    }
  },
    getNetwork: () => {
        var os = require("os");
        console.log("主进程执行getNetwork");

        const isZeroMac = mac => {
            return /^(0{1,2}[:-]){5}0{1,2}$/.test(mac);
          };
          const getMac = (family = "IPv4") => {
            const nif = os.networkInterfaces();
            for (const list of Object.values(nif)) {
              const item = list.find(
                d =>
                  !d.internal &&
                  !isZeroMac(d.mac) &&
                  (!d.family || d.family === family)
              );
              if (item) return item.mac;
            }
      
            return "";
          };
          sessionStorage.mac = getMac()
          sessionStorage.name = os.hostname();

          console.log(`mac: ${sessionStorage.mac}, name: ${sessionStorage.name}`);
          return { mac: sessionStorage.mac, name: os.hostname() };// 假设你这里是获取网络相关信息，比如获取 MAC 地址
       
    }
});