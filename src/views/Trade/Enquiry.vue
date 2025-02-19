<template>
  <!-- <div>你好呀</div> -->
  <div>
    <ComEnquiry></ComEnquiry>
  </div>
  <!-- <div class="height100">
    <com-enquiry :height="enquiryH"></com-enquiry>
  </div> -->
</template>

<script>
import { mapGetters } from "vuex";
import ComEnquiry from "@/views/components/ComEnquiry.vue";
import { commMixin } from "@/utils/commMixin";
import { useStore } from "vuex";
import { computed } from "vue";
const store = useStore(); // 获取 Vuex store 实例
//const userInfo = computed(() => store.getters.getUserInfo);
export default {
  mixins: [commMixin],
  components: { ComEnquiry },

  created() {
    console.log("你好呀Enquiry");

    // if (
    //   this.userInfo.roleName &&
    //   ["研究员"].indexOf(this.userInfo.roleName) !== -1
    // ) {
    //   this.initFrameH("enquiryH", 300);
    // } else {
    //   this.initFrameH("enquiryH", 120);
    // }
  },
  data() {
    return {
      enquiryH: "0",
    };
  },
};
</script>

<style></style>
