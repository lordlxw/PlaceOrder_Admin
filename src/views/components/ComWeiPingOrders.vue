<template lang="">
  <div>
    <div class="do">
      <el-button
        v-if="['研究员', '交割员'].indexOf(this.userInfo.roleName) !== -1"
        size="mini"
        @click="handleDefaultExpandAll"
        >{{ defaultExpandAll ? "全收" : "全展" }}</el-button
      >
      <el-button
        v-if="setAuth('nobonds:allexport')"
        type="primary"
        size="mini"
        @click="handleNobondsAllExport"
        >全量导出</el-button
      >
      <el-popover
        v-if="setAuth('nobonds:break') && noBondsIsSelection.length > 0"
        placement="bottom-start"
        ref="popover-deliveryback"
      >
        <p>
          单据号<span class="color-red">
            {{ noBondsIsSelection[0].tradeNum }} </span
          >确认要<span class="color-red"> 改违约 </span>？
        </p>
        <el-table :data="breakTableData">
          <template v-for="itemHead in breakTableHead">
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
          <!-- <el-table-column
            v-show="false"
            v-if="doListOption && doListOption.length > 0"
            label="选择"
            width="300px"
          >
            <template v-slot:default="scope">
              <el-checkbox-group
                v-model="scope.row.mySelected"
                @input="handleDoCheck"
              >
                <el-checkbox
                  v-for="item in doListOption"
                  :label="item.value"
                  :key="item.value"
                  >{{ item.label }}</el-checkbox
                >
              </el-checkbox-group>
            </template>
          </el-table-column> -->
          <el-table-column label="违约方" width="150px">
            <template v-slot:default="scope">
              <el-select
                v-model="scope.row.weiyuePerson"
                v-if="scope.row.mySelected && scope.row.mySelected.length > 0"
                placeholder="请选择"
              >
                <el-option
                  v-for="(value, key) in config.breakTypeOptions"
                  :key="key"
                  :label="value"
                  :value="key"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="违约量" width="150px">
            <template v-slot:default="scope">
              <el-input
                size="mini"
                v-model="scope.row.weiyueAmount"
                v-if="scope.row.mySelected && scope.row.mySelected.length > 0"
                width="90"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="做市商" width="150px">
            <template v-slot:default="scope">
              <el-input
                size="mini"
                v-model="scope.row.marketMakerName"
                v-if="scope.row.mySelected && scope.row.mySelected.length > 0"
                width="90"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: right" class="mt20">
          <el-button
            type="primary"
            @click="_self.$refs['popover-deliveryback'].doClose()"
            >取消</el-button
          >
          <el-button
            type="primary"
            @click="handleDeliveryBackClick(noBondsIsSelection[0])"
            >确认</el-button
          >
        </div>
        <el-button
          type="default"
          v-slot="reference"
          class="ml10"
          size="mini"
          @click="handleLoadCurrentRow(noBondsIsSelection[0])"
          >改违约</el-button
        >
      </el-popover>
      <el-tag
        :type="
          totalFloatProfit.toString().indexOf('-') !== -1 ? 'danger' : 'success'
        "
        class="ml10"
        v-if="setAuth('reward:datatotal')"
        >浮动盈亏：<b>{{ totalFloatProfit }}</b></el-tag
      >
      <el-tag type="success" class="ml10"
        >买：<b>{{ noBondsBuyVolumn }}</b></el-tag
      >
      <el-tag type="danger" class="ml10"
        >卖：<b>{{ noBondsSaleVolumn }}</b></el-tag
      >
    </div>
    <div class="table mt10" ref="noBondsDo">
      <el-table
        v-if="isShow"
        ref="noBondsTable"
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        v-swipe-copy
        style="width: 100%"
        :height="height"
        row-key="rowId"
        header-cell-class-name="list-row"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :row-class-name="tableRowClassName"
        :cell-class-name="tableCellNoBondsClassName"
        :cell-style="cellStyle"
        :default-expand-all="defaultExpandAll"
        :header-cell-style="{ background: '#f8f8f8' }"
        highlight-current-row
        @selection-change="handleNoBondsSelectionChange"
        @sort-change="handleSortChangeNoBonds"
      >
        <el-table-column width="30"></el-table-column>
        <el-table-column
          v-if="setAuth('nobonds:break')"
          type="selection"
          align="center"
          width="10"
        ></el-table-column>
        <template v-for="itemHead in tableHead">
          <template v-if="itemHead.show">
            <el-table-column
              :key="itemHead.label"
              :align="itemHead.align"
              :prop="itemHead.prop"
              :sortable="
                [
                  'createTime',
                  'tscode',
                  'tradeNum',
                  'deliveryTime',
                  'updateTime',
                  'tradeTime',
                ].indexOf(itemHead.prop) !== -1
                  ? 'custom'
                  : false
              "
              :formatter="
                itemHead.formatter
                  ? itemHead.formatter
                  : (row, column, cellValue, index) => {
                      return cellValue;
                    }
              "
              :show-overflow-tooltip="
                itemHead.showOverflowTooltip ? true : false
              "
              :label="itemHead.label"
              :width="itemHead.width ? itemHead.width : ''"
            >
            </el-table-column>
          </template>
        </template>
        <el-table-column></el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="150">
          <template v-slot:default="scope">
            <el-button
              type="text"
              v-if="setAuth('bonds:cover') && scope.row.realTradeId === null"
              @click="handleBondsCover(scope.row)"
              >平仓</el-button
            >
            <el-button
              type="text"
              v-if="
                setAuth('nobonds:roll') &&
                scope.row.realTradeId === null &&
                scope.row.gunnable
              "
              @click="handleRoll(scope.row)"
              >滚单</el-button
            >
            <el-button
              @click="handleNoBondsEditClick(scope.row)"
              type="text"
              size="small"
              v-if="
                setAuth('nobonds:update') &&
                scope.row.realTradeId !== null &&
                scope.row.status === 11 &&
                funcIsBreak(scope)
              "
              >修改</el-button
            >

            <el-popover
              v-if="
                setAuth('nobonds:updateconfirm') &&
                scope.row.realTradeId !== null &&
                scope.row.status === 17
              "
              placement="bottom-end"
              :ref="`popover-agreeupdatenobonds-${scope.$index}`"
            >
              <p>
                确认要<span class="color-red">同意修改</span>“<span
                  class="color-main"
                  >{{ scope.row.tradeNum }}</span
                >”{{ scope.row.tscode }}？
              </p>
              <el-table :data="diffTableData" :cell-style="cellStyleUpdate">
                <template v-for="itemHead in diffTableHead">
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
                <el-button
                  type="primary"
                  @click="handleAgreeNoBondsUpdateClick(scope)"
                  >同意</el-button
                >
                <el-button
                  type="default"
                  @click="handleRejectNoBondsUpdateClick(scope)"
                  >拒绝</el-button
                >
              </div>
              <el-button
                type="text"
                v-v-slot="reference"
                class="ml10"
                @click="handlViewNobondsUpdateContent(scope)"
                >修改审核</el-button
              >
            </el-popover>
            <el-popover
              v-if="
                setAuth('nobonds:saybreak') &&
                scope.row.realTradeId !== null &&
                [1, 6].indexOf(scope.row.jiaogeStatus) === -1 &&
                funcIsBreak(scope)
              "
              placement="bottom-end"
              :ref="`popover-nobondssaybreak-${scope.$index}`"
            >
              <p>
                确认要<span class="color-red">口头违约</span>“<span
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
                      `popover-nobondssaybreak-${scope.$index}`
                    )
                  "
                  >取消</el-button
                >
                <el-button
                  type="text"
                  @click="handleNoBondsSayBreakClick(scope)"
                  >确认</el-button
                >
              </div>
              <el-button type="text" class="ml10">口头违约</el-button>
            </el-popover>
            <el-popover
              v-if="
                setAuth('nobonds:saybreakok') &&
                scope.row.realTradeId !== null &&
                [6].indexOf(scope.row.jiaogeStatus) !== -1 &&
                funcIsBreak(scope)
              "
              placement="bottom-end"
              :ref="`popover-nobondssaybreakok-${scope.$index}`"
            >
              <p>
                确认要<span class="color-red">同意口头违约</span>“<span
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
                      `popover-nobondssaybreakok-${scope.$index}`
                    )
                  "
                  >取消</el-button
                >
                <el-button
                  type="text"
                  @click="handleNoBondsSayBreakOKClick(scope)"
                  >确认</el-button
                >
              </div>
              <el-button type="text" class="ml10">确认口违</el-button>
            </el-popover>
            <el-popover
              v-if="
                setAuth('nobonds:saybreakrejection') &&
                scope.row.realTradeId !== null &&
                [6].indexOf(scope.row.jiaogeStatus) !== -1 &&
                funcIsBreak(scope)
              "
              placement="bottom-end"
              :ref="`popover-nobondssaybreakrejection-${scope.$index}`"
            >
              <p>
                确认要<span class="color-red">拒绝口头违约</span>“<span
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
                      `popover-nobondssaybreakrejection-${scope.$index}`
                    )
                  "
                  >取消</el-button
                >
                <el-button
                  type="text"
                  @click="handleNoBondsSayBreakRejectionClick(scope)"
                  >确认</el-button
                >
              </div>
              <el-button type="text" class="ml10">拒绝口违</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="平仓"
      width="500px;"
      v-model="dialogBondsCoverFormVisible"
      append-to-body
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <!-- 将 currentRow 作为 `row` 属性传递给子组件 BondsCover -->
      <!-- 监听子组件 BondsCover 发出的 `change` 事件，执行 `handleBondsCoverDialogVisible` 方法 -->
      <BondsCover
        :row="currentRow"
        @change="handleBondsCoverDialogVisible"
      ></BondsCover>
    </el-dialog>

    <el-dialog
      title="未平仓修改申请"
      width="500px;"
      v-model="dialogNoBondsFormVisible"
      append-to-body
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <no-bonds-edit
        :row="nobondsRow"
        @change="handleNoBondsDialogVisible"
      ></no-bonds-edit>
    </el-dialog>
    <el-dialog
      title="滚单"
      width="50%"
      v-model="dialogBondsRollFormVisible"
      append-to-body
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <bonds-roll
        :overRow="overRow"
        :openRow="openRow"
        @change="handleBondsRollDialogVisible"
      ></bonds-roll>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import api from "@/api/Bonds";
import apiBreak from "@/api/Reward"; // kk_reward
import apiAdmin from "@/api/Power_Admin"; // kk_power_admin
import apiBondPool from "@/api/Bond_Pool"; // kk_bond_pool
import { pageMixin } from "@/utils/pageMixin";
import { commMixin } from "@/utils/commMixin";
import BondsCover from "@/components/WeiPingOrdersCover.vue"; // BondsCover.vue
import NoBondsEdit from "@/components/WeiPingOrdersEdit.vue"; // NoBondsEdit
import BondsEdit from "@/components/YiPingOrdersEdit.vue"; // BondsEdit
import BondsRoll from "@/components/YiPingOrdersRoll.vue"; // BondsRoll
import BondsDelivery from "@/components/YiPingOrdersDelivery.vue"; // BondsDelivery
import config from "@/utils/config";
import * as util from "@/utils/util";
import { debounce } from "@/utils/debounce";
import moment from "moment";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
export default {
  name: "WeiPingOrders", // 这里可以指定一个名称
  props: ["height"],
  mixins: [commMixin, pageMixin],
  components: {
    BondsCover,
    NoBondsEdit,
    BondsEdit,
    BondsRoll,
    BondsDelivery,
  },
  data() {
    return {
      dialogVisible: false, // 默认显示弹窗
      // 平仓弹框
      dialogBondsCoverFormVisible: false,
      userInfo: {}, // userInfo暴露
      enquiryInfo: {}, // enquiryInfo暴露
      config,
      loading: false,
      // 表格行内样式
      rowClassNameList: ["warning-row"],
      // 表头
      tableHead: [],
      tableData: [],
      isShow: true,
      defaultExpandAll: true,

      currentRow: {},
      // 买
      businessInList: [],
      // 卖
      businessOutList: [],
      // 未平仓编辑弹框
      dialogNoBondsFormVisible: false,
      nobondsRow: [],
      bondsRow: [],
      nobondsH: "0",
      bondsH: "0",
      // 平开仓
      dialogBondsRollFormVisible: false,
      // 平Row
      overRow: {},
      // 开Row
      openRow: {},
      // 修改对比数据
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
      // 未平浮动盈亏
      totalFloatProfit: "",
      // 未平买卖
      noBondsBuyVolumn: "",
      noBondsSaleVolumn: "",
      // 已平盈亏
      totalProfit: "",
      // 已平买卖
      buyVolumn: "",
      saleVolumn: "",
      // 未平是否有选中
      noBondsIsSelection: [],
      // 已平
      bondsIsSelection: [],
      // 改违约表头
      breakTableHead: [
        {
          label: "券码",
          prop: "tscode",
          formatter: this.funcFormat,
          width: "120",
          align: "left",
          show: true,
        },
        {
          label: "方向",
          prop: "direction",
          formatter: this.funcFormat,
          width: "60",
          align: "left",
          show: true,
        },
        {
          label: "交割价",
          prop: "price",
          formatter: this.funcFormat,
          width: "120",
          align: "right",
          show: true,
        },
        {
          label: "交割量",
          prop: "volume",
          width: "100",
          align: "right",
          show: true,
        },
      ],
      breakTableData: [],
      doListOption: config.doBreakList,
      errorMsg: "",
      isShowDeliveryBtn: false,
    };
  },
  watch: {
    enquiryInfo() {
      this.loadInitData();
    },
    defaultExpandAll() {
      this.isShow = false;
      this.noBondsIsSelection = [];
      this.$nextTick(() => {
        this.isShow = true;
      });
    },
  },

  // 使用 computed 获取 Vuex 中的状态或 getter
  // computed: {
  //   ...mapGetters({
  //     userInfo: "getUserInfo",
  //   }),
  //   ...mapState({
  //     enquiryInfo: (state) => state.enquiryInfo,
  //   }),
  // },
  methods: {
    handleDoCheck(val) {
      this.errorMsg = "";
      if (val.length > 1) {
        val.shift();
      }
    },
    handleNoBondsSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.noBondsTable.clearSelection();
        this.$refs.noBondsTable.toggleRowSelection(val.pop());
      } else {
        this.noBondsIsSelection = val;
      }
    },
    handleLoadCurrentRow(row) {
      row.mySelected = [];
      row.weiyuePerson = "";
      row.weiyueAmount = row.volume;
      row.marketMakerName = "";
      this.breakTableData = [JSON.parse(JSON.stringify(row))];
    },
    // 未平
    handleSortChangeNoBonds(sort) {
      if (sort.prop === "createTime") {
        sort.field = "createTime";
      }
      if (sort.prop === "tscode") {
        sort.field = "tscode";
      }
      if (sort.prop === "deliveryTime") {
        sort.field = "deliveryTime";
      }
      if (sort.prop === "tradeNum") {
        sort.field = "tradeNum";
      }
      if (sort.prop === "updateTime") {
        sort.field = "updateTime";
      }
      if (sort.order === "ascending") {
        sort.asc = true;
      } else {
        sort.asc = false;
      }
      if (!sort.field) {
        sort.field = "createTime";
      }
      this.loadInitData(sort);
    },
    // 改违约
    handleDeliveryBackClick: debounce(function (row) {
      // const finishCodeList = [...new Set(this.breakTableData.map(item => item.finishCode))]
      const wyList = [];
      const len = this.breakTableData.length;
      let flag = false;
      for (let i = 0; i < len; i++) {
        if (this.breakTableData[i].mySelected.length > 0) {
          wyList.push({
            marketMakerName: this.breakTableData[i].marketMakerName,
            realTradeId: this.breakTableData[i].realTradeId,
            weiyueAmount: this.breakTableData[i].weiyueAmount
              ? parseInt(this.breakTableData[i].weiyueAmount)
              : "",
            weiyuePerson: this.breakTableData[i].weiyuePerson,
            weiyueType: this.breakTableData[i].mySelected[0],
          });
          if (!this.breakTableData[i].weiyuePerson) {
            this.errorMsg = "违约方必须选全";
            flag = true;
            break;
          }
          if (
            parseInt(this.breakTableData[i].weiyueAmount) >
            this.breakTableData[i].volume
          ) {
            this.errorMsg = "违约量不能超过持仓量";
            flag = true;
            break;
          }
          if (
            isNaN(this.breakTableData[i].weiyueAmount) ||
            Number(this.breakTableData[i].weiyueAmount) <= 0
          ) {
            this.errorMsg = "违约量必须大于0";
            flag = true;
            break;
          }
        } else {
          this.errorMsg = "请勾选违约类型";
          flag = true;
          break;
        }
      }
      if (!flag) {
        apiBreak
          .deliverBreak({
            marketMakerName: wyList[0].marketMakerName,
            realTradeId: wyList[0].realTradeId,
            weiyueAmount: wyList[0].weiyueAmount,
            weiyuePerson: wyList[0].weiyuePerson,
            weiyueType: wyList[0].weiyueType,
          })
          .then((response) => {
            if (response && response.code === "00000") {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this._self.$refs["popover-deliveryback"].doClose();
              this.loadInitData();
            } else {
              this.$message({
                message: `${response.message}`,
                type: "error",
              });
            }
          });
      } else {
        this.$message({
          message: `${this.errorMsg}`,
          type: "error",
        });
      }
    }),
    // 是否不能改违约
    funcIsBreakCanUpdate(row) {
      return !moment(moment(row.deliveryTime).format("YYYY-MM-DD")).isBefore(
        moment(new Date()).format("YYYY-MM-DD")
      );
    },
    // 搜索事件
    handleSearch() {
      this.loadInitData();
    },
    // 清除事件
    handleClearCondition() {
      Promise.all([]).then(() => {
        this.handleSearch();
      });
    },
    // 未平全量导出
    handleNobondsAllExport: debounce(function () {
      api.nobondsAllExport().then((response) => {
        var blob = new Blob([response], { type: `application/vnd.ms-excel` });
        var objectUrl = URL.createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.setAttribute("style", "display:none");
        a.setAttribute("href", objectUrl);
        var filename = `未平仓_全量_${moment().format(
          "YYYY-MM-DD HH:mm:ss"
        )}.xlsx`;
        a.setAttribute("download", filename);
        a.click();
        URL.revokeObjectURL(objectUrl);
      });
    }),
    // 全量导出
    handleAllExport: debounce(function () {
      api.bondsAllExport().then((response) => {
        var blob = new Blob([response], { type: `application/vnd.ms-excel` });
        var objectUrl = URL.createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.setAttribute("style", "display:none");
        a.setAttribute("href", objectUrl);
        var filename = `已平仓_全量_${moment().format(
          "YYYY-MM-DD HH:mm:ss"
        )}.xlsx`;
        a.setAttribute("download", filename);
        a.click();
        URL.revokeObjectURL(objectUrl);
      });
    }),
    // 增量导出
    handleAddExport: debounce(function () {
      api.bondsAddExport().then((response) => {
        var blob = new Blob([response], { type: `application/vnd.ms-excel` });
        var objectUrl = URL.createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.setAttribute("style", "display:none");
        a.setAttribute("href", objectUrl);
        var filename = `已平仓_增量_${moment().format(
          "YYYY-MM-DD HH:mm:ss"
        )}.xlsx`;
        a.setAttribute("download", filename);
        a.click();
        URL.revokeObjectURL(objectUrl);
      });
    }),
    // 获取用户模版id下设置的column
    dispatchUserColumn() {
      console.log("未平单---dispatchUserColumn");
      apiAdmin
        .getUserColumn({
          templateId: 2,
          userId: null,
        })
        .then((response) => {
          if (response && response.code === "00000") {
            console.log("dispatcherUserColumn---response", response);
            const headContent = JSON.parse(response.value.headContent);
            console.log("headContent", headContent);
            console.log("config", config);
            for (let i = 0; i < headContent.length; i++) {
              if (config.bondsHead[headContent[i]]) {
                config.bondsHead[headContent[i]].formatter = this.funcFormat;
                this.tableHead.push(config.bondsHead[headContent[i]]);
              }
            }
            console.log("未平单表头：", this.tableHead);
          }
        });
    },
    // 初始化数据（未平）
    loadInitData(sort) {
      console.log("未平单---loadInitData");
      console.log(this.currentRow.price); // 如果 this.currentRow 为 undefined，会抛出错误
      this.loading = true;
      api
        .get({
          deliveryDateEnd: null,
          deliveryDateStart: null,
          realTradeId: null,
          tradeNum: null,
          tscode: null,
          userName: null,
          userTradeId: null,
          orderBy: sort ? sort.field : "create_time",
          isAsc: sort ? sort.asc : false,
        })
        .then((response) => {
          console.log("loadInitData-响应", response);
          if (response && response.code === 200 && response.rows) {
            let rowId = 0;
            // 获取表格第一行汇总的数据字段
            // let firstRow = {}
            let totalFloatProfit = 0;
            let noBondsBuyVolumn = 0;
            let noBondsSaleVolumn = 0;
            const rows = [];
            response.rows.forEach((element) => {
              const firstRowId = ++rowId;
              if (element.children && element.children.length > 0) {
                const realTradeIdList = [];
                element.children.forEach((element) => {
                  rowId++;
                  realTradeIdList.push(element.realTradeId);
                  element.rowId = rowId;
                });
                rowId++;
                element.realTradeIdList = realTradeIdList;
                element.rowId = rowId;
              }
              if (!isNaN(element.floatProfit)) {
                totalFloatProfit += element.floatProfit;
              }

              if (!isNaN(element.volume) && element.direction === "bond_0") {
                noBondsBuyVolumn += Number(element.volume);
              }
              if (!isNaN(element.volume) && element.direction === "bond_1") {
                noBondsSaleVolumn += Number(element.volume);
              }
              element.rowId = firstRowId;
              rows.push(element);
            });
            this.tableData = rows;
            this.totalCount = response.total;
            this.totalFloatProfit = util.moneyFormat(totalFloatProfit, 2);
            this.noBondsBuyVolumn = noBondsBuyVolumn;
            this.noBondsSaleVolumn = noBondsSaleVolumn;
            // firstRow["floatProfit"] = util.moneyFormat(totalFloatProfit, 2)
            // this.tableData.unshift(firstRow)

            console.log("输出tableData", this.tableData);
          } else {
            this.tableData = [];
            this.totalCount = 0;
          }
          this.loading = false;
        })
        .catch((error) => {
          console.error("加载未平数据时发生错误:", error); // 捕获异常并打印到控制台
          this.loading = false;
          // 你也可以根据需求，显示一些错误提示
          ElMessage("加载数据失败，请稍后重试");
        });
    },
    handlViewNobondsUpdateContent: debounce(function (scope) {
      api
        .nobondsUpdateContent({ realTradeId: scope.row.realTradeId })
        .then((response) => {
          if (response && response.code === "00000" && response.value) {
            let diffTableData = [];
            if (
              response.value.compareResult.fieldlist &&
              response.value.compareResult.fieldlist.length > 0
            ) {
              let fieldlist = response.value.compareResult.fieldlist;
              for (let i = 0; i < fieldlist.length; i++) {
                if (fieldlist[i] === "deliveryTime") {
                  diffTableData.push({
                    fieldName: config.bondsHead[fieldlist[i]]["label"],
                    oldValue: moment(response.value.rt[fieldlist[i]]).format(
                      "YYYY-MM-DD"
                    ),
                    newValue: moment(response.value.dto[fieldlist[i]]).format(
                      "YYYY-MM-DD"
                    ),
                  });
                } else {
                  diffTableData.push({
                    fieldName: config.bondsHead[fieldlist[i]]["label"],
                    oldValue: response.value.rt[fieldlist[i]],
                    newValue: response.value.dto[fieldlist[i]],
                  });
                }
              }
            }
            this.diffTableData = diffTableData;
          }
        });
    }),
    // 平仓弹框
    handleBondsCover: debounce(function (row) {
      console.log("handleBondsCover");
      console.log("平仓弹框");
      console.log(row);
      Promise.all([(this.currentRow = JSON.parse(JSON.stringify(row)))]).then(
        () => {
          switch (row.direction) {
            case "bond_0":
              this.initBondsCoverBusinessList({
                tscode: row.tscode,
                bidtype: 0,
                deliveryTime2: row.deliveryTime,
              });
              break;
            case "bond_1":
              this.initBondsCoverBusinessList({
                tscode: row.tscode,
                bidtype: 1,
                deliveryTime2: row.deliveryTime,
              });
              break;
          }
        }
      );
    }),

    // 滚单弹框
    handleRoll(row) {
      Promise.all([
        (this.overRow = JSON.parse(JSON.stringify(row))),
        (this.openRow = JSON.parse(JSON.stringify(row))),
      ]).then(() => {
        this.initBondsRollBusinessList({
          tscode: row.tscode,
          bidtype: 0,
          direction: row.direction,
        });
        this.initBondsRollBusinessList({
          tscode: row.tscode,
          bidtype: 1,
          direction: row.direction,
        });
      });
    },
    // 平仓弹框回参接收
    handleBondsCoverDialogVisible(obj) {
      console.log("handleBondsCoverDialogVisible");
      this.dialogBondsCoverFormVisible = obj.dialogVisible;
    },
    // 滚单弹框回参接收
    handleBondsRollDialogVisible(obj) {
      console.log("handleBondsRollDialogVisible");
      console.log(obj);
      this.dialogBondsRollFormVisible = obj.dialogVisible;
      this.loadInitData();
    },
    // 数据格式化
    funcFormat(row, column) {
      switch (column.property) {
        case "status":
          return config.funcKeyValue(
            row.status ? row.status.toString() : "",
            "bondsCommonStatus"
          );
        case "direction":
          return config.funcKeyValue(row.direction, "directionMeta");
        case "deliveryTime":
          return row.deliveryTime
            ? moment(row.deliveryTime).format("YYYY-MM-DD")
            : ""; // + `（T+${row.deliverySpeed}）`
        case "realDeliveryTime":
          return row.realDeliveryTime
            ? moment(row.realDeliveryTime).format("YYYY-MM-DD")
            : "--";
        case "price":
          return row.price ? util.moneyFormat(row.price, 4) : "";
        case "realPrice":
          return row.realPrice ? util.moneyFormat(row.realPrice, 4) : "--";
        case "realVolume":
          return row.realVolume ? row.realVolume : "--";
        case "tscode":
          return row.tscode ? row.tscode.replace(/.IB/, "") : "";
        case "jiaogeStatus":
          return config.bondStatus[row.jiaogeStatus];
      }
      return row[column.property];
    },
    // 行样式
    tableRowClassName({ row, rowIndex }) {
      let tableFinishClassName = "list-row";
      if (row.children) {
        if (
          moment(moment(row.deliveryTime).format("YYYY-MM-DD")).isBefore(
            moment(new Date()).format("YYYY-MM-DD")
          )
        ) {
          tableFinishClassName += " history-row";
        } else if (
          moment(moment(row.deliveryTime).format("YYYY-MM-DD")).isSame(
            moment(new Date()).format("YYYY-MM-DD")
          )
        ) {
          tableFinishClassName += " warning-row";
        } else {
          tableFinishClassName += " success-row";
        }
      }
      return tableFinishClassName;
    },
    // 未平仓单元格样式
    tableCellNoBondsClassName(row) {
      // 交易号为null或者不是已交割状态不显示复选框
      if (row.row.realTradeId === null || row.row.jiaogeStatus !== 1) {
        return "myCell";
      }
    },
    // 盒子样式
    // cellStyle(row, column, rowIndex, columnIndex) {
    //   if (row.column.label === "方向") {
    //     switch (row.row.direction) {
    //       case "bond_1": // 卖出
    //         return "color:#e88585";
    //       case "bond_0": // 买入
    //         return "color:#00da3c";
    //     }
    //   }
    // },

    cellStyle(row, column, rowIndex, columnIndex) {
      if (row.column.label === "方向") {
        switch (row.row.direction) {
          case "bond_1": // 卖出
            return { color: "#e88585" }; // 返回样式对象
          case "bond_0": // 买入
            return { color: "#00da3c" }; // 返回样式对象
        }
      }
    },

    // 更新记录表
    cellStyleUpdate(row, column, rowIndex, columnIndex) {
      if (row.column.label === "旧值") {
        return "color:#2cad98";
      }
      if (row.column.label === "新值") {
        return "color:#ec0000";
      }
    },
    // 卖出，买入数据
    initBondsCoverBusinessList(params) {
      const self = this;
      console.log("initBondsCoverBusinessList");
      apiBondPool.businessList(params).then((res) => {
        if (res.code === "00000") {
          switch (params.bidtype) {
            case 1:
              self.businessOutList = res.value;
              self.currentRow.price = self.funcGetBestPrice("max", res.value);
              break;
            case 0:
              self.businessInList = res.value;
              self.currentRow.price = self.funcGetBestPrice("min", res.value);
              break;
          }
          this.dialogBondsCoverFormVisible = true;
          console.log("dialogBondsCoverFormVisible显示");
        }
      });
    },
    // 滚单卖出，买入数据
    initBondsRollBusinessList(params) {
      const self = this;
      apiBondPool.businessList(params).then((res) => {
        if (res.code === "00000") {
          switch (params.bidtype) {
            case 1:
              self.businessOutList = res.value;
              if (params.direction === "bond_1") {
                self.overRow.price = self.funcGetBestPrice("max", res.value);
                self.openRow.price = self.funcGetBestPrice("min", res.value);
              }
              break;
            case 0:
              self.businessInList = res.value;
              if (params.direction === "bond_0") {
                self.overRow.price = self.funcGetBestPrice("min", res.value);
                self.openRow.price = self.funcGetBestPrice("max", res.value);
              }
              break;
          }
          self.dialogBondsRollFormVisible = true;
        }
      });
    },
    // 买卖最优值(type:min最小，type:max最大;arr:初始数组;)
    funcGetBestPrice(type, arr) {
      switch (type) {
        case "min":
          let minVal = "";
          for (let i = 0; i < arr.length; i++) {
            if (i === 0) {
              minVal = arr[i].price;
            } else {
              if (arr[i].price < minVal) {
                minVal = arr[i].price;
              }
            }
          }
          return minVal;
        case "max":
          let maxVal = "";
          for (let i = 0; i < arr.length; i++) {
            if (i === 0) {
              maxVal = arr[i].price;
            } else {
              if (arr[i].price > maxVal) {
                maxVal = arr[i].price;
              }
            }
          }
          return maxVal;
      }
    },
    // 未平仓口头违约申请
    handleNoBondsSayBreakClick: debounce(function (scope) {
      api
        .bondsSayBreakApply({ realTradeId: scope.row.realTradeId })
        .then((response) => {
          if (response && response.code === "00000") {
            this.$message({
              message: "已提交口头违约申请",
              type: "success",
            });
            this.handlePopoverClose(
              scope,
              `popover-nobondssaybreak-${scope.$index}`
            );
            this.loadInitData();
          } else {
            this.$message({
              message: response.message,
              type: "error",
            });
          }
        });
    }),
    // 未平仓口头违约确认
    handleNoBondsSayBreakOKClick: debounce(function (scope) {
      api
        .bondsSayBreakConfirm({ realTradeId: scope.row.realTradeId })
        .then((response) => {
          if (response && response.code === "00000") {
            this.$message({
              message: "已确认口头违约",
              type: "success",
            });
            this.handlePopoverClose(
              scope,
              `popover-nobondssaybreakok-${scope.$index}`
            );
            this.loadInitData();
          } else {
            this.$message({
              message: response.message,
              type: "error",
            });
          }
        });
    }),
    // 未平仓口头违约拒绝
    handleNoBondsSayBreakRejectionClick: debounce(function (scope) {
      api
        .bondsSayBreakRejection({ realTradeId: scope.row.realTradeId })
        .then((response) => {
          if (response && response.code === "00000") {
            this.$message({
              message: "已拒绝口头违约",
              type: "success",
            });
            this.handlePopoverClose(
              scope,
              `popover-nobondssaybreakrejection-${scope.$index}`
            );
            this.loadInitData();
          } else {
            this.$message({
              message: response.message,
              type: "error",
            });
          }
        });
    }),
    // 未平仓弹框变化
    handleNoBondsDialogVisible(obj) {
      this.dialogNoBondsFormVisible = obj.dialogVisible;
      this.loadInitData();
    },
    // 未平仓编辑弹框
    handleNoBondsEditClick(row) {
      Promise.all([(this.nobondsRow = JSON.parse(JSON.stringify(row)))]).then(
        () => {
          this.dialogNoBondsFormVisible = true;
        }
      );
    },
    // 同意修改未平仓单
    handleAgreeNoBondsUpdateClick: debounce(function (scope) {
      api
        .dealNoBondsEditComfirm({ realTradeId: scope.row.realTradeId })
        .then((response) => {
          if (response && response.code === "00000") {
            this.$message({
              message: "已审核",
              type: "success",
            });
            this.handlePopoverClose(
              scope,
              `popover-agreeupdatenobonds-${scope.$index}`
            );
            this.loadInitData();
          }
        });
    }),
    // 拒绝修改未平仓单
    handleRejectNoBondsUpdateClick: debounce(function (scope) {
      api
        .dealNoBondsEditRejection({ realTradeId: scope.row.realTradeId })
        .then((response) => {
          if (response && response.code === "00000") {
            this.$message({
              message: "已拒绝修改",
              type: "success",
            });
            this.handlePopoverClose(
              scope,
              `popover-agreeupdatenobonds-${scope.$index}`
            );
            this.loadInitData();
          }
        });
    }),
    // 全展 ， 全收
    handleDefaultExpandAll: debounce(function () {
      this.defaultExpandAll = !this.defaultExpandAll;
    }),
    // 是否可违约,可以修改
    funcIsBreak(scope) {
      return moment(
        moment(scope.row.deliveryTime).format("YYYY-MM-DD")
      ).isSameOrAfter(moment(new Date()).format("YYYY-MM-DD"));
    },
  },
  mounted() {
    console.log("com未平mounted");
    console.log("222");
    const store = useStore();
    console.log("333");

    this.userInfo = store.getters.getUserInfo;
    console.log("userInfo", this.userInfo);
    this.enquiryInfo = store.state.enquiryInfo;
    this.dispatchUserColumn();
    this.loadInitData();
    // this.defaultExpandAll = config.externalRoleName.indexOf(this.userInfo.roleName) !== -1
  },
  // beforeCreate() {
  //   console.log("com未平beforeCreate");
  //   const store = useStore();
  //   this.userInfo = store.getters.getUserInfo;
  //   console.log("userInfo", this.userInfo);
  //   this.enquiryInfo = store.state.enquiryInfo;
  // },
  updated() {
    this.$nextTick(() => {
      if (this.$refs.noBondsTable) {
        this.$refs.noBondsTable.doLayout();
      }
    });
  },
};
</script>
<style lang="scss">
@import "@/assets/css/style.scss";

.content {
  .navigator {
    position: relative;
    background-color: #f8f8f8;
    padding: 0 15px;

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

  .list {
    padding: 0 15px;

    .do {
      height: 40px;
      line-height: 40px;

      .el-button {
        margin-top: 10px;
      }
    }
  }

  .table {
    //  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

    >>> .list-row {
      height: 40px;
      line-height: 40px;
      color: #000;
    }
  }

  .copy-tooltip {
    visibility: hidden;
  }

  .copy:hover {
    .copy-tooltip {
      visibility: hidden;
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
}
</style>
