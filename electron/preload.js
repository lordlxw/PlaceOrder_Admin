const { contextBridge, ipcRenderer } = require("electron");
const remote = require('@electron/remote');
const isElectron = require("is-electron");
const isInElectron = isElectron();

//暴露给渲染进程使用window.electronApi.send("",object)
contextBridge.exposeInMainWorld('electronApi',{
    sendMessageToMain:(channel,data)=>{
        ipcRenderer.send(channel,data);
    }
});