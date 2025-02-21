<template>
  <div>
    <el-form
      ref="enquiryForm"
      :model="enquiryForm"
      :rules="enquiryFormRules"
      label-width="100px"
    >
      <el-form-item label="方向" prop="direction">
        {{
          row.direction === "bond_0"
            ? "买"
            : row.direction === "bond_1"
            ? "卖"
            : ""
        }}
      </el-form-item>
      <el-form-item label="券码">
        {{ row.tscode }}
      </el-form-item>
      <el-form-item label="价格">
        {{ row.price }}
      </el-form-item>
      <el-form-item label="交易量">
        {{ row.restVolume }}
      </el-form-item>
      <el-form-item label="交易速度">
        {{ formatDeliveryTime }}
      </el-form-item>
      <el-form-item label="备注">
        {{ enquiryForm.remark }}
      </el-form-item>
      <el-form-item label="难成原因" prop="reason">
        <el-checkbox-group v-model="checkedReason">
          <el-checkbox v-for="item in reasons" :label="item" :key="item">{{
            item
          }}</el-checkbox>
        </el-checkbox-group>
        <el-input
          type="textarea"
          v-model="enquiryForm.reason"
          placeholder="请输入内容"
          resize="none"
          rows="2"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-green" @click="submitForm('enquiryForm')"
          >发送</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from "@/api/Trade";
import apiAdmin from "@/api/Power_Admin";
import config from "@/utils/config";
import { debounce } from "@/utils/debounce";
import DeliveryCalendar from "@/components/DeliveryCalendar.vue";
import moment from "moment";
export default {
  props: ["row"],
  components: {
    DeliveryCalendar,
  },
  computed: {
    formattedDeliveryTime() {
      return moment(date).format("YYYY-MM-DD");
    },
  },
  data() {
    return {
      config,
      reasons: ["价格不匹配", "量不匹配"],
      checkedReason: [],
      tradeUsersOption: [],
      enquiryForm: {
        reason: "",
        userTradeId: "",
      },
      enquiryFormRules: {
        reason: [{ required: true, message: "难成原因", trigger: "blur" }],
      },
    };
  },
  watch: {
    row() {
      this.enquiryForm.userTradeId = this.row.userTradeId;
    },
    checkedReason(newVal) {
      this.enquiryForm.reason = newVal.join(",");
    },
  },
  methods: {
    // 方向
    funcDirection(val) {
      if (this.row.direction === val) {
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
    // 买单交割日期变化
    handleBuyDeliveryCalendar(obj) {
      this.enquiryForm.deliveryTime = obj.value;
    },
    // 点击交易速度
    handleDelivertySpeed(val) {
      this.enquiryForm.deliverySpeed = val;
    },
    submitForm: debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api
            .difficultAcheve({
              reason: this.enquiryForm.reason,
              userTradeId: this.enquiryForm.userTradeId,
            })
            .then((res) => {
              if (res && res.code === "00000" && res.value) {
                this.$message({
                  message: "发送成功，等待研究员审核",
                  type: "success",
                });
                this.$emit("change", {
                  dialogVisible: false,
                });
              }
            });
        }
      });
    }),
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
    this.enquiryForm.userTradeId = this.row.userTradeId;
  },
};
</script>

<style lang="scss" scoped>
.btn-active {
  background: #409eff !important;
  color: white;
  border: 1px solid #409eff;
}
</style>
