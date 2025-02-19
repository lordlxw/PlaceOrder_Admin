<!-- 询价单 -->
<!-- 询价单 -->
<template>
  <div class="content">
    <div
      class="mb10"
      v-if="userInfo.roleName && ['研究员'].indexOf(userInfo.roleName) !== -1"
    >
      <account-risk-control></account-risk-control>
    </div>
    <div class="list">
      <div class="do">
        <el-button class="btn-add" type="default">添加</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import api from "../../api/Trade";
import apiAdmin from "../../api/Power_Admin";
import apiBreak from "../../api/Break";
import DeliveryCanlendarUpdate from "../../components/DeliveryCanlendarUpdate.vue";
import RealEnquiryRoll from "../../components/RealEnquiryRoll.vue";
import EnquiryEdit from "../../components/EnquiryEdit.vue";
import EnquiryDifficult from "../../components/EnquiryDifficult.vue";
import AccountRiskControl from "../../components/AccountRiskControl.vue";
import { pageMixin } from "../../utils/pageMixin";
import { commMixin } from "../../utils/commMixin";
import config from "../../utils/config";
import * as util from "../../utils/util";
import { debounce } from "../../utils/debounce";
import moment from "moment";
import { useStore } from "vuex";
import { computed, onMounted } from "vue";

// 获取 Vuex store 实例
const store = useStore();

// 使用 computed 获取 Vuex 中的状态或 getter
const userInfo = store.getters.getUserInfo;

const shouldShowGreeting = computed(() => {
  console.log("shouldShowGreeting");
  console.log(userInfo);
  return userInfo.roleName && ["研究员"].includes(userInfo.roleName);
}); // 判断是否角色是研究员

let tableCurrentRelativeNum = "";
let currentRelativeNum = "";
// 合并单元格
let relativeNum = "";
let relativeNumRoll = "";

// 在 setup 中使用 onMounted 钩子来执行挂载逻辑
onMounted(() => {
  console.log("询价单ComEnquiry执行挂载！");
  console.log("Comenquiry---userInfo");
  console.log(userInfo.value); // 通过 .value 获取 computed 的值
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/style.scss";

.content {
  height: 100%;
  background-color: $body-main-box;

  .list {
    padding: 10px;

    .el-table {
      border-radius: 3px;
      overflow: hidden;
    }

    .do {
      height: 50px;
      line-height: 50px;
      background-color: #fff;
      border-radius: 3px;
      padding: 0 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    }

    .table {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    }

    .list-row {
      height: 40px;
      line-height: 40px;
      color: #000;
    }
  }

  .navigator {
    position: relative;
    background-color: #f8f8f8;

    .el-breadcrumb {
      height: 50px;
      line-height: 50px;
    }

    .el-button {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }

  .filter-condition {
    margin: 20px 15px 10px;
    background-color: #f8f8f8;
    padding: 10px 15px;

    .item {
      display: inline-block;
      padding: 5px 0;
    }

    label {
      font-size: 12px;
      color: #999999;
    }

    .btn-box {
      float: right;
    }

    .clearboth {
      clear: both;
    }
  }

  .copy-tooltip {
    visibility: hidden;
  }

  .copy:hover {
    .copy-tooltip {
      visibility: visible;
    }
  }

  .pagination {
    float: right;
  }

  .my-el-row .el-col {
    padding: 5px 0;
  }

  .my-el-row .el-col:nth-child(odd) {
    text-align: right;
    font-size: 14px;
    color: #999999;
  }

  .my-el-row .el-col:nth-child(even) {
    font-size: 14px;
    word-break: break-all;
  }

  .table-height {
    height: 800px !important;
  }

  // .list {
  //   .do {
  //     position: relative;
  //     .btn-add {
  //       position: absolute;
  //       bottom: 30px;
  //       right: 10px;
  //     }
  //   }
  // }
}
</style>
