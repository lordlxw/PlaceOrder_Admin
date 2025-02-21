<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form
          ref="overForm"
          :model="overForm"
          :rules="overFormRules"
          label-width="100px"
        >
          <el-form-item label="方向" prop="direction">
            {{
              overForm.direction === "bond_0"
                ? "买入"
                : overForm.direction === "bond_1"
                ? "卖出"
                : "不明确"
            }}
            <span class="txt-red">{{
              overForm.youxianLevel === 2 ? "【优先成交】" : ""
            }}</span>
          </el-form-item>
          <el-form-item label="券码" prop="tscode">
            {{ overForm.tscode }}
            <el-button type="text" @click="handleCope(overForm)"
              >复制</el-button
            >
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input
              v-model="overForm.price"
              placeholder="请输入价格"
            ></el-input>
          </el-form-item>
          <el-form-item label="交易量" prop="volume">
            <el-input
              v-model="overForm.volume"
              placeholder="请输入交易量"
              :disabled="overForm.restVolume === 0"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button type="primary" @click="funcVolumeAdd(0)"
                >清零</el-button
              >
              <el-button type="primary" @click="funcVolumeAdd(1000)"
                >1</el-button
              >
              <el-button type="primary" @click="funcVolumeAdd(2000)"
                >2</el-button
              >
              <el-button type="primary" @click="funcVolumeAdd(3000)"
                >3</el-button
              >
              <el-button type="primary" @click="funcVolumeAdd(5000)"
                >5</el-button
              >
              <el-button type="primary" @click="funcVolumeAdd(10000)"
                >10</el-button
              >
            </el-button-group>
          </el-form-item>
          <el-form-item label="交割日期" prop="deliveryTime">
            <delivery-calendar-update
              ref="deliveryCalendarUpdate"
              :dtime="overForm.dtime"
              @change="handleDeliveryCalendarUpdate"
            ></delivery-calendar-update>
          </el-form-item>
          <el-form-item label="交易对手" prop="counterParty">
            <el-input
              v-model="overForm.counterParty"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="联系人" prop="contactPerson">
              <el-input
                v-model="overForm.contactPerson"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="contactType">
              <el-input
                v-model="overForm.contactType"
                autocomplete="off"
              ></el-input>
            </el-form-item> -->
          <el-form-item label="备注">
            <el-input
              type="textarea"
              v-model="overForm.remark"
              placeholder="请输入内容"
              resize="none"
              rows="2"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('overForm')"
              :disabled="overForm.restVolume === 0"
              >确认平仓</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-form
          ref="openForm"
          :model="openForm"
          :rules="openFormRules"
          label-width="100px"
        >
          <el-form-item label="方向" prop="direction">
            {{
              openForm.direction === "bond_0"
                ? "买入"
                : openForm.direction === "bond_1"
                ? "卖出"
                : "不明确"
            }}
            <span class="txt-red">{{
              openForm.youxianLevel === 2 ? "【优先成交】" : ""
            }}</span>
          </el-form-item>
          <el-form-item label="券码" prop="tscode">
            {{ openForm.tscode }}
            <el-button type="text" @click="handleCope(openForm)"
              >复制</el-button
            >
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input
              v-model="openForm.price"
              placeholder="请输入价格"
            ></el-input>
          </el-form-item>
          <el-form-item label="交易量" prop="volume">
            <el-input
              v-model="openForm.volume"
              placeholder="请输入交易量"
              :disabled="openForm.restVolume === 0"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button type="primary" @click="funcVolumeAdd2(0)"
                >清零</el-button
              >
              <el-button type="primary" @click="funcVolumeAdd2(1000)"
                >1</el-button
              >
              <el-button type="primary" @click="funcVolumeAdd2(2000)"
                >2</el-button
              >
              <el-button type="primary" @click="funcVolumeAdd2(3000)"
                >3</el-button
              >
              <el-button type="primary" @click="funcVolumeAdd2(5000)"
                >5</el-button
              >
              <el-button type="primary" @click="funcVolumeAdd2(10000)"
                >10</el-button
              >
            </el-button-group>
          </el-form-item>
          <el-form-item label="交割日期" prop="deliveryTime">
            <delivery-calendar-update
              ref="deliveryCalendarUpdate2"
              :dtime="openForm.dtime"
              @change="handleDeliveryCalendarUpdate2"
            ></delivery-calendar-update>
          </el-form-item>
          <el-form-item label="交易对手" prop="counterParty">
            <el-input
              v-model="openForm.counterParty"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="联系人" prop="contactPerson">
              <el-input
                v-model="openForm.contactPerson"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="contactType">
              <el-input
                v-model="openForm.contactType"
                autocomplete="off"
              ></el-input>
            </el-form-item> -->
          <el-form-item label="备注">
            <el-input
              type="textarea"
              v-model="openForm.remark"
              placeholder="请输入内容"
              resize="none"
              rows="2"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('openForm')"
              :disabled="openForm.restVolume === 0"
              >确认开仓</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import apiCalendar from "@/api/Calendar";
import api from "@/api/Trade";
import config from "@/utils/config";
import * as util from "@/utils/util";
import { debounce } from "@/utils/debounce";
import { pageMixin } from "@/utils/pageMixin";
import moment from "moment";
import DeliveryCalendarUpdate from "@/components/DeliveryCalendarUpdate.vue";
export default {
  mixins: [pageMixin],
  props: ["overRow", "openRow"],
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
      overForm: {
        // id
        usertradeId: "",
        // 交易类型
        direction: "",
        // 价格
        price: "",
        // 交易量
        volume: "",
        // 债券号
        tscode: "",
        // 交割速度
        deliverySpeed: 0,
        // 交割日期
        deliveryTime: "",
        // 备注
        remark: "",
        // 交易对手
        counterParty: "",
        // 联系人
        contactPerson: "",
        // 联系方式
        contactType: "",
        isYouxian: 0,
        // 计算初始化日期
        dtime: "",
      },
      overFormRules: {
        price: [
          { required: true, message: "价格必填", trigger: "blur" },
          { validator: moneyTest, trigger: "blur" },
        ],
        volume: [
          { required: true, message: "交易量必填", trigger: "blur" },
          { validator: plusAmountTest, trigger: "blur" },
        ],
        deliveryTime: [
          { required: true, message: "交割日期必选", trigger: "blur" },
        ],
        // counterParty: [
        //   { required: true, message: '交易对手必填', trigger: 'blur' }
        // ]
      },
      openForm: {
        // id
        usertradeId: "",
        // 交易类型
        direction: "",
        // 价格
        price: "",
        // 交易量
        volume: "",
        // 债券号
        tscode: "",
        // 交割速度
        deliverySpeed: 0,
        // 交割日期
        deliveryTime: "",
        // 备注
        remark: "",
        // 交易对手
        counterParty: "",
        // 联系人
        contactPerson: "",
        // 联系方式
        contactType: "",
        isYouxian: 0,
        // 计算初始化日期
        dtime: "",
      },
      openFormRules: {
        price: [
          { required: true, message: "价格必填", trigger: "blur" },
          { validator: moneyTest, trigger: "blur" },
        ],
        volume: [
          { required: true, message: "交易量必填", trigger: "blur" },
          { validator: plusAmountTest, trigger: "blur" },
        ],
        deliveryTime: [
          { required: true, message: "交割日期必选", trigger: "blur" },
        ],
        // counterParty: [
        //   { required: true, message: '交易对手必填', trigger: 'blur' }
        // ]
      },
    };
  },
  watch: {
    overRow: function () {
      this.loadInitData();
    },
    openRow: function () {
      this.loadInitData();
    },
  },
  methods: {
    // 交易量加法函数
    funcVolumeAdd(val) {
      if (val === 0) {
        this.overForm.volume = 0;
      } else {
        this.overForm.volume += val;
      }
    },
    // 交易量加法函数2
    funcVolumeAdd2(val) {
      if (val === 0) {
        this.openForm.volume = 0;
      } else {
        this.openForm.volume += val;
      }
    },
    // 交割日期变化
    handleDeliveryCalendarUpdate(obj) {
      this.overForm.deliveryTime = obj.value;
    },
    // 交割日期变化
    handleDeliveryCalendarUpdate2(obj) {
      this.openForm.deliveryTime = obj.value;
    },
    // 复制
    handleCope(formData) {
      const scope = {};
      scope.row = JSON.parse(JSON.stringify(formData));
      this.copy(scope);
      this.$message({
        message: `复制成功`,
        type: "success",
      });
    },
    // 表单提交
    submitForm: debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api
            .inquiryDeal({
              // 成交价格
              price: util.moneyFormat(this[formName].price, 4),
              usertradeId: this[formName].usertradeId,
              // 成交量
              volume: this[formName].volume,
              // 备注
              remark: this[formName].remark,
              deliveryTime: util.dateFormat(
                this[formName].deliveryTime,
                "YYYY-MM-DD 00:00:00"
              ),
              counterParty: this[formName].counterParty,
              contactPerson: this[formName].contactPerson,
              contactType: this[formName].contactType,
            })
            .then((res) => {
              if (res && res.code === "00000") {
                this.$message({
                  message: "已提交，如有变动请等待审核",
                  type: "warning",
                });
                this.$emit("change", {
                  refresh: false,
                  relativeNum: this.overRow.relativeNum,
                  createBy: this.overRow.createBy,
                });
                // this.$emit('change', {
                //   dialogVisible: false
                // })
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
    // 加载初始值
    loadInitData() {
      this.overForm.direction = this.overRow.direction;
      this.overForm.isYouxian = this.overRow.isYouxian;
      this.overForm.tscode = this.overRow.tscode;
      this.overForm.price = this.overRow.price;
      this.overForm.usertradeId = this.overRow.userTradeId;
      this.overForm.volume = parseFloat(this.overRow.maxVolume);
      this.overForm.restVolume = parseFloat(this.overRow.maxVolume);
      if (
        moment(this.overRow.deliveryTime).format("YYYY-MM-DD") >
        moment(new Date()).format("YYYY-MM-DD")
      ) {
        this.overForm.deliveryTime = moment(this.overRow.deliveryTime).format(
          "YYYY-MM-DD"
        );
        this.overForm.dtime = this.$refs.deliveryCalendarUpdate.deliveryTime =
          moment(this.overRow.deliveryTime).format("YYYY-MM-DD");
      } else if (
        moment(this.overRow.deliveryTime).format("YYYY-MM-DD") ===
          moment(new Date()).format("YYYY-MM-DD") &&
        moment(moment(new Date()).format("YYYY-MM-DD HH:mm:ss")).isBefore(
          moment(new Date()).format("YYYY-MM-DD 16:30:00")
        )
      ) {
        this.overForm.deliveryTime = moment(new Date()).format("YYYY-MM-DD");
        this.overForm.dtime = this.$refs.deliveryCalendarUpdate.deliveryTime =
          moment(new Date()).format("YYYY-MM-DD");
      } else {
        this.getNextDealDay();
      }
      this.overForm.remark = this.overRow.remark;
      this.overForm.counterParty = this.overRow.counterParty;
      this.overForm.contactPerson = this.overRow.contactPerson;
      this.overForm.contactType = this.overRow.contactType;
      this.overForm.youxianLevel = this.overRow.youxianLevel;
      this.openForm.isYouxian = this.openRow.isYouxian;
      this.openForm.direction = this.openRow.direction;
      this.openForm.tscode = this.openRow.tscode;
      this.openForm.price = this.openRow.price;
      this.openForm.usertradeId = this.openRow.userTradeId;
      this.openForm.volume = parseFloat(this.openRow.maxVolume);
      this.openForm.restVolume = parseFloat(this.openRow.maxVolume);
      if (
        moment(this.openRow.deliveryTime).format("YYYY-MM-DD") >
        moment(new Date()).format("YYYY-MM-DD")
      ) {
        this.openForm.deliveryTime = moment(this.openRow.deliveryTime).format(
          "YYYY-MM-DD"
        );
        this.openForm.dtime = this.$refs.deliveryCalendarUpdate2.deliveryTime =
          moment(this.openRow.deliveryTime).format("YYYY-MM-DD");
      } else if (
        moment(this.openRow.deliveryTime).format("YYYY-MM-DD") ===
          moment(new Date()).format("YYYY-MM-DD") &&
        moment(moment(new Date()).format("YYYY-MM-DD HH:mm:ss")).isBefore(
          moment(new Date()).format("YYYY-MM-DD 16:30:00")
        )
      ) {
        this.openForm.deliveryTime = moment(new Date()).format("YYYY-MM-DD");
        this.openForm.dtime = this.$refs.deliveryCalendarUpdate2.deliveryTime =
          moment(new Date()).format("YYYY-MM-DD");
      } else {
        this.getNextDealDay();
      }
      this.openForm.remark = this.openRow.remark;
      this.openForm.counterParty = this.openRow.counterParty;
      this.openForm.contactPerson = this.openRow.contactPerson;
      this.openForm.contactType = this.openRow.contactType;
      this.openForm.youxianLevel = this.openRow.youxianLevel;
    },
    // 获取下个交易日
    getNextDealDay() {
      apiCalendar.nextDealDay({}).then((response) => {
        if (response && response.code === "00000") {
          this.overForm.deliveryTime = response.value;
          this.openForm.deliveryTime = response.value;
          this.overForm.dtime = this.$refs.deliveryCalendarUpdate.deliveryTime =
            response.value;
          this.openForm.dtime =
            this.$refs.deliveryCalendarUpdate2.deliveryTime = response.value;
        }
      });
    },
  },
  mounted() {
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
.txt-red {
  color: red;
  font-weight: bold;
}
</style>
