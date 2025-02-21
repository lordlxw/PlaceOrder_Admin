<template>
  <div class="el-dialog__body">
    <el-form
      ref="enquiryForm"
      :inline="true"
      :model="enquiryForm"
      :rules="enquiryFormRules"
      label-width="100px"
    >
      <el-form-item label="方向" prop="direction">
        <el-button-group v-if="!this.enquiryForm.lockDirection">
          <el-button @click="handleDirection('买')" :class="funcDirection('买')"
            >买</el-button
          >
          <el-button @click="handleDirection('卖')" :class="funcDirection('卖')"
            >卖</el-button
          >
        </el-button-group>
        <template v-else>
          <div>
            {{ enquiryForm.direction }}
          </div>
        </template>
      </el-form-item>
      <el-form-item label="券码" prop="tscode">
        <el-input
          v-model="enquiryForm.tscode"
          :disabled="action === 2"
          placeholder="请输入券码"
          class="slt-user"
        ></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input-number
          v-model="enquiryForm.price"
          :precision="4"
          :step="0.001"
          placeholder="请输入价格"
          class="pricew slt-user"
        ></el-input-number>
        <!-- <el-input v-model="enquiryForm.price" :step="0.001" placeholder="请输入价格"></el-input> -->
      </el-form-item>
      <!-- <el-form-item label="允许浮动" prop="worstPrice">
        <el-input-number v-model="enquiryForm.worstPrice" :step="0.05"></el-input-number>
        BP
      </el-form-item> -->
      <el-form-item label="询量" prop="volume">
        <!-- <el-input v-model="enquiryForm.volume" placeholder="请输入询量" :disabled="action === 2"></el-input> -->
        <el-input-number
          class="ipt-volume slt-user"
          v-model="enquiryForm.volume"
          :step="1000"
          :min="2000"
          step-strictly
          :disabled="action === 2"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="剩余询量" prop="restVolume" v-if="action === 2">
        <el-input-number
          class="ipt-volume slt-user"
          v-model="enquiryForm.restVolume"
          :step="1000"
          :min="2000"
          step-strictly
        ></el-input-number>
        <!-- <el-input v-model="enquiryForm.restVolume" placeholder="请输入剩余询量"></el-input> -->
      </el-form-item>
      <!-- <el-form-item>
        <el-button-group>
          <el-button type="primary" @click="funcVolumeAdd(0)">清零</el-button>
          <el-button type="primary" @click="funcVolumeAdd(1000)">1</el-button>
          <el-button type="primary" @click="funcVolumeAdd(2000)">2</el-button>
          <el-button type="primary" @click="funcVolumeAdd(3000)">3</el-button>
          <el-button type="primary" @click="funcVolumeAdd(5000)">5</el-button>
          <el-button type="primary" @click="funcVolumeAdd(10000)">10</el-button>
        </el-button-group>
      </el-form-item> -->
      <el-form-item label="清算速度" prop="deliveryTime">
        <delivery-calendar
          ref="buyDeliveryCalendar"
          :init="action === 2 ? true : false"
          @change="handleBuyDeliveryCalendar"
          :disabled="action === 2 ? true : false"
        ></delivery-calendar>
        <!-- <el-button-group>
          <el-button
            icon="el-icon-plus"
            :class="funcDeliverySpeed(0)"
            @click="handleDelivertySpeed(0)"
            >0</el-button
          >
          <el-button
            icon="el-icon-plus"
            :class="funcDeliverySpeed('enquiryForm', 1)"
            @click="handleDelivertySpeed('enquiryForm', 1)"
            >1</el-button
          >
        </el-button-group> -->
      </el-form-item>
      <!-- <el-form-item label="交易员" prop="tradeuserId">
        <el-select v-model="enquiryForm.tradeuserId" placeholder="请选择交易员" :disabled="action === 2">
          <el-option v-for="item in tradeUsersOption" :key="item.userId" :label="item.userName" :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="备注">
        <el-input type="textarea" v-model="enquiryForm.remark" placeholder="请输入内容" resize="none" rows="2"></el-input>
      </el-form-item> -->
      <el-form-item label=" ">
        <el-button
          type="primary"
          class="btn-green"
          @click="submitForm('enquiryForm')"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import api from "@/api/Trade";
import apiAdmin from "@/api/Power_Admin";
import * as util from "@/utils/util";
import config from "@/utils/config";
import { debounce } from "@/utils/debounce";
import DeliveryCalendar from "@/components/DeliveryCalendar.vue";
export default {
  // action=1 添加，action=2 询价单编辑
  props: ["row", "action", "riskControlData"],
  components: {
    DeliveryCalendar,
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo",
    }),
  },
  watch: {
    row() {
      if (this.row) {
        this.initEnquiryForm(this.row);
      }
    },
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
      tradeUsersOption: [],
      enquiryForm: {
        userTradeId: "",
        // 锁住方向
        lockDirection: "",
        // 交易类型
        direction: "买",
        // 价格
        price: "",
        // 交易量
        volume: "",
        restVolume: "",
        // 债券号
        tscode: "",
        // 交割速度
        deliverySpeed: 0,
        // 交割时间
        deliveryTime: "",
        // 交易员
        tradeuserId: "",
        // 备注
        remark: "",
        // 快速交易
        quickSubmit: false,
        // 允许浮动
        worstPrice: 0.1,
        // 相关单号
        relativeNum: "",
        // 滚单相关单号
        sourceNum: "",
        // 是否优先
        isYouxian: "",
        // 优先级别
        youxianLevel: "",
      },
      enquiryFormRules: {
        direction: [{ required: true, message: "方向必选", trigger: "blur" }],
        tscode: [{ required: true, message: "券码必填", trigger: "blur" }],
        price: [
          { required: true, message: "价格必填", trigger: "blur" },
          { validator: moneyTest, trigger: "blur" },
        ],
        restVolume: [
          { required: true, message: "剩余询量必填", trigger: "blur" },
          { validator: plusAmountTest, trigger: "blur" },
        ],
        volume: [
          { required: true, message: "询量必填", trigger: "blur" },
          { validator: plusAmountTest, trigger: "blur" },
        ],
        deliveryTime: [
          { required: true, message: "交割时间必选", trigger: "blur" },
        ],
        tradeuserId: [
          { required: true, message: "交易员必选", trigger: "change" },
        ],
        worstPrice: [
          { required: true, message: "允许浮动必填", trigger: "blur" },
          { validator: floatTest, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 交易量加法函数
    funcVolumeAdd(val) {
      if (val === 0) {
        this.enquiryForm.volume = 0;
      } else {
        this.enquiryForm.volume += val;
      }
    },
    // 方向
    funcDirection(val) {
      if (this.enquiryForm.direction === val) {
        return "btn-active";
      }
      return "";
    },
    // 交割速度方法
    funcDeliverySpeed(val) {
      if (this.enquiryForm.deliverySpeed === val) {
        return "btn-active";
      }
      return "";
    },
    // 买单清算速度变化
    handleBuyDeliveryCalendar(obj) {
      this.enquiryForm.deliveryTime = obj.value;
    },
    // 点击交易速度
    handleDelivertySpeed(val) {
      this.enquiryForm.deliverySpeed = val;
    },
    // 点击交易方向
    handleDirection(val) {
      this.enquiryForm.direction = val;
    },
    submitForm: debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.action === 2) {
            api
              .inquirySheetEdit({
                gaijiaTradeId: [this[formName].userTradeId],
                userTradeId: this[formName].userTradeId,
                // 交割速度
                deliverySpeed: this[formName].deliverySpeed,
                // 清算速度
                deliveryTime: util.dateFormat(
                  this[formName].deliveryTime,
                  "YYYY-MM-DD hh:mm:ss"
                ),
                // 买还是卖
                direction:
                  this[formName].direction === "买" ? "bond_0" : "bond_1",
                // 成交价格
                price: util.moneyFormat(this[formName].price, 4),
                // 债券编号
                tscode: this[formName].tscode,
                // 成交量
                restVolume: this[formName].restVolume,
                // 备注
                remark: this[formName].remark,
                // 允许浮动
                worstPrice: this[formName].worstPrice,
              })
              .then((res) => {
                if (res && res.code === "00000" && res.value) {
                  this.$message({
                    message: `询价单已修改`,
                    type: "success",
                  });
                  this.$emit("change", {
                    dialogVisible: false,
                  });

                  const { message, brokerId, channelId, userTradeId } =
                    res.value;
                  // const md = new Date(deliveryTime);
                  // // (T01 240203 2.0725 6月20日+0 9k) 改 2.0750 8k
                  // const modifyTxt = `${this[formName].volume + ' '}${util.moneyFormat(this[formName].price, 4)}`
                  // const chatMessage = `(${direction === 'bond_0' ? 'bid' : 'ofr'} ${tscode.split('.')[0]} ${price} ${md.getMonth() + 1}月${md.getDate()}日+0 ${volume}) 改 ${modifyTxt}`
                  // console.log(chatMessage)
                  const data = {
                    chatId: this.userInfo.userId,
                    message: message,
                    brokerId: brokerId,
                    channelId: channelId,
                    direction: 0,
                    tradeId: userTradeId,
                  };
                  api.sendChatMessages(data, "sim");
                } else {
                  this.$message({
                    message: `${res.message}`,
                    type: "error",
                  });
                }
              });
          } else {
            api
              .inquirySheetAdd({
                // 交割速度
                deliverySpeed: this[formName].deliverySpeed,
                // 清算速度
                deliveryTime: util.dateFormat(
                  this[formName].deliveryTime,
                  "YYYY-MM-DD"
                ),
                // 买还是卖
                direction:
                  this[formName].direction === "买" ? "bond_0" : "bond_1",
                // 成交价格
                price: util.moneyFormat(this[formName].price, 4),
                // 交易员
                tradeuserId: this[formName].tradeuserId,
                // 债券编号
                tscode: this[formName].tscode,
                // 成交量
                volume: this[formName].volume,
                // 备注
                remark: this[formName].remark,
                // 允许浮动
                worstPrice: this[formName].worstPrice,
                // 相关单号
                relativeNum: this[formName].relativeNum,
                // 滚单相关单号
                sourceNum: this[formName].sourceNum,
                // 是否优先
                isYouxian: this[formName].isYouxian,
                // 优先级别
                youxianLevel: this[formName].youxianLevel,
              })
              .then((res) => {
                if (res && res.code === "00000" && res.value) {
                  this.$message({
                    message: `询价单发送成功`,
                    type: "success",
                  });
                  this.$emit("change", {
                    dialogVisible: false,
                  });
                } else {
                  this.$message({
                    message: `${res.message}`,
                    type: "error",
                  });
                }
              });
          }
        }
      });
    }),
    // 初始化数据
    initEnquiryForm(obj) {
      this.enquiryForm.direction =
        obj.direction === "bond_0"
          ? "买"
          : obj.direction === "bond_1"
          ? "卖"
          : "";
      this.enquiryForm.price = obj.price;
      this.enquiryForm.volume = obj.volume ? parseFloat(obj.volume) : "";
      this.enquiryForm.tscode = obj.tscode;
      this.enquiryForm.deliverySpeed = obj.deliverySpeed
        ? obj.deliverySpeed
        : 0;
      this.enquiryForm.deliveryTime = obj.deliveryTime;
      this.$refs.buyDeliveryCalendar.deliveryTime = obj.deliveryTime;
      this.enquiryForm.tradeuserId = obj.userId;
      this.enquiryForm.remark = obj.remark;
      this.enquiryForm.lockDirection = obj.lockDirection;
      this.enquiryForm.worstPrice = obj.worstPrice ? obj.worstPrice : 0.1;
      this.enquiryForm.relativeNum = obj.relativeNum;
      this.enquiryForm.sourceNum = obj.sourceNum;
      this.enquiryForm.isYouxian = obj.isYouxian;
      this.enquiryForm.youxianLevel = obj.youxianLevel;
      this.enquiryForm.userTradeId = obj.userTradeId;
      this.enquiryForm.restVolume = obj.restVolume;
    },
    // 获取交易员列表
    getTradeUserList() {
      apiAdmin.tradeUserList().then((response) => {
        if (response && response.code === "00000" && response.value) {
          this.tradeUsersOption = response.value;
        }
      });
    },
  },
  mounted() {
    this.getTradeUserList();
    this.initEnquiryForm(this.row);
  },
};
</script>

<style lang="scss" scoped>
.btn-active {
  background: #409eff !important;
  color: white;
  border: 1px solid #409eff;
}

.el-dialog__body {
  padding: 0;
  padding-right: 30px;
}

.slt-user {
  width: 140px;
}

.el-form-item--small.el-form-item {
  width: 250px;
}
</style>
