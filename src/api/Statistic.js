// 用户
import request from "@/utils/request";
export default {
  
  // 获取胜率
  getWindRate(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/statistic/shenglv`,
      method: "post",
      data: {
        startDate: params.startDate,
        endDate: params.endDate,
        userIds:params.userIds,
        channelIds:params.channelIds,
        weidu:params.weidu
      }
    });
  },


   // 获取盈亏比1
   getYingKui1(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/statistic/yingkuibi1`,
      method: "post",
      data: {
        startDate: params.startDate,
        endDate: params.endDate,
        userIds:params.userIds,
        channelIds:params.channelIds,
        weidu:params.weidu
      }
    });
  },

  // 获取盈亏比2
  getYingKui2(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/statistic/yingkuibi2`,
      method: "post",
      data: {
        startDate: params.startDate,
        endDate: params.endDate,
        userIds:params.userIds,
        channelIds:params.channelIds,
        weidu:params.weidu
      }
    });
  },
};
