// store/index.js
// store.js
import { createStore } from 'vuex';
import config from "@/utils/config.js";  // 固定配置
import * as util from "@/utils/util.js"; // 一些转换配置

console.log("store--index -- config");
console.log(config);
const store = createStore({
    state: {
      // 记录当前选中的tscode,刷新恢复使用
      tscodeGlobal: "",
      isCollapse: false,
      asideLeftWidth: "",
      userId: 0,
      roleId: "",
      nickName: "",
      loginName: "",
      token: "",
      menus: [],
      navigator: [],
      navigatorId: [],
      routers: {},
      imgList: {},
      curMenuIndex: "",
      // url 连接传参
      urlParams: {},
      // 询价单的一些默认设置默认设置
      defaultSet: {},
      userInfo: {},
      riskInfo: {},
      occupyInfo: [],
      winInfo: {},
      enquiryInfo: "",
      hotsList: [],
      chatMessage: null,
      chatWorkOrder: null,
      socketMain: null,
      socketKLine: null
    },
    getters: {
      getMenus(state) {
        console.log("getMenus");
        console.log(state);
        if (state.menus.length > 0) {
          localStorage.setItem(config.keys.menusKey, state.menus);
        } else {
          state.menus = localStorage.getItem(config.keys.menusKey);
        }
        return JSON.parse(state.menus);
      },
      getRoleId(state) {
        console.log("getRoleId");
        console.log(state);
        if (state.roleId === "") {
          state.roleId = localStorage.getItem(config.keys.roleIdKey);
        }
        return state.roleId;
      },
      getNavigator(state) {
        if (state.navigator.length > 0) {
        } else {
          const navigator = localStorage.getItem(config.keys.navigatorKey);
          if (navigator) {
            state.navigator = navigator.split(",");
          }
        }
        return state.navigator;
      },
      getNavigatorId(state) {
        if (state.navigatorId.length > 0) {
        } else {
          const navigatorId = localStorage.getItem(config.keys.navigatorIdKey);
          if (navigatorId) {
            state.navigatorId = navigatorId.split(",");
          }
        }
        return state.navigatorId;
      },
      getRouters(state) {
        console.log("getRouters");
        console.log(state);
        if (Object.keys(state.routers).length > 0) {
        } else {
          const routers = JSON.parse(
            localStorage.getItem(config.keys.routersKey)
          );
          if (routers) {
            state.routers = routers;
          }
        }
        return state.routers;
      },
      getUrlParams(state) {
        if (Object.keys(state.urlParams).length > 0) {
        } else {
          const urlParams = JSON.parse(
            localStorage.getItem(config.keys.urlParams)
          );
          if (urlParams) {
            state.urlParams = urlParams;
          }
        }
        return state.urlParams;
      },
      // 获取当前tscode
      getTscodeGlobal(state) {
        if (state.tscodeGlobal === "") {
          state.tscodeGlobal = localStorage.getItem(config.keys.currentTscode);
        }
        return state.tscodeGlobal || "";
      },
      // 获取默认设置
      getDefaultSet(state) {
        if (localStorage.getItem(config.keys.defaultSet)) {
          state.defaultSet = JSON.parse(
            localStorage.getItem(config.keys.defaultSet)
          );
        } else {
          state.defaultSet = {
            // 默认交易量
            volume: 0,
            // 是否快速提交
            quickSubmit: false
          };
        }
        return state.defaultSet;
      },
      // 获取用户信息
      getUserInfo(state) {
        if (localStorage.getItem(config.keys.userInfo)) {
          state.userInfo = JSON.parse(localStorage.getItem(config.keys.userInfo));
        } else {
          state.userInfo = {
            // 权限
            permissions: [],
            // 用户名
            userName: "",
            // 用户id
            useId: "",
            // 角色名称
            roleName: "",
            // 菜单
            menutree: []
          };
        }
        return state.userInfo;
      },
      // 获取电脑基本信息
      getWinInfo(state) {
        if (localStorage.getItem(config.keys.winInfo)) {
          state.winInfo = JSON.parse(localStorage.getItem(config.keys.winInfo));
        } else {
          state.winInfo = {};
        }
        return state.winInfo;
      }
    },
    actions: {},
    mutations: {
      // 菜单收起与展开
      SET_IS_COLLAPSE(state, params) {
        state.isCollapse = params.isCollapse;
        state.asideLeftWidth = params.val + "px";
      },
      // 设置登录名
      SET_LOGINNAME(state, loginName) {
        state.loginName = loginName;
        localStorage.setItem(config.keys.loginNameKey, loginName);
      },
      // 设置token
      SET_TOKEN(state, token) {
        state.token = token;
        localStorage.setItem(config.keys.tokenKey, token);
      },
      // 设置用户信息
      SET_USER_INFO(state, userInfo) {
        state.userInfo = JSON.stringify(userInfo);
        localStorage.setItem(config.keys.userInfo, JSON.stringify(userInfo));
      },
      SET_RISK_INFO(state, riskInfo) {
        state.riskInfo = riskInfo;
      },
      SET_OCCUPY_INFO(state, occupyInfo) {
        state.occupyInfo = occupyInfo;
      },
      // 设置窗口信息
      SET_WIN_INFO(state, winInfo) {
        state.winInfo = JSON.stringify(winInfo);
        localStorage.setItem(config.keys.winInfo, JSON.stringify(winInfo));
      },
      // 设置角色id
      SET_ROLEID(state, roleId) {
        state.roleId = roleId.toString();
        localStorage.setItem(config.keys.roleIdKey, roleId.toString());
      },
      // 设置menus
      SET_MENUS(state, menus) {
        const lazyMenuIds = [];
        const menusIds = JSON.parse(menus);
        menusIds.forEach(element => {
          let temp = element;
          let flag = true;
          while (flag) {
            const position = temp.lastIndexOf("-");
            const curMenuId = temp.substring(0, position);
            if (lazyMenuIds.indexOf(curMenuId) === -1 && curMenuId !== "") {
              lazyMenuIds.push(curMenuId);
            }
            temp = curMenuId;
            if (position === -1) {
              flag = false;
            }
          }
        });
        state.menus = JSON.stringify(
          util.mergeArray(JSON.parse(menus), lazyMenuIds)
        );
        localStorage.setItem(config.keys.menusKey, state.menus);
      },
      // 设置导航
      SET_NAVIGATOR(state, params) {
        state.navigator = params.val1;
        state.navigatorId = params.val2;
        state.routers[params.val3] = {
          navigator: params.val1,
          navigatorId: params.val2
        };
        localStorage.setItem(config.keys.navigatorKey, params.val1);
        localStorage.setItem(config.keys.navigatorIdKey, params.val2);
        localStorage.setItem(
          config.keys.routersKey,
          JSON.stringify(state.routers)
        );
      },
      // 设置当前导航索引
      SET_CRUMENUSINDEX(state, index) {
        state.curMenuIndex = index;
      },
      SET_URLPARAMS(state, params) {
        localStorage.setItem(config.keys.urlParams, JSON.stringify(params));
        state.urlParams = params;
      },
      // 设置当前选中的tscode（刷新恢复使用）
      SET_TSCODE_GLOBAL(state, params) {
        state.tscodeGlobal = params.tscodeGlobal;
        localStorage.setItem(config.keys.currentTscode, params.tscodeGlobal);
      },
      // 设置默认设置
      SET_DEFAULT_SET(state, params) {
        state.defaultSet = params;
        localStorage.setItem(config.keys.defaultSet, params);
      },
      // 设置询价信息变化
      SET_ENQUIRY_INFO(state, enquiryInfo) {
        state.enquiryInfo = JSON.stringify(enquiryInfo);
      },
      SET_CHAT_MESSAGE(state, chatMessage) {
        state.chatMessage = chatMessage;
      },
      SET_CHAT_ORDER(state, chatWorkOrder) {
        state.chatWorkOrder = chatWorkOrder;
      },
      SET_HOTS_LIST(state, hotsList) {
        if (hotsList.length === 1 && state.hotsList.length > 0) {
          let updatedArr = [...state.hotsList];
          const hotsItem = hotsList[0];
          const index = updatedArr.findIndex(n => n.TsCode === hotsItem.TsCode);
          if (index >= 0) {
            updatedArr[index] = hotsItem;
          } else {
            updatedArr.push(hotsItem);
          }
          updatedArr.sort((a, b) => b.Volume - a.Volume);
          state.hotsList = updatedArr;
          console.log("递增龙虎榜了！！！！！！！！！！！！", hotsItem.TsCode, hotsItem.Volume, state.hotsList.length, index);
        } else {
          console.log("把龙虎榜替换了！！！！！！！！！！！！", hotsList, new Date());
          state.hotsList = hotsList;
        }
      },
      // 设置socketMain
      SET_SOCKET_MAIN(state, socket) {
        state.socketMain = socket;
      },
      // 设置socketKLine
      SET_SOCKET_KLINE(state, socket) {
        state.socketKLine = socket;
      }
    }
  });

export default store;



