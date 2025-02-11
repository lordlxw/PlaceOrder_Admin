// "use strict";
const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const { join } = require("path");
require("glob");
const fs = require("fs");
const lockFilePath = join(__dirname, "../lockfile");
const MultiWindows = require("./background");
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
tryGetLock();
const createWindow = () => {
  {
    const window = new MultiWindows();
    global.sharedObject = {
      independentWindow: /* @__PURE__ */ new Map()
    };
    console.log("pika");
    window.loadProcess();
    window.makeSingleInstance();
    window.ipcMainListen();
  }
};
function tryGetLock() {
  try {
    console.log("锁文件路径为" + lockFilePath);
    fs.closeSync(fs.openSync(lockFilePath, "wx"));
    console.log("Lock acquired");
    return true;
  } catch (e) {
    if (e.code === "EEXIST") {
      console.log("Lock already held by another process");
      return false;
    }
    console.error("Unexpected error while trying to acquire lock:", e);
    return false;
  }
}
function releaseLock() {
  try {
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
app.on("will-quit", () => {
  releaseLock();
});
