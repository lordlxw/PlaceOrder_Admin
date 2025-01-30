<template>
  <div class="login-container">
    <div class="login-header">登录</div>
    <form @submit.prevent="handleSubmit">
      <input
        type="text"
        v-model="username"
        class="input-field"
        placeholder="请输入用户名"
      />
      <input
        type="password"
        v-model="password"
        class="input-field"
        placeholder="请输入密码"
      />
      <div>
        <button type="submit" class="btn">登录</button>
      </div>
    </form>
    <div class="forgot-password">
      <a href="#">忘记密码?</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    handleSubmit() {
      // 登录逻辑
      console.log("Username:", this.username);
      console.log("Password:", this.password);
    },
  },
};
</script>

<style scoped>
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
