import request from '@/utils/request'

export default {
  // 下个工作日
  nextDealDay(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/holidays/getNextWorkday`,
      method: 'get',
      params: {
        date: params.deliveryTime
      }
    })
  },
  // 一月内节假日
  holidayOfMonth() {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/holidays/getHolidayInOneMonth`,
      method: 'get'
    })
  },
  // 节假日查询
  holiday() {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/holidays/getAll`,
      method: 'get'
    })
  }
}
