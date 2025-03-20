<template>
  <!-- 登录表单容器 -->
  <div class="app">
    <div class="login-container">
      <div class="login-header">登录</div>
      <!-- 登录表单 -->
      <form @submit.prevent="submitForm('ruleForm')">
        <!-- 用户名输入框 -->
        <div class="mb-3">
          <label for="username" class="form-label">用户名</label>
          <input
            type="text"
            class="form-control"
            id="username"
            v-model="ruleForm.username"
            placeholder="请输入用户名"
            @keyup.enter="submitForm('ruleForm')"
            required
          />
        </div>

        <!-- 密码输入框 -->
        <div class="mb-3">
          <label for="password" class="form-label">密码</label>
          <input
            type="password"
            class="form-control"
            id="password"
            v-model="ruleForm.password"
            placeholder="请输入密码"
            @keyup.enter="submitForm('ruleForm')"
            required
          />
        </div>

        <!-- 登录按钮 -->
        <div class="d-grid gap-2">
          <button type="submit" class="btn btn-primary">登录</button>
        </div>
      </form>

      <!-- 跳转到主页面 -->
      <div class="text-center mt-3">
        <router-link to="{ name: 'MainView' }" class="text-decoration-none"
          >跳转到主页面</router-link
        >
      </div>

      <!-- 忘记密码链接 -->
      <div class="forgot-password">
        <a href="#">忘记密码?</a>
      </div>
    </div>
  </div>
  <!-- <div class="app">
    <div class="login-container">
      <div class="login-header">登录</div>
      <el-form
        ref="ruleForm"
        size="medium"
        @submit.prevent="submitForm('ruleForm')"
      >
        <el-form-item label="用户名:" prop="username">
          <el-input
            v-model="ruleForm.username"
            placeholder="请输入用户名"
            @keyup.enter="submitForm('ruleForm')"
          />
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            @keyup.enter="submitForm('ruleForm')"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">登录</el-button>
        </el-form-item>
      </el-form>
      <div>
        <router-link :to="{ name: 'MainView' }">跳转到主页面</router-link>
      </div>
      <div class="forgot-password">
        <a href="#">忘记密码?</a>
      </div>
    </div>
  </div> -->

  <nav class="navbar navbar-default" role="navigation">
    <div class="container-fluid">
      <div class="navbar-header">
        <a class="navbar-brand" href="#">菜鸟教程</a>
      </div>
      <div>
        <ul class="nav navbar-nav">
          <li class="active"><a href="#">iOS</a></li>
          <li><a href="#">SVN</a></li>
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
              Java
              <b class="caret"></b>
            </a>
            <ul class="dropdown-menu">
              <li><a href="#">jmeter</a></li>
              <li><a href="#">EJB</a></li>
              <li><a href="#">Jasper Report</a></li>
              <li class="divider"></li>
              <li><a href="#">分离的链接</a></li>
              <li class="divider"></li>
              <li><a href="#">另一个分离的链接</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from "vue"; // 引入 ref 和 onMounted
import { debounce } from "@/utils/debounce"; // 引入 debounce 函数
import md5 from "js-md5";
import { useRouter } from "vue-router";
import api from "@/api/Login";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";

// import configUtil from "@/utils/config.js";
// import * as util from "@/utils/util";
// 定义响应式数据
const username = ref("liuxinwei");
const password = ref("");
let labelPosition = ref("管理");
const count = ref(0);
const $md5 = inject("$md5");
const store = useStore(); // 获取 Vuex store 实例
const router = useRouter(); // 获取路由实例
let isElectron = false;
const input = ref(""); // 使用 ref 来定义响应式数据
// 定义响应式数据
let ruleForm = ref({
  username: "shenhe1",
  password: "shenhe1",
});

const testValue = {
  name: "111",
  age: 12,
};

// onMounted 生命周期钩子
onMounted(() => {
  // 你的原始代码逻辑
  console.log("Login---onMounted生命周期钩子被调用");
  // 判断是否是 Electron 环境
  if (
    typeof window !== "undefined" &&
    window.v1 &&
    typeof window.v1.isElectron === "function"
  ) {
    // 在 Electron 环境中调用 isElectron
    isElectron = window.v1.isElectron();
    console.log("Electron environment detected:", isElectron);
    console.log(isElectron);
  } else {
    console.log("Not in Electron environment.");
  }
  // 如果你使用的是 Electron, 可按需进行操作
});

onUnmounted(() => {
  // 你的原始代码逻辑
  console.log("Login---onUnmounted生命周期钩子被调用");
  // 如果你使用的是 Electron, 可按需进行操作
});

const myCount = () => {
  count.value += 2; // 通过 `.value` 更新 ref 类型的变量
  console.log(`当前Count为：${count.value}`);
};

// const submitForm = () => {
//   // 在这里处理表单提交的逻辑
//   console.log(`Submitting form: 123`);
// };

const test = () => {
  // 在这里处理表单提交的逻辑
  console.log(`11111Submitting form: 123`);
};
// 提交表单的方法
const submitForm = function (formName) {
  console.log("点击登录键！");
  const { mac } = window.v1
    ? window.v1.getNetwork()
    : { mac: "cc:5e:f8:f0:5f:85" };
  console.log("mac地址是:", mac);
  console.log(`11112222`);
  let testVal = "11111";
  var hwinfo = md5(testVal);
  console.log(`hwinfo2:${hwinfo}`);
  console.log(`formName:${formName}`);
  // var hwinfo = $md5(mac.replace(/:/g, ""));
  // console.log(`hwinfo是:${mac}`);
  // 跳转到 MainView 组件
  console.log(router);
  let $path = "/MainView";
  console.log("isElectron");
  console.log("ruleForm", ruleForm.value); // 直接访问ruleForm的值
  console.log(isElectron);
  console.log("ruleform");
  console.log(ruleForm.value);
  console.log("LabelPosition");
  console.log(labelPosition);
  console.log(labelPosition.value);
  hwinfo = "aff61aa278543f4788e7b203b4b50334";
  api
    .login(
      {
        username: ruleForm.value.username,
        password: ruleForm.value.password,
        hwinfo: hwinfo,
      },
      labelPosition === "Simulation" ? "BondHelper" : "BondHelper",
      labelPosition === "Simulation" ? "sim" : "admin"
    )
    .then((response) => {
      //拿到登录成功返回的响应处理
      console.log(response);

      if (response && response.code === 200) {
        // 保存token信息
        Promise.all([store.commit("SET_TOKEN", response.token)]).then(() => {
          console.log("xxxxx!!!!!");
          //console.log(`${import.meta.env.VITE_BASE_API}`);
          api.auth().then(async (response) => {
            if (response && response.code === 200) {
              const { value: brokers } = await api.chatReceiver();
              store.commit("SET_USER_INFO", {
                permissions: response.permissions,
                userName: response.user.userName,
                userId: response.user.userId,
                roleName: response.user.roles[0].roleName,
                menutree: response.menutree,
                brokers: brokers,
                ...response.user,
              });
            }
            let $path = "/simulation/main";
            console.log("labelPosition");
            console.log(labelPosition.value);
            if (labelPosition.value === "lily") {
              $path = "/dashboard";
            }
            if (isElectron) {
              let $path = "/MainView";
              const args = {
                id: "main",
                width: 1620, // 窗口宽度
                height: 1024, // 窗口高度
                isMainWin: true,
                resize: true, // 是否支持缩放
                maximize: false, // 最大化窗口
                isMultiWin: true, // 是否支持多开窗口
                route: $path,
                frame: true,
              };
              console.log("LoginArgs");

              console.log(args);
              window.v1.sendMessageToMain("createWin", args);
            } else {
              console.log("vue下跳转");
              console.log($path);
              //this.$router.push({ name: "MainView" });
              //this.$router.push({ name: "MainView" });
              //this.$router.push({ path: $path });
              console.log(this);
              router.push({ path: "/MainView" });
            }
          });
        });
      } else {
        console.log("登录没有返回200");
        ElMessage({
          message: `${response.message}`,
          type: "error", // 错误类型
        });
        // ElMessage("This is a message.");
        // this.$message({
        //   message: `${response.message}`,
        //   type: "error",
        // });
        return;
      }
    });
};
//this.$router.push({ name: "MainView" }); // 这里使用了路由名称（假设你的路由配置了 name: 'Home'）
</script>

<style scoped>
.electron .app {
  background: rgb(193, 206, 122); /* 恢复正常背景 */
}
.app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f5f5;
}
/* 登录界面的样式 */
.login-container {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  padding: 40px;
  box-sizing: border-box;
}

.login-header {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
  color: #4caf50;
  cursor: move;
  -webkit-app-region: drag;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border 0.3s ease;
}

.input-field:focus {
  border-color: #4caf50;
}

.btn {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #45a049;
}
.forgot-password {
  text-align: center;
  margin-top: 15px;
}

.forgot-password a {
  color: #4caf50;
  text-decoration: none;
  font-weight: 500;
}
</style>
