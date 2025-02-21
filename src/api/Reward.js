// 交割回报
import request from '@/utils/request'
export default {
    name:"apiBreak",
  /**
   *交割列表
   * @param {*} params
   */
  get(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/listJiaogeTrade`,
      method: 'get',
      params: {
        deliveryDateEnd: params.deliveryDateEnd,
        deliveryDateStart: params.deliveryDateStart,
        realTradeId: params.realTradeId,
        tradeNum: params.tradeNum,
        tscode: params.tscode,
        userName: params.userName,
        userTradeId: params.userTradeId
      }
    })
  },
  /**
   * 交割撤回
   * @param {*} params
   * @returns
   */
  deliverBack(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/jiaogereturn`,
      method: 'post',
      data: {
        realTradeId: params.realTradeId
      }
    })
  },
  /**
   * 改违约
   * @param {*} params
   * @returns
   */
  deliverBreak(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/gaiweiyue`,
      method: 'post',
      data: {
        wydto: {
          marketMakerName: params.marketMakerName,
          realTradeId: params.realTradeId,
          weiyueAmount: params.weiyueAmount,
          weiyuePerson: params.weiyuePerson,
          weiyueType: params.weiyueType
        }
      }
    })
  }
}
