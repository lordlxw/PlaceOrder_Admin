export const debounce = (fn, delay = 300) => {
    let timeId = null
    console.log("进入debounce防抖");
    return function () {
      let context = this
      if (timeId) { clearTimeout(timeId) }
      timeId = setTimeout(() => {
        fn.apply(context, arguments)
        timeId = null
      }, delay)
    }
    // return function()
    // {
    //   let context = this
    //   fn.apply(context, arguments)
    // }
  }
  
  export const btnHandleColor = (event, disabled) => {
    // const myElementId = document.getElementById(elementId)
    // console.log(myElementId)
    if (event) {
      console.log(1121221)
      // myElementId.style.background = colorVal
      event.currentTarget.disabled = disabled
    }
  }
  