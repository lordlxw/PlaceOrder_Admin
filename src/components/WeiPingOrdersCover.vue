// 未平弹窗

<template>
  <div>
    <el-form
      :inline="true"
      ref="coverForm"
      :model="coverForm"
      :rules="coverFormRules"
      label-width="100px"
      v-loading="loading"
    >
      <el-form-item label="方向" prop="direction">
        {{
          coverForm.direction === "bond_0"
            ? "买入"
            : coverForm.direction === "bond_1"
            ? "卖出"
            : "不明确"
        }}
      </el-form-item>
      <el-form-item label="券码" prop="tscode">
        {{ coverForm.tscode }}
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input-number
          v-model="coverForm.price"
          :precision="4"
          :step="0.001"
          placeholder="请输入价格"
          class="slt-user"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="交易量(万)" prop="volume">
        <el-input-number
          class="slt-user"
          v-model="coverForm.volume"
          :step="1000"
          :min="1000"
          :max="100000"
          step-strictly
        ></el-input-number>
      </el-form-item>
      <el-form-item label="中介" prop="brokerid">
        <el-select
          v-model="coverForm.brokerid"
          clearable
          placeholder="系统选择"
          class="slt-user"
          popper-class="slt-user"
        >
          <el-option
            v-for="item in intendComerOption"
            :disabled="item.disabled"
            :key="item.id"
            :label="item.company"
            :value="item.brokerid"
          >
            <div style="width: 50px; float: left">
              <i class="el-icon-s-custom" :class="item.iconClass"></i>
              {{ item.company }}
            </div>
            <div class="text-left" style="width: 50px">{{ item.target }}</div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="清算速度" prop="deliveryTime">
        <DeliveryCalendarUpdate
          ref="deliveryCalendarUpdate"
          :w="`200px`"
          @change="handleDeliveryCalendarUpdate"
        ></DeliveryCalendarUpdate>
      </el-form-item>
      <el-form-item label=" ">
        <el-button
          type="primary"
          class="btn-green"
          @click="submitForm('coverForm')"
          >确认平仓</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import api from "@/api/Bonds";
import apiTrade from "@/api/Trade";
import apiAdmin from "@/api/Power_Admin";
import apiCalendar from "@/api/Calendar";
import * as util from "@/utils/util";
import config from "@/utils/config";
import { debounce } from "@/utils/debounce";
import moment from "moment";
import DeliveryCalendarUpdate from "@/components/DeliveryCalendarUpdate.vue";
export default {
  name: "BondsCover",
  props: ["row"],
  components: {
    DeliveryCalendarUpdate,
  },

  data() {
    // 金额格式验证
    const moneyTest = async (rule, value, callback) => {
      if (!config.regExpSet.money.test(value)) {
        callback(new Error("请输入正确格式（-.----）"));
      } else {
        callback();
      }
    };
    // 允许浮动格式验证
    const floatTest = async (rule, value, callback) => {
      console.log(rule);
      if (!config.regExpSet.floatPrice.test(value)) {
        callback(new Error("大于0的格式-.--"));
      } else {
        callback();
      }
    };
    // 大于0格式验证
    const plusAmountTest = async (rule, value, callback) => {
      if (!config.regExpSet.gtzero.test(value)) {
        callback(new Error("请输入大于0的正整数"));
      } else {
        callback();
      }
    };
    return {
      currentRow: {},
      tradeUsersOption: [],
      intendComerOption: [],
      coverForm: {
        // 交易类型
        direction: "买入",
        // 价格
        price: "",
        // 允许浮动
        worstPrice: 0.1,
        // 交易量
        volume: "",
        // 债券号
        tscode: "",
        // 交割速度
        deliverySpeed: 0,
        // 清算速度
        deliveryTime: "",
        // 原清算速度
        deliveryTime2: "",
        // 交易员
        tradeuserId: "",
        // 备注
        remark: "",
        // 快速交易
        quickSubmit: false,
        realTradeIdList: [],
        relativeNum: "",
        brokerid: "",
      },
      coverFormRules: {
        direction: [{ required: true, message: "方向必选", trigger: "blur" }],
        tscode: [{ required: true, message: "券码必填", trigger: "blur" }],
        price: [
          { required: true, message: "价格必填", trigger: "blur" },
          { validator: moneyTest, trigger: "blur" },
        ],
        volume: [
          { required: true, message: "交易量必填", trigger: "blur" },
          { validator: plusAmountTest, trigger: "blur" },
        ],
        deliveryTime: [
          { required: true, message: "清算速度必选", trigger: "blur" },
        ],
        tradeuserId: [
          { required: true, message: "交易员必选", trigger: "change" },
        ],
        worstPrice: [
          { required: true, message: "允许浮动必填", trigger: "blur" },
          { validator: floatTest, trigger: "blur" },
        ],
      },
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo",
    }),
    ...mapState({
      occupyInfo: (state) => state.occupyInfo,
    }),
  },
  watch: {
    row: function () {
      this.loadInitData();
    },
    occupyInfo() {
      this.getIntendComerList(this.occupyInfo);
    },
  },
  methods: {
    // 交易量加法函数
    funcVolumeAdd(val) {
      if (val === 0) {
        this.coverForm.volume = 0;
      } else {
        this.coverForm.volume += val;
      }
    },
    // 交割速度方法
    funcDeliverySpeed(val) {
      if (this.coverForm.deliverySpeed === val) {
        return "btn-active";
      }
      return "";
    },
    // 买单清算速度变化
    handleDeliveryCalendarUpdate(obj) {
      console.log("买单清算速度变化");
      this.coverForm.deliveryTime = obj.value;
    },
    // 点击清算速度
    handleDelivertySpeed(val) {
      this.coverForm.deliverySpeed = val;
    },
    // 点击交易方向
    handleDirection(val) {
      this.coverForm.direction = val;
    },
    submitForm: debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          api
            .bondsCover({
              // 交割速度
              deliverySpeed: this[formName].deliverySpeed,
              // 清算速度
              deliveryTime: util.dateFormat(
                this[formName].deliveryTime,
                "YYYY-MM-DD 00:00:00"
              ),
              // 原清算速度
              deliveryTime2: util.dateFormat(
                this[formName].deliveryTime2,
                "YYYY-MM-DD 00:00:00"
              ),
              // 买还是卖
              direction: this[formName].direction,
              // 成交价格
              price: util.moneyFormat(this[formName].price, 4),
              // 交易员
              userId: this[formName].tradeuserId,
              // 债券编号
              tscode: this[formName].tscode,
              // 成交量
              volume: this[formName].volume,
              // 备注
              // remark: this[formName].remark,
              // 允许浮动
              worstPrice: this[formName].worstPrice,
              //
              realTradeIdList: this[formName].realTradeIdList,
              brokerid: this[formName].brokerid,
              relativeNum: this[formName].relativeNum,
            })
            .then((res) => {
              this.loading = false;
              if (res && res.code === "00000" && res.value) {
                this.$message({
                  message: `平仓询价单创建成功`,
                  type: "success",
                });
                this.$emit("change", {
                  dialogVisible: false,
                });

                const { brokerId, channelId, userTradeId, message } = res.value;
                // const md = new Date(deliveryTime);
                // const chatMessage = `ref (${direction === 'bond_0' ? 'bid' : 'ofr'} ${tscode.split('.')[0]} ${price} ${md.getMonth() + 1}月${md.getDate()} 日 + 0 ${volume} )`
                // console.log(chatMessage)
                const data = {
                  chatId: this.userInfo.userId,
                  message: message,
                  brokerId: brokerId,
                  channelId: channelId,
                  direction: 0,
                  tradeId: userTradeId,
                };
                apiTrade.sendChatMessages(data, "sim");
              } else {
                this.$message({
                  message: `${res.message}`,
                  type: "error",
                });
              }
            });
        }
      });
    }),
    // 获取交易员列表
    getTradeUserList(realTradeIdList) {
      apiAdmin.realTradeUserList({ realTradeIdList }).then((response) => {
        if (response && response.code === "00000" && response.value) {
          this.tradeUsersOption = response.value;
          this.coverForm.tradeuserId = response.value[0].userId;
        }
      });
    },
    // 获取意向列表
    getIntendComerList(occupyInfo) {
      if (this.intendComerOption.length > 0 && occupyInfo) {
        const bol = occupyInfo.some(
          (n) => n.occupyier === this.userInfo.userId
        );
        this.intendComerOption = this.intendComerOption.map((item) => {
          const occupyItem = occupyInfo.filter(
            (n) =>
              n.brokerid === item.brokerid && n.channelId === item.channelId
          );
          if (occupyItem.length > 0) {
            return {
              ...item,
              disabled: bol
                ? occupyItem[0].occupyier !== this.userInfo.userId
                : occupyItem[0].occupy,
              iconClass: occupyItem[0].occupy ? "txt-red" : "txt-green",
            };
          } else {
            return item;
          }
        });
      } else {
        apiAdmin.chatReceiverList().then((response) => {
          if (response && response.code === "00000" && response.value) {
            const brokers = [...response.value].filter(
              (n) => n.brokerid !== 11 && n.brokerid !== 12
            );
            this.intendComerOption = [...brokers].map((item) => {
              return {
                ...item,
                disabled: false,
                iconClass: "txt-green",
              };
            });
            return occupyInfo ? this.getIntendComerList(occupyInfo) : null;
          }
        });
      }
    },
    // 加载初始值
    loadInitData() {
      console.log("未平弹窗1233", this.row);
      console.log(this.row.tscode); // 获取顶层的 price
      console.log(this.row.floatProfit); // 获取顶层的 price
      console.log(this.row.rowId); // 获取顶层的 price

      console.log(this.row.price); // 获取顶层的 price
      //console.log(this.row.price);
      this.coverForm.direction =
        this.row.direction === "bond_1"
          ? "bond_0"
          : this.row.direction === "bond_0"
          ? "bond_1"
          : "";
      this.coverForm.tscode = this.row.tscode;
      this.coverForm.price = this.row.price;
      console.log(this.coverForm.price);
      this.coverForm.volume = parseFloat(this.row.restVolume);

      this.coverForm.deliveryTime2 = this.row.deliveryTime;

      if (
        moment(this.row.deliveryTime).format("YYYY-MM-DD") >
        moment(new Date()).format("YYYY-MM-DD")
      ) {
        this.coverForm.deliveryTime = moment(this.row.deliveryTime).format(
          "YYYY-MM-DD"
        );
        this.$refs.deliveryCalendarUpdate.deliveryTime = moment(
          this.row.deliveryTime
        ).format("YYYY-MM-DD");
      } else if (
        moment(this.row.deliveryTime).format("YYYY-MM-DD") <=
          moment(new Date()).format("YYYY-MM-DD") &&
        moment(moment(new Date()).format("YYYY-MM-DD HH:mm:ss")).isBefore(
          moment(new Date()).format("YYYY-MM-DD 15:30:00")
        )
      ) {
        this.coverForm.deliveryTime = moment(new Date()).format("YYYY-MM-DD");
        this.$refs.deliveryCalendarUpdate.deliveryTime = moment(
          new Date()
        ).format("YYYY-MM-DD");
      } else {
        this.getNextDealDay();
      }
      this.coverForm.realTradeIdList = this.row.realTradeIdList;
      this.coverForm.relativeNum = this.row.relativeNum;
      this.getTradeUserList(this.row.realTradeIdList);
      this.getIntendComerList(this.occupyInfo);

      console.log("coverForm");
      console.log(this.coverForm);
    },
    // 获取下个交易日
    getNextDealDay() {
      apiCalendar.nextDealDay({}).then((response) => {
        if (response && response.code === "00000") {
          this.coverForm.deliveryTime = response.value;
          this.$refs.deliveryCalendarUpdate.deliveryTime = response.value;
        }
      });
    },
  },
  mounted() {
    console.log("未平弹窗执行mounted");
    console.log(this.row);
    this.loadInitData();
  },
};
</script>

<style lang="scss" scoped>
.btn-active {
  background: #409eff !important;
  color: white;
  border: 1px solid #409eff;
}

.slt-user {
  width: 140px;

  .el-select-dropdown__item {
    padding: 0 10px;
  }

  .el-select-dropdown__item.selected {
    color: black;
  }
}

.el-form-item--small.el-form-item {
  width: 250px;
}
</style>
