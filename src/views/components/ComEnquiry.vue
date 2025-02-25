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

          <!-- 操作列 -->
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="220"
          >
            <template v-slot="scope">
              <el-button
                type="text"
                v-if="
                  setAuth('inquiry:edit') &&
                  [0, 1, 4, 10].indexOf(scope.row.status) !== -1
                "
                @click="handleEditEnqury(scope.row)"
                >修改</el-button
              >
              <el-button
                type="text"
                v-if="setAuth('inquiry:accept') && scope.row.status === 0"
                @click="handleAcceptClick(scope)"
                >{{
                  scope.row.youxianLevel === 2
                    ? "接收优先复制"
                    : scope.row.youxianLevel === 1
                    ? "接收优先复制"
                    : "接收并复制"
                }}</el-button
              >
              <el-button
                @click="handleDealClick(scope.row)"
                type="text"
                size="small"
                v-if="
                  ['1', '4', '8', '10'].indexOf(scope.row.status.toString()) !==
                    -1 &&
                  setAuth('inquiry:deal') &&
                  scope.row.relativeNum &&
                  scope.row.relativeNum.indexOf('GD_') === -1
                "
                >成交</el-button
              >
              <el-popover
                v-if="setAuth('inquiry:rejection') && scope.row.status === 0"
                placement="bottom-end"
                :ref="`popover-notaccept-${scope.$index}`"
              >
                <p>
                  确认要<span class="color-red">拒收</span>“<span
                    class="color-main"
                    >{{ scope.row.tradeNum }}</span
                  >”？
                </p>
                <div style="text-align: right">
                  <el-button
                    type="text"
                    @click="
                      handlePopoverClose(
                        scope,
                        `popover-notaccept-${scope.$index}`
                      )
                    "
                    >取消</el-button
                  >
                  <el-button type="text" @click="handleNotAcceptClick(scope)"
                    >确认</el-button
                  >
                </div>
                <!-- reference 插槽的写法 -->
                <template #reference>
                  <el-button type="text" class="ml10">拒收</el-button>
                </template>
              </el-popover>
              <el-button
                @click="handleEnquiryDifficultClick(scope.row)"
                type="text"
                size="small"
                v-if="
                  [1, 4, 8].indexOf(scope.row.status) !== -1 &&
                  setAuth('inquiry:difficult')
                "
                class="ml10"
                >难成</el-button
              >
              <el-button
                type="text"
                v-if="
                  setAuth('inquiry:difficultcanncel') &&
                  [5, 19].indexOf(scope.row.status) !== -1
                "
                @click="handleDifficultNewEnqury(scope.row)"
                >新建</el-button
              >
              <el-popover
                v-if="
                  setAuth('inquiry:difficultcanncel') && scope.row.status === 19
                "
                placement="bottom-end"
                :ref="`popover-difficultcanncel-${scope.$index}`"
              >
                <p>
                  确认要<span class="color-red">难成撤单</span>“<span
                    class="color-main"
                    >{{ scope.row.tradeNum }}</span
                  >”？
                </p>
                <!-- <div style="text-align: right">
                  <el-button
                    type="text"
                    @click="
                      handlePopoverClose(
                        scope,
                        `popover-difficultcanncel-${scope.$index}`
                      )
                    "
                    >取消</el-button
                  >
                  <el-button
                    type="text"
                    @click="handleEnquiryDifficultCanncelClick(scope)"
                    >确认</el-button
                  >
                </div> -->
                <!-- reference 插槽的写法 -->
                <template #reference>
                  <el-button type="text" class="ml10">撤单</el-button>
                </template>
              </el-popover>
              <el-popover
                v-if="setAuth('inquiry:notmove') && scope.row.status === 19"
                placement="bottom-end"
                :ref="`popover-notmove-${scope.$index}`"
              >
                <p>
                  确认要<span class="color-red">难成保留</span>“<span
                    class="color-main"
                    >{{ scope.row.tradeNum }}</span
                  >”？
                </p>
                <!-- <div style="text-align: right">
                  <el-button
                    type="text"
                    @click="
                      handlePopoverClose(
                        scope,
                        `popover-notmove-${scope.$index}`
                      )
                    "
                    >取消</el-button
                  >
                  <el-button
                    type="text"
                    @click="handleEnquiryDifficultDotMoveClick(scope)"
                    >确认</el-button
                  >
                </div> -->
                <!-- reference 插槽的写法 -->
                <template #reference>
                  <el-button type="text" class="ml10">保留</el-button>
                </template>
              </el-popover>
              <el-button
                type="text"
                v-if="
                  setAuth('inquiry:accept') &&
                  [1, 4, 7, 8, 9].indexOf(scope.row.status) !== -1
                "
                @click="copy(scope)"
                :style="
                  scope.row.youxianLevel === 2
                    ? { fontWeight: 'bold', color: '#ec0000' }
                    : ''
                "
                >{{
                  scope.row.youxianLevel === 2
                    ? "先发复制"
                    : scope.row.youxianLevel === 1
                    ? "后发复制"
                    : "复制"
                }}</el-button
              >
              <el-popover
                v-if="
                  ['0', '1', '4'].indexOf(scope.row.status.toString()) !== -1 &&
                  setAuth('inquiry:cancel')
                "
                placement="bottom-end"
                :ref="`popover-cancel-${scope.$index}`"
              >
                <p>
                  确认要<span class="color-red">撤销</span>“<span
                    class="color-main"
                    >{{ scope.row.tradeNum }}</span
                  >”{{ scope.row.tscode }}？
                </p>
                <!-- <div style="text-align: right">
                  <el-button
                    type="text"
                    @click="
                      handlePopoverClose(
                        scope,
                        `popover-cancel-${scope.$index}`
                      )
                    "
                    >取消</el-button
                  >
                  <el-button
                    type="text"
                    @click="handleInquiryCancelClick(scope)"
                    >确认</el-button
                  >
                </div> -->
                <!-- reference 插槽的写法 -->
                <template #reference>
                  <el-button type="text" class="ml10">撤单</el-button>
                </template>
              </el-popover>
              <el-popover
                v-if="
                  ['7'].indexOf(scope.row.status.toString()) !== -1 &&
                  setAuth('inquiry:agreecancel')
                "
                placement="bottom-end"
                :ref="`popover-agreecancel-${scope.$index}`"
              >
                <p>
                  确认要<span class="color-red">同意撤销</span>“<span
                    class="color-main"
                    >{{ scope.row.tradeNum }}</span
                  >”{{ scope.row.tscode }}？
                </p>
                <!-- <div style="text-align: right">
                  <el-button
                    type="text"
                    @click="
                      handlePopoverClose(
                        scope,
                        `popover-agreecancel-${scope.$index}`
                      )
                    "
                    >取消</el-button
                  >
                  <el-button
                    type="text"
                    @click="handleInquiryCancelConfirmClick(scope)"
                    >确认</el-button
                  >
                </div> -->
                <!-- reference 插槽的写法 -->
                <template #reference>
                  <el-button type="text" class="ml10">同意撤单</el-button>
                </template>
              </el-popover>
              <el-popover
                v-if="
                  ['7'].indexOf(scope.row.status.toString()) !== -1 &&
                  setAuth('inquiry:rejectioncancel')
                "
                placement="bottom-end"
                :ref="`popover-rejectioncancel-${scope.$index}`"
              >
                <p>
                  确认要<span class="color-red">拒绝撤销</span>“<span
                    class="color-main"
                    >{{ scope.row.tradeNum }}</span
                  >”{{ scope.row.tscode }}？
                </p>
                <!-- <div style="text-align: right">
                  <el-button
                    type="text"
                    @click="
                      handlePopoverClose(
                        scope,
                        `popover-rejectioncancel-${scope.$index}`
                      )
                    "
                    >取消</el-button
                  >
                  <el-button
                    type="text"
                    @click="handleInquiryCancelRejectionClick(scope)"
                    >确认</el-button
                  >
                </div> -->
                <!-- reference 插槽的写法 -->
                <template #reference>
                  <el-button type="text" class="ml10">拒绝撤单</el-button>
                </template>
              </el-popover>
              <el-popover
                v-if="
                  ['9'].indexOf(scope.row.status.toString()) !== -1 &&
                  setAuth('inquiry:agreedeal')
                "
                placement="bottom-end"
                :ref="`popover-agreedeal-${scope.$index}`"
              >
                <p>
                  确认要<span class="color-red">同意成交</span>“<span
                    class="color-main"
                    >{{ scope.row.tradeNum }}</span
                  >”{{ scope.row.tscode }}？
                </p>
                <div style="text-align: right">
                  <el-button
                    type="text"
                    @click="
                      handlePopoverClose(
                        scope,
                        `popover-agreedeal-${scope.$index}`
                      )
                    "
                    >取消</el-button
                  >
                  <el-button
                    type="text"
                    @click="handleInquiryDealConfirmClick(scope)"
                    >确认</el-button
                  >
                </div>
                <!-- reference 插槽的写法 -->
                <template #reference>
                  <el-button type="text" class="ml10">同意成交</el-button>
                </template>
              </el-popover>
              <el-popover
                v-if="
                  ['9'].indexOf(scope.row.status.toString()) !== -1 &&
                  setAuth('inquiry:rejectiondeal')
                "
                placement="bottom-end"
                :ref="`popover-rejectiondeal-${scope.$index}`"
              >
                <p>
                  确认要<span class="color-red">拒绝成交</span>“<span
                    class="color-main"
                    >{{ scope.row.tradeNum }}</span
                  >”{{ scope.row.tscode }}？
                </p>
                <!-- <div style="text-align: right">
                  <el-button
                    type="text"
                    @click="
                      handlePopoverClose(
                        scope,
                        `popover-rejectiondeal-${scope.$index}`
                      )
                    "
                    >取消</el-button
                  >
                  <el-button
                    type="text"
                    @click="handleInquiryDealRejectionClick(scope)"
                    >确认</el-button
                  >
                </div> -->
                <!-- reference 插槽的写法 -->
                <template #reference>
                  <el-button type="text" class="ml10">拒绝成交</el-button>
                </template>
              </el-popover>
              <el-popover
                v-if="
                  setAuth('inquiry:breaktobeconfirm') && scope.row.status === 20
                "
                placement="bottom-end"
                :ref="`popover-breaktobeconfirm-${scope.$index}`"
              >
                <p>
                  确认要<span class="color-red">同意违约续作</span>“<span
                    class="color-main"
                    >{{ scope.row.tradeNum }}</span
                  >”{{ scope.row.tscode }}？
                </p>
                <el-table
                  border
                  :data="state.diffTableData"
                  :cell-style="state.cellStyleUpdate"
                >
                  <template v-for="itemHead in state.diffTableHead">
                    <el-table-column
                      v-if="itemHead.show"
                      :key="itemHead.label"
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
                    >
                    </el-table-column>
                  </template>
                </el-table>
                <!-- <div style="text-align: center" class="mt20">
                  <el-button
                    type="primary"
                    @click="handleAgreeBreakContinueClick(scope)"
                    >同意</el-button
                  >
                  <el-button
                    type="default"
                    @click="handleRejectBreakContinueClick(scope)"
                    >拒绝</el-button
                  >
                </div> -->
                <!-- <el-button
                  type="text"
                  v-slot="reference"
                  class="ml10"
                  @click="handlViewBreakContinueContent(scope)"
                  >违约续作审核</el-button
                > -->
              </el-popover>
              <!-- <el-popover
                v-if="setAuth('inquiry:agreeedit') && scope.row.status === 23"
                placement="bottom-end"
                :ref="`popover-agreeedit-${scope.$index}`"
              >
                <p>
                  确认要<span class="color-red">同意修改</span>“<span
                    class="color-main"
                    >{{ scope.row.tradeNum }}</span
                  >”{{ scope.row.tscode }}？
                </p>
                <el-table
                  border
                  :data="state.diffTableData"
                  :cell-style="state.cellStyleUpdate"
                >
                  <template v-for="itemHead in state.diffTableHead">
                    <el-table-column
                      v-if="itemHead.show"
                      :key="itemHead.label"
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
                    >
                    </el-table-column>
                  </template>
                </el-table>
                <div style="text-align: center" class="mt20">
                  <el-button type="primary" @click="handleAgreeEditClick(scope)"
                    >同意</el-button
                  >
                  <el-button
                    type="default"
                    @click="handleRejectEditClick(scope)"
                    >拒绝</el-button
                  >
                </div>
                <el-button
                  type="text"
                  v-v-slot="reference"
                  class="ml10"
                  @click="handlViewEditContent(scope)"
                  >修改审核</el-button
                >
              </el-popover> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, onMounted, ref } from "vue";
import copy from "clipboard-copy";
import { useStore } from "vuex";
import api from "../../api/Trade";
import apiAdmin from "../../api/Power_Admin";
import apiBreak from "../../api/Break";
import DeliveryCalendarUpdate from "../../components/DeliveryCalendarUpdate.vue";
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
import { ElMessage } from "element-plus";

// 修改后的 setAuth 方法,将方法从pagemixins提取出来
const setAuth = (permis: string) => {
  // 确保 userInfo 存在并且权限信息有效
  const permissions = userInfo.value?.permissions || [];

  // 进行权限检查
  const result =
    permissions[0] === "*:*:*" || permissions.indexOf(permis) !== -1;

  // 如果需要调试权限信息，打印日志
  if (permis === "inquiry:edit") {
    console.log("Checking permission for 'inquiry:edit'");
    console.log("User permissions:", permissions);
    console.log(`Permission check for '${permis}': ${result}`);
  }

  return result;
};

// 获取 Vuex store 实例
const store = useStore();
// 直接使用 Mixin
const mixin = pageMixin;

// 将 mixin 中的 data 转换成响应式对象
const pageData = reactive(pageMixin.data());
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
  // 调用你需要的生命周期钩子
  pageMixin.created?.();
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

const handleCopy = (row) => {
  console.log("复制询价单");
  console.log(row);
  ElMessage("复制询价单" + JSON.stringify(row));
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

// 处理按键
// 提交撤单申请
const handleInquiryCancelClick = debounce(function (scope) {
  api.inquiryCancel({ usertradeId: scope.row.userTradeId }).then((response) => {
    if (response && response.code === "00000") {
      this.$message({
        message: `${response.message}`,
        type: "success",
      });
      this.handlePopoverClose(scope, `popover-cancel-${scope.$index}`);
      this.loadInitData();
    }
  });
});
// 确认撤单
const handleInquiryCancelConfirmClick = debounce(function (scope) {
  const self = this;
  api
    .inquiryCancelConfirm({ usertradeId: scope.row.userTradeId })
    .then((response) => {
      if (response && response.code === "00000") {
        self.$message({
          message: "已撤单",
          type: "success",
        });
        this.handlePopoverClose(scope, `popover-agreecancel-${scope.$index}`);
        self.loadInitData();
      }
    });
});
// 拒绝撤单
const handleInquiryCancelRejectionClick = debounce(function (scope) {
  const self = this;
  api
    .inquiryCancelRejection({ usertradeId: scope.row.userTradeId })
    .then((response) => {
      if (response && response.code === "00000") {
        self.$message({
          message: "已拒绝",
          type: "success",
        });
        this.handlePopoverClose(
          scope,
          `popover-rejectioncancel-${scope.$index}`
        );
        self.loadInitData();
      }
    });
});
// 同意成交
const handleInquiryDealConfirmClick = function (scope) {
  const self = this;
  api
    .inquiryDealConfirm({ userTradeId: scope.row.userTradeId })
    .then((response) => {
      if (response && response.code === "00000") {
        this.$message({
          message: "已成交",
          type: "success",
        });
        this.handlePopoverClose(scope, `popover-agreedeal-${scope.$index}`);
        self.loadInitData();
      }
    });
};
// 拒绝成交
const handleInquiryDealRejectionClick = debounce(function (scope) {
  const self = this;
  api
    .inquiryDealRejection({ userTradeId: scope.row.userTradeId })
    .then((response) => {
      if (response && response.code === "00000") {
        this.$message({
          message: "已拒绝",
          type: "success",
        });
        this.handlePopoverClose(scope, `popover-rejectiondeal-${scope.$index}`);
        self.loadInitData();
      }
    });
});
// 难成撤单
const handleEnquiryDifficultCanncelClick = debounce(function (scope) {
  const self = this;
  api
    .difficultAcheveCannel({ userTradeId: scope.row.userTradeId })
    .then((response) => {
      if (response && response.code === "00000") {
        this.$message({
          message: "难成已撤单",
          type: "warning",
        });
        this.handlePopoverClose(
          scope,
          `popover-difficultcanncel-${scope.$index}`
        );
        self.loadInitData();
      }
    });
});
// 保留
const handleEnquiryDifficultDotMoveClick = debounce(function (scope) {
  const self = this;
  api.difficultStay({ userTradeId: scope.row.userTradeId }).then((response) => {
    if (response && response.code === "00000") {
      this.$message({
        message: "难成已保留",
        type: "warning",
      });
      this.handlePopoverClose(scope, `popover-notmove-${scope.$index}`);
      self.loadInitData();
    }
  });
});

// 添加
function handleAddInquiry() {
  state.currentDifficultData.value = {}; // 清空当前数据
  state.action.value = 1; // 设置为添加状态
  state.dialogEnquiryFormVisible.value = true; // 显示对话框
}

// 编辑
function handleEditEnqury(row: any) {
  state.currentDifficultData.value = JSON.parse(JSON.stringify(row)); // 深拷贝
  state.currentDifficultData.value.lockDirection = true; // 设置锁定方向
  state.action.value = 2; // 设置为编辑状态
  state.dialogEnquiryFormVisible.value = true; // 显示对话框
}

const handleAcceptClick = function (scope) {
  if (scope.row.relativeNum.indexOf("GD_") !== -1) {
    api
      .bondRollAccept({ relativeNum: scope.row.relativeNum })
      .then((response) => {
        if (response && response.code === "00000") {
          for (let i = 0; i < this.tableData.length; i++) {
            if (
              this.tableData[i].relativeNum === scope.row.relativeNum &&
              this.tableData[i].youxianLevel === 2
            ) {
              let myScope = { row: this.tableData[i] };
              this.copy(myScope);
              this.$message({
                message: "已接收并复制成功",
                type: "success",
              });
              break;
            }
          }
          this.loadInitData();
        } else {
          this.$message({
            message: response.message,
            type: "error",
          });
        }
      });
  } else {
    api
      .inquiryAccept({ usertradeId: scope.row.userTradeId })
      .then((response) => {
        if (response && response.code === "00000") {
          this.copy(scope);
          this.$message({
            message: "已接收并复制成功",
            type: "success",
          });
          this.loadInitData();
        } else {
          this.$message({
            message: response.message,
            type: "error",
          });
        }
      });
  }
}; // 设置延迟，调整延迟时间

// 拒收
// 拒收
const handleNotAcceptClick = function (scope) {
  if (scope.row.relativeNum.indexOf("GD_") !== -1) {
    api
      .bondRollReject({ relativeNum: scope.row.relativeNum })
      .then((response) => {
        if (response && response.code === "00000") {
          this.$message({
            message: "已拒收",
            type: "info",
          });
          this.handlePopoverClose(scope, `popover-notaccept-${scope.$index}`);
          this.loadInitData();
        } else {
          this.$message({
            message: response.message,
            type: "error",
          });
        }
      });
  } else {
    api
      .inquiryRejection({ usertradeId: scope.row.userTradeId })
      .then((response) => {
        if (response && response.code === "00000") {
          this.$message({
            message: "已拒收",
            type: "info",
          });
          this.handlePopoverClose(scope, `popover-notaccept-${scope.$index}`);
          this.loadInitData();
        } else {
          this.$message({
            message: response.message,
            type: "error",
          });
        }
      });
  }
};

const handlePopoverClose = (scope, ref) => {
  if (!scope._self.$refs[ref].doClose()) {
    document.body.click();
  }
};

// 点击成交
const handleDealClick = function (row) {
  Promise.all([(this.dialogDealFormVisible = true)]).then(() => {
    this.dealForm.deliveryTime = row.deliveryTime;
    this.$refs.deliveryCanlendar.deliveryTime = row.deliveryTime;
    if (
      moment(row.deliveryTime).format("YYYY-MM-DD") >
      moment(new Date()).format("YYYY-MM-DD")
    ) {
      row.deliveryTime = moment(row.deliveryTime).format("YYYY-MM-DD");
    } else if (
      moment(row.deliveryTime).format("YYYY-MM-DD") ===
        moment(new Date()).format("YYYY-MM-DD") &&
      moment(moment(new Date()).format("YYYY-MM-DD HH:mm:ss")).isBefore(
        moment(new Date()).format("YYYY-MM-DD 15:30:00")
      )
    ) {
      row.deliveryTime = moment(new Date()).format("YYYY-MM-DD");
    } else {
      this.$refs.deliveryCanlendar.getNextDealDay();
    }
    row.deliveryTime = moment(row.deliveryTime).format("YYYY-MM-DD");
    this.dealRows = row;
    this.dealForm.usertradeId = row.userTradeId;
    this.dealForm.price = row.price;
    this.dealForm.volume = row.restVolume;
    this.dealForm.remark = row.remark;
    this.dealForm.counterParty = row.counterParty;
    this.dealForm.contactPerson = row.contactPerson;
    this.dealForm.contactType = row.contactType;
  });
};

function handleDifficultNewEnqury(row) {
  const self = this;
  this.action = 1;
  api
    .difficultAcheveCannel({ userTradeId: row.userTradeId })
    .then((response) => {
      if (response && response.code === "00000") {
        // 锁住方向
        response.value.lockDirection = true;
        self.currentDifficultData = JSON.parse(JSON.stringify(response.value)); // 直接赋值
        self.dialogEnquiryFormVisible = true;
      } else {
        self.$message({
          message: `${response.message}`,
          type: "warning",
        });
      }
    });
}
// 难成点击事件
function handleEnquiryDifficultClick(row) {
  this.currentDifficultRow = JSON.parse(JSON.stringify(row)); // 直接赋值
  this.dialogEnquiryDifficultFormVisible = true; // 显示弹窗
}
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
