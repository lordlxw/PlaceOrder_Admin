// SocketElectron 才是一个全局websocket！
<template>
  <div>
    <!-- <el-dialog title="消息框" width="80%" :visible.sync="dialogTableVisible">
        <trade-enquiry ref="tradeEnquiry"></trade-enquiry>
        <div class="both-clear"></div>
      </el-dialog> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Router from "@/router";
import configUtil from "@/utils/config.js";
import { pageMixin } from "@/utils/pageMixin";
import * as util from "@/utils/util";
// import TradeEnquiry from '@/views/KKTrade/Enquiry.vue'
import api from "@/api/Trade";
import moment from "moment";

let lockReconnect = false;
let pingcangTimer = null;
let pingcangNotify = null;
export default {
  mixins: [pageMixin],
  components: {
    // TradeEnquiry
  },
  data() {
    return {
      dialogTableVisible: false,
      notifyRejection: {},
      reconnectTimer: null,
      pingcangSeconds: 0,
    };
  },
  created() {
    console.log("进入SocketElectron的Created~");
    this.initSocket();
  },
  computed: {
    ...mapState({
      socketMain: (state) => state.socketMain,
    }),
  },
  methods: {
    ...mapMutations(["SET_SOCKET_MAIN", "SET_SOCKET_KLINE"]),
    // ************websocket start**************************
    // 初始化
    initSocket() {
      const self = this;
      if (typeof WebSocket === "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
        if (
          !localStorage.getItem(configUtil.keys.tokenKey) ||
          localStorage.getItem(configUtil.keys.tokenKey) === null ||
          localStorage.getItem(configUtil.keys.tokenKey) === ""
        ) {
          if (window.v1 && window.v1.isElectron()) {
            window.v1.restart();
          } else {
            Router.push({ path: "/login" });
          }
          return;
        }
        let socketUrl = `${import.meta.env.VITE_WS_URL}/${localStorage.getItem(
          configUtil.keys.tokenKey
        )}`;
        if (self.socketMain != null) {
          console.log("self.socketMain!=null");
          self.socketMain.close();
          self["SET_SOCKET_MAIN"](null);
          // this.socketMain = null;
        }
        // 开启一个websocket服务
        this["SET_SOCKET_MAIN"](new WebSocket(socketUrl));
        // socketMain = new WebSocket(socketUrl);
        console.log("socket链接：" + socketUrl);
        // 打开事件
        if (self.socketMain) {
          console.log("socketMain存在");
          self.socketMain.onopen = function () {
            console.log("websocket已打开");
            clearInterval(self.socketTimer);
            self.socketTimer = null;
            self.socketHeart();
            self.$emit("afterInitSocket");
          };
          // 浏览器端收消息，获得从服务端发送过来的文本消息
          self.socketMain.onmessage = function (msg) {
            console.log("收到数据====", msg);
            const timestamp = moment().valueOf();
            let msgJson = JSON.parse(msg.data);
            console.log(msgJson.dataType);
            const h = self.$createElement;
            let notify = null;
            if (msgJson) {
              switch (msgJson.dataType) {
                case "bid_1":
                  console.log(1111);
                  // self.businessOutList = msgJson.data
                  // self.buyForm.price = self.funcGetBestPrice('max', msgJson.data)
                  break;
                case "bid_0":
                  console.log(2222);
                  // self.businessInList = msgJson.data
                  // self.saleForm.price = self.funcGetBestPrice('min', msgJson.data)
                  break;
                case "delegate_bond_0":
                case "delegate_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  if (msgJson.actionType === "refresh" || self.openPopUp()) {
                    break;
                  }
                  notify = self.$notify({
                    title: `发起询价单`,
                    dangerouslyUseHTMLString: true,
                    position: "bottom-left",
                    message: h("div", { class: "notify" }, [
                      h("dl", null, [
                        h("dt", null, "创建时间"),
                        h("dd", null, `${msgJson.data.createTime}`),
                      ]),
                      h("dl", null, [
                        h("dt", null, "债券码"),
                        h("dd", null, `${msgJson.data.tscode}`),
                      ]),
                      h("dl", null, [
                        h("dt", null, "方向"),
                        h(
                          "dd",
                          null,
                          `${
                            msgJson.data.direction === "bond_0"
                              ? "买入"
                              : msgJson.data.direction === "bond_1"
                              ? "卖出"
                              : ""
                          }`
                        ),
                      ]),
                      h("dl", null, [
                        h("dt", null, "询价"),
                        h(
                          "dd",
                          null,
                          `${util.moneyFormat(msgJson.data.price, 4)}`
                        ),
                      ]),
                      h("dl", null, [
                        h("dt", null, "允许最差价格"),
                        h(
                          "dd",
                          null,
                          `${util.moneyFormat(
                            msgJson.data.direction === "bond_0"
                              ? msgJson.data.price -
                                  msgJson.data.worstPrice / 100
                              : msgJson.data.price +
                                  msgJson.data.worstPrice / 100,
                            4
                          )}`
                        ),
                      ]),
                      h("dl", null, [
                        h("dt", null, "询量"),
                        h("dd", null, `${msgJson.data.volume}`),
                      ]),
                      h("dl", null, [
                        h("dt", null, "清算速度"),
                        h(
                          "dd",
                          null,
                          `${msgJson.data.deliveryTime.substr(0, 10)}`
                        ),
                      ]),
                      // h("dl", { style: "margin-top:20px;" }, [
                      //   // h("dt", null, ""),
                      //   h("dd", null, [
                      //     h("button", {
                      //       class: "notigy-agree",
                      //       on: {
                      //         click: function () {
                      //           self.handleAcceptEnquiryClick(msgJson.data, timestamp)
                      //         }
                      //       }
                      //     }, "接收并复制"),
                      //     h("button", {
                      //       class: "notigy-cancel",
                      //       on: {
                      //         click: function () {
                      //           self.handleNotAcceptEnquiryClick(msgJson.data, timestamp)
                      //         }
                      //       }
                      //     }, "拒收")
                      //   ])
                      // ]),
                    ]),
                    duration: 0,
                  });
                  self.notifyRejection[timestamp] = notify;
                  self.tryPlay();
                  break;
                case "accept_bond_0":
                case "accept_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  break;
                case "error":
                  if (msgJson.data.errorCode === "0001") {
                    if (window.v1 && window.v1.isElectron()) {
                      window.v1.restart();
                    } else {
                      Router.push({ path: "/login" });
                    }
                  }
                  break;
                case "brokeroccupyinfo":
                  const occupyInfo = msgJson.data;
                  self.$store.commit("SET_OCCUPY_INFO", occupyInfo);
                  break;
                case "userriskinfo":
                  const riskinfo = msgJson.data;
                  self.$store.commit("SET_RISK_INFO", riskinfo);
                  break;
                case "userStatusInfo":
                  const { status } = msgJson.data;
                  const userInfo = { ...self.userInfo, status };
                  self.$store.commit("SET_USER_INFO", userInfo);
                  break;
                case "qiangping_inform":
                  if (window.location.href.includes("main")) {
                    const { restSeconds, message, pingcangAction, messageId } =
                      msgJson.data;
                    if (pingcangNotify !== null) {
                      pingcangNotify.close();
                      pingcangNotify = null;
                      clearInterval(pingcangTimer);
                      pingcangTimer = null;
                    }
                    if (pingcangAction === "warn") {
                      pingcangNotify = self.$notify.error({
                        title: "强平预警",
                        dangerouslyUseHTMLString: true,
                        message: `${message}. <i id="countDownNumber" style="color: #f00;font-weight:700;padding: 0 0.01rem">${self.pingcangSeconds}</i>`,
                        showClose: false,
                        duration: 0,
                        offset: 30,
                      });
                      if (restSeconds == null) {
                        break;
                      }
                      self.pingcangSeconds = restSeconds;

                      pingcangTimer = setInterval(() => {
                        if (self.pingcangSeconds > 0) {
                          self.pingcangSeconds--;
                          let dom = document.querySelector("#countDownNumber");
                          dom.innerText = self.pingcangSeconds;
                        } else {
                          pingcangNotify.close();
                          pingcangNotify = null;
                          clearInterval(pingcangTimer);
                          pingcangTimer = null;
                        }
                      }, 1000);
                    } else if (pingcangAction === "execute") {
                      pingcangNotify = self.$notify.error({
                        title: "执行强平",
                        message: `${message}`,
                        showClose: true,
                        duration: 0,
                        offset: 30,
                        onClose: async () => {
                          await api.messageConsumed({ messageId });
                        },
                      });
                    } else if (pingcangAction === "cancel") {
                      pingcangNotify = self.$notify.info({
                        title: "强平撤销",
                        message: `${message}`,
                        showClose: true,
                        duration: 0,
                        offset: 30,
                        onClose: async () => {
                          await api.messageConsumed({ messageId });
                        },
                      });
                    }
                  }
                  break;
                case "chat_message":
                  self.$store.commit("SET_CHAT_MESSAGE", msgJson.data);
                  break;
                case "chat_work_order":
                  self.$store.commit("SET_CHAT_ORDER", msgJson.data);
                  if (msgJson.actionType === "refresh" || self.openPopUp()) {
                    break;
                  }
                  notify = self.$notify({
                    title: "系统通知",
                    message: "你收到了一笔新的工单，请及时查看！",
                    type: "warning",
                    position: "top-right",
                    offset: 35,
                    customClass: "custom-notify-class",
                  });
                  break;
                case "rank":
                  self.$store.commit("SET_HOTS_LIST", msgJson.data);
                  break;
                case "deal_bond_0":
                case "deal_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  if (msgJson.actionType === "refresh" || self.openPopUp()) {
                    break;
                  }
                  self.$notify({
                    title: `已成交`,
                    dangerouslyUseHTMLString: true,
                    position: "bottom-left",
                    message: `
                    <div class="notify">
                      <dl>
                        <dt>债券码</dt>
                        <dd>${msgJson.data.tscode}</dd>
                      </dl>
                      <dl>
                        <dt>方向</dt>
                        <dd>${
                          msgJson.data.direction === "bond_0"
                            ? "买入"
                            : msgJson.data.direction === "bond_1"
                            ? "卖出"
                            : ""
                        }</dd>
                      </dl>
                      <dl>
                        <dt>成交价</dt>
                        <dd>${util.moneyFormat(msgJson.data.price, 4)}</dd>
                      </dl>
                      <dl>
                        <dt>成交量</dt>
                        <dd>${msgJson.data.volume}</dd>
                      </dl>
                      <dl>
                        <dt>清算速度</dt>
                        <dd>${msgJson.data.deliveryTime.substr(0, 10)}</dd>
                      </dl>
                    </div>
                    `,
                    duration: 0,
                  });
                  self.tryPlay();
                  break;
                case "deny_bond_0":
                case "deny_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  if (msgJson.actionType === "refresh" || self.openPopUp()) {
                    break;
                  }
                  self.$notify({
                    title: `已拒收`,
                    dangerouslyUseHTMLString: true,
                    position: "bottom-left",
                    customClass: "notify-yellow",
                    message: `
                    <div class="notify">
                      <dl>
                        <dt>债券码</dt>
                        <dd>${msgJson.data.tscode}</dd>
                      </dl>
                      <dl>
                        <dt>方向</dt>
                        <dd>${
                          msgJson.data.direction === "bond_0"
                            ? "买入"
                            : msgJson.data.direction === "bond_1"
                            ? "卖出"
                            : ""
                        }</dd>
                      </dl>
                      <dl>
                        <dt>成交价</dt>
                        <dd>${util.moneyFormat(msgJson.data.price, 4)}</dd>
                      </dl>
                      <dl>
                        <dt>成交量</dt>
                        <dd>${msgJson.data.volume}</dd>
                      </dl>
                      <dl>
                        <dt>清算速度</dt>
                        <dd>${msgJson.data.deliveryTime.substr(0, 10)}</dd>
                      </dl>
                    </div>
                    `,
                    duration: 0,
                  });
                  self.tryPlay();
                  break;
                // 直接撤单
                case "cancel_bond_0":
                case "cancel_bond_1":
                case "delegate_feedback_bond_0":
                case "delegate_feedback_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  break;
                // 成交确认
                case "confirmdeal_bond_0":
                case "confirmdeal_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  if (msgJson.actionType === "refresh" || self.openPopUp()) {
                    break;
                  }
                  notify = self.$notify({
                    title: `已确认成交`,
                    dangerouslyUseHTMLString: true,
                    position: "bottom-left",
                    message: h("div", { class: "notify" }, [
                      h("dl", null, [
                        h("dt", null, "债券码"),
                        h(
                          "dd",
                          null,
                          `${msgJson.data.ut.tscode.replace(/.IB/, "")}`
                        ),
                      ]),
                      h("dl", null, [
                        h("dt", null, "方向"),
                        h(
                          "dd",
                          null,
                          `${
                            msgJson.data.ut.direction === "bond_0"
                              ? "买入"
                              : msgJson.data.ut.direction === "bond_1"
                              ? "卖出"
                              : " "
                          }`
                        ),
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交价"),
                        h("dd", null, [
                          h(
                            "span",
                            {
                              style:
                                "text-decoration: line-through #ec0000; padding-right:5px;",
                            },
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "price"
                            ) !== -1
                              ? util.moneyFormat(msgJson.data.ut.price, 4) + " "
                              : ""
                          ),
                          h(
                            "span",
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "price"
                            ) !== -1
                              ? { style: "color:#ec0000" }
                              : null,
                            util.moneyFormat(msgJson.data.dto.price, 4)
                          ),
                        ]),
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交量"),
                        h("dd", null, [
                          h(
                            "span",
                            {
                              style:
                                "text-decoration: line-through #ec0000; padding-right:5px;",
                            },
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "volume"
                            ) !== -1
                              ? msgJson.data.ut.volume + " "
                              : ""
                          ),
                          h(
                            "span",
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "volume"
                            ) !== -1
                              ? { style: "color:#ec0000" }
                              : null,
                            msgJson.data.dto.volume
                          ),
                        ]),
                      ]),
                      h("dl", null, [
                        h("dt", null, "清算速度"),
                        h("dd", null, [
                          h(
                            "span",
                            {
                              style:
                                "text-decoration: line-through #ec0000; padding-right:5px;",
                            },
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "deliveryTime"
                            ) !== -1
                              ? msgJson.data.ut.deliveryTime.substr(0, 10) + " "
                              : ""
                          ),
                          h(
                            "span",
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "deliveryTime"
                            ) !== -1
                              ? { style: "color:#ec0000" }
                              : null,
                            msgJson.data.dto.deliveryTime.substr(0, 10)
                          ),
                        ]),
                      ]),
                    ]),
                    duration: 0,
                  });
                  self.tryPlay();
                  break;
                // 撤单确认
                case "request_cancel_bond_0":
                case "request_cancel_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  if (msgJson.actionType === "refresh" || self.openPopUp()) {
                    break;
                  }
                  notify = self.$notify({
                    title: `发起撤单`,
                    dangerouslyUseHTMLString: true,
                    position: "bottom-left",
                    customClass: "notify-yellow",
                    message: h("div", { class: "notify" }, [
                      h("dl", null, [
                        h("dt", null, "创建时间"),
                        h("dd", null, `${msgJson.data.createTime}`),
                      ]),
                      h("dl", null, [
                        h("dt", null, "债券码"),
                        h("dd", null, `${msgJson.data.tscode}`),
                      ]),
                      h("dl", null, [
                        h("dt", null, "方向"),
                        h(
                          "dd",
                          null,
                          `${
                            msgJson.data.direction === "bond_0"
                              ? "买入"
                              : msgJson.data.direction === "bond_1"
                              ? "卖出"
                              : ""
                          }`
                        ),
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交价"),
                        h(
                          "dd",
                          null,
                          `${util.moneyFormat(msgJson.data.price, 4)}`
                        ),
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交总量"),
                        h("dd", null, `${msgJson.data.volume}`),
                      ]),
                      h("dl", null, [
                        h("dt", null, "已成交"),
                        h("dd", null, `${msgJson.data.realVolume}`),
                      ]),
                      h("dl", null, [
                        h("dt", null, "未成交"),
                        h("dd", null, `${msgJson.data.restVolume}`),
                      ]),
                      h("dl", null, [
                        h("dt", null, "清算速度"),
                        h(
                          "dd",
                          null,
                          `${msgJson.data.deliveryTime.substr(0, 10)}`
                        ),
                      ]),
                      // h("dl", { style: "margin-top:20px;" }, [
                      //   // h("dt", null, ""),
                      //   h("dd", null, [
                      //     h("button", {
                      //       class: "notigy-agree",
                      //       on: {
                      //         click: function () {
                      //           self.handleInquiryCancelConfirmClick(msgJson.data.userTradeId, timestamp)
                      //         }
                      //       }
                      //     }, "同意"),
                      //     h("button", {
                      //       class: "notigy-cancel",
                      //       on: {
                      //         click: function () {
                      //           self.handleInquiryCancelRejectionClick(msgJson.data.userTradeId, timestamp)
                      //         }
                      //       }
                      //     }, "拒绝")
                      //   ])
                      // ]),
                    ]),
                    duration: 0,
                  });
                  self.notifyRejection[timestamp] = notify;
                  self.tryPlay();
                  // if (self.dialogTableVisible) {
                  //   self.$refs.tradeEnquiry.loadInitData()
                  // }
                  break;
                case "deny_deal_bond_0":
                case "deny_deal_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  if (msgJson.actionType === "refresh" || self.openPopUp()) {
                    break;
                  }
                  notify = self.$notify({
                    title: `已拒绝成交`,
                    dangerouslyUseHTMLString: true,
                    position: "bottom-left",
                    customClass: "notify-yellow",
                    message: h("div", { class: "notify" }, [
                      h("dl", null, [
                        h("dt", null, "债券码"),
                        h(
                          "dd",
                          null,
                          `${msgJson.data.ut.tscode.replace(/.IB/, "")}`
                        ),
                      ]),
                      h("dl", null, [
                        h("dt", null, "方向"),
                        h(
                          "dd",
                          null,
                          `${
                            msgJson.data.ut.direction === "bond_0"
                              ? "买入"
                              : msgJson.data.ut.direction === "bond_1"
                              ? "卖出"
                              : " "
                          }`
                        ),
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交价"),
                        h("dd", null, [
                          h(
                            "span",
                            {
                              style:
                                "text-decoration: line-through #ec0000; padding-right:5px;",
                            },
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "price"
                            ) !== -1
                              ? util.moneyFormat(msgJson.data.ut.price, 4) + " "
                              : ""
                          ),
                          h(
                            "span",
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "price"
                            ) !== -1
                              ? { style: "color:#ec0000" }
                              : null,
                            util.moneyFormat(msgJson.data.dto.price, 4)
                          ),
                        ]),
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交量"),
                        h("dd", null, [
                          h(
                            "span",
                            {
                              style:
                                "text-decoration: line-through #ec0000; padding-right:5px;",
                            },
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "volume"
                            ) !== -1
                              ? msgJson.data.ut.volume + " "
                              : ""
                          ),
                          h(
                            "span",
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "volume"
                            ) !== -1
                              ? { style: "color:#ec0000" }
                              : null,
                            msgJson.data.dto.volume
                          ),
                        ]),
                      ]),
                      h("dl", null, [
                        h("dt", null, "清算速度"),
                        h("dd", null, [
                          h(
                            "span",
                            {
                              style:
                                "text-decoration: line-through #ec0000; padding-right:5px;",
                            },
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "deliveryTime"
                            ) !== -1
                              ? msgJson.data.ut.deliveryTime.substr(0, 10) + " "
                              : ""
                          ),
                          h(
                            "span",
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "deliveryTime"
                            ) !== -1
                              ? { style: "color:#ec0000" }
                              : null,
                            msgJson.data.dto.deliveryTime.substr(0, 10)
                          ),
                        ]),
                      ]),
                    ]),
                    duration: 0,
                  });
                  self.tryPlay();
                  break;
                case "weipingchangeconfirm_bond_0":
                case "weipingchangeconfirm_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  if (msgJson.actionType === "refresh" || self.openPopUp()) {
                    break;
                  }
                  notify = self.$notify({
                    title: `已同意未平仓修改`,
                    dangerouslyUseHTMLString: true,
                    position: "bottom-left",
                    message: h("div", { class: "notify" }, [
                      h("dl", null, [
                        h("dt", null, "创建时间"),
                        h("dd", null, `${msgJson.data.rt.createTime}`),
                      ]),
                      h("dl", null, [
                        h("dt", null, "债券码"),
                        h(
                          "dd",
                          null,
                          `${msgJson.data.rt.tscode.replace(/.IB/, "")}`
                        ),
                      ]),
                      h("dl", null, [
                        h("dt", null, "方向"),
                        h(
                          "dd",
                          null,
                          `${
                            msgJson.data.rt.direction === "bond_0"
                              ? "买入"
                              : msgJson.data.rt.direction === "bond_1"
                              ? "卖出"
                              : " "
                          }`
                        ),
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交价"),
                        h("dd", null, [
                          h(
                            "span",
                            {
                              style:
                                "text-decoration: line-through #ec0000; padding-right:5px;",
                            },
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "price"
                            ) !== -1
                              ? util.moneyFormat(msgJson.data.rt.price, 4) + " "
                              : ""
                          ),
                          h(
                            "span",
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "price"
                            ) !== -1
                              ? { style: "color:#ec0000" }
                              : null,
                            util.moneyFormat(msgJson.data.dto.price, 4)
                          ),
                        ]),
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交量"),
                        h("dd", null, [
                          h(
                            "span",
                            {
                              style:
                                "text-decoration: line-through #ec0000; padding-right:5px;",
                            },
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "volume"
                            ) !== -1
                              ? msgJson.data.rt.volume + " "
                              : ""
                          ),
                          h(
                            "span",
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "volume"
                            ) !== -1
                              ? { style: "color:#ec0000" }
                              : null,
                            msgJson.data.dto.volume
                          ),
                        ]),
                      ]),
                      h("dl", null, [
                        h("dt", null, "清算速度"),
                        h("dd", null, [
                          h(
                            "span",
                            {
                              style:
                                "text-decoration: line-through #ec0000; padding-right:5px;",
                            },
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "deliveryTime"
                            ) !== -1
                              ? msgJson.data.rt.deliveryTime.substr(0, 10) + " "
                              : ""
                          ),
                          h(
                            "span",
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "deliveryTime"
                            ) !== -1
                              ? { style: "color:#ec0000" }
                              : null,
                            msgJson.data.dto.deliveryTime.substr(0, 10)
                          ),
                        ]),
                      ]),
                      h("dl", null, [
                        h("dt", null, "交割速度"),
                        h("dd", null, [
                          h(
                            "span",
                            {
                              style:
                                "text-decoration: line-through #ec0000; padding-right:5px;",
                            },
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "deliverySpeed"
                            ) !== -1
                              ? msgJson.data.rt.deliverySpeed
                              : ""
                          ),
                          h(
                            "span",
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "deliverySpeed"
                            ) !== -1
                              ? { style: "color:#ec0000" }
                              : null,
                            msgJson.data.dto.deliverySpeed
                          ),
                        ]),
                      ]),
                      h("dl", null, [
                        h("dt", null, "交易对手"),
                        h("dd", null, [
                          h(
                            "span",
                            {
                              style:
                                "text-decoration: line-through #ec0000; padding-right:5px;",
                            },
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "counterParty"
                            ) !== -1
                              ? msgJson.data.rt.counterParty
                              : ""
                          ),
                          h(
                            "span",
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "counterParty"
                            ) !== -1
                              ? { style: "color:#ec0000" }
                              : null,
                            msgJson.data.dto.counterParty
                          ),
                        ]),
                      ]),
                      h("dl", null, [
                        h("dt", null, "联系人"),
                        h("dd", null, [
                          h(
                            "span",
                            {
                              style:
                                "text-decoration: line-through #ec0000; padding-right:5px;",
                            },
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "contactPerson"
                            ) !== -1
                              ? msgJson.data.rt.contactPerson
                              : ""
                          ),
                          h(
                            "span",
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "contactPerson"
                            ) !== -1
                              ? { style: "color:#ec0000" }
                              : null,
                            msgJson.data.dto.contactPerson
                          ),
                        ]),
                      ]),
                      h("dl", null, [
                        h("dt", null, "联系方式"),
                        h("dd", null, [
                          h(
                            "span",
                            {
                              style:
                                "text-decoration: line-through #ec0000; padding-right:5px;",
                            },
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "contactType"
                            ) !== -1
                              ? msgJson.data.rt.contactType
                              : ""
                          ),
                          h(
                            "span",
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "contactType"
                            ) !== -1
                              ? { style: "color:#ec0000" }
                              : null,
                            msgJson.data.dto.contactType
                          ),
                        ]),
                      ]),
                      h("dl", null, [
                        h("dt", null, "备注"),
                        h("dd", null, [
                          h(
                            "span",
                            {
                              style:
                                "text-decoration: line-through #ec0000; padding-right:5px;",
                            },
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "remark"
                            ) !== -1
                              ? msgJson.data.rt.remark
                              : ""
                          ),
                          h(
                            "span",
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "remark"
                            ) !== -1
                              ? { style: "color:#ec0000" }
                              : null,
                            msgJson.data.dto.remark
                          ),
                        ]),
                      ]),
                    ]),
                    duration: 0,
                  });
                  self.tryPlay();
                  break;
                case "weipingchangedeny_bond_0":
                case "weipingchangedeny_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  if (msgJson.actionType === "refresh" || self.openPopUp()) {
                    break;
                  }
                  self.$notify({
                    title: `已拒绝未平仓修改`,
                    dangerouslyUseHTMLString: true,
                    position: "bottom-left",
                    customClass: "notify-yellow",
                    message: `
                    <div class="notify">
                      <dl>
                        <dt>债券码</dt>
                        <dd>${msgJson.data.tscode.replace(/.IB/, "")}</dd>
                      </dl>
                      <dl>
                        <dt>方向</dt>
                        <dd>${
                          msgJson.data.direction === "bond_0"
                            ? "买入"
                            : msgJson.data.direction === "bond_1"
                            ? "卖出"
                            : ""
                        }</dd>
                      </dl>
                      <dl>
                        <dt>成交价</dt>
                        <dd>${util.moneyFormat(msgJson.data.price, 4)}</dd>
                      </dl>
                      <dl>
                        <dt>成交量</dt>
                        <dd>${msgJson.data.volume}</dd>
                      </dl>
                      <dl>
                        <dt>清算速度</dt>
                        <dd>${msgJson.data.deliveryTime.substr(0, 10)}</dd>
                      </dl>
                      <dl>
                        <dt>单据号</dt>
                        <dd>${msgJson.data.tradeNum}</dd>
                      </dl>
                      <dl>
                        <dt>备注</dt>
                        <dd>${msgJson.data.remark}</dd>
                      </dl>
                    </div>
                    `,
                    duration: 0,
                  });
                  self.tryPlay();
                  break;
                case "yipingchangeconfirm_bond_0":
                case "yipingchangeconfirm_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  if (msgJson.actionType === "refresh" || self.openPopUp()) {
                    break;
                  }
                  self.$notify({
                    title: `已同意已平仓修改`,
                    dangerouslyUseHTMLString: true,
                    position: "bottom-left",
                    message: `
                    <div class="notify">
                      <dl>
                        <dt>债券码</dt>
                        <dd>${msgJson.data.tscode.replace(/.IB/, "")}</dd>
                      </dl>
                      <dl>
                        <dt>方向</dt>
                        <dd>${
                          msgJson.data.direction === "bond_0"
                            ? "买入"
                            : msgJson.data.direction === "bond_1"
                            ? "卖出"
                            : ""
                        }</dd>
                      </dl>
                      <dl>
                        <dt>成交价</dt>
                        <dd>${util.moneyFormat(msgJson.data.price, 4)}</dd>
                      </dl>
                      <dl>
                        <dt>成交量</dt>
                        <dd>${msgJson.data.volume}</dd>
                      </dl>
                      <dl>
                        <dt>清算速度</dt>
                        <dd>${msgJson.data.deliveryTime.substr(0, 10)}</dd>
                      </dl>
                      <dl>
                        <dt>单据号</dt>
                        <dd>${msgJson.data.tradeNum}</dd>
                      </dl>
                      <dl>
                        <dt>备注</dt>
                        <dd>${msgJson.data.remark}</dd>
                      </dl>
                    </div>
                    `,
                    duration: 0,
                  });
                  self.tryPlay();
                  break;
                case "yipingchangedeny_bond_0":
                case "yipingchangedeny_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  if (msgJson.actionType === "refresh" || self.openPopUp()) {
                    break;
                  }
                  self.$notify({
                    title: `已拒绝已平仓修改`,
                    dangerouslyUseHTMLString: true,
                    position: "bottom-left",
                    customClass: "notify-yellow",
                    message: `
                    <div class="notify">
                      <dl>
                        <dt>债券码</dt>
                        <dd>${msgJson.data.tscode.replace(/.IB/, "")}</dd>
                      </dl>
                      <dl>
                        <dt>方向</dt>
                        <dd>${
                          msgJson.data.direction === "bond_0"
                            ? "买入"
                            : msgJson.data.direction === "bond_1"
                            ? "卖出"
                            : ""
                        }</dd>
                      </dl>
                      <dl>
                        <dt>成交价</dt>
                        <dd>${util.moneyFormat(msgJson.data.price, 4)}</dd>
                      </dl>
                      <dl>
                        <dt>成交量</dt>
                        <dd>${msgJson.data.volume}</dd>
                      </dl>
                      <dl>
                        <dt>清算速度</dt>
                        <dd>${msgJson.data.deliveryTime.substr(0, 10)}</dd>
                      </dl>
                      <dl>
                        <dt>单据号</dt>
                        <dd>${msgJson.data.tradeNum}</dd>
                      </dl>
                      <dl>
                        <dt>备注</dt>
                        <dd>${msgJson.data.remark}</dd>
                      </dl>
                    </div>
                    `,
                    duration: 0,
                  });
                  self.tryPlay();
                  break;
                case "nancheng_cancel_bond_0":
                case "nancheng_cancel_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  if (msgJson.actionType === "refresh" || self.openPopUp()) {
                    break;
                  }
                  self.$notify({
                    title: `${msgJson.data.createuser} 难成已撤单`,
                    dangerouslyUseHTMLString: true,
                    position: "bottom-left",
                    customClass: "notify-yellow",
                    message: `
                    <div class="notify">
                      <dl>
                        <dt>债券码</dt>
                        <dd>${msgJson.data.tscode.replace(/.IB/, "")}</dd>
                      </dl>
                      <dl>
                        <dt>方向</dt>
                        <dd>${
                          msgJson.data.direction === "bond_0"
                            ? "买入"
                            : msgJson.data.direction === "bond_1"
                            ? "卖出"
                            : ""
                        }</dd>
                      </dl>
                      <dl>
                        <dt>成交价</dt>
                        <dd>${util.moneyFormat(msgJson.data.price, 4)}</dd>
                      </dl>
                      <dl>
                        <dt>成交量</dt>
                        <dd>${msgJson.data.volume}</dd>
                      </dl>
                      <dl>
                        <dt>清算速度</dt>
                        <dd>${msgJson.data.deliveryTime.substr(0, 10)}</dd>
                      </dl>
                      <dl>
                        <dt>单据号</dt>
                        <dd>${msgJson.data.tradeNum}</dd>
                      </dl>
                      <dl>
                        <dt>备注</dt>
                        <dd>${msgJson.data.remark}</dd>
                      </dl>
                    </div>
                    `,
                    duration: 0,
                  });
                  self.tryPlay();
                  break;
                case "nancheng_baoliu_bond_0":
                case "nancheng_baoliu_bond_1":
                  if (self.openPopUp()) {
                    break;
                  }
                  self.$notify({
                    title: `${msgJson.data.createuser} 难成已保留`,
                    dangerouslyUseHTMLString: true,
                    position: "bottom-left",
                    message: `
                    <div class="notify">
                      <dl>
                        <dt>债券码</dt>
                        <dd>${msgJson.data.tscode.replace(/.IB/, "")}</dd>
                      </dl>
                      <dl>
                        <dt>方向</dt>
                        <dd>${
                          msgJson.data.direction === "bond_0"
                            ? "买入"
                            : msgJson.data.direction === "bond_1"
                            ? "卖出"
                            : ""
                        }</dd>
                      </dl>
                      <dl>
                        <dt>成交价</dt>
                        <dd>${util.moneyFormat(msgJson.data.price, 4)}</dd>
                      </dl>
                      <dl>
                        <dt>成交量</dt>
                        <dd>${msgJson.data.volume}</dd>
                      </dl>
                      <dl>
                        <dt>清算速度</dt>
                        <dd>${msgJson.data.deliveryTime.substr(0, 10)}</dd>
                      </dl>
                      <dl>
                        <dt>单据号</dt>
                        <dd>${msgJson.data.tradeNum}</dd>
                      </dl>
                      <dl>
                        <dt>备注</dt>
                        <dd>${msgJson.data.remark}</dd>
                      </dl>
                    </div>
                    `,
                    duration: 0,
                  });
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  self.tryPlay();
                  break;
                case "koutouweiyueconfirm_bond_0":
                case "koutouweiyueconfirm_bond_1":
                  if (self.openPopUp()) {
                    break;
                  }
                  self.$notify({
                    title: `${msgJson.data.yanjiuyuanName} 已确认口头违约`,
                    dangerouslyUseHTMLString: true,
                    position: "bottom-left",
                    customClass: "notify-red",
                    message: `
                    <div class="notify notify-dd-red">
                      <dl>
                        <dt>债券码</dt>
                        <dd>${msgJson.data.tscode.replace(/.IB/, "")}</dd>
                      </dl>
                      <dl>
                        <dt>方向</dt>
                        <dd>${
                          msgJson.data.direction === "bond_0"
                            ? "买入"
                            : msgJson.data.direction === "bond_1"
                            ? "卖出"
                            : ""
                        }</dd>
                      </dl>
                      <dl>
                        <dt>成交价</dt>
                        <dd>${util.moneyFormat(msgJson.data.price, 4)}</dd>
                      </dl>
                      <dl>
                        <dt>成交量</dt>
                        <dd>${msgJson.data.volume}</dd>
                      </dl>
                      <dl>
                        <dt>清算速度</dt>
                        <dd>${msgJson.data.deliveryTime.substr(0, 10)}</dd>
                      </dl>
                      <dl>
                        <dt>单据号</dt>
                        <dd>${msgJson.data.tradeNum}</dd>
                      </dl>
                      <dl>
                        <dt>备注</dt>
                        <dd>${msgJson.data.remark}</dd>
                      </dl>
                    </div>
                    `,
                    duration: 0,
                  });
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  self.tryPlay();
                  break;
                case "koutouweiyuedeny_bond_0":
                case "koutouweiyuedeny_bond_1":
                  if (self.openPopUp()) {
                    break;
                  }
                  self.$notify({
                    title: `${msgJson.data.yanjiuyuanName} 已拒绝口头违约`,
                    dangerouslyUseHTMLString: true,
                    position: "bottom-left",
                    customClass: "notify-red",
                    message: `
                    <div class="notify notify-dd-red">
                      <dl>
                        <dt>债券码</dt>
                        <dd>${msgJson.data.tscode.replace(/.IB/, "")}</dd>
                      </dl>
                      <dl>
                        <dt>方向</dt>
                        <dd>${
                          msgJson.data.direction === "bond_0"
                            ? "买入"
                            : msgJson.data.direction === "bond_1"
                            ? "卖出"
                            : ""
                        }</dd>
                      </dl>
                      <dl>
                        <dt>成交价</dt>
                        <dd>${util.moneyFormat(msgJson.data.price, 4)}</dd>
                      </dl>
                      <dl>
                        <dt>成交量</dt>
                        <dd>${msgJson.data.volume}</dd>
                      </dl>
                      <dl>
                        <dt>清算速度</dt>
                        <dd>${msgJson.data.deliveryTime.substr(0, 10)}</dd>
                      </dl>
                      <dl>
                        <dt>单据号</dt>
                        <dd>${msgJson.data.tradeNum}</dd>
                      </dl>
                      <dl>
                        <dt>备注</dt>
                        <dd>${msgJson.data.remark}</dd>
                      </dl>
                    </div>
                    `,
                    duration: 0,
                  });
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  self.tryPlay();
                  break;
                case "koutouweiyuerequest_bond_0":
                case "koutouweiyuerequest_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  break;
                case "confirm_cancel_bond_0":
                case "confirm_cancel_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  break;
                case "tradecompare_bond_0":
                case "tradecompare_bond_1":
                case "deny_cancel_bond_0":
                case "deny_cancel_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  break;
                case "yipingchangerequest_bond_0":
                case "yipingchangerequest_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  break;
                case "nancheng_bond_0":
                case "nancheng_bond_1":
                case "weipingchangerequest_bond_0":
                case "weipingchangerequest_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  break;
                case "xuzuo_confirmdeal_bond_0":
                case "xuzuo_confirmdeal_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  if (msgJson.actionType === "refresh" || self.openPopUp()) {
                    break;
                  }
                  self.$notify({
                    title: `${msgJson.data.yanjiuyuanName} 已确认续作`,
                    dangerouslyUseHTMLString: true,
                    position: "top-left",
                    message: `
                    <div class="notify">
                      <dl>
                        <dt>债券码</dt>
                        <dd>${msgJson.data.tscode}</dd>
                      </dl>
                      <dl>
                        <dt>方向</dt>
                        <dd>${
                          msgJson.data.direction === "bond_0"
                            ? "买入"
                            : msgJson.data.direction === "bond_1"
                            ? "卖出"
                            : ""
                        }</dd>
                      </dl>
                      <dl>
                        <dt>成交价</dt>
                        <dd>${util.moneyFormat(msgJson.data.price, 4)}</dd>
                      </dl>
                      <dl>
                        <dt>成交量</dt>
                        <dd>${msgJson.data.volume}</dd>
                      </dl>
                      <dl>
                        <dt>清算速度</dt>
                        <dd>${msgJson.data.deliveryTime.substr(0, 10)}</dd>
                      </dl>
                    </div>
                    `,
                    duration: 0,
                  });
                  self.tryPlay();
                  break;
                case "xuzuo_deal_bond_0":
                case "xuzuo_deal_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  if (msgJson.actionType === "refresh" || self.openPopUp()) {
                    break;
                  }
                  self.$notify({
                    title: `${msgJson.data.tradeuser} 续作交易已成功`,
                    dangerouslyUseHTMLString: true,
                    position: "bottom-left",
                    message: `
                    <div class="notify">
                      <dl>
                        <dt>债券码</dt>
                        <dd>${msgJson.data.tscode}</dd>
                      </dl>
                      <dl>
                        <dt>方向</dt>
                        <dd>${
                          msgJson.data.direction === "bond_0"
                            ? "买入"
                            : msgJson.data.direction === "bond_1"
                            ? "卖出"
                            : ""
                        }</dd>
                      </dl>
                      <dl>
                        <dt>成交价</dt>
                        <dd>${util.moneyFormat(msgJson.data.price, 4)}</dd>
                      </dl>
                      <dl>
                        <dt>成交量</dt>
                        <dd>${msgJson.data.volume}</dd>
                      </dl>
                      <dl>
                        <dt>清算速度</dt>
                        <dd>${msgJson.data.deliveryTime.substr(0, 10)}</dd>
                      </dl>
                    </div>
                    `,
                    duration: 0,
                  });
                  self.tryPlay();
                  break;
                case "xuzuo_deny_deal_bond_0":
                case "xuzuo_deny_deal_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  if (msgJson.actionType === "refresh" || self.openPopUp()) {
                    break;
                  }
                  notify = self.$notify({
                    title: `${msgJson.data.rt.yanjiuyuanName} 已拒绝续作`,
                    dangerouslyUseHTMLString: true,
                    position: "bottom-left",
                    customClass: "notify-yellow",
                    message: h("div", { class: "notify" }, [
                      h("dl", null, [
                        h("dt", null, "单据号"),
                        h("dd", null, `${msgJson.data.rt.tradeNum}`),
                      ]),
                      h("dl", null, [
                        h("dt", null, "债券码"),
                        h(
                          "dd",
                          null,
                          `${msgJson.data.rt.tscode.replace(/.IB/, "")}`
                        ),
                      ]),
                      h("dl", null, [
                        h("dt", null, "方向"),
                        h(
                          "dd",
                          null,
                          `${
                            msgJson.data.rt.direction === "bond_0"
                              ? "买入"
                              : msgJson.data.rt.direction === "bond_1"
                              ? "卖出"
                              : " "
                          }`
                        ),
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交价"),
                        h("dd", null, [
                          h(
                            "span",
                            {
                              style:
                                "text-decoration: line-through #ec0000; padding-right:5px;",
                            },
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "price"
                            ) !== -1
                              ? util.moneyFormat(msgJson.data.rt.price, 4) + " "
                              : ""
                          ),
                          h(
                            "span",
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "price"
                            ) !== -1
                              ? { style: "color:#ec0000" }
                              : null,
                            util.moneyFormat(msgJson.data.dto.price, 4)
                          ),
                        ]),
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交量"),
                        h("dd", null, [
                          h(
                            "span",
                            {
                              style:
                                "text-decoration: line-through #ec0000; padding-right:5px;",
                            },
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "volume"
                            ) !== -1
                              ? msgJson.data.rt.volume + " "
                              : ""
                          ),
                          h(
                            "span",
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "volume"
                            ) !== -1
                              ? { style: "color:#ec0000" }
                              : null,
                            msgJson.data.dto.volume
                          ),
                        ]),
                      ]),
                      h("dl", null, [
                        h("dt", null, "清算速度"),
                        h("dd", null, [
                          h(
                            "span",
                            {
                              style:
                                "text-decoration: line-through #ec0000; padding-right:5px;",
                            },
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "deliveryTime"
                            ) !== -1
                              ? msgJson.data.rt.deliveryTime
                                  .toString()
                                  .substr(0, 10) + " "
                              : ""
                          ),
                          h(
                            "span",
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "deliveryTime"
                            ) !== -1
                              ? { style: "color:#ec0000" }
                              : null,
                            msgJson.data.dto.deliveryTime
                              .toString()
                              .substr(0, 10)
                          ),
                        ]),
                      ]),
                    ]),
                    duration: 0,
                  });
                  self.tryPlay();
                  break;
                case "gundan_bond_1":
                case "gundan_bond_0":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  if (msgJson.actionType === "refresh" || self.openPopUp()) {
                    break;
                  }
                  notify = self.$notify({
                    title: `${msgJson.data.first.yanjiuyuanName} 发起滚单`,
                    dangerouslyUseHTMLString: true,
                    position: "bottom-left",
                    message: h("div", { class: "notify" }, [
                      h("dl", null, [
                        h("dt", null, "创建时间"),
                        h("dd", null, `${msgJson.data.first.createTime}`),
                      ]),
                      h("dl", null, [
                        h("dt", null, "债券码"),
                        h("dd", null, `${msgJson.data.first.tscode}`),
                      ]),
                      h(
                        "div",
                        {
                          style:
                            "border:1px solid #f56c6c; width:100%; background:#fac8c8; position:relative; padding:8px 0;",
                          class: "mt10",
                        },
                        [
                          h(
                            "div",
                            {
                              style:
                                "position: absolute; right:10px; top:10px; color:red; opacity:0.5",
                            },
                            "优先成交"
                          ),
                          h("dl", null, [
                            h("dt", null, "方向"),
                            h(
                              "dd",
                              null,
                              `${
                                msgJson.data.first.direction === "bond_0"
                                  ? "买入"
                                  : msgJson.data.first.direction === "bond_1"
                                  ? "卖出"
                                  : ""
                              }`
                            ),
                          ]),
                          h("dl", null, [
                            h("dt", null, "询价"),
                            h(
                              "dd",
                              null,
                              `${util.moneyFormat(msgJson.data.first.price, 4)}`
                            ),
                          ]),
                          h("dl", null, [
                            h("dt", null, "询量"),
                            h("dd", null, `${msgJson.data.first.volume}`),
                          ]),
                          h("dl", null, [
                            h("dt", null, "清算速度"),
                            h(
                              "dd",
                              null,
                              `${msgJson.data.first.deliveryTime.substr(0, 10)}`
                            ),
                          ]),
                        ]
                      ),
                      h(
                        "div",
                        {
                          style:
                            "border:1px solid #52d5c0; width:100%;background:#d3f5ef; padding:8px 0;",
                          class: "mt10",
                        },
                        [
                          h("dl", null, [
                            h("dt", null, "方向"),
                            h(
                              "dd",
                              null,
                              `${
                                msgJson.data.second.direction === "bond_0"
                                  ? "买入"
                                  : msgJson.data.second.direction === "bond_1"
                                  ? "卖出"
                                  : ""
                              }`
                            ),
                          ]),
                          h("dl", null, [
                            h("dt", null, "询价"),
                            h(
                              "dd",
                              null,
                              `${util.moneyFormat(
                                msgJson.data.second.price,
                                4
                              )}`
                            ),
                          ]),
                          h("dl", null, [
                            h("dt", null, "询量"),
                            h("dd", null, `${msgJson.data.second.volume}`),
                          ]),
                          h("dl", null, [
                            h("dt", null, "清算速度"),
                            h(
                              "dd",
                              null,
                              `${msgJson.data.second.deliveryTime.substr(
                                0,
                                10
                              )}`
                            ),
                          ]),
                        ]
                      ),
                      // h("dl", { style: "margin-top:20px;" }, [
                      //   // h("dt", null, ""),
                      //   h("dd", null, [
                      //     h("button", {
                      //       class: "notigy-agree",
                      //       on: {
                      //         click: function () {
                      //           self.handleAcceptEnquiryRollClick(msgJson.data.first, timestamp)
                      //         }
                      //       }
                      //     }, "接收优先复制"),
                      //     h("button", {
                      //       class: "notigy-cancel",
                      //       on: {
                      //         click: function () {
                      //           self.handleNotAcceptEnquiryRollClick(msgJson.data.first, timestamp)
                      //         }
                      //       }
                      //     }, "拒收")
                      //   ])
                      // ]),
                    ]),
                    duration: 0,
                  });
                  self.notifyRejection[timestamp] = notify;
                  self.tryPlay();
                  break;
                case "budan_bond_0":
                case "budan_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  if (msgJson.actionType === "refresh" || self.openPopUp()) {
                    break;
                  }
                  notify = self.$notify({
                    title: `${msgJson.data.createUserName} 发起补单询价单`,
                    dangerouslyUseHTMLString: true,
                    position: "bottom-left",
                    message: h("div", { class: "notify" }, [
                      h("dl", null, [
                        h("dt", null, "创建时间"),
                        h("dd", null, `${msgJson.data.createTime}`),
                      ]),
                      h("dl", null, [
                        h("dt", null, "债券码"),
                        h("dd", null, `${msgJson.data.tscode}`),
                      ]),
                      h("dl", null, [
                        h("dt", null, "方向"),
                        h(
                          "dd",
                          null,
                          `${
                            msgJson.data.direction === "bond_0"
                              ? "买入"
                              : msgJson.data.direction === "bond_1"
                              ? "卖出"
                              : ""
                          }`
                        ),
                      ]),
                      h("dl", null, [
                        h("dt", null, "询价"),
                        h(
                          "dd",
                          null,
                          `${util.moneyFormat(msgJson.data.price, 4)}`
                        ),
                      ]),
                      h("dl", null, [
                        h("dt", null, "允许最差价格"),
                        h(
                          "dd",
                          null,
                          `${util.moneyFormat(
                            msgJson.data.direction === "bond_0"
                              ? msgJson.data.price -
                                  msgJson.data.worstPrice / 100
                              : msgJson.data.price +
                                  msgJson.data.worstPrice / 100,
                            4
                          )}`
                        ),
                      ]),
                      h("dl", null, [
                        h("dt", null, "询量"),
                        h("dd", null, `${msgJson.data.volume}`),
                      ]),
                      h("dl", null, [
                        h("dt", null, "清算速度"),
                        h(
                          "dd",
                          null,
                          `${msgJson.data.deliveryTime.substr(0, 10)}`
                        ),
                      ]),
                      // h("dl", { style: "margin-top:20px;" }, [
                      //   // h("dt", null, ""),
                      //   h("dd", null, [
                      //     h("button", {
                      //       class: "notigy-agree",
                      //       on: {
                      //         click: function () {
                      //           self.handleAcceptEnquiryClick(msgJson.data, timestamp)
                      //         }
                      //       }
                      //     }, "接收并复制"),
                      //     h("button", {
                      //       class: "notigy-cancel",
                      //       on: {
                      //         click: function () {
                      //           self.handleNotAcceptEnquiryClick(msgJson.data, timestamp)
                      //         }
                      //       }
                      //     }, "拒收")
                      //   ])
                      // ]),
                    ]),
                    duration: 0,
                  });
                  self.notifyRejection[timestamp] = notify;
                  self.tryPlay();
                  break;
                case "xunjiachangefinish_bond_0":
                case "xunjiachangefinish_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  if (msgJson.actionType === "refresh" || self.openPopUp()) {
                    break;
                  }
                  notify = self.$notify({
                    title: `${msgJson.data.yanjiuyuanName} 已修改询价单`,
                    dangerouslyUseHTMLString: true,
                    position: "bottom-left",
                    customClass: "notify-yellow",
                    message: h("div", { class: "notify" }, [
                      h("dl", null, [
                        h("dt", null, "单据号"),
                        h("dd", null, `${msgJson.data.ut.tradeNum}`),
                      ]),
                      h("dl", null, [
                        h("dt", null, "债券码"),
                        h(
                          "dd",
                          null,
                          `${msgJson.data.ut.tscode.replace(/.IB/, "")}`
                        ),
                      ]),
                      h("dl", null, [
                        h("dt", null, "方向"),
                        h(
                          "dd",
                          null,
                          `${
                            msgJson.data.ut.direction === "bond_0"
                              ? "买入"
                              : msgJson.data.ut.direction === "bond_1"
                              ? "卖出"
                              : " "
                          }`
                        ),
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交价"),
                        h("dd", null, [
                          h(
                            "span",
                            {
                              style:
                                "text-decoration: line-through #ec0000; padding-right:5px;",
                            },
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "price"
                            ) !== -1
                              ? util.moneyFormat(msgJson.data.ut.price, 4) + " "
                              : ""
                          ),
                          h(
                            "span",
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "price"
                            ) !== -1
                              ? { style: "color:#ec0000" }
                              : null,
                            util.moneyFormat(msgJson.data.dto.price, 4)
                          ),
                        ]),
                      ]),
                      h("dl", null, [
                        h("dt", null, "允许浮动"),
                        h("dd", null, [
                          h(
                            "span",
                            {
                              style:
                                "text-decoration: line-through #ec0000; padding-right:5px;",
                            },
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "worstPrice"
                            ) !== -1
                              ? util.moneyFormat(
                                  msgJson.data.ut.worstPrice,
                                  4
                                ) + " "
                              : ""
                          ),
                          h(
                            "span",
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "worstPrice"
                            ) !== -1
                              ? { style: "color:#ec0000" }
                              : null,
                            util.moneyFormat(msgJson.data.dto.worstPrice, 4)
                          ),
                        ]),
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交量"),
                        h("dd", null, [
                          h(
                            "span",
                            {
                              style:
                                "text-decoration: line-through #ec0000; padding-right:5px;",
                            },
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "volume"
                            ) !== -1
                              ? msgJson.data.ut.volume + " "
                              : ""
                          ),
                          h(
                            "span",
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "volume"
                            ) !== -1
                              ? { style: "color:#ec0000" }
                              : null,
                            msgJson.data.dto.volume
                          ),
                        ]),
                      ]),
                      h("dl", null, [
                        h("dt", null, "清算速度"),
                        h("dd", null, [
                          h(
                            "span",
                            {
                              style:
                                "text-decoration: line-through #ec0000; padding-right:5px;",
                            },
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "deliveryTime"
                            ) !== -1
                              ? msgJson.data.ut.deliveryTime
                                  .toString()
                                  .substr(0, 10) + " "
                              : ""
                          ),
                          h(
                            "span",
                            msgJson.data.compareResult.fieldlist.indexOf(
                              "deliveryTime"
                            ) !== -1
                              ? { style: "color:#ec0000" }
                              : null,
                            msgJson.data.dto.deliveryTime
                              .toString()
                              .substr(0, 10)
                          ),
                        ]),
                      ]),
                    ]),
                    duration: 0,
                  });
                  self.tryPlay();
                  break;
                case "xunjiachangerequest_bond_0":
                case "xunjiachangerequest_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  if (msgJson.actionType === "refresh" || self.openPopUp()) {
                    break;
                  }
                  // notify = self.$notify({
                  //   title: `询价修改待确认`,
                  //   dangerouslyUseHTMLString: true,
                  //   position: 'bottom-left',
                  //   customClass: 'notify-yellow',
                  //   message: h(
                  //     "div",
                  //     { class: "notify" },
                  //     [
                  //       h("dl", null, [
                  //         h("dt", null, "单据号"),
                  //         h("dd", null, `${msgJson.data.ut.tradeNum}`)
                  //       ]),
                  //       h("dl", null, [
                  //         h("dt", null, "债券码"),
                  //         h("dd", null, `${msgJson.data.ut.tscode.replace(/.IB/, '')}`)
                  //       ]),
                  //       h("dl", null, [
                  //         h("dt", null, "方向"),
                  //         h("dd", null, `${msgJson.data.ut.direction === 'bond_0' ? '买入' : msgJson.data.ut.direction === 'bond_1' ? '卖出' : ' '}`)
                  //       ]),
                  //       h("dl", null, [
                  //         h("dt", null, "成交价"),
                  //         h("dd", null, [
                  //           h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('price') !== -1 ? util.moneyFormat(msgJson.data.ut.price, 4) + ' ' : ''),
                  //           h("span", msgJson.data.compareResult.fieldlist.indexOf('price') !== -1 ? { style: "color:#ec0000" } : null, util.moneyFormat(msgJson.data.dto.price, 4))
                  //         ])
                  //       ]),
                  //       h("dl", null, [
                  //         h("dt", null, "允许浮动"),
                  //         h("dd", null, [
                  //           h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('worstPrice') !== -1 ? util.moneyFormat(msgJson.data.ut.worstPrice, 4) + ' ' : ''),
                  //           h("span", msgJson.data.compareResult.fieldlist.indexOf('worstPrice') !== -1 ? { style: "color:#ec0000" } : null, util.moneyFormat(msgJson.data.dto.worstPrice, 4))
                  //         ])
                  //       ]),
                  //       h("dl", null, [
                  //         h("dt", null, "成交量"),
                  //         h("dd", null, [
                  //           h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('volume') !== -1 ? msgJson.data.ut.volume + ' ' : ''),
                  //           h("span", msgJson.data.compareResult.fieldlist.indexOf('volume') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.volume)
                  //         ])
                  //       ]),
                  //       h("dl", null, [
                  //         h("dt", null, "清算速度"),
                  //         h("dd", null, [
                  //           h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('deliveryTime') !== -1 ? msgJson.data.ut.deliveryTime.toString().substr(0, 10) + ' ' : ''),
                  //           h("span", msgJson.data.compareResult.fieldlist.indexOf('deliveryTime') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.deliveryTime.toString().substr(0, 10))
                  //         ])
                  //       ]),
                  //       // h("dl", { style: "margin-top:20px;" }, [
                  //       //   // h("dt", null, ""),
                  //       //   h("dd", null, [
                  //       //     h("button", {
                  //       //       class: "notigy-agree",
                  //       //       on: {
                  //       //         click: function () {
                  //       //           self.handleInquiryEditConfirmClick(msgJson.data.dto.userTradeId, timestamp)
                  //       //         }
                  //       //       }
                  //       //     }, "同意"),
                  //       //     h("button", {
                  //       //       class: "notigy-cancel",
                  //       //       on: {
                  //       //         click: function () {
                  //       //           self.handleInquiryEditRejectionClick(msgJson.data.dto.userTradeId, timestamp)
                  //       //         }
                  //       //       }
                  //       //     }, "拒绝")
                  //       //   ])
                  //       // ]),
                  //     ],
                  //   ),
                  //   duration: 0
                  // });
                  // self.notifyRejection[timestamp] = notify
                  self.tryPlay();
                  break;
                case "xiugaichangedeny_bond_0":
                case "xiugaichangedeny_bond_1":
                case "xiugaichangeconfirm_bond_0":
                case "xiugaichangeconfirm_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  if (msgJson.actionType === "refresh") {
                    break;
                  }
                  break;
                case "jiaogeweiyueNotice_bond_0":
                case "jiaogeweiyueNotice_bond_1":
                  self.$store.commit(
                    "SET_ENQUIRY_INFO",
                    new Date().getTime() + "-" + Math.random(100000)
                  );
                  if (msgJson.actionType === "refresh" || self.openPopUp()) {
                    break;
                  }
                  self.$notify({
                    title: `${msgJson.data.jiaogeyuanName} 发起违约`,
                    dangerouslyUseHTMLString: true,
                    position: "top-left",
                    customClass: "notify-red",
                    message: `
                    <div class="notify notify-dd-red">
                      <dl>
                        <dt>单据号</dt>
                        <dd>${msgJson.data.tradeNum}</dd>
                      </dl>
                      <dl>
                        <dt>债券码</dt>
                        <dd>${msgJson.data.tscode}</dd>
                      </dl>
                      <dl>
                        <dt>方向</dt>
                        <dd>${
                          msgJson.data.direction === "bond_0"
                            ? "买入"
                            : msgJson.data.direction === "bond_1"
                            ? "卖出"
                            : ""
                        }</dd>
                      </dl>
                      <dl>
                        <dt>成交价</dt>
                        <dd>${util.moneyFormat(msgJson.data.price, 4)}</dd>
                      </dl>
                      <dl>
                        <dt>成交量</dt>
                        <dd>${msgJson.data.volume}</dd>
                      </dl>
                      <dl>
                        <dt>清算速度</dt>
                        <dd>${msgJson.data.deliveryTime.substr(0, 10)}</dd>
                      </dl>
                      <dl>
                        <dt>违约方</dt>
                        <dd>${configUtil.funcKeyValue(
                          msgJson.data.weiyuePerson
                            ? msgJson.data.weiyuePerson.toString()
                            : "",
                          "breakTypeOptions"
                        )}</dd>
                      </dl>
                      <dl>
                        <dt>违约量</dt>
                        <dd>${msgJson.data.weiyueAmount}</dd>
                      </dl>
                      <dl>
                        <dt>做市商</dt>
                        <dd>${msgJson.data.marketMakerName}</dd>
                      </dl>
                      <dl>
                        <dt>提示</dt>
                        <dd>请去违约页面处理后续！</dd>
                      </dl>
                    </div>
                    `,
                    duration: 0,
                  });
                  self.tryPlay();
                  break;
              }
              self.socketMain.send(
                JSON.stringify({
                  dataType: "ack",
                  data: {
                    dataKey: msgJson.dataKey,
                    dataType: msgJson.dataType,
                  },
                })
              );
            }
          };
          // 关闭事件
          self.socketMain.onclose = function (code, reason) {
            console.log("websocket已关闭", code, reason);
            self.reconnect();
          };
          // 发生了错误事件
          self.socketMain.onerror = function () {
            console.log("websocket发生了错误");
            // 重连
            self.reconnect();
          };
        }
      }
    },
    // socket心跳
    socketHeart() {
      const self = this;
      this.socketTimer = setInterval(() => {
        if (self.socketMain) {
          console.log("WebSocket Send Heartbeat : ", new Date());
          self.socketMain.send(
            JSON.stringify({ dataKey: "HELLO", dataType: "ping" })
          );
        }
      }, 60 * 1000);
    },
    // 重连
    reconnect() {
      const self = this;
      if (self.socketMain && self.socketMain.readyState === 1) {
        // 如果状态等于1代表websocket连接正常
        return;
      }
      if (lockReconnect) {
        return;
      }
      // 让重连锁变为true,阻止进入下一个循环锁
      lockReconnect = true;
      self.reconnectTimer = setTimeout(() => {
        console.log("尝试重连: ", new Date());
        Promise.all([(lockReconnect = false)]).then(() => {
          this.initSocket();
        });
      }, 5000);
    },
    openPopUp() {
      const wins = ["chatitem"];
      const unOpen = wins.filter((n) => {
        return window.location.href.includes(n);
      });
      return unOpen.length > 0;
    },
    // 接收询价滚单
    handleAcceptEnquiryRollClick(obj, timestamp) {
      const self = this;
      api.bondRollAccept({ relativeNum: obj.relativeNum }).then((response) => {
        if (response && response.code === "00000") {
          self.copySocket(obj);
          self.$store.commit(
            "SET_ENQUIRY_INFO",
            new Date().getTime() + "-" + Math.random(100000)
          );
          this.$message({
            message: "已接收并复制成功",
            type: "success",
          });
        } else {
          this.$message({
            message: response.message,
            type: "error",
          });
        }
        self.notifyRejection[timestamp].close();
        delete self.notifyRejection[timestamp];
      });
    },
    // 拒收询价滚单
    handleNotAcceptEnquiryRollClick(obj, timestamp) {
      const self = this;
      api.bondRollReject({ relativeNum: obj.relativeNum }).then((response) => {
        if (response && response.code === "00000") {
          this.$message({
            message: "已拒收",
            type: "info",
          });
          self.$store.commit(
            "SET_ENQUIRY_INFO",
            new Date().getTime() + "-" + Math.random(100000)
          );
        } else {
          this.$message({
            message: response.message,
            type: "error",
          });
        }
        self.notifyRejection[timestamp].close();
        delete self.notifyRejection[timestamp];
      });
    },
    // 接收询价单
    handleAcceptEnquiryClick(obj, timestamp) {
      const self = this;
      api.inquiryAccept({ usertradeId: obj.userTradeId }).then((response) => {
        if (response && response.code === "00000") {
          this.$message({
            message: "已接收并复制成功",
            type: "success",
          });
          self.copySocket(obj);
          self.$store.commit(
            "SET_ENQUIRY_INFO",
            new Date().getTime() + "-" + Math.random(100000)
          );
        } else {
          this.$message({
            message: response.message,
            type: "error",
          });
        }
        self.notifyRejection[timestamp].close();
        delete self.notifyRejection[timestamp];
      });
    },
    // 拒收询价单
    handleNotAcceptEnquiryClick(obj, timestamp) {
      const self = this;
      api
        .inquiryRejection({ usertradeId: obj.userTradeId })
        .then((response) => {
          if (response && response.code === "00000") {
            this.$message({
              message: "已拒收",
              type: "success",
            });
            self.$store.commit(
              "SET_ENQUIRY_INFO",
              new Date().getTime() + "-" + Math.random(100000)
            );
          } else {
            this.$message({
              message: response.message,
              type: "error",
            });
          }
          self.notifyRejection[timestamp].close();
          delete self.notifyRejection[timestamp];
        });
    },
    // 确认撤单
    handleInquiryCancelConfirmClick(usertradeId, timestamp) {
      const self = this;
      api.inquiryCancelConfirm({ usertradeId }).then((response) => {
        if (response && response.code === "00000") {
          self.$message({
            message: "已撤单",
            type: "success",
          });
          self.$store.commit(
            "SET_ENQUIRY_INFO",
            new Date().getTime() + "-" + Math.random(100000)
          );
        } else {
          self.$message({
            message: `${response.message}`,
            type: "error",
          });
        }
        self.notifyRejection[timestamp].close();
        delete self.notifyRejection[timestamp];
      });
    },
    // 拒绝撤单
    handleInquiryCancelRejectionClick(usertradeId, timestamp) {
      const self = this;
      api.inquiryCancelRejection({ usertradeId }).then((response) => {
        if (response && response.code === "00000") {
          self.$message({
            message: "已拒绝",
            type: "success",
          });
          self.$store.commit(
            "SET_ENQUIRY_INFO",
            new Date().getTime() + "-" + Math.random(100000)
          );
        } else {
          self.$message({
            message: `${response.message}`,
            type: "error",
          });
        }
        self.notifyRejection[timestamp].close();
        delete self.notifyRejection[timestamp];
      });
    },
    // 同意修改询价单
    handleInquiryEditConfirmClick(usertradeId, timestamp) {
      const self = this;
      api.inquiryEditConfirm({ userTradeId: usertradeId }).then((response) => {
        if (response && response.code === "00000") {
          self.$message({
            message: "已同意修改",
            type: "success",
          });
          self.$store.commit(
            "SET_ENQUIRY_INFO",
            new Date().getTime() + "-" + Math.random(100000)
          );
        } else {
          self.$message({
            message: `${response.message}`,
            type: "error",
          });
        }
        self.notifyRejection[timestamp].close();
        delete self.notifyRejection[timestamp];
      });
    },
    // 拒绝修改询价
    handleInquiryEditRejectionClick(usertradeId, timestamp) {
      const self = this;
      api.inquiryEditReject({ userTradeId: usertradeId }).then((response) => {
        if (response && response.code === "00000") {
          self.$message({
            message: "已拒绝修改",
            type: "success",
          });
          self.$store.commit(
            "SET_ENQUIRY_INFO",
            new Date().getTime() + "-" + Math.random(100000)
          );
        } else {
          self.$message({
            message: `${response.message}`,
            type: "error",
          });
        }
        self.notifyRejection[timestamp].close();
        delete self.notifyRejection[timestamp];
      });
    },
    // 播放提示音
    tryPlay() {
      const self = this;
      try {
        // if (self.dialogTableVisible) {
        //   self.$refs.tradeEnquiry.loadInitData()
        // }
        if (self.$refs.playAudio) {
          self.$refs.playAudio.play();
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  beforeDestroy() {
    this.socketMain.close();
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    this["SET_SOCKET_MAIN"](null);
  },
};
</script>
