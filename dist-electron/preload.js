"use strict";
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("v1", {
  sendMessageToMain: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  getNetwork: () => {
    var os = require("os");
    console.log("主进程执行getNetwork");
    const isZeroMac = (mac) => {
      return /^(0{1,2}[:-]){5}0{1,2}$/.test(mac);
    };
    const getMac = (family = "IPv4") => {
      const nif = os.networkInterfaces();
      for (const list of Object.values(nif)) {
        const item = list.find(
          (d) => !d.internal && !isZeroMac(d.mac) && (!d.family || d.family === family)
        );
        if (item) return item.mac;
      }
      return "";
    };
    sessionStorage.mac = getMac();
    sessionStorage.name = os.hostname();
    console.log(`mac: ${sessionStorage.mac}, name: ${sessionStorage.name}`);
    return { mac: sessionStorage.mac, name: os.hostname() };
  }
});
