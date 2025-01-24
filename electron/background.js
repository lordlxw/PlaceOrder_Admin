//封装了一层供main.js使用
const {
    app,
    BrowserWindow,
    ipcMain,
    screen,
    globalShortcut
  } = require("electron");
  const { join } = require("path");
  const glob = require("glob");
  process.env.ROOT = join(__dirname, "../");
  const isDevelopment = process.env.NODE_ENV === "development";
  // const winURL = isDevelopment ? 'http://localhost:3000/' : join(__dirname, 'dist/index.html')
  const winURL = isDevelopment
    ? "http://localhost:8080"
    : join(process.env.ROOT, "/dist/index.html");
  const klinevertical = "/simulation/klinevertical";
  // 配置参数
  const defaultConfig = {
    id: null, // 窗口唯一id
    background: "#fff", // 背景色
    route: "", // 路由地址url
    title: "", // 标题
    data: null, // 传入数据参数
    width: 1440, // 窗口宽度
    height: 900, // 窗口高度
    minWidth: 1440, // 窗口最小宽度
    minHeight: 600, // 窗口最小高度
    maxWidth: 0,
    maxHeight: 0,
    x: "", // 窗口相对于屏幕左侧坐标
    y: "", // 窗口相对于屏幕顶端坐标
    resize: true, // 是否支持缩放
    maximizable: true,
    minimizable: true,
    maximize: false, // 最大化窗口
    isMultiWin: false, // 是否支持多开窗口
    isMainWin: false, // 是否主窗口
    parent: "", // 父窗口（需传入父窗口id）
    modal: false, // 模态窗口（模态窗口是浮于父窗口上，禁用父窗口）
    alwaysOnTop: false, // 置顶窗口
    webPreferences: {},
    sharSession: true,
    transparent: true
  };
  
  class MultiWindows {
    constructor() {
      // 主窗口
      this.mainWin = null;
      // 窗口组
      this.winLs = {};
  
      // ...
    }
  
    winOpts() {
      return {
        // 窗口图标
        icon: join(process.env.ROOT, "/static/lily_orange.ico"),
        backgroundColor: "#fff",
        show: false,
        // autoHideMenuBar: true,
        // resizable: true,
        // minimizable: true,
        // maximizable: false,
        frame: false,
        titleBarStyle: "hidden",
        webPreferences: {
          defaultEncoding: "utf-8",
          partition: String(+new Date()),
          sandbox: false,
          contextIsolation: true,
          preload: join(process.env.ROOT, "/electron/preload.js"),
          nodeIntegration: true
          // devTools: true,
          // webSecurity: false
        }
      };
    }
  
    // 创建新窗口
    createWin(options) {
      const args = Object.assign({}, defaultConfig, options);
      console.log("options: " + JSON.stringify(args, null, 2));

  
      let opt = this.winOpts();
      if (args.parent) {
        opt.parent = this.getWin(args.parent);
      }
      if (typeof args.modal === "boolean") opt.modal = args.modal;
      if (typeof args.resize === "boolean") opt.resizable = args.resize;
      if (typeof args.alwaysOnTop === "boolean") {
        opt.alwaysOnTop = args.alwaysOnTop;
      }
      if (args.background) opt.backgroundColor = args.background;
      if (args.width) opt.width = args.width;
      if (args.height) opt.height = args.height;
      if (args.minWidth) opt.minWidth = args.minWidth;
      if (args.minHeight) opt.minHeight = args.minHeight;
      if (args.x) opt.x = args.x;
      if (args.y) opt.y = args.y;
      if (args.maximizable) opt.maximizable = args.maximizable;
  
      if (args.maxWidth >= args.minWidth) opt.maxWidth = args.maxWidth;
      if (args.maxHeight >= args.minHeight) opt.maxHeight = args.maxHeight;
  
      const allWin = this.getAllWin();
      if (args.webPreferences && args.webPreferences.session) {
        opt.webPreferences.session = args.webPreferences.session;
      } else if (args.sharSession && allWin.length > 0) {
        opt.webPreferences.session = allWin[0].webContents.session;
      }
      // 创建窗口对象
      // Menu.setApplicationMenu(null);
      const win = new BrowserWindow({
        ...opt
      });
      console.log("WinUrl:"+winURL);
      const $url = args.route
      ? `${winURL}#${args.route}`
      : process.env.VITE_DEV_SERVER_URL
      ? process.env.VITE_DEV_SERVER_URL
      : winURL;

      console.log("Url:"+$url);
      win.loadURL($url);
      win.once("ready-to-show", () => {
        win.show();  // 只有在窗口准备好显示时才会显示窗口
      });
      

    }
  

  
    // 获取窗口
    getWin(id) {
      // return this.winLs[id].win;
      return BrowserWindow.fromId(Number(id));
    }
  
    // 获取全部窗口
    getAllWin() {
      return BrowserWindow.getAllWindows();
    }
  
    // 关闭全部窗口
    closeAllWin() {
      try {
        for (let i in this.winLs) {
          if (this.getWin(i)) {
            this.getWin(i).close();
          } else {
            app.quit();
          }
        }
        // 主窗口
        this.mainWin = null;
        // 窗口组
        this.winLs = {};
      } catch (error) {
        console.log(error);
      }
    }
  
   
  
    makeSingleInstance() {
      if (process.mas) return;
  
      const loginArg = {
        width: 650, // 窗口宽度
        height: 480, // 窗口高度
        minWidth: 650, // 窗口最小宽度
        minHeight: 480, // 窗口最小高度
        resize: false, // 是否支持缩放
        maximize: false, // 最大化窗口
        isMultiWin: false, // 是否支持多开窗口
        isMainWin: false, // 是否主窗口
        alwaysOnTop: true, // 置顶窗口
        route: "/login"
      };
      const sendData = { PROJECT_NAME: process.env.PROJECT_NAME };
      const lock = true;
      // const lock = app.requestSingleInstanceLock(sendData);
      console.log("additionalData : ", sendData, lock);
      if (!lock) {
        app.quit();
      } else {
        app.on(
          "second-instance",
          (event, commandLine, workingDirectory, additionalData) => {
            console.log("requestSingleInstanceLock", additionalData, sendData);
            if (sendData.PROJECT_NAME === additionalData.PROJECT_NAME) {
              const allWin = this.getAllWin();
              if (allWin.length > 0) {
                if (allWin[0].isMinimized()) allWin[0].restore();
                allWin[0].focus();
              }
            }
          }
        );
  
        this.createWin(loginArg);
      }
    }
  
    loadProcess() {
      let pattern = join(process.env.ROOT, "/electron/main-process/**/*.js");
      pattern = pattern.replace(/\\/g, "/");
      // 将反斜杠替换为正斜杠
      const files = glob.sync(pattern);
      console.log(files);
      files.forEach(file => {
        require(file);
      });
    }
  
    // 开启主进程监听
    ipcMainListen() {
      // 设置标题
      ipcMain.on("set-title", (e, data) => {
        const webContents = e.sender;
        const wins = BrowserWindow.fromWebContents(webContents);
        wins.setTitle(data);
      });
      // 是否最大化
      ipcMain.handle("isMaximized", e => {
        const win = BrowserWindow.getFocusedWindow();
        return win.isMaximized();
      });
  
      ipcMain.on("min", e => {
        const win = BrowserWindow.getFocusedWindow();
        win.minimize();
      });
      ipcMain.handle("max2min", e => {
        const win = BrowserWindow.getFocusedWindow();
        if (win.isMaximized()) {
          win.unmaximize();
          return false;
        } else {
          win.maximize();
          return true;
        }
      });
  
      ipcMain.handle("createWin", (event, args) => this.createWin(args));
  
      ipcMain.handle("setArgs", (event, args) => {
        let win = BrowserWindow.getFocusedWindow();
        if (args.parent) win.setParentWindow(this.getWin(args.parent));
        if (args.data) this.winLs[win.id].data = args.data;
        if (typeof args.resize === "boolean") win.setResizable(args.resize);
        if (typeof args.alwaysOnTop === "boolean") {
          win.setAlwaysOnTop(args.alwaysOnTop);
        }
  
        if (args.background) win.setBackgroundColor(args.background);
        if (args.width && args.height) win.setSize(args.width, args.height);
        if (args.minWidth && args.minHeight) {
          win.setMinimumSize(args.minWidth, args.minHeight);
        }
        if (args.x && args.y) win.setBounds(args.x, args.y);
        // 是否最大化
        if (args.maximize && args.resize) {
          win.maximize();
        }
  
        if (args.route) {
          win.loadURL(`${winURL}#${args.route}`);
        }
      });
  
      // ipcMain.handle("close", (e, data) => {
      //   const wins = BrowserWindow.getFocusedWindow();
      //   console.log("BrowserWindow win handle close ", wins.id);
      //   wins.close();
      // });
  
      ipcMain.on("win-create", (event, args) => this.createWin(args));
  
      ipcMain.handle("quit", e => {
        this.closeAllWin();
      });
  
      ipcMain.handle("restart", () => {
        this.mainWin = null;
        this.winLs = {};
        setTimeout(() => {
          app.relaunch();
          app.exit();
        }, 300); // 给予操作系统一些时间来处理退出信号
      });
  
      ipcMain.handle("getAllDisplays", e => {
        return screen.getAllDisplays();
      });
  
      ipcMain.handle("getWinThis", (event, id) => {
        const { data } = this.winLs[id];
        return { data };
      });
  
      ipcMain.handle("getProfile", (event, id) => {
        if (id) {
          const win = this.getWin(id);
          const { x, y, width, height } = win.getBounds();
          return [{ ...this.win[id], x: x + 1, y: y + 1, width, height }];
        } else {
          const wins = this.getAllWin();
          return wins.map(win => {
            const { x, y, width, height } = win.getBounds();
            let winParam = this.winLs[win.id]
            delete winParam.win;
            return { ...winParam, x: x + 1, y: y + 1, width, height };
          });
        }
      });
  
      ipcMain.handle("hasWins", (event, args) => {
        // 判断窗口是否存在
        for (let i in this.winLs) {
          if (
            this.getWin(i) &&
            this.winLs[i].route === args.route &&
            !this.winLs[i].isMultiWin
          ) {
            this.getWin(i).focus();
            return true;
          }
        }
        return false;
      });
  
      ipcMain.handle("hasWinsById", (event, id) => {
        // 判断窗口是否存在
        console.log(this.winLs, id);
        return id && this.getWin(id) ? true : false;
      });
  
      ipcMain.handle("sendWinMsg", (event, args) => {
        this.getWin(args.id).webContents.send(args.fun, args.data);
      });
  
      ipcMain.handle("focusByID", (event, args) => {
        this.getWin(args.id).focus();
      });
    }
  }
  
  module.exports = MultiWindows;
  