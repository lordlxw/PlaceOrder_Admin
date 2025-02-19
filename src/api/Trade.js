// 交易管理
import request from "@/utils/request";
export default {
  /**
   * 新增询价单
   * @param {*} params
   * @returns
   */
  inquirySheetAdd(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/add`,
      method: "post",
      data: {
        // 交割速度
        deliverySpeed: params.deliverySpeed,
        // 交割日期
        deliveryTime: params.deliveryTime,
        // 买还是卖
        direction: params.direction,
        // 成交价格
        price: params.price,
        // 交易员
        tradeuserId: params.tradeuserId,
        // 债券编号
        tscode: params.tscode,
        // 成交量
        volume: params.volume,
        // 备注
        // remark: params.remark,
        // 允许浮动
        worstPrice: params.worstPrice,
        // 相关单号
        relativeNum: params.relativeNum,
        // 滚单相关单号
        sourceNum: params.sourceNum,
        // 优先
        isYouxian: params.isYouxian,
        // 优先级别
        youxianLevel: params.youxianLevel,

        brokerId: params.brokerId
      }
    });
  },
  // 修改询价单
  inquirySheetEdit(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/changerequest`,
      method: "post",
      data: {
        gaijiaTradeId: params.gaijiaTradeId,
        userTradeId: params.userTradeId,
        // 交割速度
        deliverySpeed: params.deliverySpeed,
        // 交割日期
        deliveryTime: params.deliveryTime,
        // 买还是卖
        direction: params.direction,
        // 成交价格
        price: params.price,
        // 债券编号
        tscode: params.tscode,
        // 成交量
        restVolume: params.restVolume,
        // 备注
        // remark: params.remark,
        // 允许浮动
        worstPrice: params.worstPrice
      }
    });
  },
  /**
   * 询价单接收
   * @param {*} params
   */
  inquiryAccept(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/accept?usertradeId=${params.usertradeId}`,
      method: "POST"
    });
  },
  /**
   * 询价单拒绝
   * @param {*} params
   */
  inquiryRejection(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/deny?usertradeId=${params.usertradeId}`,
      method: "post"
    });
  },
  /**
   * 成交修改
   * @param {*} params
   * @returns
   */
  inquiryDeal(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/deal`,
      method: "post",
      data: {
        // 询价单单号ID
        userTradeId: params.usertradeId,
        // 成交价格
        price: params.price,
        // 成交量
        volume: params.volume,
        // 交割速度
        deliverySpeed: 0,
        // 交割时间
        deliveryTime: params.deliveryTime,
        // 备注
        // remark: params.remark,
        // 交易对手
        counterParty: params.counterParty,
        // 联系人
        contactPerson: params.contactPerson,
        // 联系方式
        contactType: params.contactType
      }
    });
  },
  updateTradeState(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/chatWorkOrder/tradeState/modify`,
      method: "post",
      data: params
    });
  },
  /**
   * 撤单
   * @param {*} params
   * @returns
   */
  inquiryCancel(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/cancel?usertradeId=${params.usertradeId}`,
      method: "post"
    });
  },
  /**
   * 成交单撤单
   * @param {*} params
   * @returns
   */
  cancelRealTrade(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/cancelRealTrade?usertradeId`,
      data: params,
      method: "post"
    });
  },
  inquiryCancelRequest(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/cancelrequest?usertradeId=${params.usertradeId}`,
      method: "post"
    });
  },
  // 确认撤单
  inquiryCancelConfirm(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/confirmcancel?usertradeId=${params.usertradeId}`,
      method: "post"
    });
  },
  // 拒绝撤单
  inquiryCancelRejection(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/denycancel?usertradeId=${params.usertradeId}`,
      method: "post"
    });
  },
  /**
   * 询价单查询列表
   * @param {*} params
   */
  inquiryQuery(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/listByCurrentUser`,
      method: "get",
      params: {
        // 交割结束日期,示例值(2022-10-10)
        deliveryDateEnd: params.deliveryDateEnd,
        // 交割起始日期,示例值(2022-10-01)
        deliveryDateStart: params.deliveryDateStart,
        // 状态
        status: params.status,
        // 交易结束日期,示例值(2022-10-10)
        tradeDateEnd: params.tradeDateEnd,
        // 交易起始日期,示例值(2022-10-01)
        tradeDateStart: params.tradeDateStart,
        // 单号
        tradeNum: params.tradeNum,
        // 债券代码
        tscode: params.tscode,
        // 用户名称
        userName: params.userName,
        // 交易ID
        userTradeId: params.userTradeId,
        orderBy: params.orderBy,
        isAsc: params.isAsc,
        userBy: params.userBy
        // 当前页
        // pageNum: params.pageNum,
        // 显示条数
        // pageSize: params.pageSize
      }
    });
  },
  kecheQuery(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/listKeche`,
      method: "get",
      params: {
        // 交割结束日期,示例值(2022-10-10)
        deliveryDateEnd: params.deliveryDateEnd,
        // 交割起始日期,示例值(2022-10-01)
        deliveryDateStart: params.deliveryDateStart,
        // 状态
        status: params.status,
        // 交易结束日期,示例值(2022-10-10)
        tradeDateEnd: params.tradeDateEnd,
        // 交易起始日期,示例值(2022-10-01)
        tradeDateStart: params.tradeDateStart,
        // 单号
        tradeNum: params.tradeNum,
        // 债券代码
        tscode: params.tscode,
        // 用户名称
        userName: params.userName,
        // 交易ID
        userTradeId: params.userTradeId,
        orderBy: params.orderBy,
        isAsc: params.isAsc
        // 当前页
        // pageNum: params.pageNum,
        // 显示条数
        // pageSize: params.pageSize
      }
    });
  },
  /**
   * 确认成交
   * @param {*} params
   */
  inquiryDealConfirm(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/confirmdeal`,
      method: "post",
      data: {
        userTradeId: params.userTradeId
      }
    });
  },
  /**
   * 拒绝成交
   * @param {*} params
   */
  inquiryDealRejection(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/denydeal`,
      method: "post",
      data: {
        userTradeId: params.userTradeId
      }
    });
  },
  // 难成
  difficultAcheve(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/nancheng`,
      method: "post",
      data: {
        // 难成原因
        reason: params.reason,
        userTradeId: params.userTradeId
      }
    });
  },
  // 难成保留
  difficultStay(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/nanchengbaoliu`,
      method: "post",
      data: {
        userTradeId: params.userTradeId
      }
    });
  },
  // 难成撤单
  difficultAcheveCannel(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/nanchengchedan`,
      method: "post",
      data: {
        userTradeId: params.userTradeId
      }
    });
  },
  // 根据滚单号查询开仓和平仓信息
  detailByRelativeNum(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/detailByRelativeNum`,
      method: "get",
      params: {
        relativeNum: params.relativeNum,
        yanjiuyuanId: params.yanjiuyuanId
      }
    });
  },
  // 滚单接收
  bondRollAccept(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/gundanaccept`,
      method: "post",
      data: {
        relativeNum: params.relativeNum
      }
    });
  },
  // 滚单拒收
  bondRollReject(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/gundandeny`,
      method: "post",
      data: {
        relativeNum: params.relativeNum
      }
    });
  },
  // 询价修改内容查看详情
  inquiryChangeCheck(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/changecheck`,
      method: "post",
      data: {
        userTradeId: params.userTradeId
      }
    });
  },
  // 询价修改确认
  inquiryEditConfirm(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/changeconfirm`,
      method: "post",
      data: {
        userTradeId: params.userTradeId
      }
    });
  },
  // 询价修改拒绝
  inquiryEditReject(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/changedeny`,
      method: "post",
      data: {
        userTradeId: params.userTradeId
      }
    });
  },
  // 账号风控接口
  accountRiskControl(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/tradeamountlimit/userlatestriskinfo`,
      method: "post",
      data: {
        userId: params.userId
      }
    });
  },
  getChatMessages() {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/chatMessage`,
      method: "get"
    });
  },
  hijackChat(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/chatMessage/hijackChat`,
      method: "post",
      data: params
    });
  },
  lockUserTrade(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/lock`,
      method: "post",
      data: params
    });
  },
  unlockUserTrade(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/usertrade/unlock`,
      method: "post",
      data: params
    });
  },
  getChatMessagesByCondition(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/chatMessage/findCondition`,
      method: "post",
      data: params
    });
  },
  getSysChatMessagesByCondition(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/chatMessage/sys/findCondition`,
      method: "post",
      data: params
    });
  },
  sendChatMessages(data, key) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/chatMessage/${key}/send`,
      method: "post",
      data
    });
  },
  updateChatMessages(data, id) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/chatMessage/${id}`,
      method: "put",
      data
    });
  },
  chatWorkOrderSave(data) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/chatWorkOrder`,
      method: "post",
      data
    });
  },
  messageConsumed(data) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/qpinform/messageconsumed`,
      method: "post",
      data
    });
  },
  getOperationTrack(data) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/operationTrack/findCondition`,
      method: "post",
      data
    });
  },
  getMaxBidBy(tscode) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/tradeamountlimit/getMaxBidByTscode?tscode=${tscode}`,
      method: "get"
    });
  }
};
