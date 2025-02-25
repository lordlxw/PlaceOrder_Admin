<template>
  <div>
    <h1>已平修改</h1>
    <div class="steps custom-scrollbar" v-swipe-copy>
      <el-steps :active="tradeSteps.length" align-center :space="200">
        <el-step
          v-for="item in tradeSteps"
          :key="item.id"
          :title="`${item.operation}:${item.createBy}`"
          :description="item.createTime | dateFormat('YYYY-MM-DD HH:mm:ss')"
        >
          <template slot="title">
            <el-tooltip
              v-if="userSummary"
              class="item"
              effect="dark"
              :content="`${item.operation}:${
                item.createBy === 0
                  ? '系统'
                  : userSummary.find((n) => n.userId === item.createBy).nickName
              }`"
              placement="bottom-start"
            >
              <div>
                {{ item.operation }}:{{
                  item.createBy === 0
                    ? "系统"
                    : userSummary.find((n) => n.userId === item.createBy)
                        .nickName
                }}
              </div>
            </el-tooltip>
            <div
              v-else
              class="ellipsis"
              :v-tooltip="`${item.operation}:${item.createBy}`"
            >
              {{ item.operation }}
            </div>
          </template>
        </el-step>
        <!-- <el-step title="步骤2" description="这是一段很长很长很长的描述性文字"></el-step>
          <el-step title="步骤3" description="这是一段很长很长很长的描述性文字"></el-step>
          <el-step title="步骤4" description="这是一段很长很长很长的描述性文字"></el-step> -->
      </el-steps>
    </div>
    <div class="mt30 steps-desc">
      <el-descriptions
        title="订单信息"
        direction="vertical"
        size="medium"
        :column="5"
        border
      >
        <template slot="extra" v-if="setAuth('system:order:edit')">
          <div v-if="!currentRow.lock">
            <el-button type="primary" size="small" @click="lockUserTrade(0)"
              >锁定询价单</el-button
            >
          </div>
          <div v-else>
            <el-button type="primary" size="small" @click="lockUserTrade(1)"
              >解锁询价单</el-button
            >
            <!-- <el-button
                v-if="viewWork == 0 && currentRow.children && currentRow.children.length <= 0 && currentRow.status === 3"
                type="primary" @click="cancelRealTrade(currentRow.realTradeId)" size="small">成交单撤销</el-button>          -->
            <el-button
              v-if="viewWork == 0"
              type="primary"
              size="small"
              @click="hijackChat"
              >劫持通道</el-button
            >
            <el-button
              v-if="viewWork == 0"
              type="primary"
              size="small"
              @click="operateTrade"
              >操作询价单</el-button
            >
            <el-button
              v-if="viewWork == 1"
              type="primary"
              size="small"
              @click="handleInquiryDealConfirmClick"
              >同意修改</el-button
            >
            <el-button
              v-if="viewWork == 1"
              type="primary"
              size="small"
              @click="
                (viewWork = 0),
                  (dataForm.realTrades = []),
                  (dataForm.target = null)
              "
              >取消操作</el-button
            >
          </div>
        </template>
        <el-descriptions-item label="研究员">{{
          this.userSummary && this.userSummary.length > 0
            ? this.userSummary.find((n) => n.userId === currentRow.createBy)
                .nickName
            : "--"
        }}</el-descriptions-item>
        <el-descriptions-item label="券号">{{
          currentRow.tscode
        }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <template v-if="viewWork == 0">
            {{ funcFormat(currentRow.status.toString(), "inquiryStatus") }}
          </template>
          <template
            v-if="
              viewWork == 1 && [5, 4, 6, 3, 1, 23].includes(currentRow.status)
            "
          >
            {{ funcFormat(currentRow.status.toString(), "inquiryStatus") }}
            <i class="el-icon-d-arrow-right mr5"></i>
            <el-select
              v-model="dataForm.target"
              placeholder="请选择"
              class="ipt-el-select"
            >
              <el-option
                v-for="item in updateUserTrade"
                :key="item.value"
                v-if="item.handle.includes(currentRow.status)"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="中介">{{
          currentRow.target
        }}</el-descriptions-item>
        <el-descriptions-item label="主询价单">{{
          currentRow.sourceNum
        }}</el-descriptions-item>

        <el-descriptions-item label="方向">
          <el-tag size="small">{{
            currentRow.direction == "bond_0" ? "买入" : "卖出"
          }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="当前询价">
          <template v-if="viewWork == 0">
            {{ currentRow.price }}
          </template>
          <template v-if="viewWork == 1">
            <el-input-number
              class="ipt-volume"
              v-model="dataForm.price"
              :precision="4"
              :step="0.0005"
              placeholder="请输入价格"
              step-strictly
            ></el-input-number>
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="总询量">{{
          currentRow.volume
        }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{
          currentRow.createTime
        }}</el-descriptions-item>
        <el-descriptions-item v-if="viewWork == 0" label="剩余询量">
          <template>
            {{ currentRow.restVolume }}
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="期望成交量" v-if="viewWork == 1">
          <!-- <template v-if="turnoverInput">
              <el-input-number class="ipt-volume" v-model="dataForm.turnover" :step="1000" :min="0"
                :max="parseInt(currentRow.volume)" step-strictly></el-input-number>
            </template> -->
        </el-descriptions-item>
        <el-descriptions-item label="是否强平">
          <el-tag size="small">{{
            currentRow.qiangpingId ? "是" : "否"
          }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="交割速度" :span="4">{{
          currentRow.deliverySpeed
        }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions
        v-if="
          ![4, 6, 3].includes(dataForm.target) && currentRow.children.length > 0
        "
        v-for="(chid, index) in currentRow.children"
        :key="chid.id"
        direction="vertical"
        size="medium"
        :column="5"
        border
      >
        <el-descriptions-item :label="'子成交单' + index">{{
          chid.tradeNum
        }}</el-descriptions-item>
        <el-descriptions-item label="成交价">{{
          chid.realPrice
        }}</el-descriptions-item>
        <el-descriptions-item label="成交量">{{
          chid.volume
        }}</el-descriptions-item>
        <el-descriptions-item label="成交时间">{{
          chid.createTime
        }}</el-descriptions-item>
        <el-descriptions-item label="操作">
          <!-- <el-button v-if="viewWork == 1 && currentRow.lock" type="primary" size="small"
              @click="cancelRealTrade(chid.realTradeId)">成交单撤销</el-button> -->
        </el-descriptions-item>
      </el-descriptions>

      <el-descriptions
        v-if="
          [4, 6, 3].includes(dataForm.target) &&
          viewWork == 1 &&
          dataForm.realTrades.length > 0
        "
        v-for="(chid, index) in dataForm.realTrades"
        :key="index"
        direction="vertical"
        size="medium"
        :column="5"
        border
      >
        <el-descriptions-item :label="'子成交单' + index">{{
          chid.tradeNum || "XJ_0000_00_00_0000@0"
        }}</el-descriptions-item>
        <el-descriptions-item label="成交价">
          <el-input-number
            class="ipt-volume"
            v-model="chid.price"
            :precision="4"
            :step="0.0005"
            placeholder="请输入价格"
            step-strictly
          ></el-input-number>
        </el-descriptions-item>
        <el-descriptions-item label="成交量">
          <el-input-number
            class="ipt-volume"
            v-model="chid.turnover"
            :step="1000"
            :min="1000"
            :max="parseInt(currentRow.volume)"
            step-strictly
          ></el-input-number>
        </el-descriptions-item>
        <el-descriptions-item label="成交时间">{{
          chid.createTime || "0000-00-00 00:00:00"
        }}</el-descriptions-item>
        <el-descriptions-item label="操作">
          <el-button
            v-if="viewWork == 1 && currentRow.lock"
            type="primary"
            size="small"
            @click="changeRealTrade(index)"
            >移除</el-button
          >
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions
        v-if="
          [4, 6, 3].includes(dataForm.target) &&
          viewWork == 1 &&
          currentRow.lock
        "
        direction="vertical"
        size="medium"
        :column="5"
        border
      >
        <el-descriptions-item labelStyle="display:none">
          <el-card
            shadow="hover"
            class="text-center"
            @click.native="changeRealTrade(-1)"
          >
            <i class="el-icon-plus"></i>
          </el-card>
        </el-descriptions-item>
      </el-descriptions>

      <div class="result-display" v-if="resultDisplay == 1">
        <el-result
          icon="success"
          title="成功提示"
          subTitle="您的操作已经成功！"
        >
          <template slot="extra">
            <el-button type="primary" size="medium" @click="resultDisplay = 0"
              >返回</el-button
            >
          </template>
        </el-result>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/Trade";
import config from "@/utils/config";
import moment from "moment";
import { pageMixin } from "@/utils/pageMixin";
import { debounce } from "@/utils/debounce";
// import * as util from '@/utils/util'
export default {
  props: {
    currentRow: {},
    userSummary: [],
  },
  mixins: [pageMixin],
  components: {},
  data() {
    return {
      tradeSteps: [],
      viewWork: 0,
      dataForm: {
        turnover: 0,
        target: null,
        current: null,
        price: 0,
        userTradeId: null,
        realTrades: [],
      },
      resultDisplay: 0,
      updateUserTrade: [...config.updateUserTrade],
      turnoverInput: false,
    };
  },
  watch: {
    currentRow() {
      this.initRowSteps();
    },
    "dataForm.target": {
      immediate: true, // 将立即以表达式的当前值触发回调
      handler: function (val, oldVal) {
        this.turnoverInput = [4, 6].includes(this.dataForm.target);
      },
      deep: true,
    },
  },
  methods: {
    operateTrade() {
      this.viewWork = 1;
      if (this.currentRow.children.length > 0) {
        this.dataForm.realTrades = this.currentRow.children.map((n) => {
          return {
            turnover: n.volume,
            price: n.realPrice,
            realTradeId: n.realTradeId,
            tradeNum: n.tradeNum,
            createTime: n.createTime,
          };
        });
      }
    },
    changeRealTrade(index) {
      if (index >= 0) {
        this.dataForm.realTrades.splice(index, 1);
      } else {
        this.dataForm.realTrades.push({
          turnover: 1000,
          price: this.currentRow.price,
          realTradeId: null,
        });
      }
    },
    initRowSteps() {
      console.log(this.currentRow);
      this.dataForm.price = this.currentRow.price;
      this.dataForm.turnover = this.currentRow.restVolume;
      this.dataForm.userTradeId = this.currentRow.userTradeId;
      const { tradeNum } = this.currentRow;
      if (tradeNum) {
        api
          .getOperationTrack({
            fromNum: tradeNum,
          })
          .then(({ code, value }) => {
            if (code === "00000" && value) {
              value.sort(function (a, b) {
                return moment(a.createTime).diff(moment(b.createTime));
              });
              // this.tradeSteps = value.map(n => {
              //   console.log(this.userSummary.find(n => n.userId === n.createBy))
              //   const nickName = this.userSummary ? this.userSummary.find(n => n.userId === n.createBy).nickName : n.createBy;
              //   return { ...n, nickName }
              // })

              this.tradeSteps = value;
            }
          });
      }
    },
    funcFormat(val, key) {
      return config.funcKeyValue(val.toString(), key);
    },
    cancelRealTrade: debounce(function (realTradeId) {
      Promise.all([]).then(async () => {
        const { code } = await api.cancelRealTrade({ realTradeId });
        if (code === "00000") {
          this.viewWork = 0;
          this.resultDisplay = 1;
          this.$emit("refreshData");
        }
      });
    }),
    hijackChat() {
      if (window.v1) {
        window.v1.hasWinsById("chat").then((bool) => {
          if (bool) {
            window.v1.focusByID("chat");
            window.v1.sendWinMsg({
              id: "chat",
              fun: "window-send",
              data: { hijack: this.currentRow },
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
                  data: { hijack: this.currentRow },
                });
              }, 1000);
            });
          }
        });
      }
    },
    lockUserTrade: debounce(async function (type) {
      let param = {
        userTradeIdList: [this.currentRow.userTradeId],
      };
      if (type === 1) {
        const { code } = await api.unlockUserTrade(param);
        if (code === "00000") {
          this.viewWork = 0;
          this.resultDisplay = 1;
          this.$emit("refreshData");
        }
      } else {
        const { code } = await api.lockUserTrade(param);
        if (code === "00000") {
          // this.resultDisplay = 1;
          this.$emit("refreshData");
        }
      }

      this.dataForm.realTrades = [];
    }),
    handleInquiryDealConfirmClick: debounce(function () {
      // let sum = this.currentRow.children.length > 0 ? this.currentRow.children.map(n => parseInt(n.volume)).reduce((a, b) => { return a + b; }) : 0;
      let sum =
        this.dataForm.realTrades.length > 0
          ? this.dataForm.realTrades
              .map((n) => n.turnover)
              .reduce((a, b) => {
                return a + b;
              })
          : 0;
      if (sum > this.currentRow.volume) {
        this.$message({
          message: "成交量异常",
          type: "error",
        });
        return;
      }

      this.dataForm.current = this.currentRow.status;
      if (!this.dataForm.current) {
        this.$message({
          message: "参数异常",
          type: "error",
        });
        return;
      }
      api.updateTradeState(this.dataForm).then((response) => {
        if (response && response.code === "00000") {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.viewWork = 0;
          this.resultDisplay = 1;
          this.dataForm = {
            turnover: 0,
            target: null,
            current: null,
            price: 0,
            userTradeId: null,
            realTrades: [],
          };
          this.$emit("refreshData");
        } else {
          this.$message({
            message: response.message,
            type: "error",
          });
        }
      });
      // let param = {
      //   usertradeId: this.currentRow.userTradeId,
      //   price: this.currentRow.price,
      //   volume: 0,
      //   remark: this.currentRow.remark,
      //   deliveryTime: util.dateFormat(this.currentRow.deliveryTime, "YYYY-MM-DD 00:00:00"),
      //   counterParty: this.currentRow.counterParty,
      //   contactPerson: this.currentRow.contactPerson,
      //   contactType: this.currentRow.contactType,
      //   releaseChannel: true
      // }
      // param.volume = this.dataForm.volume
      // console.log(param, this.currentRow)
      // api.inquiryDeal(param).then(response => {
      //   if (response && response.code === '00000') {
      //     this.$message({
      //       message: "已成交",
      //       type: 'success'
      //     })
      //     // self.loadInitData()
      //     this.viewWork = 0;
      //     this.resultDisplay = 1;
      //     this.$emit("refreshData")
      //   } else {
      //     this.$message({
      //       message: response.message,
      //       type: 'info'
      //     })
      //   }
      // })
    }),
  },
  mounted() {
    if (window.v1) {
      window.v1.ipcRenderer().On("window-send", (event, data) => {
        const { action } = data;
        console.log(data);
        if (action === "refreshData") {
          this.$emit(action);
        }
      });
    }
  },
  created() {
    this.initRowSteps();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/style.scss";

.steps {
  padding-bottom: 10px;
  text-align: center;

  >>> .el-steps {
    display: inline-block;

    .el-step {
      width: 140px;
    }
  }

  >>> .el-step__head.is-finish {
    color: #000000;
    border-color: #000000;
  }

  >>> .el-step__title.is-finish,
  >>> .el-step__description.is-finish {
    color: #000000;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: normal;
    font-size: 12px;
    padding: 0;
  }

  // >>>.el-step__title.is-finish:hover::before {
  //   content: attr(title);
  //   /*显示提示框内容*/
  //   position: absolute;
  //   background-color: #ccc;
  //   color: #000;
  //   padding: 5px;
  //   width: 200px;
  //   /*提示框宽度*/
  //   border-radius: 3px;
  //   box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
  //   z-index: 1;
  // }
}

.steps-desc {
  position: relative;

  >>> .el-descriptions__header {
    margin: 10px 0;
  }

  >>> .el-descriptions-row {
    .el-card {
      cursor: pointer;
    }

    .el-icon-plus {
      font-size: 16px;
    }
  }

  .result-display {
    position: absolute;
    z-index: 99;
    width: 100%;
    height: 105%;
    top: -5px;
    background: rgb(240 248 255);
    border-radius: 3px;
  }
}

.ipt-el-select {
  width: 120px;

  >>> .el-input {
    font-size: 12px;
  }
}

.ipt-volume {
  >>> .el-input {
    font-size: 12px;
  }
}
</style>
