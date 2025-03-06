<template>
  <div>
    <!-- 筛选栏 -->
    <el-row>
      <el-date-picker
        v-model="selectedDate"
        type="date"
        placeholder="选择日期"
      />
    </el-row>

    <!-- 图表 -->
    <div>
      <h3>每日交易员盈亏</h3>
      <div ref="chart" style="width: 100%; height: 500px"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  data() {
    return {
      selectedDate: "",
      tableData: [
        { trader: "张三", date: "2023-10-01", profit: 5000, count: 10 },
        { trader: "李四", date: "2023-10-01", profit: -2000, count: 5 },
        { trader: "王五", date: "2023-10-01", profit: 3000, count: 8 },
        { trader: "张三", date: "2023-10-02", profit: 4000, count: 7 },
        { trader: "李四", date: "2023-10-02", profit: -1000, count: 3 },
        { trader: "王五", date: "2023-10-02", profit: 2000, count: 6 },
        { trader: "张三", date: "2023-10-03", profit: 6000, count: 12 },
        { trader: "李四", date: "2023-10-03", profit: -3000, count: 4 },
        { trader: "王五", date: "2023-10-03", profit: 1500, count: 5 },
        { trader: "张三", date: "2023-10-04", profit: 5500, count: 9 },
        { trader: "李四", date: "2023-10-04", profit: -2500, count: 6 },
        { trader: "王五", date: "2023-10-04", profit: 1800, count: 7 },
        { trader: "张三", date: "2023-10-05", profit: 7000, count: 15 },
        { trader: "李四", date: "2023-10-05", profit: -4000, count: 8 },
        { trader: "王五", date: "2023-10-05", profit: 2200, count: 10 },
        { trader: "张三", date: "2023-10-06", profit: 4500, count: 11 },
        { trader: "李四", date: "2023-10-06", profit: -1500, count: 5 },
        { trader: "王五", date: "2023-10-06", profit: 3000, count: 9 },
        { trader: "张三", date: "2023-10-07", profit: 8000, count: 18 },
        { trader: "李四", date: "2023-10-07", profit: -5000, count: 10 },
        { trader: "王五", date: "2023-10-07", profit: 2500, count: 12 },
      ],
    };
  },
  computed: {
    filteredData() {
      return this.tableData.filter(
        (item) => !this.selectedDate || item.date === this.selectedDate
      );
    },
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      const chart = echarts.init(this.$refs.chart);

      // 按日期分组
      const dates = [...new Set(this.tableData.map((item) => item.date))];
      const traders = [...new Set(this.tableData.map((item) => item.trader))];

      // 准备数据
      const series = traders.map((trader) => {
        return {
          name: trader,
          type: "bar",
          data: dates.map((date) => {
            const item = this.tableData.find(
              (d) => d.date === date && d.trader === trader
            );
            return item ? item.profit : 0;
          }),
          label: {
            show: true,
            position: "top",
            formatter: (params) => {
              const item = this.tableData.find(
                (d) => d.date === dates[params.dataIndex] && d.trader === trader
              );
              return item ? `${trader}\n${item.profit}` : "";
            },
          },
        };
      });

      // 设置图表选项
      chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
        },
        legend: { data: traders },
        xAxis: {
          type: "category",
          data: dates,
          axisLabel: {
            interval: 0, // 显示所有日期
          },
        },
        yAxis: { type: "value" },
        series,
        // 控制柱状图间隔
        barGap: "10%", // 组内柱状图间隔
        barCategoryGap: "30%", // 组间柱状图间隔
      });
    },
  },
};
</script>
