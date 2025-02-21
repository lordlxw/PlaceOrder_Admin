export default {
  // key
  keys: {
    'tokenKey': 'token',
    'roleIdKey': 'roleId',
    'menusKey': 'menus',
    'loginNameKey': 'loginName',
    'navigatorKey': 'navigator',
    'navigatorIdKey': 'navigatorId',
    'routersKey': 'routers',
    'urlParams': 'urlParams',
    'currentTscode': 'currentTscode',
    'defaultSet': 'defaultSet',
    'userInfo': 'userInfo',
    'winInfo': 'winInfo'
  },
  // 菜单功能类型
  menuFunType: {
    'M': '菜单',
    'C': '叶节点',
    'F': '功能',
  },
  // 数据权限
  dataScopeType: {
    '1': '查看所有',
    '2': '查看自己',
    '3': '查看委派'
  },
  // 询价单状态 '7': '撤单待确认','9': '成交待确认'
  inquiryStatus: {
    '0': '待接收',
    '1': '已接收',
    '2': '已拒收',
    '3': '已成交',
    '4': '部分成交',
    '5': '已撤单',
    '6': '部分撤单',
    '7': '待确认',
    '8': '已拒撤',
    '9': '待确认',
    '10': '待确认', // 子询价单确认中
    '19': '待确认', // 难成待确认
    '20': '待确认', // 违约续作待确认
    '22': '已关闭',
    '23': '修改中', // 询价单修改中
  },
  updateUserTrade: [{
    value: 3,
    label: '已成交',
    handle: [5, 4, 6, 1, 23]
  },
  {
    value: 1,
    label: '已接收',
    handle: [5, 4, 6, 3, 23]
  },
  {
    value: 4,
    label: '部分成交',
    handle: [5, 4, 6, 3, 1, 23]
  },
  {
    value: 6,
    label: '部分撤单',
    handle: [5, 4, 6, 3, 1, 23]
  },
  {
    value: 5,
    label: '已撤单',
    handle: [4, 6, 3, 1, 23]
  },
  {
    value: 23,
    label: '改价中',
    handle: []
  }],
  // 交易单交割状态
  bondStatus: {
    '0': '未交割',
    '1': '已交割',
    '2': '口头违约',
    '3': '技术违约',
    '4': '恶意违约',
    '5': '技违垫付', // 包含做市商垫付的技术违约
    '6': '待确认', // 口头违约待确认
    '7': '违约续作',
    '8': '部分违约',
    '9': '恶违垫付',
    '10': '违约续作完成',
    '11': '补单中',
    '12': '补单完成'
  },
  // 平仓状态
  bondsCommonStatus: {
    '10': '待确认', // 交易单待确认
    '11': '待平仓', // 交易单待平仓
    '12': '已平仓', // 交易单已平仓
    '13': '已作废', // 作废
    '16': '修改中', // 已平修改中
    '17': '修改中', // 未平修改中
    '21': '已结束', // 交易已结束
  },
  // 角色名称未平仓展开收起配置
  externalRoleName: ['交易员', '交割员'],
  // 交易方向
  directionMeta: {
    'bond_0': '买入',
    'bond_1': '卖出'
  },
  // 用户状态
  userStatus: {
    '0': '正常',
    '1': '预警',
    '2': '锁定',
    '3': '冻结',
    '4': '删除',
    '5': '劫持'
  },
  // 工单状态
  orderStatus: {
    '0': '未处理',
    '1': '处理中',
    '2': '已处理',
    '3': '不处理',
  },
  // 通道状态
  channelStatus: {
    '0': '启用',
    '1': '禁用',
    '2': '阻塞',
  },
  // 工单类型
  orderTypes: {
    '0': '普通异常',
    '1': '询价单异常',
    '2': '成交单异常',
    '3': '通道异常',
    '4': '引用异常'
  },
  // 违约类型
  breakTypeOptions: {
    '1': '对手方违约',
    '2': '做市商违约',
    '3': '我方违约'
  },
  // 违约
  doBreakList: [
    {
      label: '技术违约',
      value: 0
    }, {
      label: '恶意违约',
      value: 1
    }
  ],
  // 处理键值对信息转换
  funcKeyValue(key, type) {
    return this[`${type}`][`${key}`]
  },
  // 正则
  regExpSet: {
    // 11位手机号
    mobile: /^1[0-9]{10}$/,
    // 钱
    // money: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,4})?$/,
    money: /^([0](\.\d{1,4}))$|^([1-9][0-9]*(\.\d{1,4})?)$/,
    // 浮动价
    floatPrice: /^(0|[0](\.\d{1,2}))$|^([1-9][0-9]*(\.\d{1,2})?)$/,
    // 日期时间
    dtime: /^(\d+)-(\d{ 1,2 })-(\d{ 1,2 }) (\d{ 1,2 }):(\d{ 1,2 }):(\d{ 1,2 })$/,
    // 时分
    hourminute: /^(20|21|22|23|[0-1]\d):[0-5]\d$/,
    // 非零正整数
    gtzero: /^\+?[1-9][0-9]*$/,
    // 非负整数
    gtorzero: /^\+?[0-9][0-9]*$/,
    // 版本号
    version: /^([1-9]\d|[1-9])(.([1-9]\d|\d)){2}$/
  },
  // 询价单头
  enquiryHead: {
    // 询价排列显示： 债券代码 交易方向 询价 询面额 交割日期 其他排后
    createBy: { label: '研究员id', prop: 'createBy', width: 'auto', align: 'left', show: false },
    userId: { label: '交易员id', prop: 'userId', width: '120', align: 'left', show: false },
    userTradeId: { label: '交易id', prop: 'userTradeId', width: '120', align: 'left', show: false },
    createTime: { label: '询价日期', prop: 'createTime', width: '160', align: 'left', show: true },
    xunjiaDate: { label: '询价日期', prop: 'xunjiaDate', width: '146', align: 'left', show: true },
    xunjiaTime: { label: '询价时间', prop: 'xunjiaTime', width: '146', align: 'left', show: true },
    price: { label: '询价', prop: 'price', width: '66', align: 'left', show: true },
    worstPrice: { label: '允许最差价格', prop: 'worstPrice', width: '146', align: 'left', show: true },
    realPrice: { label: '成交价', prop: 'realPrice', width: '66', align: 'left', show: true },
    volume: { label: '询量', prop: 'volume', width: '70', align: 'left', show: true },
    restVolume: { label: '剩余询量', prop: 'restVolume', width: '70', align: 'left', show: true },
    realVolume: { label: '成交量', prop: 'realVolume', width: '70', align: 'left', show: true },
    deliveryTime: { label: '询清算速度1', prop: 'deliveryTime', width: '90', align: 'left', show: false },
    realDeliveryTime: { label: '成清算速度1', prop: 'realDeliveryTime', width: '90', align: 'left', show: false },
    tscode: { label: '券码', prop: 'tscode', width: '70', align: 'left', show: true },
    direction: { label: '方向', prop: 'direction', width: '50', align: 'left', show: true },
    status: { label: '状态', prop: 'status', width: '70', align: 'left', show: true, sortable: true },
    remark: { label: '备注', prop: 'remark', width: '200', align: 'left', show: false, showOverflowTooltip: true },
    tradeNum: { label: '单据号', prop: 'tradeNum', width: '166', align: 'left', show: true },
    deliverySpeed: { label: '询清算速度', prop: 'deliverySpeed', width: '140', align: 'left', show: true },
    realDeliverySpeed: { label: '成清算速度', prop: 'realDeliverySpeed', width: '140', align: 'left', show: true },
    createuser: { label: '研究员', prop: 'createuser', width: '100', align: 'left', show: true, showOverflowTooltip: true },
    forward: { label: '是否远期', prop: 'forward', width: '140', align: 'left', show: false },
    parentId: { label: '相关单号', prop: 'parentId', width: '160', align: 'left', show: false },
    updateBy: { label: '修改人', prop: 'updateBy', width: '120', align: 'left', show: true },
    updateTime: { label: '修改时间', prop: 'updateTime', width: '146', align: 'left', show: true },
    tradeTime: { label: '成交时间', prop: 'tradeTime', width: '160', align: 'left', show: true },
    tradeDate: { label: '成交日期', prop: 'tradeDate', width: '146', align: 'left', show: true },
    tradeTime2: { label: '成交时间2', prop: 'tradeTime2', width: '146', align: 'left', show: true },
    tradeuser: { label: '交易员', prop: 'tradeuser', width: '100', align: 'left', show: true, showOverflowTooltip: true },
    brokerId: { label: '中介ID', prop: 'brokerId', width: '70', align: 'left', show: true },
    target: { label: '中介', prop: 'target', width: '140', align: 'left', show: true },
    // 询价成交重要排序：成交价格  成交面额 成交交割日期  交易对手 联系方式
  },
  // 未平仓，已平表头
  bondsHead: {
    createBy: { label: '研究员id', prop: 'createBy', width: 'auto', align: 'left', show: false },
    tscode: { label: '券码', prop: 'tscode',  width: '70', align: 'left', show: true },
    direction: { label: '方向', prop: 'direction',  width: '50', align: 'left', show: true },
    price: { label: '成交价', prop: 'price',  width: '66', align: 'left', show: true },
    volume: { label: '持仓量', prop: 'volume', width: '66', align: 'left', show: true },
    restVolume: { label: '待平量', prop: 'restVolume', width: '60', align: 'left', show: true },
    deliverySpeed: { label: '清算速度', prop: 'deliverySpeed', width: '140', align: 'left', show: true },
    deliveryTime: { label: '交割日期', prop: 'deliveryTime', width: '96', align: 'left', show: false },
    floatProfit: { label: '浮动盈亏', prop: 'floatProfit', width: '90', align: 'left', show: true },
    profit: { label: '已平盈亏', prop: 'profit', width: '90', align: 'left', show: true },
    realTradeId: { label: '交易员id', prop: 'realTradeId', width: '120', align: 'left', show: false },
    remark: { label: '备注', prop: 'remark', width: '200', align: 'left', show: false, showOverflowTooltip: true },
    tradeNum: { label: '单据号', prop: 'tradeNum', width: '150', align: 'left', show: true },
    tradeuser: { label: '交易员', prop: 'tradeuser', width: '100', align: 'left', show: true, showOverflowTooltip: true },
    // userTradeId: { label: '交易id', prop: 'userTradeId', width: '120', align: 'left', show: false },
    // yanjiuyuanId: { label: '交易员id', prop: 'yanjiuyuanId', width: '120', align: 'left', show: false },
    yanjiuyuanName: { label: '研究员', prop: 'yanjiuyuanName', width: '100', align: 'left', show: true, showOverflowTooltip: true },
    createTime: { label: '成交时间', prop: 'createTime', width: '146', align: 'left', show: true },
    tradeDate: { label: '成交日期', prop: 'tradeDate', width: '146', align: 'left', show: true },
    tradeTime: { label: '交易时间', prop: 'tradeTime', width: '146', align: 'left', show: true },
    counterParty: { label: '交易对手', prop: 'counterParty', width: '90', align: 'left', show: true },
    contactPerson: { label: '联系人', prop: 'contactPerson', width: '90', align: 'left', show: true },
    contactType: { label: '联系方式', prop: 'contactType', width: '100', align: 'left', show: true },
    jiaogeStatus: { label: '交割状态', prop: 'jiaogeStatus', width: '100', align: 'left', show: true },
    status: { label: '平仓状态', prop: 'status', width: '90', align: 'left', show: true },
    updateTime: { label: '修改时间', prop: 'updateTime', width: '146', align: 'left', show: true },
    userTradeNum: { label: '询价单据号', prop: 'userTradeNum', width: '170', align: 'left', show: true },
    target: { label: '中介', prop: 'target', width: '140', align: 'left', show: true },
  },
  // 交割回报
  rewardHead: {
    tscode: { label: '券码', prop: 'tscode', width: '70', align: 'left', show: true },
    direction: { label: '方向', prop: 'direction', width: '50', align: 'left', show: true },
    price: { label: '交割价', prop: 'price', width: '66', align: 'right', show: true },
    volume: { label: '交割量', prop: 'volume', width: '60', align: 'right', show: true },
    chengjiaoAmount: { label: '成交量', prop: 'chengjiaoAmount', width: '66', align: 'right', show: true },
    profit: { label: '交割盈亏', prop: 'profit', width: '70', align: 'right', show: true },
    counterParty: { label: '对手方', prop: 'counterParty', width: '90', align: 'left', show: true },
    contactPerson: { label: '联系人', prop: 'contactPerson', width: '90', align: 'left', show: true },
    contactType: { label: '联系方式', prop: 'contactType', width: '100', align: 'left', show: true },
    createBy: { label: '创建人id', prop: 'createBy', width: 'auto', align: 'left', show: false },
    createTime: { label: '成交时间', prop: 'createTime', width: '146', align: 'left', show: true },
    deliverySpeed: { label: '清算速度', prop: 'deliverySpeed', width: '90', align: 'left', show: false },
    deliveryTime: { label: '交割日期', prop: 'deliveryTime', width: '90', align: 'left', show: true },
    tradeNum: { label: '单据号', prop: 'tradeNum', width: '160', align: 'left', show: true },
    tradeuser: { label: '交易员', prop: 'tradeuser', width: '100', align: 'left', show: true, showOverflowTooltip: true },
    remark: { label: '备注', prop: 'remark', width: '200', align: 'left', show: true, showOverflowTooltip: true },
    updateTime: { label: '修改时间', prop: 'updateTime', width: '146', align: 'left', show: true },
    yanjiuyuanName: { label: '研究员', prop: 'yanjiuyuanName', width: '100', align: 'left', show: true, showOverflowTooltip: true },
    userTradeNum: { label: '询价单据号', prop: 'userTradeNum', width: '170', align: 'left', show: true },
  },
  // 违约单头部
  breakHead: {
    tscode: { label: '券码', prop: 'tscode', width: '70', align: 'left', show: true },
    direction: { label: '方向', prop: 'direction', width: '50', align: 'left', show: true },
    price: { label: '成交价', prop: 'price', width: '66', align: 'right', show: true },
    volume: { label: '交易量', prop: 'volume', width: '66', align: 'right', show: true },
    deliveryTime: { label: '交割日期', prop: 'deliveryTime', width: '90', align: 'left', show: true },
    weiyueAmount: { label: '违约量', prop: 'weiyueAmount', width: '60', align: 'right', show: true },
    weiyuePerson: { label: '违约方', prop: 'weiyuePerson', width: '90', align: 'left', show: true },
    marketMakerName: { label: '做市商', prop: 'marketMakerName', width: '90', align: 'left', show: true },
    jiaogeStatus: { label: '状态', prop: 'jiaogeStatus', width: '90', align: 'left', show: true },
    realTradeId: { label: '交易员id', prop: 'realTradeId', width: '120', align: 'left', show: false },
    remark: { label: '备注', prop: 'remark', width: '200', align: 'left', show: true, showOverflowTooltip: true },
    tradeNum: { label: '单据号', prop: 'tradeNum', width: '160', align: 'left', show: true },
    updateTime: { label: '修改时间', prop: 'updateTime', width: '146', align: 'left', show: true },
    createTime: { label: '创建时间', prop: 'createTime', width: '146', align: 'left', show: true },
    contactPerson: { label: '交易对手', prop: 'contactPerson', width: '90', align: 'left', show: true },
    contactType: { label: '联系方式', prop: 'contactType', width: '90', align: 'left', show: true },
    counterParty: { label: '对手方', prop: 'counterParty', width: '90', align: 'left', show: true },
    traderName: { label: '交易员', prop: 'traderName', width: '100', align: 'left', show: true, showOverflowTooltip: true },
    yanjiuyuanName: { label: '研究员', prop: 'yanjiuyuanName', width: '100', align: 'left', show: true, showOverflowTooltip: true },
    userTradeNum: { label: '询价单据号', prop: 'userTradeNum', width: '170', align: 'left', show: true },
  },
  // 用户汇总
  // userSummaryHead: {
  //   userId: { label: '用户ID', prop: 'userId', width: '70', align: 'left', show: false },
  //   userName: { label: '用户名', prop: 'userName', width: '100', align: 'left', show: true },
  //   nickName: { label: '昵称', prop: 'nickName', width: '100', align: 'left', show: true },
  //   maxVolume: { label: '最大可买', prop: 'maxVolume', width: '100', align: 'left', show: true },
  //   minProfitAlltime: { label: '总允亏', prop: 'minProfitAlltime', width: '100', align: 'left', show: true, sortable: true },
  //   minProfitDaily: { label: '日允亏', prop: 'minProfitDaily', width: '100', align: 'left', show: true },
  //   solidProfit: { label: '总盈亏', prop: 'solidProfit', width: '100', align: 'left', show: true, sortable: true },
  //   limitBid: { label: '买入笔数', prop: 'limitBid', width: '100', align: 'left', show: true },
  //   limitOffer: { label: '卖出笔数', prop: 'limitOffer', width: '100', align: 'left', show: true },
  //   limitDeal: { label: '成交笔数', prop: 'limitDeal', width: '100', align: 'left', show: true, sortable: true },
  //   limitCancel: { label: '撤单笔数', prop: 'limitCancel', width: '100', align: 'left', show: true },
  //   level: { label: '用户等级', prop: 'level', width: '100', align: 'left', show: true },
  //   phonenumber: { label: '电话', prop: 'phonenumber', width: '100', align: 'left', show: true },
  //   email: { label: '邮箱', prop: 'email', width: '100', align: 'left', show: false },
  //   sex: { label: '性别', prop: 'sex', width: '60', align: 'left', show: false },
  //   avatar: { label: '头像', prop: 'avatar', width: '90', align: 'left', show: false },
  //   status: { label: '用户状态', prop: 'status', width: '100', align: 'left', formatter: this.funcFormat, show: true },
  //   delFlag: { label: '是否删除', prop: 'delFlag', width: '100', align: 'left', show: true },
  //   loginIp: { label: '登录IP', prop: 'loginIp', width: '100', align: 'left', show: true },
  //   loginDate: { label: '登录时间', prop: 'loginDate', width: '160', align: 'left', show: true },
  // },
 // 交易汇总
  transHistory: {
   dateStart: { label: '开仓日期', prop: 'dateStart', width: '150', align: 'left', show: true, sortable: true },
   dateEnd: { label: '平仓日期', prop: 'dateEnd', width: '150', align: 'left', show: true },
   tscode: { label: '券号', prop: 'tscode', width: '100', align: 'left', show: true },
   transNum: { label: '笔数', prop: 'transNum', width: '50', align: 'left', show: true },
   volume: { label: '交易量', prop: 'volume', width: '70', align: 'left', show: true },
   direction: { label: '方向', prop: 'direction', width: '60', align: 'left', show: true },
   priceStart: { label: '开仓价格', prop: 'priceStart', width: '100', align: 'left', show: true },
   priceEnd: { label: '平仓价格', prop: 'priceEnd', width: '90', align: 'left', show: true },
   solidProfit: { label: '盈亏', prop: 'solidProfit', width: '90', align: 'left', show: true, sortable: true },
   fee: { label: '手续费', prop: 'fee', width: '90', align: 'left', show: true },
   yanjiuyuanName: { label: '研究员', prop: 'yanjiuyuanName', width: '100', align: 'left', show: false },
   finishCode: { label: '交易号', prop: 'finishCode', width: '170', align: 'left', show: true, sortable: true },
 },
  // 工单列表
  workOrder: {
    status: { label: '状态', prop: 'status', width: '70', align: 'left', show: true },
    messageId: { label: '消息', prop: 'messageId', width: '100', align: 'left', show: true, showOverflowTooltip: true },
    remarks: { label: '描述', prop: 'remarks', width: '200', align: 'left', show: true, showOverflowTooltip: true },
    broker: { label: '中介', prop: 'broker', width: '100', align: 'left', show: true },
    createBy: { label: '发起人', prop: 'createBy', width: '100', align: 'left', show: true },
    reviewedBy: { label: '操作员', prop: 'reviewedBy', width: '100', align: 'left', show: true },
    type: { label: '类型', prop: 'type', width: '90', align: 'left', show: true },
    tradeIds: { label: '相关订单', prop: 'tradeIds', width: '100', align: 'left', show: true, showOverflowTooltip: true },
    weight: { label: '优先级', prop: 'weight', width: '70', align: 'left', show: true },
    createTime: { label: '创建时间', prop: 'createTime', width: '200', align: 'left', show: true, sortable: true },
    updateTime: { label: '更新时间', prop: 'updateTime', width: '200', align: 'left', show: true, sortable: true },
  },
  // 工单询价单查询
  enquiryOrderHead: {
    // 询价排列显示： 债券代码 交易方向 询价 询面额 交割日期 其他排后
    tradeNum: { label: '单据号', prop: 'tradeNum', width: '166', align: 'left', show: true },
    tscode: { label: '券码', prop: 'tscode', width: '70', align: 'left', show: true },
    direction: { label: '方向', prop: 'direction', width: '50', align: 'left', show: true },
    price: { label: '询价', prop: 'price', width: '66', align: 'left', show: true },
    volume: { label: '询量', prop: 'volume', width: '56', align: 'left', show: true },
    deliverySpeed: { label: '询清算速度', prop: 'deliverySpeed', width: '140', align: 'left', show: true },
    status: { label: '状态', prop: 'status', width: '70', align: 'left', show: true, sortable: true },
    target: { label: '中介', prop: 'target', width: '140', align: 'left', show: true },
    realPrice: { label: '成交价', prop: 'realPrice', width: '66', align: 'left', show: true },
    realVolume: { label: '成交量', prop: 'realVolume', width: '60', align: 'left', show: true },
    restVolume: { label: '剩余询量', prop: 'restVolume', width: '70', align: 'left', show: true },
    realDeliverySpeed: { label: '成清算速度', prop: 'realDeliverySpeed', width: '140', align: 'left', show: true },
    createuser: { label: '研究员', prop: 'createuser', width: '140', align: 'left', show: true },
    xunjiaTime: { label: '询价时间', prop: 'xunjiaTime', width: '146', align: 'left', show: true },
    tradeTime2: { label: '成交时间2', prop: 'tradeTime2', width: '146', align: 'left', show: true },
    updateTime: { label: '修改时间', prop: 'updateTime', width: '146', align: 'left', show: true },
    xunjiaDate: { label: '询价日期', prop: 'xunjiaDate', width: '146', align: 'left', show: true },

  },
}
