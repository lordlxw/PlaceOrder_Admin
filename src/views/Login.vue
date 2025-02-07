<template>
  <!-- <div>
    <h2>nihao</h2>
    <el-button type="primary" @click="handleClick">点击我</el-button>
    <el-input v-model="inputValue" placeholder="请输入内容"></el-input>
    <p>输入的内容是：{{ inputValue }}</p>
  </div> -->
  <div class="app">
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
      <!-- <form ref="ruleForm" @submit.prevent="submitForm('ruleForm')">
        <input
          type="text"
          v-model="username"
          class="input-field"
          placeholder="请输入用户名"
          @keyup.enter="submitForm('ruleForm')"
        />
        <input
          type="password"
          v-model="password"
          class="input-field"
          placeholder="请输入密码"
          @keyup.enter="submitForm('ruleForm')"
        />
        <div>
          <button class="btn">登录</button>
        </div>
      </form> -->

      <!-- <div>
        <button @click="test">测试</button>
      </div> -->
      <div>
        <router-link :to="{ name: 'MainView' }">跳转到主页面</router-link>
      </div>
      <div class="forgot-password">
        <a href="#">忘记密码?</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from "vue"; // 引入 ref 和 onMounted
import { debounce } from "@/utils/debounce"; // 引入 debounce 函数
import md5 from "js-md5";
import { useRouter } from "vue-router";
// 定义响应式数据
const username = ref("liuxinwei");
const password = ref("");
const count = ref(0);
const $md5 = inject("$md5");
const router = useRouter(); // 获取路由实例
let isElectron = false;
// 定义响应式数据
const ruleForm = ref({
  username: "liuxinwei2test",
  password: "",
});

// onMounted 生命周期钩子
onMounted(() => {
  // 你的原始代码逻辑
  console.log("Login---onMounted生命周期钩子被调用");
  isElectron = window.v1.isElectron();
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
  var hwinfo2 = md5(testVal);
  console.log(`hwinfo2:${hwinfo2}`);
  console.log(`formName:${formName}`);
  // var hwinfo = $md5(mac.replace(/:/g, ""));
  // console.log(`hwinfo是:${mac}`);
  // 跳转到 MainView 组件
  console.log(router);
  let $path = "/MainView";
  if (isElectron) {
    let $path = "/MainView";
    const args = {
      id: "main",
      width: 1024, // 窗口宽度
      height: 968, // 窗口高度
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
    return;
    window.v1
      .sendMessageToMain("createWin", args)
      .then((response) => {
        window.v1.close();
      })
      .catch((error) => {
        // 处理错误
        console.error(error);
      });

    window.v1
      .sendMessageToMain("createWin", args)
      .then((response) => {
        window.v1.close();
      })
      .catch((error) => {
        // 处理错误
        console.error(error);
      });
  } else {
    console.log("vue下跳转");
    console.log($path);
    //this.$router.push({ name: "MainView" });
    //this.$router.push({ name: "MainView" });
    this.$router.push({ path: $path });
  }

  //this.$router.push({ name: "MainView" }); // 这里使用了路由名称（假设你的路由配置了 name: 'Home'）
  return;
  this.$refs[formName].validate((valid) => {
    if (valid) {
      api
        .login(
          {
            username: this.ruleForm.username,
            password: this.ruleForm.password,
            uuid: this.uuid,
            code: this.ruleForm.code,
            hwinfo: hwinfo,
          },
          this.labelPosition === "Simulation" ? "BondHelper" : "BondHelper",
          this.labelPosition === "Simulation" ? "sim" : "admin"
        )
        .then((response) => {
          if (response && response.code === 200) {
            // 保存 token 信息
            Promise.all([this.$store.commit("SET_TOKEN", response.token)]).then(
              () => {
                api.auth().then(async (response) => {
                  if (response && response.code === 200) {
                    const { value: brokers } = await api.chatReceiver();
                    this.$store.commit("SET_USER_INFO", {
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
                  if (this.labelPosition === "lily") {
                    $path = "/dashboard";
                  }

                  if (this.isElectron) {
                    const displays = await window.v1.getAllDisplays();
                    this.$store.commit("SET_WIN_INFO", {
                      displays,
                    });
                    if (this.labelPosition === "lily") {
                      const maxWidth = Math.max(
                        ...displays.map((display) => display.bounds.width)
                      );
                      const minWidth = Math.ceil(maxWidth * 0.7);
                      const minHeight = Math.ceil(minWidth * 0.6);
                      const args = {
                        id: "main",
                        width: minWidth, // 窗口宽度
                        height: minHeight, // 窗口高度
                        isMainWin: true,
                        resize: true, // 是否支持缩放
                        maximize: false, // 最大化窗口
                        isMultiWin: true, // 是否支持多开窗口
                        route: $path,
                      };

                      console.log(args);
                      window.v1
                        .createWin(args)
                        .then((response) => {
                          window.v1.close();
                        })
                        .catch((error) => {
                          // 处理错误
                          console.error(error);
                        });
                    } else {
                      const { code, value, message } = await api.getProfile(
                        response.user.userId
                      );
                      if (code !== "00000") {
                        return this.$message({
                          message: `${message}`,
                          type: "error",
                        });
                      }
                      const klineWins =
                        value && value.wins ? JSON.parse(value.wins) : [];
                      if (
                        klineWins.length > 0 &&
                        this.labelPosition !== "lily"
                      ) {
                        klineWins.forEach((args, index) => {
                          window.v1
                            .createWin(args)
                            .then((response) => {
                              console.log("args: ", response, args);
                            })
                            .catch((error) => {
                              // 处理错误
                              console.error(error);
                            });
                        });
                        window.v1.close();
                      } else {
                        const maxWidth = Math.max(
                          ...displays.map((display) => display.bounds.width)
                        );
                        const minWidth = Math.ceil(maxWidth / 2 + 100);
                        const minHeight = Math.ceil(minWidth * 0.63);

                        // const maxWidth = Math.max(...displays.map(display => display.bounds.width));
                        // const minWidth = Math.ceil(maxWidth * 0.7);
                        // const minHeight = Math.ceil(minWidth * 0.6);
                        const args = {
                          width: minWidth, // 窗口宽度
                          height: minHeight, // 窗口高度
                          minWidth: minWidth, // 窗口最小宽度
                          maxWidth: minWidth,
                          isMainWin: true,
                          resize: true, // 是否支持缩放
                          maximize: false, // 最大化窗口
                          isMultiWin: true, // 是否支持多开窗口
                          route: $path,
                        };

                        console.log(args);
                        window.v1
                          .createWin(args)
                          .then((response) => {
                            window.v1.close();
                          })
                          .catch((error) => {
                            // 处理错误
                            console.error(error);
                          });
                      }
                    }
                  } else {
                    this.$router.push({ path: $path });
                  }
                });
              }
            );
          } else {
            this.$message({
              message: `${response.message}`,
              type: "error",
            });
          }
        });
    } else {
      this.$message.error("验证失败");
    }
  });
};
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
  padding: 12px;
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
