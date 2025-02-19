// 用户
import request from "@/utils/request";
export default {
  // 系统用户列表查询
  get(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/system/user/list`,
      method: "get",
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize
      }
    });
  },
  // 角色全量查询
  getAll() {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/system/role/optionselect`,
      method: "get"
    });
  },
  // 系统用户新增
  add(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/system/user`,
      method: "post",
      data: {
        userName: params.userName,
        roleIds: params.roleIds,
        password: params.password,
        nickName: params.nickName,
        phonenumber: params.phonenumber,
        remark: params.remark,
        tscode: params.tscode
      }
    });
  },
  // 系统用户修改
  edit(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/system/user`,
      method: "put",
      data: {
        userId: params.userId,
        userName: params.userName,
        roleIds: params.roleIds,
        nickName: params.nickName,
        phonenumber: params.phonenumber,
        remark: params.remark,
        tscode: params.tscode
      }
    });
  },
  // 修改状态
  updateStatus(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/system/user/changeStatus`,
      method: "put",
      data: {
        // 用户id
        userId: params.userId,
        // 状态 0：正常，1：已禁用
        status: params.status
      }
    });
  },
  // 删除
  delete(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/system/user/${params.userIds}`,
      method: "delete"
    });
  },
  // 系统用户明细查询
  detail(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/system/user/${params.userId}`,
      method: "get"
    });
  },
  // 重置用户密码
  resetPassword(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/system/user/resetPwd`,
      method: "put",
      data: {
        userId: params.userId,
        password: params.password
      }
    });
  },
  // 修改密码
  updatePassword(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/system/user/changePwd`,
      method: "put",
      data: {
        newPassword: params.newPassword,
        oldPassword: params.oldPassword
      }
    });
  },
  // 交易员选择列表
  tradeUserList() {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/system/user/listTraders`,
      method: "get"
    });
  },
  chatReceiverList() {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/chatReceiver`,
      method: "get"
    });
  },
  // 平仓时选择交易员优先级
  realTradeUserList(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/realtrade/listTrader?realTradeIdList=${params.realTradeIdList}`,
      method: "get"
    });
  },
  // ****** 设置表头
  // column查询
  getColumn(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/syscolumn/columnlist?templateId=${params.templateId}`,
      method: "get"
    });
  },
  // template查询
  getTemplate() {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/syscolumn/templatelist`,
      method: "get"
    });
  },
  // 个人设置查询 ?templateId=${params.templateId}&userId=${params.userId}
  getUserColumn(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/sysusercolumn/list`,
      method: "get",
      params: {
        templateId: params.templateId,
        userId: params.userId
      }
    });
  },
  // 个人列设置保存
  saveColumn(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/sysusercolumn/save`,
      method: "post",
      data: {
        fieldValue: params.fieldValue,
        headContent: params.headContent,
        templateId: params.templateId,
        userId: params.userId
      }
    });
  },
  getUserSummarys(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/sys/summary`,
      method: "post",
      data: params
    });
  },
  getTransHistory(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/sys/getFinishTrades`,
      method: "post",
      data: params
    });
  },
  findWorkOrder(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/chatWorkOrder/findCondition`,
      method: "post",
      data: params
    });
  },
  saveAndUpdateWorkOrder(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/chatWorkOrder`,
      method: "post",
      data: params
    });
  },
  findPageChannel(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/channel/page`,
      method: "get",
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize
      }
    });
  },
  saveOrUpdateChannel(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/channel`,
      method: "post",
      data: params
    });
  },
  saveOrUpdateReceiver(params) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/chatReceiver`,
      method: "post",
      data: params
    });
  },
  findReceiverByChannel(channelId) {
    return request({
      url: `${import.meta.env.VITE_BASE_API}/chatReceiver/channelId/${channelId}`,
      method: "get",
    });
  }
};
