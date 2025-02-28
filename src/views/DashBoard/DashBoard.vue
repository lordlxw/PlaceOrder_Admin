<template lang="html">
  <div class="dashboard">
    <!-- 上部选择日期区间区域 -->
    <div class="header">
      <h1>消息看板</h1>

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
        <!-- 区间收益率 -->
        <div class="metric">
          <h3>区间收益率</h3>
          <p>{{ intervalReturn }}%</p>
        </div>

        <!-- 盈利额 -->
        <div class="metric">
          <h3>盈利额</h3>
          <p>￥{{ profit }}</p>
        </div>

        <!-- 亏损额 -->
        <div class="metric">
          <h3>亏损额</h3>
          <p>￥{{ loss }}</p>
        </div>
      </div>

      <!-- 收益走势图 -->
      <div class="chart">
        <h3>收益走势图</h3>
        <!-- 这里可以嵌入图表组件，使用 Chart.js 或其他库 -->
        <canvas id="profit-chart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 选定的日期区间
      startDate: "",
      endDate: "",
      // 数据示例
      intervalReturn: 10.5, // 区间收益率（百分比）
      profit: 100000, // 盈利额
      loss: 50000, // 亏损额
    };
  },
  methods: {
    // 应用日期区间筛选
    applyDateRange() {
      console.log("开始日期:", this.startDate);
      console.log("结束日期:", this.endDate);
      // 在这里实现根据选定日期区间查询数据的逻辑
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
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  width: 30%;
}

.chart {
  background: #f1f1f1;
  padding: 20px;
  border-radius: 8px;
}
</style>
