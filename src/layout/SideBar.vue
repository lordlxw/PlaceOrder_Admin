<template>
  <div style="width: 200px">
    <el-menu
      :default-active="$route.path"
      background-color="brown"
      text-color="#fff"
      active-text-color="#fff"
      :default-openeds="openeds"
      v-if="userInfo"
    >
      <template v-for="(item, index) in userInfo.menutree">
        <el-sub-menu
          v-if="item.children && item.children.length > 0"
          :index="index + 1 + ''"
          :key="index"
        >
          <template #title>
            <i :class="item.icon" class="mr10 menu-icon"></i>
            <span class="menu-tit">{{ item.menuName }}</span>
          </template>
          <el-menu-item
            v-for="item2 in item.children"
            :route="item2.component"
            :index="item2.component"
            :key="item2.component"
            @click="
              navigateTo(
                [`${item.menuName}`, `${item2.menuName}`],
                [item.menuId, item2.menuId],
                `${item2.component}`
              )
            "
            ><i :class="item2.icon" class="mr10"></i
            >{{ item2.menuName }}</el-menu-item
          >
        </el-sub-menu>
        <!-- 单独的菜单项 -->
        <el-menu-item
          v-else
          :index="item.component === null ? index + 1 + '' : item.component"
          :route="item.component"
          :key="item.component"
          @click="
            navigateTo([`${item.menuName}`], [item.menuId], `${item.component}`)
          "
        >
          <template #title>
            <i :class="item.icon" class="mr10 menu-icon"></i>
            <span class="menu-tit">{{ item.menuName }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from "vue";
import { computed, watch } from "vue";
import { Menu as IconMenu, Message, Setting } from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { onMounted } from "vue";
import config from "../utils/config.js";
const router = useRouter(); // 获取路由实例
const route = useRoute(); // 获取路由实例
const store = useStore(); // 获取 Vuex store 实例
// 使用 computed 来映射 state 和 getters

const curMenuIndex = computed(() => store.state.curMenuIndex);
const routers = computed(() => store.getters.getRouters);
const menus_ids = computed(() => store.getters.getMenus);
const roleId = computed(() => store.getters.getRoleId);
const userInfo = computed(() => store.getters.getUserInfo);
const openeds2 = ref(["1", "2", "3", "4"]);
const menus = ref([]); // 使用 ref 来创建响应式数组
// 打开的菜单项
// const openeds = ref([]); // 用 ref 来存储状态，确保其响应式
const openeds = ref<string[]>([]); // 明确指定类型为 string 数组

let test = ref([]);

// 路由变化监听
watch(route, (to, from) => {
  console.log("watch变化");
  if (routers[to.path]) {
    navigateTo(
      routers[to.path].navigator,
      routers[to.path].navigatorId,
      to.path
    );
  }
});

//赋值默认打开的子菜单
onBeforeMount(() => {
  // 这里相当于 Vue 2 中的 created
  console.log("组件创建前执行");

  if (userInfo.value && userInfo.value.menutree) {
    openeds.value = userInfo.value.menutree.map((item, i) =>
      (i + 1).toString()
    );
  }
});
onMounted(() => {
  console.log("sideBar组件已挂载");
  console.log(userInfo.value);
  console.log("config");
  console.log(config);
  menus.value = config.menus;
  console.log("menus");
  console.log(menus.value);
  console.log(menus);
  console.log("openeds");
  console.log(openeds.value);
  console.log("openeds2");
  console.log(openeds2.value);
});
// 路由跳转
const navigateTo = (val1, val2, val3) => {
  console.log("navigateto");
  console.log(openeds2.value);

  console.log(openeds.value);
  console.log(userInfo.value);
  console.log(openeds2.value);

  console.log("routers");
  console.log(routers.value);
  console.log("endrouter");
  const params = {
    val1,
    val2,
    val3,
  };
  router.push(val3);
  store.commit("SET_NAVIGATOR", params);
};

const item = {
  date: "2016-05-02",
  name: "Tom",
  address: "No. 189, Grove St, Los Angeles",
};
const tableData = ref(Array.from({ length: 20 }).fill(item));
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}

.menu-tit {
  font-weight: bold;
  font-size: 15px;
}
</style>
