// 持仓单
import request from "@/utils/request";
export default {
  /**
   * 未平仓列表
   * @param {*} params
   */
  get(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/listByCurrentUser?orderBy=${params.orderBy}&isAsc=${params.isAsc}`,
      method: "get",
      params: {
        deliveryDateEnd: params.deliveryDateEnd,
        deliveryDateStart: params.deliveryDateStart,
        realTradeId: params.realTradeId,
        tradeNum: params.tradeNum,
        tscode: params.tscode,
        userName: params.userName,
        userTradeId: params.userTradeId,
        userBy: params.userBy,
      }
    });
  },
  /**
   * 已平仓列表
   * @param {*} params
   */
  getFinish(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/listFinishTrade?orderBy=${params.orderBy}&isAsc=${params.isAsc}`,
      method: "get",
      params: {
        deliveryDateEnd: params.deliveryDateEnd,
        deliveryDateStart: params.deliveryDateStart,
        realTradeId: params.realTradeId,
        tradeNum: params.tradeNum,
        tscode: params.tscode,
        userName: params.userName,
        userTradeId: params.userTradeId,
        userBy: params.userBy,
        hasFront: params.hasFront,
        hasMiddle: params.hasMiddle,
        hasBackEnd: params.hasBackEnd
      }
    });
  },
  // 违约查询列表
  getBreak(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/listweiyueTrade`,
      method: "get",
      params: {
        deliveryDateEnd: params.deliveryDateEnd,
        deliveryDateStart: params.deliveryDateStart,
        realTradeId: params.realTradeId,
        tradeNum: params.tradeNum,
        tscode: params.tscode,
        userName: params.userName,
        userTradeId: params.userTradeId
      }
    });
  },
  /**
   * 平仓
   * @param {*} params
   */
  bondsCover(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/pingcang`,
      method: "post",
      data: {
        // 交割速度
        deliverySpeed: params.deliverySpeed,
        // 交割日期
        deliveryTime: params.deliveryTime,
        // 原交割日期
        deliveryTime2: params.deliveryTime2,
        // 方向
        direction: params.direction,
        // 成交价格
        price: params.price,
        // 交易单号ID 数组
        realTradeIdList: params.realTradeIdList,
        // 备注
        // remark: params.remark,
        // 债券编号
        tscode: params.tscode,
        // 交易员ID
        userId: params.userId,
        // 成交量
        volume: params.volume,
        // 允许浮动
        worstPrice: params.worstPrice,
        // 相关单号
        relativeNum: params.relativeNum,
        brokerId: params.brokerid
      }
    });
  },
  bondsCoverAgain(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/qiangping`,
      method: "post",
      data: {
        // 交割速度
        deliverySpeed: params.deliverySpeed,
        // 交割日期
        deliveryTime: params.deliveryTime,
        // 方向
        direction: params.direction,
        // 债券编号
        tscode: params.tscode,
        // 交易员ID
        userId: params.userId,
        // 成交量
        volume: params.volume,
      }
    });
  },
  /**
   * 交易员列表查询
   * @param {*} params
   */
  dealPersionList(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/listTrader`,
      method: "post",
      data: {
        // 交易单号ID
        realTradeIdList: params.realTradeIdList
      }
    });
  },
  /**
   * 滚单
   * @param {*} params
   */
  dealRoll(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/gundan`,
      method: "post",
      data: {
        first: {
          deliverySpeed: params.deliverySpeed,
          deliveryTime: params.deliveryTime,
          direction: params.direction,
          price: params.price,
          remark: params.remark,
          tscode: params.tscode,
          userId: params.userId,
          volume: params.volume,
          isYouxian: params.isYouxian ? 1 : 0
        },
        second: {
          deliverySpeed: params.deliverySpeed2,
          deliveryTime: params.deliveryTime2,
          direction: params.direction2,
          price: params.price2,
          remark: params.remark2,
          tscode: params.tscode2,
          userId: params.userId2,
          volume: params.volume2,
          isYouxian: params.isYouxian2 ? 1 : 0
        },
        relativeNum: params.relativeNum,
        deliveryTime2: params.deliveryTime3
      }
    });
  },
  // 已平仓交割
  dealDelivery(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/jiaoge`,
      method: "post",
      data: {
        // 恶意违约id数组列表
        // eyiweiyueIdlist: params.eyiweiyueIdlist,
        // 交割id数组列表
        // jiaogeIdlist: params.jiaogeIdlist,
        // 技术违约id数组列表
        // jishuweiyueIdmap: params.jishuweiyueIdmap,
        // finishCode
        // finishCode: params.finishCode
        finishCodeList: params.finishCodeList,
        wyList: params.wyList
      }
    });
  },
  // 未平仓修改申请
  dealNoBondsEdit(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/weipingchangerequest`,
      method: "post",
      data: {
        // 联系人
        contactPerson: params.contactPerson,
        // 联系方式
        contactType: params.contactType,
        // 交易对手
        counterParty: params.counterParty,
        // 交割速度
        deliverySpeed: params.deliverySpeed,
        // 交割时间
        deliveryTime: params.deliveryTime,
        // 成交价格
        price: params.price,
        // 交易单ID
        realTradeId: params.realTradeId,
        // 备注
        // remark: params.remark,
        // 成交量
        volume: params.volume
      }
    });
  },
  // 已平仓修改申请
  dealBondsEdit(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/yipingchangerequest`,
      method: "post",
      data: {
        // 联系人
        contactPerson: params.contactPerson,
        // 联系方式
        contactType: params.contactType,
        // 交易对手
        counterParty: params.counterParty,
        // 交割速度
        deliverySpeed: params.deliverySpeed,
        // 交割时间
        deliveryTime: params.deliveryTime,
        // 成交价格
        price: params.price,
        // 交易单ID
        realTradeId: params.realTradeId,
        // 备注
        // remark: params.remark,
        // 成交量
        volume: params.volume
      }
    });
  },
  // 未平仓修改申请确认审核通过
  dealNoBondsEditComfirm(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/weipingchangeconfirm`,
      method: "post",
      data: {
        realTradeId: params.realTradeId
      }
    });
  },
  // 已平仓修改申请确认审核通过
  dealBondsEditComfirm(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/yipingchangeconfirm`,
      method: "post",
      data: {
        realTradeId: params.realTradeId
      }
    });
  },
  // 未平仓修改申请拒绝通过
  dealNoBondsEditRejection(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/weipingchangedeny`,
      method: "post",
      data: {
        realTradeId: params.realTradeId
      }
    });
  },
  // 已平仓修改申请拒绝通过
  dealBondsEditRejection(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/yipingchangedeny`,
      method: "post",
      data: {
        realTradeId: params.realTradeId
      }
    });
  },
  // 交易违约
  dealBreak(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/weiyue`,
      method: "post",
      data: {
        realTradeId: params.realTradeId
      }
    });
  },
  // 违约撤回
  dealBreakReturn(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/weiyuereturn`,
      method: "post",
      data: {
        realTradeId: params.realTradeId
      }
    });
  },
  // 未平全量导出
  nobondsAllExport() {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/weipingexport`,
      method: "get",
      responseType: "arraybuffer"
    });
  },
  // 已平全量导出
  bondsAllExport() {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/export`,
      method: "get",
      responseType: "arraybuffer"
    });
  },
  // 已平增量导出
  bondsAddExport() {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/export`,
      method: "get",
      responseType: "arraybuffer"
    });
  },
  // 口头违约申请
  bondsSayBreakApply(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/koutouweiyueRequest`,
      method: "post",
      data: {
        realTradeId: params.realTradeId
      }
    });
  },
  // 口头违约确认
  bondsSayBreakConfirm(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/koutouweiyueConfirm`,
      method: "post",
      data: {
        realTradeId: params.realTradeId
      }
    });
  },
  // 口头违约拒绝
  bondsSayBreakRejection(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/koutouweiyuedeny`,
      method: "post",
      data: {
        realTradeId: params.realTradeId
      }
    });
  },
  // 未平持仓修改内容查看
  nobondsUpdateContent(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/weipingchangecheck`,
      method: "post",
      data: {
        realTradeId: params.realTradeId
      }
    });
  },
  // 已平持仓修改内容查看
  bondsUpdateContent(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/yipingchangecheck`,
      method: "post",
      data: {
        realTradeId: params.realTradeId
      }
    });
  },
  // 是否显示交割按钮
  deliveryBtnIsShow() {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/jiaogeButtonHidden`,
      method: "get"
    });
  }
};
