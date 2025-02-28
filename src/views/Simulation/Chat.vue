<template>
  <div style="height: 100%">
    <button @click="TestClick">测试点击{{ this.number }}</button>
    <div style="background-color: rgb(32, 32, 32); height: 100%">
      <el-container class="chat-box">
        <el-main class="chat-main">
          <div class="chat-item">
            <MChatBox
              :ref="'MChatBox'"
              :boxHeight="boxHeight"
              :config="config"
              :asideShow="true"
              :simulation="false"
              @dateChange="dateChange"
              :asideItems="asideItems"
              :dialogChatBoxVisible="false"
              :userName="userInfo.userName"
              @changAsideItem="changAsideItem"
              @handleClose="() => {}"
              :mine="asideItem"
            >
            </MChatBox>
          </div>
        </el-main>
      </el-container>
      <main-socket></main-socket>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { commMixin } from "@/utils/commMixin";
import apiAdmin from "@/api/Power_Admin";
import apiTrade from "@/api/Trade";
import apiLogin from "@/api/Login";
import MChatBox from "@/components/chat/MChatBox.vue";
import MainSocket from "@/components/SocketElectron.vue";
import * as util from "@/utils/util";
export default {
  mixins: [commMixin],
  components: {
    MChatBox,
    MainSocket,
  },
  created() {
    console.log("Chat.vue --- created");
    if (window.v1) {
      this.isElectron = window.v1.isElectron();
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo",
    }),
    ...mapState({
      chatMessage: (state) => state.chatMessage,
      socketMain: (state) => state.socketMain,
      occupyInfo: (state) => state.occupyInfo,
    }),
    brokerid() {
      console.log(this.$route);
      return this.$route.query.brokerid;
    },
    channelId() {
      return this.$route.query.channelId;
    },
  },
  watch: {
    chatMessage(item) {
      console.log("::::::::::::", item);
      // eslint-disable-next-line eqeqeq
      if (this.brokerid == item.brokerId && this.$refs[`MChatBox`]) {
        this.$refs[`MChatBox`].pushMsgs([item]);
      } else {
        this.initChatMessages();
      }
    },
    occupyInfo() {
      // this.getIntendComerList(this.occupyInfo)
      console.log("occupyInfo", this.occupyInfo);
      if (this.asideItems.length) {
        let asideItems = this.asideItems;
        asideItems = asideItems.map((n) => {
          const item = this.occupyInfo.find(
            (o) => o.brokerid === n.brokerid && o.channelId === n.channelId
          );
          return { ...n, ...item };
        });
        // this.asideItems = [];
        this.asideItem = asideItems.find(
          (o) =>
            o.brokerid === this.asideItem.brokerid &&
            o.channelId === this.asideItem.channelId
        );
        this.asideItems = [...asideItems];
      } else {
        this.getUserSummarys();
      }
    },
  },
  data() {
    return {
      number: 0,
      // 获取主面板列表信息，下文会做进一步介绍
      config: {
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
      },
      // 会话
      asideItem: {
        company: "",
      },
      boxHeight: 400,
      isElectron: false,
      profile: {},
      chatMessages: {},
      asideItems: [],
      userInfos: [],
      chatDate: "",
    };
  },
  methods: {
    TestClick() {
      this.number++;
      console.log("点击", this.number);
    },
    dateChange(e) {
      this.chatDate = e;
      this.initChatMessages(e);
    },
    changAsideItem(asideItem, chatDate) {
      this.asideItem = asideItem;
      this.chatDate = chatDate;
      this.initChatMessages(this.chatDate);
    },
    getIntendComerList() {
      Promise.all([]).then(async () => {
        apiAdmin.chatReceiverList().then(async ({ code, value }) => {
          if (code === "00000" && value) {
            console.log("getIntendComerList===value", value);
            // eslint-disable-next-line eqeqeq
            let asideItems = value;
            asideItems = asideItems.map((n) => {
              const item = this.occupyInfo.find(
                (o) => o.brokerid === n.brokerid && o.channelId === n.channelId
              );
              return { ...n, ...item };
            });
            // this.asideItems = [];
            this.asideItem = this.brokerid
              ? asideItems.find(
                  (o) =>
                    o.brokerid === this.asideItem.brokerid &&
                    o.channelId === this.asideItem.channelId
                )
              : asideItems[0];
            this.asideItems = [...asideItems];
            this.initChatMessages();
          }
        });
        const { value } = await apiLogin.getProfile(this.userInfo.userId);
        this.profile = value ? value : {};
      });
    },
    initChatMessages(date) {
      console.log("initChatMessages", date);
      Promise.all([]).then(async () => {
        const createTime = `${util.dateFormat(
          date || new Date(),
          "YYYY-MM-DD"
        )} 00:00:00`;
        const { value: msgs } = await apiTrade.getSysChatMessagesByCondition({
          createTime,
          brokerId: this.asideItem.brokerid,
        });
        const messages = msgs.map((n) => {
          const user = this.userInfos.find(
            (element) => element.userId === n.chatId
          );
          return { ...n, nickName: user ? user.nickName : "未知" };
        });
        this.$refs[`MChatBox`].pushMsgs(messages, true);
      });
    },
    getUserSummarys() {
      apiAdmin
        .getUserSummarys({
          roles: [],
        })
        .then(async ({ code, value }) => {
          if (code === "00000") {
            console.log("getUserSummarys", code, value);
            this.userInfos = value;
            this.getIntendComerList();
          }
        });
    },
  },
  mounted() {
    console.log("Chat.vue --- mounted");
    if (window.v1 && this.isElectron) {
      console.log("chat.vue---mounted");
      window.v1.getAllDisplays().then((response) => {
        console.log("response", response);
        const maxHeight = Math.max(
          ...response.map((display) => display.bounds.height)
        );
        this.boxHeight = (maxHeight - 190) / 3;
      });
    } else {
      this.boxHeight = 390;
    }
  },
};
</script>

<style lang="scss" scoped>
.right_bar {
  width: 40px;
  height: 40px;
  font-size: 18px;
  line-height: 40px;
  color: #fff;
  text-align: center;
  -webkit-app-region: no-drag;
}

.chat-box {
  height: 100%;

  .chat-header {
    background-color: #474747;
    color: #333;
    text-align: center;
    line-height: 40px;
    height: 40px !important;
    text-align: right;
    padding: 0 10px;
  }

  .chat-main {
    // margin-top: 40px;
    height: 100%;
    overflow: hidden;

    .chat-item {
      height: 100%;
      width: 100%;
      display: inline-block;
    }
  }
}
</style>
