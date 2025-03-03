<!-- 用户信息表格 -->

<!-- 用户汇总 -->

<template>
  <div class="content">
    <div class="list">
      <div class="table-container">
        <el-table
          :max-height="200"
          v-swipe-copy
          v-loading="loading"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :height="height"
          ref="multipleTable"
          :header-row-style="{ height: '30px', lineHeight: '30px' }"
          header-cell-class-name="list-row"
          :header-cell-style="{ background: '#f8f8f8' }"
          :key="Math.random()"
          :cell-style="cellStyleUpdate"
          :row-class-name="tableRowFinishClassName"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
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
              :show-overflow-tooltip="
                itemHead.showOverflowTooltip ? true : false
              "
            >
            </el-table-column>
          </template>
          <el-table-column></el-table-column>
          <el-table-column fixed="right" label="操作" width="80px">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import apiAdmin from "@/api/Power_Admin";
import { pageMixin } from "@/utils/pageMixin";
import { commMixin } from "@/utils/commMixin";
import config from "@/utils/config";
import * as util from "@/utils/util";
import moment from "moment";
let tableFinishClassName = "";
export default {
  props: {
    height: Number,
    searchParam: Object,
    showDo: true,
    tableSelection: 0,
  },
  mixins: [pageMixin, commMixin],
  data() {
    return {
      config,
      loading: false,
      // 表头
      tableHead: [],
      tableData: [],
      errorMsg: "",
      rewardBuyVolume: "",
      rewardSaleVolume: "",
      rewardFloatProfit: "",
      multipleSelection: [],

      initOnce: false, //只初始化的时候执行一次
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo",
    }),
  },

  watch: {
    "searchParam.date": {
      immediate: true, // 将立即以表达式的当前值触发回调
      handler: function (val, oldVal) {
        console.log("ComUserInfos watch调用了");
        this.loadInitData(this.searchParam);
      },
      deep: true,
    },
    "searchParam.userIds": {
      immediate: true, // 将立即以表达式的当前值触发回调
      handler: function (val, oldVal) {
        // this.multipleSelection = val;
      },
      deep: true,
    },
  },
  created() {
    console.log("ComUserInfos---Created");
    // 默认全选
    this.$nextTick(() => {
      this.$refs.multipleTable.toggleAllSelection();
    });
  },
  methods: {
    chooseAll() {
      console.log("执行全选");
      this.$refs.multipleTable.toggleAllSelection();
    },
    handleSelectionChange(val) {
      console.log("选中发生变化咯~");
      // 默认多选
      if (this.tableSelection === 0) {
        this.multipleSelection = val;
      } else {
        // 单选
        if (val.length === 1) {
          this.multipleSelection = val;
        }
        // 单选选中多条时，需要清空所选数据
        if (val.length > 1) {
          this.$refs.multipleTable.clearSelection(); // 清空选项
          this.$refs.multipleTable.toggleRowSelection(val.pop()); // 选中最后点击的数据
        }
        // 取消选中
        if (val.length === 0) {
          this.multipleSelection = [];
        }
      }
      console.log(this.multipleSelection);
      this.$emit("handleSelectionChange", this.multipleSelection);
    },
    // 已平仓行样式
    tableRowFinishClassName({ row, rowIndex }) {
      if (row.solidProfit < 0) {
        tableFinishClassName = "gd-red-row";
      } else {
        tableFinishClassName = "even-row";
      }
      return tableFinishClassName + " list-row";
    },
    // 导出
    handleExport() {},
    // 获取用户模版id下设置的column
    dispatchUserColumn() {
      console.log("dispatchUserColumn ", config.userSummaryHead);
      const headContent = config.userSummaryHead;
      Object.entries(headContent).forEach(([key, value]) => {
        value.formatter = this.funcFormat;
        this.tableHead.push(value);
      });
      // this.loadInitData();
    },
    // 初始化数据
    loadInitData(searchParam) {
      console.log("ComUserInfos---loadInitData", searchParam);
      if (!searchParam.date[0]) {
        return;
      }
      this.loading = true;
      apiAdmin
        .getUserSummarys({
          dateStart: this.searchParam.date[0],
          dateEnd: this.searchParam.date[1],
          userId: this.setAuth("system:alltrans:query")
            ? ""
            : this.userInfo.userId,
          roles: [3],
        })
        .then((response) => {
          const { code, value } = response;
          if (code === "00000" && value) {
            this.tableData = response.value.map((n) => {
              return { ...n, solidProfit: util.moneyFormat(n.solidProfit, 4) };
            });
            this.rewardFloatProfit =
              this.tableData.reduce((sum, item) => {
                return sum + parseFloat(item.solidProfit) * 10000;
              }, 0) / 10000;

            this.rewardBuyVolume = this.tableData.reduce((sum, item) => {
              return sum + item.limitBid;
            }, 0);

            this.rewardSaleVolume = this.tableData.reduce((sum, item) => {
              return sum + item.limitOffer;
            }, 0);

            this.$nextTick(() => {
              // this.multipleSelection = this.tableData.filter(n => searchParam.userIds.includes(n.userId));
              this.tableData
                .filter((n) => searchParam.userIds.includes(n.userId))
                .forEach((n) => {
                  this.$refs.multipleTable.toggleRowSelection(n, true);
                });
            });
            if (!this.initOnce) {
              console.log("initOnce");
              this.$nextTick(() => {
                // 执行全选
                this.chooseAll();
              });
            }

            console.log("multipleSelection", this.multipleSelection);
            this.$emit("init", this.tableData);
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
    // 更新记录表
    cellStyleUpdate(row, column, rowIndex, columnIndex) {
      if (
        row.column.label === "交割量" &&
        parseInt(row.row.volume) < row.row.chengjiaoAmount
      ) {
        return "color:orange";
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
    // 数据格式化
    funcFormat(row, column) {
      switch (column.property) {
        case "status":
          return config.funcKeyValue(row.status.toString(), "userStatus");
        case "delFlag":
          return config.funcKeyValue(row.status.toString(), "delStatus");
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
        case "minProfitDaily":
          return row.minProfitDaily + "w";
        case "minProfitAlltime":
          return row.minProfitAlltime + "w";
      }
      return row[column.property];
    },
  },
  mounted() {
    this.dispatchUserColumn();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/style.scss";

.content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.list {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  position: relative;
  padding: 10px 10px;
  height: calc(100vh - 120px);
  overflow-y: auto;

  .el-table {
    border-radius: 3px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    width: max-content;
    min-width: 100%;
  }

  .el-table__body-wrapper {
    overflow-x: auto !important;
  }

  /* 使用 sticky 保持横向滚动条始终可见 */
  .el-table__header-wrapper {
    position: sticky;
    top: 0; /* 设置为0可以固定在顶部 */
    z-index: 1; /* 确保它在其他内容之上 */
  }

  .do {
    height: 50px;
    line-height: 50px;
    background-color: #fff;
    border-radius: 3px;
    padding: 0 10px;
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
</style>
