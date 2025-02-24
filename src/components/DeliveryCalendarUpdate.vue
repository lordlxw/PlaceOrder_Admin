<template>
  <el-date-picker
    v-model="deliveryTime"
    type="date"
    placeholder="选择日期"
    :clearable="false"
    :picker-options="pickerOptions"
    @change="handleChange"
    :editable="false"
    class="date-w"
  >
  </el-date-picker>
</template>

<script>
import api from "@/api/Calendar";
import * as util from "@/utils/util";
export default {
  props: {
    w: {
      type: String,
      default: "140px",
    },
    dtime: {
      type: Date,
      default: null,
    },
  },
  data() {
    return {
      deliveryTime: "",
      pickerOptions: {},
    };
  },
  watch: {
    // 监听 deliveryTime 的变化
    deliveryTime(newValue) {
      this.handleChange(newValue); // 当 deliveryTime 变化时调用此方法
    },
  },
  methods: {
    // 一月内节假日
    getHolidayOfMonth() {
      const self = this;
      api.holidayOfMonth().then((response) => {
        if (response && response.code === "00000") {
          // 设置可选日期
          // self.pickerOptions = {
          //   disabledDate(time) {
          //     const date = new Date()
          //     return (time.getTime() + 3600 * 1000 * 24 * 1) < Date.now() || time.getTime() > (date.getTime() + 3600 * 1000 * 24 * 30) || response.value.indexOf(util.dateFormat(time, 'YYYY-MM-DD')) !== -1;
          //   }
          // }
          self.pickerOptions = {
            disabledDate(time) {
              const date = new Date();
              if (self.dtime) {
                return (
                  time.getTime() + 3600 * 1000 * 15 * 1 + 3600 * 100 * 5 <
                    new Date(self.dtime) ||
                  time.getTime() > date.getTime() + 3600 * 1000 * 24 * 30 ||
                  response.value.indexOf(
                    util.dateFormat(time, "YYYY-MM-DD")
                  ) !== -1
                );
              }
              return (
                time.getTime() + 3600 * 1000 * 15 * 1 + 3600 * 100 * 5 <
                  Date.now() ||
                time.getTime() > date.getTime() + 3600 * 1000 * 24 * 30 ||
                response.value.indexOf(util.dateFormat(time, "YYYY-MM-DD")) !==
                  -1
              );
            },
          };
        }
      });
    },
    // 获取下个交易日
    getNextDealDay() {
      api.nextDealDay({}).then((response) => {
        if (response && response.code === "00000") {
          this.deliveryTime = response.value;
          this.$emit("change", {
            value: response.value,
          });
        }
      });
    },
    // 改变日期
    handleChange(val) {
      console.log("改变日期");
      this.deliveryTime = val;
      this.$emit("change", {
        value: val,
      });
    },
  },
  mounted() {
    this.getHolidayOfMonth();
  },
};
</script>
<style lang="scss" scoped>
.date-w {
  width: 140px;
}
</style>
