<template>
  <div class="order-notifiy drag-container">
    <transition-group name="slide-right" tag="div" v-if="messages.length > 0">
      <div
        class="notification draggable"
        draggable="true"
        @dragstart="dragStart"
        v-for="(item, index) in messages"
        :key="item.id"
        @click="viewChat(item)"
        :target-index="index"
      >
        <i class="el-notification__icon el-icon-warning"></i>
        <div class="el-notification__group is-with-icon">
          <div class="el-notification__title">
            {{ item.company }}-{{ item.name }}-通知消息
          </div>
          <div class="el-notification__content">
            <p>{{ item.company }}-{{ item.name }} : {{ item.chatMessage }}</p>
          </div>

          <div class="el-notification__closeBtn">
            <div
              class="el-icon-close icon"
              @click.stop="updateChatMessage(item)"
            ></div>
          </div>
        </div>
      </div>
    </transition-group>
    <el-empty v-else description="暂无数据" style="margin-top: 100%"></el-empty>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { commMixin } from "@/utils/commMixin";
import apiTrade from "@/api/Trade";
import * as util from "@/utils/util";
export default {
  mixins: [commMixin],
  created() {},
  data() {
    return {
      position: "absolute",
      messages: [],
    };
  },
  watch: {
    chatMessage(item) {
      const brokers = this.userInfo.brokers;
      const broker = brokers.find((n) => n.brokerid === item.brokerId);
      let message = { ...item, company: broker.company, name: broker.chatId };
      this.messages.unshift(message);
    },
  },
  methods: {
    openChat() {
      const args = {
        id: "chat",
        width: 1024, // 窗口宽度
        height: 968, // 窗口高度
        minWidth: 1024, // 窗口最小宽度
        minHeight: 968, // 窗口最小高度
        isMainWin: false,
        resize: false, // 是否支持缩放
        maximize: false, // 最大化窗口
        isMultiWin: false, // 是否支持多开窗口
        route: "/simulation/chat",
      };
      window.v1.createWin(args);
    },

    viewChat(message) {
      if (window.v1) {
        window.v1.hasWinsById("chat").then((bool) => {
          if (bool) {
            window.v1.focusByID("chat");
            window.v1.sendWinMsg({
              id: "chat",
              fun: "window-send",
              data: { message },
            });
          } else {
            window.v1.getAllDisplays().then((response) => {
              console.log(response);
              const maxWidth = Math.max(
                ...response.map((display) => display.bounds.width)
              );
              const maxHeight = Math.max(
                ...response.map((display) => display.bounds.height)
              );

              const minWidth =
                maxWidth / 2 - 10 <= 500 ? 500 : maxWidth / 2 - 300;
              const minHeight = maxHeight / 3 + 300;
              const args = {
                id: "chat",
                width: minWidth, // 窗口宽度
                height: minHeight, // 窗口高度
                minWidth: minWidth, // 窗口最小宽度
                minHeight: minHeight, // 窗口最小高度
                isMainWin: false,
                resize: false, // 是否支持缩放
                maximize: false, // 最大化窗口
                isMultiWin: false, // 是否支持多开窗口
                route: "/simulation/chat",
              };
              window.v1.createWin(args);
              setTimeout(() => {
                window.v1.sendWinMsg({
                  id: "chat",
                  fun: "window-send",
                  data: { message },
                });
              }, 1500);
            });
          }
        });
      }
    },
    updateChatMessage(element) {
      Promise.all([]).then(async () => {
        const chatId = this.userInfo.userId;
        const { code } = await apiTrade.updateChatMessages(
          { chatId },
          element.id
        );
        if (code === "00000") {
          const index = this.messages.indexOf(element);
          if (index !== -1) {
            this.messages.splice(index, 1);
          }
        }
      });
    },
    initChatMessages(date) {
      Promise.all([]).then(async () => {
        const createTime = `${util.dateFormat(
          date || new Date(),
          "YYYY-MM-DD"
        )} 00:00:00`;
        const { value: msgs } = await apiTrade.getSysChatMessagesByCondition({
          createTime,
          chatId: -1,
        });

        const brokers = this.userInfo.brokers;
        let messages = msgs.map((element) => {
          const broker = brokers.find((n) => n.brokerid === element.brokerId);
          return { ...element, company: broker.company, name: broker.chatId };
        });

        messages.sort((a, b) => {
          const dateA = new Date(b.createTime);
          const dateB = new Date(a.createTime);
          return dateA - dateB;
        });
        this.messages = messages;

        // msgs.forEach(async element => {
        //     const broker = brokers.find(n => n.brokerid === element.brokerId)
        //     await new Promise(resolve => setTimeout(() => {
        //         this.$notify({
        //             title: '通知消息',
        //             message: `${broker.company}-${broker.chatId} : ${element.chatMessage}`,
        //             type: 'warning',
        //             offset: 135,
        //             duration: 0
        //         });
        //         resolve();
        //     }, 100));
        //     return false;
        // });
      });
    },
    dragStart(event) {
      // 设置拖拽时传输的数据
      let index = event.target.getAttribute("target-index");
      event.dataTransfer.setData(
        "text/plain",
        JSON.stringify(this.messages[index])
      );
    },
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo",
    }),
    ...mapState({
      chatMessage: (state) => state.chatMessage,
    }),
  },
  mounted() {
    this.initChatMessages();
  },
};
</script>

<style lang="scss" scoped>
.order-notifiy {
  padding: 10px 5px;
  // height: calc(100% - 45px);
  // background-color: #7d7d7d;
  // border-radius: 3px;
  // margin-top: 10px;
}

.notification {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  width: 360px;
  padding: 14px 26px 14px 13px;
  border-radius: 8px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: 1px solid #ebeef5;
  position: relative;
  background-color: #fff;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  -webkit-transition: opacity 0.3s, left 0.3s, right 0.3s, top 0.4s, bottom 0.3s,
    -webkit-transform 0.3s;
  transition: opacity 0.3s, left 0.3s, right 0.3s, top 0.4s, bottom 0.3s,
    -webkit-transform 0.3s;
  transition: opacity 0.3s, transform 0.3s, left 0.3s, right 0.3s, top 0.4s,
    bottom 0.3s;
  transition: opacity 0.3s, transform 0.3s, left 0.3s, right 0.3s, top 0.4s,
    bottom 0.3s, -webkit-transform 0.3s;
  overflow: hidden;
  margin-bottom: 10px;
  cursor: move;

  >>> .el-icon-warning {
    color: #e6a23c;
  }
}

.el-notification__closeBtn {
  color: #000;

  .icon {
    font-size: 16px;
    margin-left: 10px;
  }
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.5s, opacity 0.5s;
}

.slide-right-enter,
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.el-notification__title {
  font-size: 14px;
}

.draggable {
  cursor: move;
}
</style>
