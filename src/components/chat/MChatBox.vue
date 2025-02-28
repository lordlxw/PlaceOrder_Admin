<template>
  <div
    class="chat_box"
    @click="
      () => {
        msgShow = false;
      }
    "
    :class="msgShow ? 'message show' : ''"
  >
    <el-container v-loading="chatloads">
      <el-aside width="210px" v-if="asideShow">
        <div class="aside_top"></div>
        <div v-infinite-scroll="load">
          <div
            v-for="item in asideItems"
            class="chat_item"
            :style="
              item.brokerid === mine.brokerid &&
              item.channelId === mine.channelId
                ? 'background-color: #cfcfcf;'
                : ''
            "
            :key="item.brokerid"
            @click="changAsideItem(item)"
          >
            <el-row>
              <el-col :span="8">
                <div class="demo-basic--circle">
                  <div class="block">
                    <el-avatar
                      :size="50"
                      :class="item.occupy ? 'txt-red' : ''"
                      >{{ item.company.substr(0, 1) }}</el-avatar
                    >
                  </div>
                </div>
              </el-col>
              <el-col :span="16">
                <div class="item_name">{{ item.company }}</div>
                <div class="item_name item_content">
                  {{ item.describe || "没有新消息..." }}
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-aside>
      <el-container>
        <el-header style="-webkit-app-region: drag">
          <el-row>
            <el-col :span="8" class="chat_header_left">
              <el-row>
                <el-col :span="8">
                  <div class="demo-basic--circle">
                    <div class="block">
                      <el-avatar :size="50">{{
                        mine.company.substr(0, 1)
                      }}</el-avatar>
                    </div>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div class="item_name">{{ mine.company }}</div>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="describe || '没有新消息...'"
                    placement="top-start"
                  >
                    <div class="item_name item_content">
                      {{ describe || "没有新消息..." }}
                    </div>
                  </el-tooltip>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="16"> </el-col>
          </el-row>
          <div class="header-right">
            <i @click="minimize" class="el-icon-minus"></i>
            <i @click="handleClose" class="el-icon-close"></i>
          </div>
          <el-divider></el-divider>
        </el-header>
        <div class="el-main" ref="scrollContainer" id="scrollContainer">
          <div
            v-for="(item, i) in messages"
            class="main_item"
            @dblclick="updateChatMessage(item)"
            :class="{
              main_item_red: !item.tradeId,
              main_item_highlight:
                item.tradeId == highlight || item.id == highlight,
            }"
            v-if="
              item.brokerId == mine.brokerid && item.channelId == mine.channelId
            "
            :key="i"
            :id="'message_' + item.id"
          >
            <el-row>
              <el-col :span="asideShow ? 2 : 3" v-if="item.direction === 1">
                <div class="demo-basic--circle">
                  <div class="block">
                    <el-avatar :size="40">{{
                      mine.company && mine.company.substr(0, 1)
                    }}</el-avatar>
                  </div>
                </div>
              </el-col>
              <el-col
                :span="21"
                :class="item.direction === 1 ? 'main_left' : 'main_right'"
              >
                <div class="main_name" v-if="item.direction === 0">
                  <span class="main-time mr10">{{
                    dateFormat(item.createTime)
                  }}</span>
                  <span
                    >{{ item.nickName || userName }}-{{ item.tradeId }}</span
                  >
                </div>
                <div class="main_name" v-else>
                  <span>{{ mine.company }}</span>
                  <span class="main-time ml10">{{
                    dateFormat(item.createTime)
                  }}</span>
                </div>
                <div class="main_content">
                  {{ item.chatMessage }}
                </div>
                <div class="main_quote" v-if="item.quoteMessage">
                  <div
                    class="text"
                    :class="item.direction === 0 ? 'text-right' : 'text-left'"
                  >
                    {{ item.quoteDirection === 0 ? "研究员" : mine.company }}:{{
                      item.quoteMessage
                    }}
                  </div>
                </div>
              </el-col>
              <el-col :span="asideShow ? 2 : 3" v-if="item.direction === 0">
                <div class="demo-basic--circle">
                  <div class="block">
                    <el-avatar :size="40">{{
                      item.nickName
                        ? item.nickName.substr(0, 1)
                        : userName.substr(0, 1)
                    }}</el-avatar>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <el-footer
          :height="simulation ? '' : '190px'"
          v-if="
            setAuth('system:order:edit') &&
            (mine.occupyier === userInfo.userId || simulation)
          "
        >
          <div class="mt20" v-if="!simulation">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="textarea"
              maxlength="300"
              :rows="5"
              show-word-limit
              resize="none"
              @keydown.enter.prevent="inputKeydown"
              @input="handleInput"
            ></el-input>
          </div>
          <div class="footer_send">
            <el-select
              v-model="selectVal"
              placeholder="请选择"
              @change="
                () => {
                  textarea = selectVal;
                  sendChatMessages(simulation ? 0 : 1);
                }
              "
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-button type="success" plain @click="dateChange"
              >刷新记录</el-button
            >
            <el-button
              type="success"
              plain
              @click="hijackChat(1)"
              v-if="!simulation"
              >释放通道</el-button
            >
            <el-button type="success" plain @click="sendChatMessages"
              >发送</el-button
            >
          </div>
        </el-footer>
        <el-footer v-else>
          <div class="footer_send">
            <el-date-picker
              v-model="chatDate"
              align="right"
              type="date"
              placeholder="选择日期"
              v-if="asideShow"
              @change="dateChange"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
            <el-button
              v-if="setAuth('system:order:edit')"
              type="success"
              plain
              :disabled="!mine.available"
              @click="hijackChat(0)"
              >劫持通道</el-button
            >
            <el-button type="success" plain @click="dateChange"
              >刷新记录</el-button
            >
          </div>
        </el-footer>
      </el-container>
    </el-container>

    <el-dialog
      :title="dialogVisible.title"
      v-model="dialogVisible.show"
      width="300px"
      top="30vh"
      custom-class="custom-dialog"
      :before-close="
        () => {
          dialogVisible.show = false;
        }
      "
    >
      <div v-html="dialogVisible.message"></div>
      <template #footer>
        <el-button @click="dialogVisible.show = false">取 消</el-button>
        <el-button :class="'bg-green'" @click="dialogVisible.fun"
          >确 定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { pageMixin } from "@/utils/pageMixin";
import moment from "moment";
import api from "@/api/Trade";
import * as util from "@/utils/util";
export default {
  name: "M-ChatBox",
  created() {
    console.log("MChatBox执行created方法");
  },
  mixins: [pageMixin],
  props: {
    simulation: true,
    userName: "",
    asideShow: {
      type: Boolean,
      default: false,
    },
    asideItems: [],
    tipsHeight: {
      type: String,
    },
    tipsWidth: {
      type: Number,
      default: 200,
    },
    boxHeight: {
      type: Number,
      default: 200,
    },
    config: {
      type: Object,
      default() {
        return {
          // 是否有下拉按钮
          downBtn: true,
          rightBox: true,
          // 简约模式
          brief: true,
          // 是否开启桌面消息提醒，即在浏览器之外的提醒
          notice: false,
          // 设定
          voice: true,
          // 上传文件的扩展名
          fileExt: "",
          tabRemove: false,
          fixed: true,
        };
      },
    },
    mine: {
      type: Object,
    },
  },
  data() {
    return {
      circleUrl: "image.png",
      count: 5,
      options: [
        {
          value: "好的",
          label: "好的",
        },
      ],
      value: "",
      dialogChatBoxVisible: false,
      msgShow: false,
      describe: "",
      messages: [],
      chatDate: new Date(),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      highlight: "",
      dialogVisible: {
        title: "提示",
        show: false,
        message: "",
        fun: () => {},
      },
      chatloads: false,
      textarea: "",
      selectVal: "",
    };
  },
  computed: {
    // list() {
    //     return JSON.parse(JSON.stringify(this.messages))
    // }
    ...mapGetters({
      userInfo: "getUserInfo",
    }),
  },
  asideItems() {
    // this.getIntendComerList(this.occupyInfo)
    console.log(this.asideItems);
  },
  methods: {
    load() {
      // this.count += 2
    },
    dateChange() {
      this.chatloads = true;
      this.$emit("changAsideItem", this.mine, this.chatDate);
      setTimeout(() => {
        this.chatloads = false;
      }, 500);
    },
    changAsideItem(e) {
      this.$emit("changAsideItem", e, this.chatDate);
    },
    handleClose(e) {
      // this.dialogChatBoxVisible = false;
      this.$emit("handleClose", e);
      window.v1.close();
    },
    minimize() {
      window.v1.minimize();
    },
    scrollToBottom(height) {
      const container = this.$refs.scrollContainer;
      return container
        ? (container.scrollTop = height < 0 ? container.scrollHeight : height)
        : null;
    },
    handleInput(event) {
      // 阻止换行
      this.inputValue = event.replace(/\n/g, "");
    },
    async updateChatMessage(element) {
      if (!element.tradeId) {
        const { code } = await api.updateChatMessages(
          { tradeId: "1" },
          element.id
        );
        if (code === "00000") {
          element.tradeId = "0";
        }
      }
    },
    inputKeydown(e) {
      if (e.ctrlKey) {
        // 换行
        const { selectionStart, selectionEnd } = e.target;
        const chars = this.textarea.split("");
        chars.splice(selectionStart, selectionEnd - selectionStart, "\n");
        this.textarea = chars.join("");
      } else {
        this.sendChatMessages(); // 提交方法
      }
    },
    sendChatMessages(isProd = 1) {
      Promise.all([console.log("发送消息给中介")]).then(async () => {
        if (this.textarea && this.textarea.trim() !== "") {
          const data = {
            chatId: this.userInfo.userId,
            message: this.textarea,
            brokerId: this.mine.brokerid,
            channelId: this.mine.channelId,
            direction: 0,
            isProd: isProd,
          };
          await api.sendChatMessages(data, "sim");
          this.textarea = "";
        } else {
          this.$message({
            message: `请输入你要发送的消息`,
            type: "warning",
          });
        }
      });
    },
    pushMsgs(items, refresh) {
      console.log("执行pushMsgs", items, refresh);
      if (refresh) {
        this.messages = [];
      }

      if (items.length === 1) {
        this.msgShow = items[0].direction === 1 ? true : false;
        this.messages.push(items[0]);
        if (this.msgShow) {
          this.describe = items[0].chatMessage;
        }
      } else {
        this.msgShow = false;
        items = items.sort((a, b) => {
          const dateA = new Date(a.createTime);
          const dateB = new Date(b.createTime);
          return dateA - dateB;
        });
        this.messages = this.messages.concat(items);
      }
      this.$nextTick(() => {
        if (this.highlight && !this.scrollBottm) {
          const brokerMsgs = this.messages.filter(
            (item) =>
              item.brokerId === this.mine.brokerid &&
              item.channelId === this.mine.channelId
          );
          let index = brokerMsgs.findIndex(
            (item) =>
              item.tradeId === this.highlight || item.id === this.highlight
          );
          const targetDom = document.getElementById(
            "message_" + brokerMsgs[index].id
          );
          const container = document.getElementById("scrollContainer");
          // const container = this.$refs.scrollContainer;
          container.scrollTo(0, targetDom.offsetTop - container.offsetTop - 10);

          // let index = this.messages.filter(item => item.brokerId === this.mine.brokerid && item.channelId === this.mine.channelId).findIndex(item => item.tradeId === this.highlight);
          // this.scrollToBottom(79 * index);
          this.scrollBottm = true;
        } else {
          this.scrollToBottom(-1);
        }
      });
      window.v1 && window.v1.focus();
    },
    hijackChat(hijack) {
      if (hijack === 1) {
        const tradeDateStart = moment(new Date()).format("YYYY-MM-DD"); // 创建一个新的日期对象，以免修改原始日期
        const tradeDateEnd = moment(new Date())
          .add(1, "days")
          .format("YYYY-MM-DD");
        api
          .inquiryQuery({
            tradeDateStart: tradeDateStart,
            tradeDateEnd: tradeDateEnd,
          })
          .then(({ code, rows }) => {
            const list = rows.filter(
              (n) =>
                n.brokerId === this.mine.brokerid &&
                n.channelId === this.mine.channelId &&
                !([2, 3, 5, 6, 13].indexOf(n.status) > 0)
            );
            if (list.length > 0) {
              this.dialogVisible = {
                title: "提示",
                show: true,
                message: `当前还有 ${list.length} 单询价正在进行中，是否还原中介占用！`,
                fun: async () => {
                  // const tradeNums = list.map(n => { return n.tradeNum });
                  const tradeNums = [];
                  const data = {
                    brokerId: this.mine.brokerid,
                    channelId: this.mine.channelId,
                    release: hijack,
                    tradeNums,
                  };
                  const { code } = await api.hijackChat(data);
                  if (code === "00000") {
                    this.dialogVisible.show = false;
                    this.chatDate = `${util.dateFormat(
                      new Date(),
                      "YYYY-MM-DD"
                    )} 00:00:00`;
                    this.dateChange();

                    window.v1.sendWinMsg({
                      id: "main",
                      fun: "window-send",
                      data: { action: "refreshData" },
                    });
                  }
                },
              };
            } else {
              this.dialogVisible = {
                title: "提示",
                show: true,
                message: `是否确定释放中介通道！`,
                fun: async () => {
                  const tradeNums = [];
                  const data = {
                    brokerId: this.mine.brokerid,
                    channelId: this.mine.channelId,
                    release: hijack,
                    tradeNums,
                  };
                  const { code } = await api.hijackChat(data);
                  if (code === "00000") {
                    this.dialogVisible.show = false;
                    this.chatDate = `${util.dateFormat(
                      new Date(),
                      "YYYY-MM-DD"
                    )} 00:00:00`;
                    this.dateChange();

                    window.v1.sendWinMsg({
                      id: "main",
                      fun: "window-send",
                      data: { action: "refreshData" },
                    });
                  }
                },
              };
            }
          });
      } else {
        this.dialogVisible = {
          title: "提示",
          show: true,
          message: `您是否需要强行占用中介：${this.mine.company}, 当前中介状态${
            this.mine.occupyier == null
              ? "空闲中！"
              : "正在交易中，强行占用可能会影响交易！"
          }`,
          fun: async () => {
            if (!this.mine.available) {
              this.$message({
                message: `中介状态已被禁用，无法占用通道`,
                type: "error",
              });
              return;
            }
            const tradeNums = [];
            const data = {
              brokerId: this.mine.brokerid,
              channelId: this.mine.channelId,
              release: hijack,
              tradeNums,
            };
            const { code } = await api.hijackChat(data);
            if (code === "00000") {
              this.dialogVisible.show = false;
              this.chatDate = `${util.dateFormat(
                new Date(),
                "YYYY-MM-DD"
              )} 00:00:00`;
              this.dateChange();

              window.v1.sendWinMsg({
                id: "main",
                fun: "window-send",
                data: { action: "refreshData" },
              });
            }
          },
        };
      }
    },
    dateFormat(date) {
      const padWithZero = (number) => {
        return number < 10 ? "0" + number : number.toString();
      };
      if (date instanceof Object) {
        return `${
          this.asideShow ? moment(date).format("YYYY-MM-DD") : ""
        } ${padWithZero(date.hour)}:${padWithZero(date.minute)}:${padWithZero(
          date.second
        )}`;
      } else {
        const time = new Date(date);
        return `${
          this.asideShow ? moment(time).format("YYYY-MM-DD") : ""
        } ${padWithZero(time.getHours())}:${padWithZero(
          time.getMinutes()
        )}:${padWithZero(time.getSeconds())}`;
      }
    },
  },
  mounted() {
    if (window.v1) {
      console.log("=============================");
      console.log("MChatBox---mounted");
      window.v1.ipcRenderer().On("window-send", (event, data) => {
        const { row, hijack, message } = data;
        console.log("MChatBox---mounted", data);
        if (row) {
          this.highlight = row.userTradeId;
          this.scrollBottm = false;
          const asideItem = this.asideItems.find(
            (element) =>
              element.brokerid === row.brokerId &&
              element.channelId === row.channelId
          );
          this.chatDate = `${util.dateFormat(
            row.createTime || new Date(),
            "YYYY-MM-DD"
          )} 00:00:00`;
          this.$emit("changAsideItem", asideItem, this.chatDate);
        } else if (hijack) {
          const { brokerId, channelId } = hijack;
          const asideItem = this.asideItems.find(
            (n) => n.brokerid === brokerId && n.channelId === channelId
          );
          this.chatDate = `${util.dateFormat(
            new Date(),
            "YYYY-MM-DD"
          )} 00:00:00`;
          this.$emit("changAsideItem", asideItem, this.chatDate);
          if (asideItem.occupyier !== this.userInfo.userId) {
            this.hijackChat(0);
            // this.dialogVisible = {
            //     title: '提示',
            //     show: true,
            //     message: `您是否需要强行占用中介：${target}, 当前中介状态${asideItem.occupyier == null ? '空闲中！' : '正在交易中，强行占用可能会影响交易！'}`,
            //     fun: () => {
            //         this.hijackChat(0)
            //     }
            // }
          }
        } else if (message) {
          this.highlight = message.id;
          this.scrollBottm = false;
          const asideItem = this.asideItems.find(
            (element) =>
              element.brokerid === message.brokerId &&
              element.channelId === message.channelId
          );
          let date = new Date();
          if (message.createTime) {
            if (message.createTime.year) {
              const { year, monthValue, dayOfMonth } = message.createTime;
              date = year + "-" + monthValue + "-" + dayOfMonth;
            } else {
              date = message.createTime;
            }
          }
          this.chatDate = `${util.dateFormat(date, "YYYY-MM-DD")} 00:00:00`;
          this.$emit("changAsideItem", asideItem, this.chatDate);
        }
      });
    }
  },
};
</script>
<style>
.no-header-dialog .el-dialog__header {
  display: none;
}

.no-header-dialog .el-dialog__body {
  padding: 0;
}
</style>
<style lang="scss" scoped>
.chat_tips {
  min-width: 215px;
  min-height: 50px;
  background-color: white;
  margin: 5px;
  display: inline-block;
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  position: relative;
  cursor: pointer;

  .tips-right {
    position: absolute;
    right: 0;
    top: 0;

    i {
      width: 20px;
      height: 20px;
      font-size: 18px;
      line-height: 20px;
      text-align: center;
    }

    i:hover {
      background-color: #b6b4b4;
    }
  }

  .tips_tit {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: normal;
    padding: 0 10px;
    line-height: 25px;
  }

  .tips_name {
    padding: 0 10px;
    line-height: 25px;
  }
}

.chat_tips:hover {
  background-color: #b8b8b8;
}

.chat_box {
  min-width: 500px;
  width: 100%;
  height: 100%;
  margin: 0px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  position: relative;
  top: unset;
  left: unset;
  border-color: rgba(0, 0, 0, 0.05);
  background-repeat: no-repeat;
  background-color: #f6f6f6;
  color: #333;
  overflow: hidden;

  .chat_header_left {
    max-height: 80px;
    cursor: pointer;
    border-radius: 3px;
    padding: 15px 0;

    .el-avatar {
      line-height: 60px;
    }

    .item_name {
      font-size: 14px;
      text-align: left;
      font-weight: bold;
      width: 100%;
      padding-left: 5px;
      line-height: 25px;
    }

    .item_content {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: normal;
      font-size: 12px;
    }
  }

  .chat_item:hover {
    background-color: #d9d9d9;
  }

  .el-aside {
    color: #333;
    text-align: center;
    background-color: #efefef;

    .aside_top {
      height: 20px;
      margin: auto;
    }

    .chat_item {
      max-height: 60px;
      margin: 5px;
      cursor: pointer;
      border-radius: 3px;
      padding: 7px 0;

      .el-avatar {
        vertical-align: middle;
        line-height: 60px;
      }

      .item_name {
        font-size: 14px;
        text-align: left;
        font-weight: bold;
        display: inline-block;
        width: 100%;
        padding-left: 5px;
        line-height: 23px;
      }

      .item_content {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: normal;
        font-size: 12px;
      }
    }
  }

  .el-aside::-webkit-scrollbar {
    width: 0em;
  }

  .el-aside::-webkit-scrollbar-track {
    background-color: transparent;
  }

  .el-aside::-webkit-scrollbar-thumb {
    background-color: transparent;
  }

  .el-header,
  .el-footer {
    color: #333;
    text-align: center;
    position: relative;
  }

  .el-header {
    height: 80px !important;

    .el-divider--horizontal {
      margin: 0px;
    }

    .header-right {
      position: absolute;
      right: 0;
      top: 0;

      i {
        width: 30px;
        height: 30px;
        font-size: 20px;
        line-height: 30px;
        -webkit-app-region: no-drag;
      }

      i:hover {
        color: #f78484;
      }
    }
  }

  .el-footer {
    background-color: #ffffff;

    .footer_send {
      text-align: right;
      line-height: 60px;

      .is-plain {
        display: inline-block;
        font-size: 14px;
        line-height: 32px;
        margin-left: 5px;
        padding: 0 20px;
        background-color: #f5f5f5;
        border: none;
        color: #606060;
        min-width: 80px;
      }

      .el-select--small >>> .el-input__inner:hover,
      .is-plain:hover {
        background-color: #189100;
        color: #fff;
      }

      .el-select--small >>> .el-input__inner {
        width: 120px;
        background-color: #f5f5f5;
        border: none;
        font-size: 12px;
      }
    }
  }

  .el-main {
    color: #333;
    text-align: center;

    .main_item_highlight {
      background-color: antiquewhite !important;
    }

    .main_item_red {
      background-color: #e3baba8c;
    }

    .main_item {
      margin: 5px 10px;
      cursor: pointer;
      border-radius: 3px;
      padding: 5px 0 10px;
      // background-color: antiquewhite;

      .el-avatar {
        vertical-align: middle;
        line-height: 60px;
      }

      .main_left {
        text-align: left;
      }

      .main_right {
        text-align: right;

        .main_content {
          background-color: #9eea6a;
        }

        .main_content:after {
          left: auto;
          right: -10px;
          border-top-color: #9eea6a;
        }
      }

      .main_name {
        font-size: 14px;
        font-weight: bold;
        display: inline-block;
        width: 100%;
        line-height: 25px;

        .main-time {
          color: #8f8e8e;
          font-size: 10px;
        }
      }

      .main_quote {
        .text {
          line-height: 20px;
          background-color: #e7e7e7a3;
          margin-top: 10px;
          color: gray;
          font-size: 10px;
          width: fit-content;
          padding: 5px 20px;
          border-radius: 3px;
          display: inline-block;
        }
      }

      .main_content {
        position: relative;
        line-height: 22px;
        padding: 8px 15px;
        background-color: #fff;
        color: #000;
        word-break: break-all;
        max-width: 262px;
        font-weight: normal;
        font-size: 12px;
        text-align: left;
        width: fit-content;
        display: inline-block;
        box-shadow: 0 2px 4px rgb(8 8 8 / 25%), 0 0 6px rgba(0, 0, 0, 0.04);
        border-radius: 7px;
        border: none;
      }

      .main_content:after {
        content: "";
        position: absolute;
        left: -10px;
        top: 13px;
        width: 0;
        height: 0;
        border-style: solid dashed dashed;
        border-color: #fff transparent transparent;
        overflow: hidden;
        border-width: 10px;
      }
    }
  }

  .el-container {
    height: 100%;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  /* 自定义滚动条的宽度 */
  .el-main::-webkit-scrollbar {
    width: 10px;
    /* 对于水平滚动条 */
    height: 10px;
    /* 对于垂直滚动条 */
  }

  /* 自定义滚动条的背景色 */
  .el-main::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
    /* 滚动条轨道的背景色 */
  }

  /* 自定义滚动条的滑块颜色 */
  .el-main::-webkit-scrollbar-thumb {
    background: #888 !important;
    border-radius: 3px;
    /* 滚动条滑块的背景色 */
  }

  /* 当鼠标悬停在滚动条上时，自定义滑块的颜色 */
  .el-main::-webkit-scrollbar-thumb:hover {
    background: #555 !important;
    /* 滚动条滑块的背景色 */
  }

  /** 设置表格内设的滚动条宽度，适应动态计算 */
  .el-main {
    &::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
  }
}

.message {
  animation: fadeInOut 2s infinite;
  opacity: 0.5;
  background-color: #f0f0f0;
  border-radius: 5px;
  box-shadow: 0 0 10px #ec0000;
  z-index: 1000;
}

.message.show {
  display: block;
}

@keyframes fadeInOut {
  0%,
  100% {
    opacity: 0.5;
  }

  50% {
    opacity: 1;
  }
}
</style>
