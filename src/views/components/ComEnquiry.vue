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
      <div class="do"></div>
      <!-- 添加键，现在不用了。 -->
      <div class="table mt10">
        <el-table
          v-loading="state.loading"
          :data="state.tableData"
          row-key="userTradeId"
          default-expand-all
          tooltip-effect="dark"
          style="width: 100%"
          :header-cell-style="{ background: '#f8f8f8' }"
          :cell-style="cellStyle"
          :header-row-style="{ height: '26px', lineHeight: '30px' }"
          :row-class-name="tableRowClassName"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          @expand-change="handleExpandChange"
          @sort-change="handleSortChange"
        >
          <el-table-column width="10"></el-table-column>
          <template v-for="itemHead in state.tableHead">
            <el-table-column
              v-if="itemHead.show"
              :key="itemHead.prop"
              :align="itemHead.align"
              :prop="itemHead.prop"
              :formatter="
                itemHead.formatter
                  ? itemHead.formatter
                  : (row, column, cellValue, index) => {
                      return cellValue;
                    }
              "
              :label="itemHead.label"
              :width="itemHead.width ? itemHead.width : ''"
              :show-overflow-tooltip="
                itemHead.showOverflowTooltip ? true : false
              "
            >
            </el-table-column>
          </template>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, onMounted, ref } from "vue";
import { useStore } from "vuex";
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

// 获取 Vuex store 实例
const store = useStore();

// 使用 computed 获取 Vuex 中的状态或 getter
const userInfo = store.getters.getUserInfo;

// 判断是否角色是研究员
const shouldShowGreeting = computed(() => {
  console.log("shouldShowGreeting");
  console.log(userInfo.value); // 注意这里使用 `.value`
  return (
    userInfo.value.roleName && ["研究员"].includes(userInfo.value.roleName)
  );
});

// 合并单元格
let tableCurrentRelativeNum = "";
let currentRelativeNum = "";
// 定义需要的变量
const relativeNum = ref("");
const relativeNumRoll = ref("");

// 在 setup 中使用 onMounted 钩子来执行挂载逻辑
onMounted(() => {
  dispatchUserColumn();
  console.log("询价单ComEnquiry执行挂载！");
  console.log("Comenquiry---userInfo");
  console.log(userInfo.value); // 通过 .value 获取 computed 的值
});

// 定义表单验证规则
const moneyTest = async (rule: any, value: string, callback: Function) => {
  if (!config.regExpSet.money.test(value)) {
    callback(new Error("请输入正确格式（-.----）"));
  } else {
    callback();
  }
};

const plusAmountTest = async (rule: any, value: string, callback: Function) => {
  if (!config.regExpSet.gtzero.test(value)) {
    callback(new Error("请输入大于0的正整数"));
  } else {
    callback();
  }
};

// 定义响应式状态
const state = reactive<any>({
  config,
  loading: false,
  tableHead: [],
  tableData: [],
  dialogDealFormVisible: false,
  dealForm: {
    usertradeId: "",
    price: "",
    volume: "",
    remark: "",
    deliveryTime: "",
    counterParty: "",
    contactPerson: "",
    contactType: "",
  },
  rulesDealForm: {
    price: [
      { required: true, message: "价格必选", trigger: "blur" },
      { validator: moneyTest, trigger: "blur" },
    ],
    volume: [
      { required: true, message: "交易量必填", trigger: "blur" },
      { validator: plusAmountTest, trigger: "blur" },
    ],
    deliveryTime: [
      { required: true, message: "清算速度必选", trigger: "blur" },
    ],
  },
  dealRows: {},
  dialogEnquiryFormVisible: false,
  formLabelWidth: "0",
  dialogEnquiryDifficultFormVisible: false,
  currentDifficultRow: [],
  dialogBondsRollFormVisible: false,
  overRow: {},
  openRow: {},
  diffTableData: [],
  diffTableHead: [
    {
      label: "修改项",
      prop: "fieldName",
      width: "150",
      align: "left",
      show: true,
    },
    {
      label: "旧值",
      prop: "oldValue",
      width: "200",
      align: "left",
      show: true,
    },
    {
      label: "新值",
      prop: "newValue",
      width: "200",
      align: "left",
      show: true,
    },
  ],
  expandRollSheetCounts: {},
  currentDifficultData: {},
  action: 1,
});

defineExpose({
  state,
});

//方法

//方法1、拿到配置的列
// 你可以直接在这里定义你的方法，无需使用 `methods` 对象
const dispatchUserColumn = () => {
  console.log("调用拿取询价单列~");
  apiAdmin
    .getUserColumn({
      templateId: 1,
      userId: null,
    })
    .then((response) => {
      console.log("询价单列response", response); // 输出整个对象
      if (response && response.code === "00000") {
        const headContent = JSON.parse(response.value.headContent);
        for (let i = 0; i < headContent.length; i++) {
          if (config.enquiryHead[headContent[i]]) {
            config.enquiryHead[headContent[i]].formatter = funcFormat;
            state.tableHead.push(config.enquiryHead[headContent[i]]);
          }
        }
        loadInitData();
      }
    });
};

//方法2、加载询价单数据
const loadInitData = (sort: { field: string; asc: boolean } | null = null) => {
  state.loading = true;
  api
    .inquiryQuery({
      pageNum: state.pageNum,
      pageSize: state.pageSize,
      orderBy: sort ? sort.field : "create_time",
      isAsc: sort ? sort.asc : false,
    })
    .then((response) => {
      if (response && response.code === 200 && response.rows) {
        state.tableData = response.rows;
        state.totalCount = response.total;
      } else {
        state.tableData = [];
        state.totalCount = 0;
      }
      calcRollSheetCanSee();
      state.loading = false;
    });
};

// 滚轮滑动
const calcRollSheetCanSee = () => {
  state.expandRollSheetCounts = {}; // 清空对象
  let tempRelativeNum = "";
  let relativeNumCount = 0;

  for (let i = 0; i < state.tableData.length; i++) {
    const row = state.tableData[i];

    // 判断条件
    if (
      row.relativeNum &&
      row.relativeNum.indexOf("GD_") !== -1 &&
      [2, 5, 6].indexOf(row.status) === -1
    ) {
      if (tempRelativeNum === "" && row.relativeNum) {
        tempRelativeNum = row.relativeNum;
      }
      if (tempRelativeNum === row.relativeNum) {
        relativeNumCount++;
        relativeNumCount += row.children.length;
        state.expandRollSheetCounts[tempRelativeNum] = relativeNumCount;
      } else {
        state.expandRollSheetCounts[tempRelativeNum] = relativeNumCount;
        relativeNumCount = 0;
        tempRelativeNum = row.relativeNum;
        relativeNumCount++;
        relativeNumCount += row.children.length;
      }
    } else {
      if (tempRelativeNum) {
        state.expandRollSheetCounts[tempRelativeNum] = relativeNumCount;
      }
      relativeNumCount = 0;
      tempRelativeNum = "";
    }
  }
};

// 定义格式化方法
const funcFormat = (row: any, column: any) => {
  switch (column.property) {
    case "status":
      return config.funcKeyValue(row.status.toString(), "inquiryStatus");
    case "direction":
      return config.funcKeyValue(row.direction, "directionMeta");
    case "deliveryTime":
      return moment(row.deliveryTime).format("YYYY-MM-DD");
    case "realDeliveryTime":
      return row.realDeliveryTime
        ? moment(row.realDeliveryTime).format("YYYY-MM-DD")
        : "--";
    case "price":
      return util.moneyFormat(row.price, 4);
    case "realPrice":
      return row.realPrice ? util.moneyFormat(row.realPrice, 4) : "--";
    case "realVolume":
      return row.realVolume ? row.realVolume : "--";
    case "tscode":
      return row.tscode.replace(/.IB/, "");
    case "worstPrice":
      let worstPrice = row.price;
      if (row.worstPrice) {
        if (row.direction === "bond_0") {
          worstPrice = row.price - row.worstPrice / 100;
        }
        if (row.direction === "bond_1") {
          worstPrice = row.price + row.worstPrice / 100;
        }
      }
      return util.moneyFormat(worstPrice, 4);
    default:
      return row[column.property];
  }
};

// cellStyle 方法
const cellStyle = (row, column, rowIndex, columnIndex) => {
  console.log("cellStyle-column");
  console.log(row);
  console.log(row.column);
  console.log(row.row.direction);

  switch (row.row.direction) {
    case "bond_1": // 卖出
      return {
        color: "#e88585",
        "font-weight": "bold",
        "font-size": "12px",
        "font-family":
          '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif',
      };
    case "bond_0": // 买入
      return {
        color: "#00da3c",
        "font-weight": "bold",
        "font-size": "12px",
        "font-family":
          '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif',
      };
    default:
      return {};
  }

  return {};
};

// 表格行样式设置
const tableRowClassName = ({ row, rowIndex }) => {
  if (row.relativeNum && row.relativeNum.indexOf("GD_") !== -1) {
    if (rowIndex === 0) {
      state.tableCurrentRelativeNum = "gd-odd-row";
      state.currentRelativeNum = row.relativeNum;
    }
    if (state.currentRelativeNum !== row.relativeNum) {
      state.currentRelativeNum = row.relativeNum;
      if (state.tableCurrentRelativeNum === "gd-even-row") {
        state.tableCurrentRelativeNum = "gd-odd-row";
      } else {
        state.tableCurrentRelativeNum = "gd-even-row";
      }
    }
  } else {
    state.tableCurrentRelativeNum = "";
  }
  return state.tableCurrentRelativeNum + " list-row";
};

// 方法：合并行列
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (rowIndex === 0) {
    // 解决重复渲染问题，清空之前的数据
    relativeNum.value = "";
    relativeNumRoll.value = "";
  }

  if (column.label === "滚单成交") {
    if (row.relativeNum && row.relativeNum.indexOf("GD_") !== -1) {
      // 根据当前relativeNum查找个数作为合并行数
      if (relativeNum.value !== row.relativeNum) {
        relativeNum.value = row.relativeNum;
        return {
          rowspan: state.expandRollSheetCounts[relativeNum.value],
          colspan: columnIndex,
        };
      } else {
        return {
          rowspan: 0,
          colspan: columnIndex,
        };
      }
    }
  }

  if (column.label === "操作") {
    if (
      row.relativeNum &&
      row.relativeNum.indexOf("GD_") !== -1 &&
      row.status === 0
    ) {
      if (relativeNumRoll.value !== row.relativeNum) {
        relativeNumRoll.value = row.relativeNum;
        return {
          rowspan: state.expandRollSheetCounts[relativeNumRoll.value],
          colspan: columnIndex,
        };
      } else {
        return {
          rowspan: 0,
          colspan: columnIndex,
        };
      }
    }
  }

  return {}; // 默认返回空
};

// handleExpandChange 方法
const handleExpandChange = (row, expandedRows) => {
  if (row.relativeNum && row.relativeNum.indexOf("GD_") !== -1) {
    if (expandedRows) {
      // 如果展开，增加子项的数量
      state.expandRollSheetCounts.value[row.relativeNum] =
        (state.expandRollSheetCounts.value[row.relativeNum] || 0) +
        row.children.length;
    } else {
      // 如果收起，减少子项的数量
      state.expandRollSheetCounts.value[row.relativeNum] =
        (state.expandRollSheetCounts.value[row.relativeNum] || 0) -
        row.children.length;
    }
  }
};

const handleSortChange = (sort) => {
  if (sort.prop === "createTime") {
    sort.field = "createTime";
  }
  if (sort.order === "ascending") {
    sort.asc = true;
  } else {
    sort.asc = false;
  }
  if (!sort.field) {
    sort.field = "createTime";
  }
  loadInitData(sort);
};
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
