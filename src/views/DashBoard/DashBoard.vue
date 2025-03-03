<template lang="html">
  <div class="dashboard">
    <!-- 上部选择日期区间区域 -->
    <div class="header">
      <!-- 日期区间选择器 -->
      <div class="date-selector">
        <label for="start-date">开始日期:</label>
        <input type="date" id="start-date" v-model="startDate" />

        <label for="end-date">结束日期:</label>
        <input type="date" id="end-date" v-model="endDate" />

        <button @click="applyDateRange">应用日期区间</button>
      </div>
    </div>

    <!-- 下部数据展示区域 -->
    <div class="data-display">
      <div class="metrics">
        <!-- 债券交易频次 -->
        <div class="metric">
          <div ref="bondPieChart" style="width: 100%; height: 200px"></div>
          <p>{{ intervalReturn }}%</p>
        </div>

        <!-- 盈利额 -->
        <div class="metric" style="width: 30%">
          <h3>盈利额</h3>
        </div>

        <!-- 用户信息 -->
        <div class="metric" style="width: 60%">
          <h3>用户信息</h3>
          <ComUserInfos
            :searchParam="searchParam"
            @init="initChartB"
            :showDo="true"
            @handleSelectionChange="userSummaryChange"
            :tableSelection="0"
          ></ComUserInfos>
        </div>
      </div>

      <!-- 收益走势图 -->
      <div class="chart">
        <h3>收益走势图</h3>
        <div style="display: flex; width: 100%; margin-top: 20px">
          <div style="flex: 1; display: flex; gap: 10px">
            <div>期初盈亏：</div>
            <div>{{ tradeInfo.Profit }}</div>
          </div>
          <div style="flex: 1; display: flex; gap: 10px">
            <div>当前盈亏：</div>
            <div>{{ tradeInfo.NowProfit }}</div>
          </div>
          <div style="flex: 1; display: flex; gap: 10px">
            <div>成交额资金比：</div>
            <div :style="getStyle(tradeInfo.NowProfit)">
              {{ tradeInfo.NowProfit }}
            </div>
          </div>
          <div style="flex: 1; display: flex; gap: 10px">
            <div>区间收益率：</div>
            <div>100W</div>
          </div>
        </div>
        <div style="display: flex; width: 100%; margin-top: 25px">
          <div style="flex: 1; display: flex; gap: 10px">
            <div>盈亏额：</div>
            <div>{{ tradeInfo.Profit }}</div>
          </div>
          <div style="flex: 1; display: flex; gap: 10px">
            <div>单笔最大盈利：</div>
            <div>{{ tradeInfo.LargestProfit }}</div>
          </div>
          <div style="flex: 1; display: flex; gap: 10px">
            <div>单笔最大亏损：</div>
            <div>{{ tradeInfo.LargestLoss }}</div>
          </div>
          <div style="flex: 1; display: flex; gap: 10px">
            <div>最大日盈亏 ：</div>
            <div>100W</div>
          </div>
          <!-- <div style="flex: 1; display: flex; gap: 10px">
            <div>最大回撤：</div>
            <div>100W</div>
          </div> -->
        </div>

        <el-button-group style="margin-top: 20px">
          <el-button
            id="week-btn"
            :type="active === 'day' ? 'primary' : 'default'"
            @click="updateMainDataByPeriod('day')"
            >日</el-button
          >
          <el-button
            id="week-btn"
            :type="active === 'week' ? 'primary' : 'default'"
            @click="updateMainDataByPeriod('week')"
            >周</el-button
          >
          <el-button
            id="month-btn"
            :type="active === 'month' ? 'primary' : 'default'"
            @click="updateMainDataByPeriod('month')"
            >月</el-button
          >
          <el-button
            id="year-btn"
            :type="active === 'year' ? 'primary' : 'default'"
            @click="updateMainDataByPeriod('year')"
            >年</el-button
          >
        </el-button-group>

        <!-- 这里可以嵌入图表组件，使用 Chart.js 或其他库 -->
        <div id="main-chart" style="width: 100%; height: 300px"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import ComUserInfos from "@/views/components/ComUserInfos.vue";
import ComTest from "@/views/components/ComTest.vue";
export default {
  data() {
    return {
      tradeInfo: {},
      // 选定的日期区间
      startDate: "",
      endDate: "",
      active: "day", //默认按日
      bondPieData: [], // 饼图数据
      // 数据示例
      intervalReturn: 10.5, // 区间收益率（百分比）
      profit: 100000, // 盈利额
      loss: 50000, // 亏损额

      searchParam: {
        date: ["", ""],
        userIds: [],
      }, // 搜索的参数，绑定日期区间和人
    };
  },
  components: {
    ComUserInfos, // ✅ 确保注册了组件
    ComTest,
  },
  mounted() {
    this.InitDays();
    this.initBondChart(); // 初始化债券交易频次饼图

    this.initMainChart(); // 初始化 主图
  },
  methods: {
    // 用户改变选择
    userSummaryChange(rows) {
      console.log("DashBoard感知用户选中发生变化", rows);
      const userIds = rows.map((n) => n.userId);
      if (
        JSON.stringify(this.searchParam.userIds) !== JSON.stringify(userIds)
      ) {
        this.searchParam.userIds = rows.map((n) => n.userId);
      }
    },
    //初始化日期，默认是当天
    InitDays() {
      const today = new Date().toISOString().split("T")[0]; // 获取 YYYY-MM-DD 格式的日期
      this.startDate = today;
      this.endDate = today;
      this.searchParam.date = [this.startDate, this.endDate];
    },
    // 根据周期改变主图
    updateMainDataByPeriod(timeUnit) {
      // 更新选中的时间单位
      this.active = timeUnit;
      console.log(this.active);
      // 根据选择的时间单位更新图表数据
      if (timeUnit === "week") {
        // 更新图表为按周显示
      } else if (timeUnit === "month") {
        // 更新图表为按月显示
      } else if (timeUnit === "year") {
        // 更新图表为按年显示
      } else if (timeUnit === "day") {
        // 更新图表为按日显示
      }
    },

    // 根据值判断颜色，如果大于 0 小于0就绿色，0=黑色
    getStyle(value) {
      return {
        color: value > 0 ? "green" : value < 0 ? "red" : "black",
      };
    },
    initMainChart() {
      // 初始化echarts实例
      var myChart = echarts.init(document.getElementById("main-chart"));

      // 设置图表的配置项
      var option = {
        title: {
          text: "盈亏信息与交易笔数",
          left: "center",
          top: "0",
          textStyle: {
            fontSize: 16,
            fontWeight: "bold",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow", // 用于柱状图
          },
        },
        legend: {
          data: ["盈亏(万)", "交易笔数"], // 添加交易笔数的图例
          top: "15",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "2023-01-01",
            "2023-01-02",
            "2023-01-03",
            "2023-01-04",
            "2023-01-05",
            "2023-01-06",
            "2023-01-07",
            "2023-01-08",
            "2023-01-09",
            "2023-01-10",
            "2023-01-11",
            "2023-01-12",
            "2023-01-13",
            "2023-01-14",
            "2023-01-15",
            "2023-01-16",
            "2023-01-17",
            "2023-01-18",
            "2023-01-19",
            "2023-01-20",
            "2023-01-21",
            "2023-01-22",
            "2023-01-23",
            "2023-01-24",
            "2023-01-25",
            "2023-01-26",
            "2023-01-27",
            "2023-01-28",
            "2023-01-29",
            "2023-01-30",
          ], // 日期轴，30天数据
          axisLabel: {
            interval: 0, // 每个标签都显示
            rotate: 0, // 旋转标签
            formatter: function (value) {
              return value.substring(5); // 去掉年份部分，只显示月份和日期（格式：01-01）
            },
          },
        },
        yAxis: [
          {
            type: "value",
            axisLabel: {
              formatter: "{value} 万", // 设置单位为万
            },
          },
          {
            type: "value",
            axisLabel: {
              formatter: "{value} 笔", // 交易笔数的单位
            },
            position: "right", // 右侧y轴用于显示交易笔数
          },
        ],
        series: [
          {
            name: "盈亏(万)",
            type: "bar", // 设置为柱状图
            data: [
              -1.2, 2.3, 0.5, -0.8, 1.7, -1.9, 2.0, 0.3, -2.3, 1.1, -3.2, 2.7,
              1.8, -1.4, 0.9, 2.1, -2.5, 3.3, -1.1, 2.2, -0.5, 1.8, -1.3, 2.4,
              -0.7, 1.9, -3.1, 2.2, 1.6, 0.7,
            ], // 盈亏数据，负数为亏损，正数为盈利
            itemStyle: {
              color: function (params) {
                // 根据盈亏值设置颜色，负值红色，正值绿色
                return params.value < 0 ? "red" : "green";
              },
            },
            barWidth: "25%", // 设置柱状图的宽度比例
            yAxisIndex: 0, // 使用左侧y轴
            label: {
              show: true, // 显示数据标签
              position: "top", // 数据标签的位置，'top' 表示在柱状图的顶部
              formatter: "{c} 万", // 数据标签的格式，这里显示数值后加上 "万"
              color: "#000", // 标签的颜色
            },
          },
          {
            name: "交易笔数",
            type: "line", // 设置为曲线图
            data: [
              10, 12, 15, 18, 20, 13, 17, 19, 22, 25, 30, 28, 24, 26, 22, 18,
              20, 25, 27, 24, 30, 28, 25, 26, 29, 30, 22, 24, 28, 29,
            ], // 交易笔数数据
            yAxisIndex: 1, // 使用右侧y轴
            smooth: true, // 曲线平滑
            lineStyle: {
              color: "blue", // 设置曲线颜色
            },
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表
      myChart.setOption(option);
    },

    // 初始化债券交易频次饼图
    initBondChart() {
      console.log("初始化债券交易频次饼图");
      const chartElement = this.$refs.bondPieChart;
      const myChart = echarts.init(chartElement);
      this.bondPieData = [
        { bondCode: "240215", tradeCount: 10 },
        { bondCode: "240210", tradeCount: 20 },
        { bondCode: "240225", tradeCount: 15 },
        { bondCode: "240230", tradeCount: 25 },
        { bondCode: "240240", tradeCount: 30 },
        { bondCode: "240250", tradeCount: 12 },
        // 可以根据需要添加更多债券数据
      ];
      // 根据 tradeCount 从高到低排序
      this.bondPieData.sort((a, b) => b.tradeCount - a.tradeCount);
      const topFiveData = this.bondPieData.slice(0, 5); // 截取前五条
      const option = {
        title: {
          text: "债券交易频次",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        series: [
          {
            name: "交易频次",
            type: "pie",
            radius: "50%",
            data: this.bondPieData.map((item) => ({
              name: item.bondCode,
              value: item.tradeCount,
            })),
            emphasis: {
              focus: "series",
            },
          },
        ],
        // legend: {
        //   top: "top", // 让图例居中
        //   orient: "vertical", // 垂直方向排列
        //   left: "left",
        //   data: topFiveData.map((item) => item.bondCode), // 将 legend 数据设置为 bondCode，按顺序排列
        // },
      };

      myChart.setOption(option);
    },
    // 应用日期区间筛选
    applyDateRange() {
      console.log("开始日期:", this.startDate);
      console.log("结束日期:", this.endDate);

      this.searchParam.date = [this.startDate, this.endDate];
      // 在这里实现根据选定日期区间查询数据的逻辑

      console.log("searchParam变化", this.searchParam);
    },
  },
};
</script>

<style lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.date-selector {
  display: flex;
  gap: 10px;
  align-items: center;
}

.date-selector input {
  padding: 5px;
}

.data-display {
  display: flex;
  flex-direction: column;
}

.metrics {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.metric {
  background: #f1f1f1;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  width: 30%;

  max-height: 250px;
}

.chart {
  background: #f1f1f1;
  padding: 20px;
  border-radius: 8px;
}
</style>
