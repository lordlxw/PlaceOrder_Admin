const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const { join } = require("path");
const glob = require("glob");
const fs = require("fs");
const lockFilePath = join(__dirname, "../lockfile");
const MultiWindows = require("./background");

// 屏蔽安全警告
// ectron Security Warning (Insecure Content-Security-Policy)
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const hasLock = tryGetLock();

const createWindow = () => {
  if (hasLock || true) {
    const window = new MultiWindows();
    // background.js
    // 多窗口数据存储
    global.sharedObject = {
      independentWindow: new Map()
    };
    console.log('pika')
    window.loadProcess();
    window.makeSingleInstance();
    window.ipcMainListen();
  } else {
    app.quit();
  }
};

function tryGetLock() {
  try {
    // 尝试创建一个锁文件
    console.log("锁文件路径为"+lockFilePath)
    fs.closeSync(fs.openSync(lockFilePath, "wx"));
    console.log("Lock acquired");
    return true;
  } catch (e) {
    // 如果文件已经存在，说明没有获取到锁
    if (e.code === "EEXIST") {
      console.log("Lock already held by another process");
      return false;
    }
    // 其他错误处理
    console.error("Unexpected error while trying to acquire lock:", e);
    return false;
  }
}

function releaseLock() {
  try {
    // 删除锁文件
    fs.unlinkSync(lockFilePath);
    console.log("Lock released");
  } catch (e) {
    console.error("Error while releasing lock:", e);
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on('will-quit', () => {
  releaseLock();
})



//通用方法，打开一个窗口
function createNewWindow(url, options = {}) {
  const defaultOptions={
    width:800,
    height:600,
    webPreferences:{
      nodeIntegration:true,
      preload:path.join(__dirname,"preload.js")
    }
  }
  options = Object.assign(defaultOptions,options);
  const win = new BrowserWindow(options);
  win.loadFile(path.join(__dirname, url));
  return win;
}