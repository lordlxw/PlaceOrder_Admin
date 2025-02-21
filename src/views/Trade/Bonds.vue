<template lang="">
  <div>当前持仓2</div>
  <div>
    hello
    <el-tabs ref="eltabs">
      <el-tab-pane :label="tablist[0]">
        <div>
          <WeiPingOrders></WeiPingOrders>
          <!-- <el-table :data="WeiPingOrders" v-loading="loading">
            <template v-for="item in WeiPingOrders">
              <el-table-column
                :formatter="item.formatter"
                :width="itemHead.width ? itemHead.width : ''"
              >
              </el-table-column>
            </template>
          </el-table> -->
        </div>
      </el-tab-pane>

      <el-tab-pane :label="tablist[1]">
        <div>
          <el-button>测试2</el-button>
          <YiPingOrders></YiPingOrders>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { ElMessage } from "element-plus";
import { defineComponent } from "vue";
import WeiPingOrders from "../components/ComWeiPingOrders.vue"; // 已平
import YiPingOrders from "../components/ComYiPingOrders.vue"; // 未平
export default defineComponent({
  components: {
    WeiPingOrders,
    YiPingOrders,
  },
  data() {
    return {
      loading: false, // 布尔类型
      tablist: ["未平仓", "已平仓"],
      WeiPingOrders: {}, // 未平单子
      YiPingOrders: {}, // 已平单子
      currentTab: "", // 当前tab
    };
  },
  methods: {
    // 初始化未平
    InitWeiPing() {
      try {
        this.loading = true;
      } catch (ex) {
        ElMessage("未平异常" + ex);
      } finally {
        this.loading = false;
      }
    },

    // 初始化已平
    InitYiPing() {
      try {
        ElMessage("YiPing");
        this.loading = true;
      } catch (ex) {
        ElMessage("已平异常" + ex);
      } finally {
        this.loading = false;
      }
    },
    toggleLoading() {
      this.loading = !this.loading; // 切换 loading 状态
    },
  },
  created() {
    console.log("Bonds-Created");

    ElMessage("进入Bonds.vue");
  },
  mounted() {
    console.log("Bonds---Mounted");
    // // 使用 $nextTick 确保 DOM 已经渲染
    // this.$nextTick(() => {
    //   if (this.$refs.eltabs && this.$refs.eltabs.panes.length > 0) {
    //     console.log("Bonds有eltab");
    //     switch (this.$refs.eltabs.panes[0].label) {
    //       case this.tablist[0]:
    //         this.currentTab = this.tablist[0];
    //         break;
    //       case this.tablist[1]:
    //         this.currentTab = this.tablist[1];
    //         break;
    //     }
    //   } else {
    //     console.log("Bonds没有eltab");
    //   }
    // });
  },
});
</script>

<style lang=""></style>
