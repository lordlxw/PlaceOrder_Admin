import moment from "moment";

// 辅助格式化。2025/2/10 lxw
/**
 * 日期格式化
 * @param {*} date
 * @param {*} fmt
 */
export const dateFormat = (date, fmt) => {
  return moment(date).format(fmt);
  // if (date) {
  //   if (!(date instanceof Date)) {
  //     date = new Date(date)
  //   }
  //   if (/(y+)/.test(fmt)) {
  //     fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  //   }
  //   const o = {
  //     'M+': date.getMonth() + 1,
  //     'd+': date.getDate(),
  //     'h+': date.getHours(),
  //     'm+': date.getMinutes(),
  //     's+': date.getSeconds()
  //   }
  //   for (const k in o) {
  //     const str = o[k] + ''
  //     if (new RegExp(`(${k})`).test(fmt)) {
  //       fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
  //     }
  //   }
  // } else {
  //   fmt = ''
  // }
  // return fmt
};
// function padLeftZero(str) {
//   return ('00' + str).substr(str.length)
// }

export const timeFormat = (timesamp, format) => {
  return moment.unix(timesamp).format(format);
};

/**
 * 在当前日期追加天数
 * @param {*} date
 * @param {*} days
 */
export const addDaysToDate = (date, days) => {
  let dateTime = new Date(date);
  dateTime = dateTime.setDate(dateTime.getDate() + days);
  dateTime = new Date(dateTime);
  return dateTime;
};

/**
 * 金额格式化
 * 参数说明：
 * number：要格式化的数字
 * decimals：保留几位小数
 * decPoint：小数点符号
 * thousandsSep：千分位符号
 * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
 */
export const moneyFormat = (
  number,
  decimals,
  decPoint,
  thousandsSep,
  roundtag
) => {
  number = (number + "").replace(/[^0-9+-Ee.]/g, "");
  roundtag = roundtag || "ceil"; // "ceil","floor","round"
  const n = !isFinite(+number) ? 0 : +number;
  const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
  const sep = typeof thousandsSep === "undefined" ? "," : thousandsSep;
  const dec = typeof decPoint === "undefined" ? "." : decPoint;
  const toFixedFix = function(n, prec) {
    const k = Math.pow(10, prec);
    return (
      "" +
      parseFloat(
        Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)
      ) /
        k
    );
  };
  let s = "";
  s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
  const re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }

  if ((s[1] || "").length < prec) {
    s[1] = s[1] || "";
    s[1] += new Array(prec - s[1].length + 1).join("0");
  }
  return s.join(dec);
};
// 对菜单递归
function recuisionMenus(array, navigatorId, code, index) {
  return array.some(element => {
    if (parseInt(navigatorId[index]) === parseInt(element.id)) {
      if (element.children && element.children.length > 0) {
        index += 1;
        return recuisionMenus(element.children, navigatorId, code, index);
      } else {
        return false;
      }
    } else {
      if (element.permissionCodes === code) {
        return true;
      } else if (element.children && element.children.length > 0) {
        return element.children.some(element2 => {
          if (element2.permissionCodes === code) {
            return true;
          } else if (element2.children && element2.children.length > 0) {
            return recuisionMenus(element2.children, navigatorId, code, index);
          } else {
            return false;
          }
        });
      } else {
        return false;
      }
    }
  });
}
// 验证功能权限
export const authValid = (code, menus, navigatorId) => {
  menus = menus || [];
  navigatorId = navigatorId || [];
  if (!Array.isArray(menus)) {
    menus = JSON.parse(menus);
  }
  if (!Array.isArray(navigatorId)) {
    navigatorId = JSON.parse(menus);
  }
  if (menus.length > 0) {
    return recuisionMenus(menus, navigatorId, code, 0);
  } else {
    return false;
  }
};

// 去掉前后空格
export const trim = str => {
  return str.replace(/(^\s*)|(\s*$)/g, "");
};

export const timesampToDate = timesamp => {
  return moment.unix(timesamp).format("YYYY-MM-DD HH:mm:ss");
};

export const mergeArray = (arr1, arr2) => {
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (arr1[i] === arr2[j]) {
        arr1.splice(i, 1); // 利用splice函数删除元素，从第i个位置，截取长度为1的元素
      }
    }
  }
  for (let i = 0; i < arr2.length; i++) {
    arr1.push(arr2[i]);
  }
  return arr1;
};

export const groupArrayToMap = (arr, keyFn, valueFn = item => item) => {
  const map = new Map();
  arr.forEach(item => {
    const key = keyFn(item);
    const value = valueFn(item);
    if (map.has(key)) {
      map.get(key).push(value);
    } else {
      map.set(key, [value]);
    }
  });
  return map;
};

export const getDatesInRange = (startDate, endDate, fmt) => {
  const dateArray = [];
  let currentDate = new Date(startDate);
  const laseDate = new Date(endDate);
  // eslint-disable-next-line no-unmodified-loop-condition
  while (currentDate <= laseDate) {
    // 将当前日期的副本添加到数组中
    dateArray.push(moment(new Date(currentDate)).format(fmt));
    // 将当前日期向前推进一天
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateArray;
};

export const copyTextToClipboard = async text => {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Text copied to clipboard");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};
