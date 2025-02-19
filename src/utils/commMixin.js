export const commMixin = {
  methods: {
    // 计算宽度
    initFrameW(obj, val) {
      const width = 1920
      const clientWith = document.body.clientWidth
      this[obj] = Math.floor(clientWith / width * val)
    },
    // 带返回值的宽度
    returnFrameW(val) {
      const width = 1920
      const clientWith = document.body.clientWidth
      return Math.floor(clientWith / width * val)
    },
    // 计算高度
    initFrameH(obj, val) {
      const clientHeight = document.body.clientHeight
      this[obj] = Math.floor(clientHeight - val)
    },
    // 带返回值的高度
    returnFrameH(val) {
      const height = 1080
      const clientHeight = document.body.clientHeight
      return Math.floor(clientHeight / height * val)
    },
    // 计算百分比高度
    initFramePH(obj, val) {
      const height = 1080
      const clientHeight = document.body.clientHeight
      this[obj] = Math.floor(clientHeight / height * val)
    }
  }
}
