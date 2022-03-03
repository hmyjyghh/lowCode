let ua= navigator.userAgent; //取得浏览器的userAgent字符串

function checkBrowser() {
  const isOpera = ua.indexOf("Opera") > -1; //判断是否Opera浏览器
  const isIE = ua.indexOf("compatible") > -1
    && ua.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
  const isEdge = ua.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
  const isFF = ua.indexOf("Firefox") > -1; //判断是否Firefox浏览器
  const isSafari = ua.indexOf("Safari") > -1
    && ua.indexOf("Chrome") === -1; //判断是否Safari浏览器
  const isChrome = ua.indexOf("Chrome") > -1
    && ua.indexOf("Safari") > -1; //判断Chrome浏览器

  if (isIE) {
    const reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(ua);
    const fIEVersion = parseFloat(RegExp["$1"]);
    if (fIEVersion === 7) {
      return "IE7";
    } else if (fIEVersion === 8) {
      return "IE8";
    } else if (fIEVersion === 9) {
      return "IE9";
    } else if (fIEVersion === 10) {
      return "IE10";
    } else if (fIEVersion === 11) {
      return "IE11";
    } else {
      return "IE";
    }
  }
  if (isOpera) {
    return "Opera";
  }
  if (isEdge) {
    return "Edge";
  }
  if (isFF) {
    return "FF";
  }
  if (isSafari) {
    return "Safari";
  }
  if (isChrome) {
    return "Chrome";
  }

}

export default {
  // 是什么浏览器
  type: checkBrowser(),
  //是否是ios
  iOS: function() {
    const u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) { //安卓手机
      return false
    } else if (u.indexOf('iPhone') > -1) { //苹果手机
      return true
    } else if (u.indexOf('iPad') > -1) { //iPad
      return false
    } else if (u.indexOf('Windows Phone') > -1) { //winphone手机
      return false
    } else {
      return false
    }
  },
  //是否是pc
  PC: function() {
    const userAgentInfo = navigator.userAgent;
    const Agents = ["Android", "iPhone",
      "SymbianOS", "Windows Phone",
      "iPad", "iPod"
    ];
    let flag = true;
    for (let v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
  },
  //qq浏览器
  QQ:function(){
    return !!ua.match(/mqqbrowser|qzone|qqbrowser|qbwebviewtype/i)
  },
  //是否是移动端
  Mobile:function(){
    return /android|webos|iphone|ipod|balckberry/i.test(ua);
  },
  //是否是微信打开
  WeiXin:function(){
    return ua.match(/microMessenger/i) === 'micromessenger'
  },
  //是否是安卓
  isAndroid() {
    return ua.indexOf("Android") > -1 && ua.indexOf("Linux") > -1;
  }
}