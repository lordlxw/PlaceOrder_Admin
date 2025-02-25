<!-- 用户汇总 -->
<template>
  <div class="content">
    <div
      class="list"
      v-if="pageOrder == 0"
      @dragover="dragOver"
      @drop="drop"
      v-loading="loading"
    >
      <div class="do mb10">
        <el-row>
          <el-col :span="12">
            <el-tag type="success" class="mr20"
              >已处理:
              <b>{{
                tableData.filter(
                  (n) => n.status === 2 && n.reviewedBy === userInfo.userId
                ).length
              }}</b></el-tag
            >
            <el-tag type="danger" class="mr20"
              >未处理:
              <b>{{
                tableData.filter((n) => n.status === 0).length
              }}</b></el-tag
            >
          </el-col>
          <el-col :span="12" class="text-right">
            <template>
              <el-tooltip :content="'只显示和我相关'" placement="top">
                <el-switch
                  v-model="showMyOrder"
                  active-color="#009688"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                >
                </el-switch>
              </el-tooltip>
            </template>
            <template>
              <el-date-picker
                class="ml20"
                v-model="orderDate"
                type="date"
                placeholder="选择日期"
                :clearable="false"
                value-format="yyyy-MM-dd"
                @change="loadInitData"
              >
              </el-date-picker>
            </template>
          </el-col>
        </el-row>
        <!-- <el-tag :type="rewardFloatProfit.toString().indexOf('-') !== -1
            ? 'danger'
            : 'success'
            " class="mr20" v-if="setAuth('reward:datatotal')">总盈亏：<b>{{ rewardFloatProfit }}</b></el-tag> -->
      </div>
      <el-table
        v-swipe-copy
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        :height="height - 55"
        :header-row-style="{ height: '30px', lineHeight: '30px' }"
        @cell-dblclick="handleCellDblClick"
        header-cell-class-name="list-row"
        :header-cell-style="{ background: '#f8f8f8' }"
        :key="Math.random()"
        :cell-style="cellStyleUpdate"
        :row-class-name="OrderTableRowClassName"
      >
        <template v-for="itemHead in tableHead">
          <el-table-column
            v-if="itemHead.show"
            :sortable="itemHead.sortable"
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
            :show-overflow-tooltip="itemHead.showOverflowTooltip ? true : false"
          >
          </el-table-column>
        </template>
        <el-table-column></el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          algin="center"
          width="200px"
        >
          <template v-slot="scope">
            <el-button
              type="text"
              v-if="
                setAuth('system:order:edit') &&
                [0].indexOf(scope.row.status) !== -1
              "
              @click="receiveOrder(scope.row, 1)"
              >接收</el-button
            >
            <el-button
              type="text"
              v-if="
                setAuth('system:order:edit') &&
                scope.row.reviewedBy === userInfo.userId &&
                [1].indexOf(scope.row.status) !== -1 &&
                scope.row.type !== 3
              "
              @click="goHandleOrder(scope.row)"
              >去处理</el-button
            >
            <el-button
              type="text"
              v-else-if="
                setAuth('system:order:edit') &&
                scope.row.reviewedBy === userInfo.userId &&
                [1].indexOf(scope.row.status) !== -1
              "
              @click="copyTextToClipboard(scope.row.remarks)"
              >复制</el-button
            >
            <el-button
              type="text"
              v-if="
                setAuth('system:order:edit') &&
                scope.row.reviewedBy === userInfo.userId &&
                [1].indexOf(scope.row.status) !== -1
              "
              @click="receiveOrder(scope.row, 2)"
              >处理完成</el-button
            >

            <el-popover
              v-if="
                setAuth('system:order:edit') &&
                scope.row.reviewedBy === userInfo.userId &&
                [1].indexOf(scope.row.status) !== -1
              "
              placement="bottom-end"
              :ref="`popover-rejectiondeal-${scope.$index}`"
            >
              <p>确认要取消处理吗？</p>
              <div style="text-align: right">
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
                <el-button type="text" @click="receiveOrder(scope.row, 3)"
                  >确认</el-button
                >
              </div>

              <template #reference>
                <el-button type="text">无法处理</el-button>
              </template>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="list" v-if="pageOrder == 1">
      <div class="do mb10">
        <el-row>
          <el-col :span="12">
            <el-tag type="success" class="mr20" @click="pageOrder = 0"
              ><i class="el-icon-back"></i
            ></el-tag>
            <el-tag type="success" class="mr20"
              >可能关联的{{ tableSwitch === 0 ? "询价单" : "成交单" }}</el-tag
            >
            <!-- <el-radio-group v-model="tableSwitch" size="mini">
                <el-radio-button :label="0">询价单</el-radio-button>
                <el-radio-button :label="1">成交单</el-radio-button>
              </el-radio-group> -->
          </el-col>
          <el-col :span="12" class="text-right">
            <template v-if="tableSwitch === 0">
              <el-select
                v-model="brokerItem"
                placeholder="请选择"
                @change="brokerChange()"
                multiple
                collapse-tags
              >
                <el-option
                  v-for="item in userInfo.brokers"
                  :key="item.brokerid"
                  :label="item.company"
                  :value="item.brokerid"
                >
                </el-option>
              </el-select>
            </template>
          </el-col>
        </el-row>
      </div>
      <div class="current_work mt10 mb10">
        <el-descriptions
          class="margin-top"
          title=""
          :column="4"
          size="small"
          border
        >
          <!-- <template slot="extra">
              <el-button type="primary" size="small">操作</el-button>
            </template> -->
          <el-descriptions-item :label="'工单类型'">
            {{
              config.funcKeyValue(currentOrder.type.toString(), "orderTypes")
            }}
          </el-descriptions-item>

          <el-descriptions-item :label="'异常中介'">
            {{
              currentOrder.brokerId
                ? userInfo.brokers.find(
                    (n) =>
                      n.brokerid === currentOrder.brokerId &&
                      n.channelId === currentOrder.channelId
                  ).company
                : "--"
            }}
          </el-descriptions-item>

          <el-descriptions-item :label="'申请人'">
            {{
              userSummary.length > 0
                ? userSummary.find((n) => n.userId === currentOrder.createBy)
                    .nickName
                : "--"
            }}
          </el-descriptions-item>

          <el-descriptions-item :label="'处理人'">
            {{
              userSummary.length > 0 && currentOrder.status != 0
                ? userSummary.find((n) => n.userId === currentOrder.reviewedBy)
                    .nickName
                : "--"
            }}
          </el-descriptions-item>

          <el-descriptions-item :label="'当前状态'">
            <el-tag size="small">
              {{
                config.funcKeyValue(
                  currentOrder.status.toString(),
                  "orderStatus"
                )
              }}
            </el-tag>
          </el-descriptions-item>

          <el-descriptions-item :label="'申请时间'">
            {{ currentOrder.createTime }}
          </el-descriptions-item>

          <el-descriptions-item
            v-if="currentOrder.messageId"
            :label="'聊天消息'"
          >
            <el-button
              type="primary"
              size="small"
              @click="
                handleCellDblClick(currentOrder, { property: 'messageId' })
              "
            >
              查看
            </el-button>
          </el-descriptions-item>

          <el-descriptions-item :label="'工单备注'">
            <el-tooltip
              class="item"
              effect="dark"
              :content="currentOrder.remarks"
              placement="top-start"
            >
              <div class="text-ellipsis">{{ currentOrder.remarks }}</div>
            </el-tooltip>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <el-table
        v-if="tableSwitch === 1"
        ref="noBondsTable"
        class="mb10"
        v-swipe-copy
        v-loading="loading"
        :data="noBondsData"
        tooltip-effect="dark"
        style="width: 100%"
        :height="250"
        row-key="rowId"
        header-cell-class-name="list-row"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :row-class-name="noBondsTableRowClassName"
        :cell-class-name="noBondsTableCellNoBondsClassName"
        :cell-style="noBondsCellStyle"
        :default-expand-all="defaultExpandAll"
        :header-row-style="{ height: '30px', lineHeight: '30px' }"
        :header-cell-style="{ background: '#f8f8f8' }"
        highlight-current-row
      >
        <!-- :default-sort="{ prop: 'createTime', order: 'descending' }" -->
        <el-table-column width="30"></el-table-column>
        <!-- <el-table-column v-if="setAuth('nobonds:break')" type="selection" align="center" width="40"></el-table-column> -->
        <template v-for="itemHead in noBondsTable">
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
              :label="itemHead.label"
              :width="itemHead.width ? itemHead.width : ''"
              :show-overflow-tooltip="
                itemHead.showOverflowTooltip ? true : false
              "
            >
            </el-table-column>
          </template>
        </template>
        <el-table-column></el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="150">
          <template v-slot="scope">
            <el-popover
              v-if="
                setAuth('system:order:edit') && scope.row.realTradeId === null
              "
              placement="bottom-end"
              :ref="`popover-qiangping-${scope.$index}`"
            >
              <p>确认要重新强平吗？</p>
              <div style="text-align: right">
                <el-button
                  type="text"
                  @click="
                    handlePopoverClose(
                      scope,
                      `popover-qiangping-${scope.$index}`
                    )
                  "
                  >取消</el-button
                >
                <el-button type="text" @click="qiangPing(scope)"
                  >确认</el-button
                >
              </div>
              <template #reference>
                <el-button type="text">重新强平</el-button>
              </template>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-swipe-copy
        v-loading="loading"
        :data="enquiryOrderData"
        tooltip-effect="dark"
        style="width: 100%"
        :height="tableSwitch === 0 ? height - 145 : height - 400"
        :header-row-style="{ height: '30px', lineHeight: '30px' }"
        header-cell-class-name="list-row"
        :header-cell-style="{ background: '#f8f8f8' }"
        :key="Math.random()"
        :cell-style="cellStyleUpdate"
        :row-class-name="tableRowClassName"
      >
        <template v-for="itemHead in enquiryOrder">
          <el-table-column
            v-if="itemHead.show"
            :sortable="itemHead.sortable"
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
            :show-overflow-tooltip="itemHead.showOverflowTooltip ? true : false"
          >
          </el-table-column>
        </template>
        <el-table-column></el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          algin="center"
          width="150px"
        >
          <template v-slot="scope">
            <el-button
              type="text"
              v-if="setAuth('system:order:edit')"
              @click="viewChat(scope.row)"
              >查看会话</el-button
            >
            <!-- && (!tradeIsLock || scope.row.lock) -->
            <el-button
              type="text"
              v-if="
                setAuth('system:order:edit') &&
                !currentOrder.tradeIds.includes(scope.row.userTradeId) &&
                tableSwitch === 0
              "
              @click="orderBind(scope.row)"
              >绑定工单</el-button
            >
            <el-button
              type="text"
              v-if="
                setAuth('system:order:edit') &&
                currentOrder.tradeIds.includes(scope.row.userTradeId) &&
                tableSwitch === 0
              "
              @click="orderEdit(scope.row)"
              >异常处理</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="订单异常处理"
      width="500px;"
      v-model="dialogOrderEdit.visible"
      append-to-body
      class="orderEditDialog"
      :before-close="dialogOrderEditClose"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <order-edit
        :currentRow="dialogOrderEdit.currentRow"
        @refreshData="inquiryQuery(currentOrder)"
        :userSummary="userSummary"
      ></order-edit>
    </el-dialog>
    <main-socket></main-socket>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import apiAdmin from "@/api/Power_Admin";
import api from "@/api/Trade";
import apiBonds from "@/api/Bonds";
import { pageMixin } from "@/utils/pageMixin";
import { commMixin } from "@/utils/commMixin";
import config from "@/utils/config";
import * as util from "@/utils/util";
import OrderEdit from "@/components/OrderEdit.vue";
import MainSocket from "@/components/SocketElectron.vue";
import moment from "moment";
export default {
  props: {
    height: Number,
    searchParam: Object,
  },
  mixins: [pageMixin, commMixin],
  components: {
    OrderEdit,
    MainSocket,
  },
  data() {
    return {
      config,
      loading: false,
      // 表头
      tableHead: [],
      noBondsTable: [],
      defaultExpandAll: true,
      enquiryOrder: [],
      tableData: [],
      noBondsData: [],
      enquiryOrderData: [],
      errorMsg: "",
      rewardBuyVolume: "",
      rewardSaleVolume: "",
      rewardFloatProfit: "",
      dialogOrderEdit: {
        visible: false,
        currentRow: {},
      },
      orderDate: "",
      showMyOrder: 1,
      currentOrder: null,
      userSummary: [],
      brokerItem: [],
      tradeIsLock: false,
      pageOrder: 0,
      tableSwitch: 1,
    };
  },
  watch: {
    showMyOrder: {
      immediate: true, // 将立即以表达式的当前值触发回调
      handler: function (val, oldVal) {
        this.tableData.forEach((n) => {
          if (
            this.showMyOrder === 1 &&
            n.reviewedBy !== this.userInfo.userId &&
            n.status !== 0
          ) {
            n.hidenRow = true;
          } else {
            n.hidenRow = false;
          }
        });
      },
      deep: true,
    },
    chatWorkOrder() {
      this.loadInitData();
    },
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo",
    }),
    ...mapState({
      chatWorkOrder: (state) => state.chatWorkOrder,
    }),
  },
  methods: {
    handleCellDblClick(row, column, cell, event) {
      if (column.property === "messageId" && row.brokerId && window.v1) {
        window.v1.hasWinsById("chat").then((bool) => {
          const message = { ...row, id: row.messageId };
          if (bool) {
            window.v1.focusByID("chat");
            window.v1.sendWinMsg({
              id: "chat",
              fun: "window-send",
              data: { message },
            });
          } else {
            window.v1.getAllDisplays().then((response) => {
              console.log(response);
              const maxWidth = Math.max(
                ...response.map((display) => display.bounds.width)
              );
              const maxHeight = Math.max(
                ...response.map((display) => display.bounds.height)
              );

              const minWidth =
                maxWidth / 2 - 10 <= 500 ? 500 : maxWidth / 2 - 300;
              const minHeight = maxHeight / 3 + 300;
              const args = {
                id: "chat",
                width: minWidth, // 窗口宽度
                height: minHeight, // 窗口高度
                minWidth: minWidth, // 窗口最小宽度
                minHeight: minHeight, // 窗口最小高度
                isMainWin: false,
                resize: false, // 是否支持缩放
                maximize: false, // 最大化窗口
                isMultiWin: false, // 是否支持多开窗口
                route: "/simulation/chat",
              };
              window.v1.createWin(args);
              setTimeout(() => {
                window.v1.sendWinMsg({
                  id: "chat",
                  fun: "window-send",
                  data: { message },
                });
              }, 1500);
            });
          }
        });
      }
    },
    copyTextToClipboard(text) {
      util.copyTextToClipboard(text);
      this.$message({
        type: "success",
        message: "复制成功!",
      });
    },
    tableRowClassName({ row, rowIndex }) {
      let tableFinishClassName = "list-row";
      if (row.hidenRow) {
        tableFinishClassName += " hiden-row";
      }
      if (
        (row.lock && this.currentOrder.tradeIds.includes(row.userTradeId)) ||
        (row.qiangpingId && row.status === 1 && this.tableSwitch === 1)
      ) {
        tableFinishClassName += " gd-red-row";
      } else if (row.solidProfit > 0 || row.handle) {
        tableFinishClassName += " gd-green-row";
      } else {
        tableFinishClassName += " even-row";
      }
      return tableFinishClassName;
    },
    OrderTableRowClassName({ row, rowIndex }) {
      let tableRowClassName = "list-row";
      if (row.hidenRow) {
        tableRowClassName += " hiden-row";
      }
      if (row.status === 0) {
        tableRowClassName += " gd-orange-row";
      }
      if (row.status === 2) {
        tableRowClassName += " gd-green-row";
      }
      return tableRowClassName;
    },
    noBondsTableRowClassName({ row, rowIndex }) {
      let tableRowClassName = "list-row";
      if (row.children) {
        if (
          moment(moment(row.deliveryTime).format("YYYY-MM-DD")).isBefore(
            moment(new Date()).format("YYYY-MM-DD")
          )
        ) {
          tableRowClassName += " history-row";
        } else if (
          moment(moment(row.deliveryTime).format("YYYY-MM-DD")).isSame(
            moment(new Date()).format("YYYY-MM-DD")
          )
        ) {
          tableRowClassName += " warning-row";
        } else {
          tableRowClassName += " success-row";
        }
      }

      return tableRowClassName;
    },
    noBondsCellStyle(row, column, rowIndex, columnIndex) {
      if (row.column.label === "方向") {
        switch (row.row.direction) {
          case "bond_1": // 卖出
            return "color:#e88585";
          case "bond_0": // 买入
            return "color:#00da3c";
        }
      }
    },
    noBondsTableCellNoBondsClassName(row) {
      // 交易号为null或者不是已交割状态不显示复选框
      if (row.row.realTradeId === null || row.row.jiaogeStatus !== 1) {
        return "myCell";
      }
    },
    viewChat(row) {
      if (window.v1) {
        window.v1.hasWinsById("chat").then((bool) => {
          if (bool) {
            window.v1.focusByID("chat");
            window.v1.sendWinMsg({
              id: "chat",
              fun: "window-send",
              data: { row },
            });
          } else {
            window.v1.getAllDisplays().then((response) => {
              console.log(response);
              const maxWidth = Math.max(
                ...response.map((display) => display.bounds.width)
              );
              const maxHeight = Math.max(
                ...response.map((display) => display.bounds.height)
              );

              const minWidth =
                maxWidth / 2 - 10 <= 500 ? 500 : maxWidth / 2 - 300;
              const minHeight = maxHeight / 3 + 300;
              const args = {
                id: "chat",
                width: minWidth, // 窗口宽度
                height: minHeight, // 窗口高度
                minWidth: minWidth, // 窗口最小宽度
                minHeight: minHeight, // 窗口最小高度
                isMainWin: false,
                resize: false, // 是否支持缩放
                maximize: false, // 最大化窗口
                isMultiWin: false, // 是否支持多开窗口
                route: "/simulation/chat",
              };
              window.v1.createWin(args);
              setTimeout(() => {
                window.v1.sendWinMsg({
                  id: "chat",
                  fun: "window-send",
                  data: { row },
                });
              }, 1500);
            });
          }
        });
      }
    },
    dialogOrderEditClose(done) {
      const { lock } = this.dialogOrderEdit.currentRow;
      lock ? this.$message.error("请解锁询价单后关闭！") : done();
    },
    orderEdit(row) {
      this.dialogOrderEdit.visible = true;
      this.dialogOrderEdit.currentRow = row;
    },
    orderBind(row) {
      let tradeIds = this.currentOrder.tradeIds;
      if (!tradeIds.includes(row.userTradeId)) {
        tradeIds = tradeIds
          ? tradeIds + "," + row.userTradeId
          : row.userTradeId;
        apiAdmin
          .saveAndUpdateWorkOrder({ id: this.currentOrder.id, tradeIds })
          .then(({ code }) => {
            if (code === "00000") {
              this.loadInitData();
            }
          });
      }
    },
    // 导出
    handleExport() {},
    // 获取用户模版id下设置的column
    dispatchUserColumn() {
      console.log("dispatchUserColumn ", config.transHistory);
      const headContent = config.workOrder;
      Object.entries(headContent).forEach(([key, value]) => {
        value.formatter = this.funcFormat;
        this.tableHead.push(value);
      });

      const enquiryOrder = config.enquiryOrderHead;
      Object.entries(enquiryOrder).forEach(([key, value]) => {
        value.formatter = this.funcFormatOrder;
        this.enquiryOrder.push(value);
      });
      // this.loadInitData();

      apiAdmin
        .getUserColumn({
          templateId: 2,
          userId: null,
        })
        .then((response) => {
          if (response && response.code === "00000") {
            const headContent = JSON.parse(response.value.headContent);
            for (let i = 0; i < headContent.length; i++) {
              if (config.bondsHead[headContent[i]]) {
                config.bondsHead[headContent[i]].formatter =
                  this.funcNoBondsFormat;
                this.noBondsTable.push(config.bondsHead[headContent[i]]);
              }
            }
          }
        });
    },
    getUserSummarys() {
      apiAdmin
        .getUserSummarys({
          userId: this.setAuth("system:alltrans:query")
            ? ""
            : this.userInfo.userId,
          roles: [],
        })
        .then((response) => {
          const { code, value } = response;
          if (code === "00000" && value) {
            this.userSummary = response.value.map((n) => {
              return { ...n, solidProfit: util.moneyFormat(n.solidProfit, 4) };
            });
          } else {
            this.tableData = [];
            this.$message({
              message: `${response.message}`,
              type: "warning",
            });
          }
        });
    },
    // 初始化数据
    loadInitData() {
      this.loading = true;
      const createTime = this.orderDate ? this.orderDate + " 00:00:00" : "";
      apiAdmin.findWorkOrder({ createTime }).then((response) => {
        const { code, value } = response;
        if (code === "00000" && value) {
          let data = [];
          let vals = value.map((n) => {
            if (
              this.showMyOrder === 1 &&
              n.reviewedBy !== this.userInfo.userId &&
              n.status !== 0
            ) {
              n.hidenRow = true;
            } else {
              n.hidenRow = false;
            }
            return { ...n };
          });
          vals.sort((a, b) => {
            const dateA = new Date(a.createTime);
            const dateB = new Date(b.createTime);
            return dateB - dateA;
          });
          data = [...data, ...vals];
          this.currentOrder = this.currentOrder
            ? data.find((n) => n.id === this.currentOrder.id)
            : null;
          this.tableData = data;
          this.inquiryQuery(this.currentOrder);
          this.noBondsQuery(this.currentOrder);
          this.$emit("init", value);
        } else {
          this.tableData = [];
          this.$message({
            message: `${response.message}`,
            type: "warning",
          });
        }
        this.loading = false;
      });
    },
    dragOver(event) {
      // 阻止浏览器默认操作，允许drop事件发生
      event.preventDefault();
    },
    drop(event) {
      // 阻止浏览器默认操作
      event.preventDefault();
      const data = event.dataTransfer.getData("text/plain");
      console.log(JSON.parse(data));
      const { id, brokerId, channelId } = JSON.parse(data);
      const param = {
        status: 1,
        messageId: id,
        remarks: "管理员认定对话消息异常！",
        type: 0,
        tradeIds: "",
        reviewedBy: this.userInfo.userId,
        weight: 100,
        brokerId,
        channelId,
      };
      api.chatWorkOrderSave(param);
    },
    // 更新记录表
    cellStyleUpdate(row, column, rowIndex, columnIndex) {
      if (
        row.column.label === "交割量" &&
        parseInt(row.row.volume) < row.row.chengjiaoAmount
      ) {
        return "color:red";
      }
      if (row.column.label === "方向") {
        switch (row.row.direction) {
          case "bond_1": // 卖出
            return "color:#e88585";
          case "bond_0": // 买入
            return "color:#00da3c";
        }
      }
    },
    funcNoBondsFormat(row, column) {
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
    // 数据格式化
    funcFormat(row, column) {
      switch (column.property) {
        case "status":
          return config.funcKeyValue(row.status.toString(), "orderStatus");
        case "price":
          return util.moneyFormat(row.price, 4);
        case "realPrice":
          return row.realPrice ? util.moneyFormat(row.realPrice, 4) : "--";
        case "broker":
          return row.brokerId
            ? this.userInfo.brokers.find(
                (n) =>
                  n.brokerid === row.brokerId && n.channelId === row.channelId
              ).company
            : "--";
        case "tscode":
          return row.tscode.replace(/.IB/, "");
        case "createBy":
          return this.userSummary.find((n) => n.userId === row.createBy)
            ? this.userSummary.find((n) => n.userId === row.createBy).nickName
            : "--";
        case "reviewedBy":
          return this.userSummary.find((n) => n.userId === row.reviewedBy)
            ? this.userSummary.find((n) => n.userId === row.reviewedBy).nickName
            : "--";
        case "messageId":
          return row.messageId || "--";
        case "tradeIds":
          return row.tradeIds || "--";
        case "type":
          return row.type !== undefined
            ? config.funcKeyValue(row.type.toString(), "orderTypes")
            : "--";
      }
      return row[column.property];
    },
    funcFormatOrder(row, column) {
      switch (column.property) {
        case "status":
          return config.funcKeyValue(row.status.toString(), "inquiryStatus");
        case "direction":
          return config.funcKeyValue(row.direction, "directionMeta");
        case "deliveryTime":
          return moment(row.deliveryTime).format("YYYY-MM-DD"); // + `（T+${row.deliverySpeed}）`
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
        case "createBy":
          return this.userSummary.lenght > 0 ? "---" : row.createBy;
        case "minProfitAlltime":
          return row.minProfitAlltime + "w";
      }
      return row[column.property];
    },
    qiangPing(scope) {
      let that = this;
      that.loading = true;
      const {
        deliverySpeed,
        deliveryTime,
        restVolume: volume,
        tscode,
        direction,
        children,
      } = scope.row;

      apiBonds
        .bondsCoverAgain({
          deliverySpeed: deliverySpeed.includes("+1") ? 1 : 0,
          deliveryTime,
          volume,
          tscode,
          direction,
          userId: children[0].yanjiuyuanId,
        })
        .then(({ code }) => {
          if (code === "00000") {
            // that.$refs["popover-qiangping-" + scope.$index].doClose();
            this.handlePopoverClose(scope, `popover-qiangping-${scope.$index}`);
            that.inquiryQuery(
              { createTime: new Date(), tradeIds: [] },
              this.currentOrder.createBy
            );
            that.$message({
              message: `强平发送成功!`,
              type: "success",
            });
            that.loading = false;
          } else {
            that.$message({
              message: `发起强平失败!`,
              type: "error",
            });
            that.loading = false;
          }
        });
    },
    async receiveOrder(row, status) {
      if (status === 2) {
        if (row.tradeIds) {
          if (row.type === 2) {
            const { rows } = await apiBonds.get({
              orderBy: "create_time",
              isAsc: false,
              userBy: row.createBy,
            });

            const bool = rows.some((n) => {
              return n.children.some((obj) =>
                row.tradeIds.includes(obj.realTradeId)
              );
            });
            if (bool) {
              this.$message({
                message: `当前工单还未处理完成，请检查平仓单是否完成!`,
                type: "error",
              });
              return;
            }
          } else {
            const hasLock =
              this.enquiryOrderData.filter(
                (n) => row.tradeIds.includes(n.userTradeId) && n.lock
              ).length > 0;
            if (hasLock) {
              this.$message({
                message: `当前工单还未处理完成，请检查是否解锁询价单!`,
                type: "error",
              });
              return;
            }
          }
        } else {
          this.$message({
            message: `无法处理订单未绑定的工单!`,
            type: "error",
          });
          return;
        }
      }
      this.enquiryOrderData = [];
      apiAdmin
        .saveAndUpdateWorkOrder({
          id: row.id,
          reviewedBy: this.userInfo.userId,
          status: status,
        })
        .then(({ code }) => {
          if (code === "00000") {
            // this.loadInitData()
          }
        });
    },
    brokerChange(tradeIds = "") {
      let list = this.enquiryOrderData;
      list.forEach((n) => {
        n.handle = this.currentOrder.tradeIds.includes(n.userTradeId)
          ? true
          : false;
        if (this.brokerItem.length > 0) {
          n.hidenRow = this.brokerItem.includes(n.brokerId) ? false : true;
        }
      });
      this.enquiryOrderData = [...list];
    },
    goHandleOrder(row) {
      this.currentOrder = row;
      if (row.type === 2) {
        this.tableSwitch = 1;
        this.noBondsQuery(row);
        this.inquiryQuery(
          { createTime: new Date(), tradeIds: [] },
          row.createBy
        );
      } else {
        this.tableSwitch = 0;
        this.inquiryQuery(row);
      }
      this.loading = true;
      setTimeout(() => {
        this.pageOrder = 1;
        this.loading = false;
      }, 500);
    },
    noBondsQuery(row) {
      // const param = row || { createTime: this.orderDate, tradeIds: [] };
      this.noBondsData = [];
      row &&
        apiBonds
          .get({
            orderBy: "create_time",
            isAsc: false,
            userBy: row.createBy,
          })
          .then((response) => {
            if (response && response.code === 200 && response.rows) {
              let rowId = 0;
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
                element.rowId = firstRowId;
                rows.push(element);
              });
              this.noBondsData = rows;
            } else {
              this.noBondsData = [];
            }
          });
    },
    inquiryQuery(row, userBy) {
      const param = row || { createTime: this.orderDate, tradeIds: [] };
      this.enquiryOrderData = [];
      const tradeDateStart = moment(param.createTime).format("YYYY-MM-DD"); // 创建一个新的日期对象，以免修改原始日期
      const tradeDateEnd = moment(param.createTime)
        .add(1, "days")
        .format("YYYY-MM-DD");
      api
        .inquiryQuery({
          tradeDateStart: tradeDateStart,
          tradeDateEnd: tradeDateEnd,
          userBy: userBy,
        })
        .then(({ code, rows }) => {
          // let list = rows.filter(n => n.createBy === this.currentOrder.createBy)
          let list = rows;
          if (this.tableSwitch === 1) {
            list = list.filter((n) => n.qiangpingId);
          }
          this.brokerItem = param.brokerId ? [param.brokerId] : [];
          this.tradeIsLock = false;
          list.forEach((n) => {
            n.handle = param.tradeIds.includes(n.userTradeId) ? true : false;
            if (this.brokerItem.length > 0) {
              n.hidenRow = this.brokerItem.includes(n.brokerId) ? false : true;
            }
            if (n.lock) {
              this.tradeIsLock = true;
            }
          });
          this.enquiryOrderData = [...list];
          if (this.dialogOrderEdit.currentRow) {
            this.dialogOrderEdit.currentRow = list.find(
              (n) =>
                n.userTradeId === this.dialogOrderEdit.currentRow.userTradeId
            );
          }
        });
    },
  },
  mounted() {
    this.orderDate = moment(new Date()).format("YYYY-MM-DD");
    this.getUserSummarys();
    this.dispatchUserColumn();
    this.loadInitData();
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/style.scss";

.orderEditDialog {
  >>> .el-dialog__body {
    max-height: 68vh;
    overflow-y: scroll;
  }
}

.content {
  height: 100%;

  // background-color: $body-main-box;

  .list {
    padding: 10px 10px 0px;

    .el-table {
      border-radius: 3px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    }

    .do {
      height: 50px;
      line-height: 50px;
      background-color: #fff;
      border-radius: 3px;
      padding: 0 10px;
      // margin-top: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

      .el-icon-back {
        font-size: 18px;
        vertical-align: middle;
        cursor: pointer;
      }
    }

    .current_work {
      .el-descriptions {
        border-radius: 3px;
        overflow: hidden;
      }
    }

    .table {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    }

    >>> .list-row {
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

  .list {
    .do {
      .el-button {
        margin-top: 10px;
      }
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
}

.el-table tbody tr:hover > td {
  background-color: unset !important; //修改成自己想要的颜色即可
}

.gd-green-row {
  .el-button--text {
    color: #fff;
  }
}

// .el-table--enable-row-hover .el-table__body tr:hover>td {
//   background-color: rgba(0, 0, 0, 0) !important;
// }
</style>
