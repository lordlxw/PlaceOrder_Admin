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
          <!-- <ComTest></ComTest> -->
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
      <div class="chart" v-show="true">
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
        <el-switch
          style="margin-top: 20px"
          v-model="switchValue"
          size="large"
          active-text="个人"
          inactive-text="整体"
        />
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
import api from "@/api/Statistic.js"; // 导入你写的 user.js 文件
import { markRaw } from "vue";
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
      switchValue: false,
      searchParam: {
        date: ["", ""],
        userIds: [],
      }, // 搜索的参数，绑定日期区间和人

      rawData: [], //主图的数据(整体数据)
      personalData: [], // 主图的数据(个人数据)

      myChart: {},
    };
  },
  components: {
    ComUserInfos, // ✅ 确保注册了组件
    ComTest,
  },

  mounted() {
    //this.myChart = echarts.init(document.getElementById("main-chart"));

    this.myChart = markRaw(echarts.init(document.getElementById("main-chart")));
    this.InitDays();
    this.initBondChart(); // 初始化债券交易频次饼图

    // 生成30天的随机数据
    this.rawData = this.generateRandomData();
    //this.initMainChart(this.rawData, false); // 初始化 主图
  },
  watch: {
    //当按键切换时触发
    switchValue(newValue) {
      //let data = newValue ? this.personalData : this.rawData;
      console.log("按键切换", newValue);
      if (newValue) {
        // 说明是个人
        this.initMainChart(null, newValue);
      } else {
        this.initMainChart(this.rawData, false); // 初始化 主图
      }
    },
  },
  methods: {
    // 初始化盈亏比/胜率
    initChart(winRateData, profitLossData, smoothLine) {
      console.log("胜率数据:", winRateData);
      console.log("盈亏比数据:", profitLossData);

      // X轴交易员姓名
      let traderNames = winRateData.map((d) => d.index);

      // 胜率数据（转换为百分比）
      let winRates = winRateData.map((d) => d.shenglv * 100);

      // 盈亏比数据
      let profitLossRatios = profitLossData.map((d) => d.yingkuibi);

      // 盈亏值数据
      let profits = profitLossData.map((d) => d.ying); // 盈
      let losses = profitLossData.map((d) => d.kui); // 亏

      // 清空现有配置
      this.myChart.clear();

      let option = {
        title: { text: "交易胜率 & 盈亏比", left: "center" },
        tooltip: { trigger: "axis" },
        legend: {
          data: ["胜率", "盈亏比", "盈", "亏"],
          top: "9%",
          left: "25%",
          zIndex: 122200, // 设置 zIndex，确保它位于最前面
        },
        grid: {
          left: "15%", // 适当增加
          right: "15%", // 适当增加
          bottom: "15%",
          containLabel: true, // 确保标签不被裁剪
        },
        xAxis: {
          type: "category",
          data: traderNames,
          axisLabel: {
            interval: 0, // 强制显示所有标签
            fontSize: 12,
          },
        },
        yAxis: [
          {
            type: "value",
            name: "胜率 (%)",
            min: 0,
            max: 100,
            axisLabel: { formatter: "{value} %" },
          },
          {
            type: "value",
            name: "盈亏比",
            min: 0,
            axisLabel: { formatter: "{value}" },
          },
        ],
        series: [
          {
            name: "胜率",
            type: "bar",
            data: winRates,
            yAxisIndex: 0,
            color: "#2196F3",
            label: { show: true, position: "top", formatter: "{c}%" },
          },
          {
            name: "盈亏比",
            type: "line",
            yAxisIndex: 1,
            data: profitLossRatios,
            color: "#FF9800",
            lineStyle: { width: 3 },
            symbol: "circle",
            symbolSize: 8,
            smooth: smoothLine,
            label: { show: true, position: "top" },
          },
          {
            name: "盈",
            type: "bar",
            data: profits,
            yAxisIndex: 0,
            color: "#4CAF50", // 绿色，表示盈
            label: { show: true, position: "top" },
          },
          {
            name: "亏",
            type: "bar",
            data: losses,
            yAxisIndex: 0,
            color: "#F44336", // 红色，表示亏
            label: { show: true, position: "top" },
          },
        ],
      };
      // 绑定图例选中事件
      this.myChart.on("legendselectchanged", function (params) {
        console.log("图例选中变化:", params);
        console.log("当前选择的系列:", params.selected);
      });
      this.myChart.setOption(option);
    },

    // 生成30天的随机数据
    generateRandomData() {
      let data = [];

      for (let i = 0; i < 14; i++) {
        let date = this.formatDate(new Date(2023, 0, i + 1)); // 假设数据是从 2023年1月1日开始
        let profitLoss = this.randomFloat(-5, 5); // 盈亏数据，范围从 -5 到 5
        let tradeCount = this.randomInt(10, 40); // 交易笔数，范围从 10 到 40

        data.push({
          date: date,
          profitLoss: profitLoss,
          tradeCount: tradeCount,
        });
      }

      return data;
    },
    // 随机生成浮动数字
    randomFloat(min, max) {
      return (Math.random() * (max - min) + min).toFixed(1); // 返回1位小数
    },

    // 随机生成整数
    randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // 格式化日期
    formatDate(date) {
      let month = ("0" + (date.getMonth() + 1)).slice(-2); // 获取月份
      let day = ("0" + date.getDate()).slice(-2); // 获取日期
      return `${date.getFullYear()}-${month}-${day}`;
    },
    // 用户改变选择
    userSummaryChange(rows) {
      console.log("DashBoard感知用户选中发生变化", rows);
      console.log("112345");
      const userIds = rows.map((n) => n.userId);
      console.log("userIds", userIds);
      if (
        JSON.stringify(this.searchParam.userIds) !== JSON.stringify(userIds)
      ) {
        this.searchParam.userIds = userIds;
      }
      console.log("searchParam", this.searchParam);
    },
    //初始化日期，默认是当天
    InitDays() {
      const today = new Date().toISOString().split("T")[0]; // 获取 YYYY-MM-DD 格式的日期
      this.startDate = today;
      this.endDate = today;
      this.searchParam.date = [this.startDate, this.endDate];
    },
    // 根据周期改变主图
    updateMainDataByPeriod(period) {
      this.active = period;

      let groupedData = [];
      if (period === "day") {
        groupedData = this.rawData;
        console.log("按日", this.rawData);
      } else if (period === "week") {
        groupedData = this.groupDataByWeek();
      } else if (period === "month") {
        groupedData = this.groupDataByMonth();
      } else if (period === "year") {
        groupedData = this.groupDataByYear();
      }

      console.log("grouedData---", groupedData);
      this.initMainChart(groupedData);
    },
    // 按周汇总
    groupDataByWeek() {
      console.log("按周汇总");
      let result = [];
      let weekProfit = 0;
      let weekTrades = 0;
      let count = 0;
      let weekStart = "";

      console.log("weekrawData", this.rawData);
      this.rawData.forEach((d, index) => {
        // 确保 profitLoss 和 tradeCount 是数值类型
        const profitLoss = parseFloat(d.profitLoss) || 0; // 将 profitLoss 转为数字类型，默认为 0
        const tradeCount = parseInt(d.tradeCount, 10) || 0; // 将 tradeCount 转为数字类型，默认为 0

        if (count === 0) weekStart = d.date;

        weekProfit += profitLoss; // 累加利润
        weekTrades += tradeCount; // 累加交易次数
        count++;

        if (count === 7 || index === this.rawData.length - 1) {
          result.push({
            date: weekStart,
            profitLoss: weekProfit,
            tradeCount: weekTrades,
          });
          weekProfit = 0;
          weekTrades = 0;
          count = 0;
        }
      });

      console.log("weekrawData按周数据处理返回后", result);
      return result;
    },

    // 按月汇总
    groupDataByMonth() {
      console.log("按月汇总");
      let result = [];
      let monthProfit = 0;
      let monthTrades = 0;
      let monthStart = "";

      console.log("monthRawData", this.rawData);
      this.rawData.forEach((d, index) => {
        // 检查 d.date 格式是否为 "YYYY-MM"，并提取年份和月份部分
        const month = d.date.slice(0, 7); // "YYYY-MM"

        // 打印每个 d.date 的值，检查是否有格式问题
        console.log("Checking date:", d.date, "Month:", month);

        const profitLoss = parseFloat(d.profitLoss) || 0; // 将 profitLoss 转为数字类型，默认为 0
        const tradeCount = parseInt(d.tradeCount, 10) || 0; // 将 tradeCount 转为数字类型，默认为 0

        if (monthStart === "") monthStart = month;

        // 只在月份变化时进行汇总
        if (monthStart === month) {
          monthProfit += profitLoss;
          monthTrades += tradeCount;
        } else {
          result.push({
            date: monthStart,
            profitLoss: monthProfit,
            tradesCount: monthTrades,
          });

          // 更新为当前月份，重新计数
          monthStart = month;
          monthProfit = profitLoss;
          monthTrades = tradeCount;
        }

        // 处理最后一条数据，确保它被加入到结果中
        if (index === this.rawData.length - 1) {
          result.push({
            date: monthStart,
            profitLoss: monthProfit,
            tradesCount: monthTrades,
          });
        }
      });
      // 修改结果中的日期字段，确保日期是 "YYYY-MM-01" 格式
      result = result.map((item) => {
        return {
          ...item,
          date: item.date + "-01", // 将日期从 "YYYY-MM" 转换为 "YYYY-MM-01"
        };
      });

      console.log("weekrawData按月数据处理返回后", result);
      return result;
    },

    // 按年汇总
    groupDataByYear() {
      console.log("按年汇总");
      let result = [];
      let yearProfit = 0;
      let yearTrades = 0;

      this.rawData.forEach((d, index) => {
        // 获取年份部分
        let year = d.date.substring(0, 4); // "YYYY"

        // 确保 profit 和 trades 是数值类型
        const profitLoss = parseFloat(d.profitLoss) || 0; // 将 profitLoss 转为数字类型，默认为 0
        const tradeCount = parseInt(d.tradeCount, 10) || 0; // 将 tradeCount 转为数字类型，默认为 0

        // 如果 result 数组为空或该年份的数据不存在，则添加新数据
        const existingYearData = result.find((item) => item.date === year);

        if (existingYearData) {
          // 如果该年份的数据已存在，累加数据
          existingYearData.profitLoss += profitLoss;
          existingYearData.tradesCount += tradeCount;
        } else {
          // 如果该年份的数据不存在，则添加新的条目
          result.push({
            date: year,
            profitLoss: profitLoss,
            tradesCount: tradeCount,
          });
        }
      });

      // 修改结果中的日期字段，确保日期是 "YYYY-01-01" 格式
      result = result.map((item) => {
        return {
          ...item,
          date: item.date + "-01-01", // 将日期从 "YYYY" 转换为 "YYYY-01-01"
        };
      });

      console.log("weekrawData按年数据处理返回后", result);
      return result;
    },

    // 根据值判断颜色，如果大于 0 小于0就绿色，0=黑色
    getStyle(value) {
      return {
        color: value > 0 ? "green" : value < 0 ? "red" : "black",
      };
    },
    initMainChart(rawData, isPersonalData) {
      console.log("元数据", rawData);
      console.log("是否是交易员数据", isPersonalData);
      // if (!rawData || rawData.length === 0) {
      //   console.log("数据为空，清空图表");
      //   this.myChart.clear();
      //   return;
      // }
      console.log("AAAAAA");
      if (!isPersonalData) {
        console.log("加载主图");
        this.renderMainChart(rawData);
      } else {
        console.log("加载交易员图");
        this.renderPersonalChart();
      }
    },
    renderMainChart(rawData) {
      this.myChart.clear();
      let dates = rawData.map((item) => item.date);
      let profitLossData = rawData.map((item) => item.profitLoss);
      let tradeCountData = rawData.map((item) => item.tradeCount);

      // 动态计算柱子的宽度，假设数据量小于某个值时，柱子宽度会变窄
      let barWidth;
      if (rawData.length <= 7) {
        barWidth = "12%"; // 数据量小于或等于7条时，柱子宽度为 10%
      } else if (rawData.length <= 15) {
        barWidth = "8%"; // 数据量小于或等于15条时，柱子宽度为 5%
      } else {
        barWidth = "5%"; // 数据量大于15条时，柱子宽度为 2%
      }

      let option = {
        title: { text: "盈亏信息与交易笔数", left: "center", top: "0" },
        tooltip: {
          trigger: "item", // 设置为 'item'，悬浮在具体的数据点上时触发
          formatter: function (params) {
            // 使用 formatter 函数自定义悬浮时的显示内容
            let tooltipHtml = "";
            // 根据不同的系列类型显示盈亏（万）或交易笔数（笔）
            tooltipHtml +=
              params.seriesName +
              " : " +
              params.value +
              (params.seriesName === "盈亏(万)" ? " 万" : " 笔") +
              "<br>";
            return tooltipHtml;
          },
        },
        legend: { data: ["盈亏(万)", "交易笔数"], top: "25" },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: dates,
          axisLabel: {
            interval: 0,
            rotate: 0,
            formatter: (value) => value.substring(5),
          },
        },
        yAxis: [
          { type: "value", axisLabel: { formatter: "{value} 万" } },
          {
            type: "value",
            axisLabel: { formatter: "{value} 笔" },
            position: "right",
          },
        ],
        series: [
          {
            name: "盈亏(万)",
            type: "bar",
            data: profitLossData,
            itemStyle: {
              color: (params) => (params.value < 0 ? "red" : "green"),
            },
            barWidth: barWidth, // 动态调整柱子的宽度
            yAxisIndex: 0,
            label: {
              show: true,
              position: "top",
              formatter: "{c} 万",
              color: "#000",
            },
            barGap: "50%", // 增加柱状图间距，防止重叠
          },
          {
            name: "交易笔数",
            type: "line",
            data: tradeCountData,
            yAxisIndex: 1,
            smooth: true,
            lineStyle: { color: "blue" },
            label: {
              show: true,
              position: "top",
              formatter: "{c} 笔",
              color: "blue",
            },
            symbolSize: 6, // 减小折线图标记的大小，防止重叠
            z: 10, // 设置折线图的 z-index，使其显示在柱状图上方
          },
        ],
      };
      this.myChart.setOption(option);
    },
    renderPersonalChart() {
      this.myChart.clear();
      this.personalData = [];
      (this.personalData = [
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
      ]),
        console.log("输出个人信息", this.personalData);
      if (!this.personalData.length) return;
      const dates = [...new Set(this.personalData.map((item) => item.date))];
      const traders = [
        ...new Set(this.personalData.map((item) => item.trader)),
      ];

      const series = traders.map((trader) => ({
        name: trader,
        type: "bar",
        data: dates.map((date) => {
          const item = this.personalData.find(
            (d) => d.date === date && d.trader === trader
          );
          return item ? item.profit : 0;
        }),
        label: {
          show: true,
          position: "top",
          formatter: (params) => {
            const item = this.personalData.find(
              (d) => d.date === dates[params.dataIndex] && d.trader === trader
            );
            return item ? `${trader}\n${item.profit}` : "";
          },
        },
      }));

      this.myChart.setOption({
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        legend: { data: traders },
        xAxis: { type: "category", data: dates, axisLabel: { interval: 0 } },
        yAxis: { type: "value" },
        series,
        barGap: "10%",
        barCategoryGap: "30%",
      });
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
      // 直接修改 searchParam.date，不重新赋值整个对象
      // 直接修改 searchParam.date
      this.searchParam.date = [this.startDate, this.endDate];
      console.log("applyDateRange222", this.searchParam);
      //this.searchParam.userIds = userIds;
      //this.searchParam.date = [this.startDate, this.endDate];
      // 在这里实现根据选定日期区间查询数据的逻辑
      // 定义请求参数
      var params = {
        endDate: this.endDate,
        startDate: this.startDate,
        weidu: "person",
        userIds: this.searchParam.userIds,
        channelIds: ["f09639756a47415fb4fbf6d31febbad4"],
      };
      console.log("输出params", params);
      // 调用 API 获取数据
      Promise.all([
        api.getWindRate(params), // 请求胜率数据
        api.getYingKui1(params), // 请求盈亏比数据
      ])
        .then(([winRateResponse, profitLossResponse]) => {
          console.log("胜率数据:", winRateResponse);
          console.log("盈亏比数据:", profitLossResponse);

          if (
            winRateResponse.code === "00000" &&
            profitLossResponse.code === "00000"
          ) {
            this.initChart(
              winRateResponse.value,
              profitLossResponse.value,
              true
            );
          } else {
            console.error(
              "API 返回错误:",
              winRateResponse.code,
              profitLossResponse.code
            );
          }
        })
        .catch((error) => {
          console.error("获取数据失败:", error);
        });
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
