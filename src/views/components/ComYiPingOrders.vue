<template>
  <div>
    <div class="do">
      <el-popover
        v-if="setAuth('bonds:break') && bondsIsSelection.length > 0"
        placement="bottom-start"
        ref="popover-deliveryback-bonds"
      >
        <p>
          单据号<span class="color-red">
            {{ bondsIsSelection[0].tradeNum }} </span
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
          <el-table-column
            v-if="doListOption && doListOption.length > 0"
            label="选择"
            width="300px"
          >
            <template>
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
          </el-table-column>
          <el-table-column label="违约方" width="150px">
            <template>
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
            <template>
              <el-input
                size="mini"
                v-model="scope.row.weiyueAmount"
                v-if="scope.row.mySelected && scope.row.mySelected.length > 0"
                width="90"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="做市商" width="150px">
            <template>
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
            @click="_self.$refs['popover-deliveryback-bonds'].doClose()"
            >取消</el-button
          >
          <el-button
            type="primary"
            @click="handleDeliveryBackClick(bondsIsSelection[0])"
            >确认</el-button
          >
        </div>
        <el-button
          type="default"
          class="mr10"
          size="mini"
          @click="handleLoadCurrentRow(bondsIsSelection[0])"
          >改违约</el-button
        >
      </el-popover>
      <el-button
        v-if="setAuth('bonds:allexport')"
        type="primary"
        size="mini"
        @click="handleAllExport"
        >全量导出</el-button
      >
      <el-button
        v-if="setAuth('bonds:addexport')"
        type="primary"
        size="mini"
        class="mr10"
        @click="handleAddExport"
        >增量导出</el-button
      >
      <el-tag
        :type="
          totalProfit.toString().indexOf('-') !== -1 ? 'danger' : 'success'
        "
        class="mr10"
        v-if="setAuth('reward:datatotal')"
        >已平盈亏：<b>{{ totalProfit }}</b></el-tag
      >
      <el-tag type="success" class="mr10"
        >买：<b>{{ buyVolumn }}</b></el-tag
      >
      <el-tag type="danger" class="mr10"
        >卖：<b>{{ saleVolumn }}</b></el-tag
      >
      <div
        style="float: right; margin-left: 20px; line-height: 30px"
        v-if="showLoginName"
      >
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{ userInfo ? userInfo.userName : "" }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div style="float: right" class="ml10">
        <el-checkbox-group
          v-model="checkboxGroup"
          size="small"
          @change="changeFinishParam"
        >
          <el-checkbox-button label="Front">前台</el-checkbox-button>
          <el-checkbox-button label="Middle">中台</el-checkbox-button>
          <el-checkbox-button label="BackEnd">后台</el-checkbox-button>
        </el-checkbox-group>
      </div>

      <div style="float: right">
        <el-button
          v-if="setAuth('bonds:delivery') && isShowDeliveryBtn"
          type="primary"
          size="mini"
          @click="handleDeliveryClick"
          >交割</el-button
        >
      </div>
    </div>
    <div class="table mt10">
      <el-table
        ref="bondsTable"
        v-swipe-copy
        v-loading="loading"
        header-cell-class-name="list-row"
        :data="tableDataFinish"
        tooltip-effect="dark"
        style="width: 100%"
        :height="height"
        row-key="rowId"
        :row-class-name="tableRowFinishClassName"
        :cell-class-name="tableCellBondsClassName"
        :cell-style="finishCellStyle"
        :span-method="objectSpanMethod"
        :header-row-style="{ height: '30px', lineHeight: '30px' }"
        :header-cell-style="{ background: '#f8f8f8' }"
        highlight-current-row
        @selection-change="handleBondsSelectionChange"
        @sort-change="handleSortChangeBonds"
        @row-click="handleRowClick"
      >
        <el-table-column
          v-if="setAuth('bonds:break')"
          type="selection"
          align="center"
          width="40"
        ></el-table-column>
        <template v-for="itemHead in tableHeadFinish">
          <el-table-column
            v-if="itemHead.show"
            :key="itemHead.prop"
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
            :label="itemHead.label"
            :width="itemHead.width ? itemHead.width : ''"
            :show-overflow-tooltip="itemHead.showOverflowTooltip ? true : false"
          >
          </el-table-column>
        </template>
        <el-table-column></el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="150">
          <template v-slot="scope">
            <el-button
              @click="handleBondsEditClick(scope.row)"
              type="text"
              size="small"
              v-if="
                setAuth('bonds:update') &&
                scope.row.status === 12 &&
                scope.row.jiaogeStatus === 0 &&
                funcIsBreak(scope)
              "
              class="ml10"
              >修改</el-button
            >
            <el-popover
              v-if="
                setAuth('bonds:updateconfirm') &&
                scope.row.realTradeId !== null &&
                scope.row.status === 16
              "
              placement="bottom-end"
              :ref="`popover-agreeupdatebonds-${scope.$index}`"
            >
              <template v-slot:reference>
                <el-button
                  type="text"
                  class="ml10"
                  @click="handlViewBondsUpdateContent(scope)"
                >
                  修改审核
                </el-button>
              </template>
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
                  @click="handleAgreeBondsUpdateClick(scope)"
                  >同意</el-button
                >
                <el-button
                  type="default"
                  @click="handleRejectBondsUpdateClick(scope)"
                  >拒绝</el-button
                >
              </div>
            </el-popover>

            <el-popover
              v-if="
                setAuth('bonds:saybreak') &&
                scope.row.realTradeId !== null &&
                [1, 6].indexOf(scope.row.jiaogeStatus) === -1 &&
                funcIsBreak(scope)
              "
              placement="bottom-end"
              :ref="`popover-bondssaybreak-${scope.$index}`"
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
                      `popover-bondssaybreak-${scope.$index}`
                    )
                  "
                  >取消</el-button
                >
                <el-button type="text" @click="handleBondsSayBreakClick(scope)"
                  >确认</el-button
                >
              </div>
              <template v-slot:reference>
                <el-button type="text" class="ml10"> 口头违约 </el-button>
              </template>
            </el-popover>
            <el-popover
              v-if="
                setAuth('bonds:saybreakok') &&
                scope.row.realTradeId !== null &&
                funcIsBreak(scope) &&
                [6].indexOf(scope.row.jiaogeStatus) !== -1
              "
              placement="bottom-end"
              :ref="`popover-bondssaybreakok-${scope.$index}`"
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
                      `popover-bondssaybreakok-${scope.$index}`
                    )
                  "
                  >取消</el-button
                >
                <el-button
                  type="text"
                  @click="handleBondsSayBreakOKClick(scope)"
                  >确认</el-button
                >
              </div>
              <template v-slot:reference>
                <el-button type="text" class="ml10"> 确认口违 </el-button>
              </template>
            </el-popover>
            <el-popover
              v-if="
                setAuth('bonds:saybreakrejection') &&
                scope.row.realTradeId !== null &&
                funcIsBreak(scope) &&
                [6].indexOf(scope.row.jiaogeStatus) !== -1
              "
              placement="bottom-end"
              :ref="`popover-bondssaybreakrejection-${scope.$index}`"
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
                      `popover-bondssaybreakrejection-${scope.$index}`
                    )
                  "
                  >取消</el-button
                >
                <el-button
                  type="text"
                  @click="handleBondsSayBreakRejectionClick(scope)"
                  >确认</el-button
                >
              </div>

              <template v-slot:reference>
                <el-button type="text" class="ml10"> 拒绝口违 </el-button>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <!-- <el-table-column
                fixed="right"
                align="center"
                label="交割操作"
                width="90"
                v-if="setAuth('bonds:delivery')"
              >
                <template slot-scope="scope">
                  <el-button type="text" @click="handleDeliveryClick(scope)"
                    >交割</el-button
                  >
                </template>
              </el-table-column> -->
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
      <bonds-cover
        :row="currentRow"
        @change="handleBondsCoverDialogVisible"
      ></bonds-cover>
    </el-dialog>
    <el-dialog
      title="已平仓修改申请"
      width="50%"
      v-model="dialogBondsFormVisible"
      append-to-body
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <bonds-edit
        :row="bondsRow"
        @change="handleBondsDialogVisible"
      ></bonds-edit>
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
    <el-dialog
      title="今天（交割确认）"
      width="80%"
      v-model="dialogBondsDeliveryFormVisible"
      append-to-body
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <bonds-delivery
        :deliveryFinishData="deliveryFinishData"
        @change="handleBondsDeliveryDialogVisible"
      ></bonds-delivery>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import api from "@/api/Bonds";
import apiLogin from "@/api/Login";
import apiBreak from "@/api/Reward";
import apiAdmin from "@/api/Power_Admin";
import apiBondPool from "@/api/Bond_Pool";
import { pageMixin } from "@/utils/pageMixin";
import { commMixin } from "@/utils/commMixin";
import BondsCover from "@/components/WeiPingOrdersCover.vue";

import NoBondsEdit from "@/components/WeiPingOrdersEdit.vue";
import BondsEdit from "@/components/YiPingOrdersEdit.vue";
import BondsRoll from "@/components/YiPingOrdersRoll.vue";
import BondsDelivery from "@/components/YiPingOrdersDelivery.vue";

import config from "@/utils/config";
import * as util from "@/utils/util";
import { debounce } from "@/utils/debounce";
import moment from "moment";
import { useStore } from "vuex";
let currentFinishCode = "";
let tableFinishClassName = "";
// 合并单元格
let finishCode = "";
let finishCodeSameCount = 0;

export default {
  name: "YiPingOrders", // 这里可以指定一个名称
  // 你可以在这里定义组件的属性、数据、方法等
  components: {
    BondsCover,
    NoBondsEdit,
    BondsEdit,
    BondsRoll,
    BondsDelivery,
  },
  computed: {
    ...mapState({
      enquiryInfo: (state) => state.enquiryInfo,
    }),
  },
  mixins: [commMixin, pageMixin],
  data() {
    return {
      userInfo: {},
      config,
      loading: false,
      // 表格行内样式
      rowClassNameList: ["warning-row"],
      // 表头
      tableHeadFinish: [],
      tableDataFinish: [],
      isShow: true,
      // 平仓弹框
      dialogBondsCoverFormVisible: false,
      currentRow: {},
      // 买
      businessInList: [],
      // 卖
      businessOutList: [],
      nobondsRow: [],
      // 已平仓编辑弹框
      dialogBondsFormVisible: false,
      bondsRow: [],
      nobondsH: "0",
      // 平开仓
      dialogBondsRollFormVisible: false,
      // 平Row
      overRow: {},
      // 开Row
      openRow: {},
      // 交割弹框
      dialogBondsDeliveryFormVisible: false,
      deliveryFinishData: [],
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
      checkboxGroup: ["Front"],
    };
  },
  created() {
    console.log("已平单Created");
  },
  mounted() {
    console.log("ComYiPingOrders---mounted");

    const store = useStore();

    // 使用 computed 获取 Vuex 中的状态或 getter
    this.userInfo = store.getters.getUserInfo;
    console.log("已平单输出userInfo", this.userInfo);
    this.dispatchUserBondedColumn();
    this.loadInitDataFinish();
  },
  methods: {
    handleRowClick(row, column, event) {
      console.log("已平Clicked row:", row);
      // 在这里执行你的逻辑
    },
    handleDoCheck(val) {
      this.errorMsg = "";
      if (val.length > 1) {
        val.shift();
      }
    },
    handleBondsSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.bondsTable.clearSelection();
        this.$refs.bondsTable.toggleRowSelection(val.pop());
      } else {
        this.bondsIsSelection = val;
      }
    },
    handleLoadCurrentRow(row) {
      row.mySelected = [];
      row.weiyuePerson = "";
      row.weiyueAmount = row.volume;
      row.marketMakerName = "";
      this.breakTableData = [JSON.parse(JSON.stringify(row))];
    },
    // 已平
    handleSortChangeBonds(sort) {
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
      this.loadInitDataFinish(sort);
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
    dispatchUserBondedColumn() {
      console.log("已平单获取列");
      apiAdmin
        .getUserColumn({
          templateId: 3,
          userId: null,
        })
        .then((response) => {
          if (response && response.code === "00000") {
            console.log("已平单列详情", response);
            const headContent = JSON.parse(response.value.headContent);
            for (let i = 0; i < headContent.length; i++) {
              if (config.bondsHead[headContent[i]]) {
                config.bondsHead[headContent[i]].formatter = this.funcFormat;
                this.tableHeadFinish.push(config.bondsHead[headContent[i]]);
              }
            }
          }
        });
    },
    changeFinishParam(e) {
      this.loadInitDataFinish();
    },
    // 初始化已平仓数据
    async loadInitDataFinish(sort) {
      try {
        console.log("初始化已平仓数据");
        this.loading = true;
        const response = await api.getFinish({
          deliveryDateEnd: null,
          deliveryDateStart: null,
          realTradeId: null,
          tradeNum: null,
          tscode: null,
          userName: null,
          userTradeId: null,
          orderBy: sort ? sort.field : "create_time",
          isAsc: sort ? sort.asc : false,
          hasFront: this.checkboxGroup.includes("Front"),
          hasMiddle: this.checkboxGroup.includes("Middle"),
          hasBackEnd: this.checkboxGroup.includes("BackEnd"),
        });

        if (response && response.code === 200 && response.rows) {
          // 获取表格第一行汇总的数据字段
          // let firstRow = {}
          let totalProfit = 0;
          let buyVolumn = 0;
          let saleVolumn = 0;
          response.rows.forEach((element) => {
            // if (index === 0) {
            //   firstRow = JSON.parse(JSON.stringify(element))
            //   Object.keys(firstRow).forEach(key => {
            //     firstRow[key] = ''
            //   })
            // }
            if (!isNaN(element.profit)) {
              totalProfit += element.profit;
            }
            if (element.direction === "bond_0" && !isNaN(element.volume)) {
              buyVolumn += Number(element.volume);
            }
            if (element.direction === "bond_1" && !isNaN(element.volume)) {
              saleVolumn += Number(element.volume);
            }
          });
          this.tableDataFinish = response.rows;
          this.totalCount = response.total;
          this.totalProfit = util.moneyFormat(totalProfit, 2);
          this.buyVolumn = buyVolumn;
          this.saleVolumn = saleVolumn;
          // firstRow["profit"] = util.moneyFormat(totalProfit, 2)
          // this.tableDataFinish.unshift(firstRow)
        } else {
          this.tableDataFinish = [];
          this.totalCount = 0;
        }
        this.loading = false;

        this.getIsShowDeliveryBtn();
      } catch (error) {
        console.error("加载已平仓数据失败:", error);
        this.loading = false;
        this.tableDataFinish = [];
        this.totalCount = 0;
      }
    },
    getIsShowDeliveryBtn() {
      api.deliveryBtnIsShow().then((response) => {
        this.isShowDeliveryBtn = !response.value;
      });
    },
    handlViewBondsUpdateContent: debounce(function (scope) {
      api
        .bondsUpdateContent({ realTradeId: scope.row.realTradeId })
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
                    newValue: moment(response.value.rt[fieldlist[i]]).format(
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
      this.dialogBondsCoverFormVisible = obj.dialogVisible;
    },
    // 滚单弹框回参接收
    handleBondsRollDialogVisible(obj) {
      this.dialogBondsRollFormVisible = obj.dialogVisible;
      this.loadInitData();
    },
    // 交割弹框回参接收
    handleBondsDeliveryDialogVisible(obj) {
      this.dialogBondsDeliveryFormVisible = obj.dialogVisible;
      this.loadInitDataFinish();
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
      if (row.children) {
        if (
          moment(moment(row.deliveryTime).format("YYYY-MM-DD")).isBefore(
            moment(new Date()).format("YYYY-MM-DD")
          )
        ) {
          return "history-row";
        } else if (
          moment(moment(row.deliveryTime).format("YYYY-MM-DD")).isSame(
            moment(new Date()).format("YYYY-MM-DD")
          )
        ) {
          return "warning-row";
        } else {
          return "success-row";
        }
      }
    },
    // 已平仓单元格样式
    tableCellBondsClassName(row) {
      if (row.row.realTradeId === null || row.row.jiaogeStatus !== 1) {
        return "myCell";
      }
    },
    // 已平仓行样式
    tableRowFinishClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        tableFinishClassName = "odd-row";
        currentFinishCode = row.finishCode;
      } else {
        if (currentFinishCode !== row.finishCode) {
          currentFinishCode = row.finishCode;
          if (tableFinishClassName === "even-row") {
            tableFinishClassName = "odd-row";
          } else {
            tableFinishClassName = "even-row";
          }
        }
      }
      return tableFinishClassName + " list-row";
    },
    // 盒子样式
    cellStyle(row, column, rowIndex, columnIndex) {
      if (row.column.label === "方向") {
        switch (row.row.direction) {
          case "bond_1": // 卖出
            return "color:#e88585";
          case "bond_0": // 买入
            return "color:#00da3c";
        }
      }
    },
    // 已平仓盒子样式
    finishCellStyle(row, column, rowIndex, columnIndex) {
      console.log("finishCellStyle");
      console.log(row);
      console.log(column);
      console.log(rowIndex);
      console.log(columnIndex);
      const style = {};

      if (
        moment(moment(row.row.deliveryTime).format("YYYY-MM-DD")).isBefore(
          moment(new Date()).format("YYYY-MM-DD")
        )
      ) {
        style.color = "#5d0b0b"; // 设置字体颜色
      }

      if (row.column.label === "方向") {
        switch (row.row.direction) {
          case "bond_1": // 卖出
            style.color = "#e88585"; // 设置卖出的字体颜色
            break;
          case "bond_0": // 买入
            style.color = "#00da3c"; // 设置买入的字体颜色
            break;
        }
      }

      return style; // 返回样式对象
    },
    // 更新记录表
    cellStyleUpdate(row, column, rowIndex, columnIndex) {
      console.log("cellStyleUpdate");
      console.log(row);
      console.log(column);
      console.log(rowIndex);
      console.log(columnIndex);
      const style = {};

      if (row.column.label === "旧值") {
        style.color = "#2cad98"; // 设置旧值列的字体颜色
      }
      if (row.column.label === "新值") {
        style.color = "#ec0000"; // 设置新值列的字体颜色
      }

      return style; // 返回样式对象
    },
    // 合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        // 解决重复渲染问题，清空之前的数据
        finishCode = "";
      }
      if (column.label === "交割操作") {
        // 1、根据当前finishCode查找个数作为合并行数
        finishCodeSameCount = 0;
        let flag = false;
        if (finishCode.toString() !== row.finishCode) {
          finishCode = row.finishCode;
          for (let i = 0; i < this.tableDataFinish.length; i++) {
            if (this.tableDataFinish[i].finishCode === row.finishCode) {
              finishCodeSameCount = finishCodeSameCount + 1;
              flag = true;
            } else {
              if (flag) {
                break;
              }
            }
          }
          return {
            rowspan: finishCodeSameCount,
            colspan: columnIndex,
          };
        } else {
          return {
            rowspan: 0,
            colspan: columnIndex,
          };
        }
      }
    },
    // 卖出，买入数据
    initBondsCoverBusinessList(params) {
      const self = this;
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
          self.dialogBondsCoverFormVisible = true;
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
    // 交割
    handleDeliveryClick: debounce(async function () {
      this.checkboxGroup = ["BackEnd"];
      await this.loadInitDataFinish();
      let deliveryFinishData = [];
      // 处理数据
      for (let i = 0; i < this.tableDataFinish.length; i++) {
        const row = JSON.parse(JSON.stringify(this.tableDataFinish[i]));
        // 违约量
        row.weiyueAmount = this.tableDataFinish[i].volume;
        // 做市商名称
        row.marketMakerName = "";
        // 违约方
        row.weiyuePerson = "";
        // 违约类型
        row.weiyueType = "";
        row.mySelected = [];
        deliveryFinishData.push(row);
      }
      this.deliveryFinishData = deliveryFinishData;
      this.dialogBondsDeliveryFormVisible = true;
    }),
    // 已平仓口头违约申请
    handleBondsSayBreakClick: debounce(function (scope) {
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
              `popover-bondssaybreak-${scope.$index}`
            );
            this.loadInitDataFinish();
          } else {
            this.$message({
              message: response.message,
              type: "error",
            });
          }
        });
    }),
    // 已平仓口头确认
    handleBondsSayBreakOKClick: debounce(function (scope) {
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
              `popover-bondssaybreakok-${scope.$index}`
            );
            this.loadInitDataFinish();
          } else {
            this.$message({
              message: response.message,
              type: "error",
            });
          }
        });
    }),
    // 已平仓口头拒绝
    handleBondsSayBreakRejectionClick: debounce(function (scope) {
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
              `popover-bondssaybreakrejection-${scope.$index}`
            );
            this.loadInitDataFinish();
          } else {
            this.$message({
              message: response.message,
              type: "error",
            });
          }
        });
    }),
    // 已平仓弹框变化
    handleBondsDialogVisible(obj) {
      this.dialogBondsFormVisible = obj.dialogVisible;
      this.loadInitDataFinish();
    },
    // 已平仓编辑弹框
    handleBondsEditClick(row) {
      Promise.all([(this.bondsRow = JSON.parse(JSON.stringify(row)))]).then(
        () => {
          this.dialogBondsFormVisible = true;
        }
      );
    },
    // 同意修改已平仓单
    handleAgreeBondsUpdateClick: debounce(function (scope) {
      api
        .dealBondsEditComfirm({ realTradeId: scope.row.realTradeId })
        .then((response) => {
          if (response && response.code === "00000") {
            this.$message({
              message: "已审核",
              type: "success",
            });
            this.handlePopoverClose(
              scope,
              `popover-agreeupdatebonds-${scope.$index}`
            );
            this.loadInitDataFinish();
          }
        });
    }),
    // 拒绝修改已平仓单
    handleRejectBondsUpdateClick: debounce(function (scope) {
      api
        .dealBondsEditRejection({ realTradeId: scope.row.realTradeId })
        .then((response) => {
          if (response && response.code === "00000") {
            this.$message({
              message: "已拒绝修改",
              type: "success",
            });
            this.handlePopoverClose(
              scope,
              `popover-agreeupdatebonds-${scope.$index}`
            );
            this.loadInitDataFinish();
          }
        });
    }),
    // 是否可违约,可以修改
    funcIsBreak(scope) {
      return moment(
        moment(scope.row.deliveryTime).format("YYYY-MM-DD")
      ).isSameOrAfter(moment(new Date()).format("YYYY-MM-DD"));
    },
    /* 下拉指令 */
    handleCommand(command) {
      switch (command) {
        case "logout":
          apiLogin.logout().then((response) => {
            if (response && response.code === 200) {
              Promise.all([
                this.$store.commit("SET_TOKEN", null),
                this.$store.commit("SET_USER_INFO", null),
              ]).then(() => {
                this.$router.push({ path: "/" });
              });
            } else {
              this.$message({
                message: "退出失败",
                type: "error",
              });
            }
          });
          break;
        case "updatePassword":
          this.dialogUpdatePasswordVisible = true;
          break;
      }
    },
  },
};
</script>

<style lang="scss" scope1d>
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
        // margin-top: 5px;
        height: 31px;
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
}

.el-dialog__body {
  padding: 10px;
}
</style>
<style>
/* thead .el-table-column--selection .cell {
  display: none !important;
} */

/* .myCell .el-checkbox__input {
  display: none !important;
} */
</style>
