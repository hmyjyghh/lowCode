export default {
  toChinesNum: function(num) {
    var changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']; //changeNum[0] = "零"
    var unit = ["", "十", "百", "千", "万"];
    num = parseInt(num);
    var getWan = function(temp) {
      var strArr = temp.toString().split("").reverse();
      var newNum = "";
      for (var i = 0; i < strArr.length; i++) {
        newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[
          strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
      }
      return newNum;
    }
    var overWan = Math.floor(num / 10000);
    var noWan = num % 10000;
    if (noWan.toString().length < 4) noWan = "0" + noWan;
    return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
  },
  numToEnglishLetter: function(number) {
    var char = "";
    var array = [];
    // Switch ASCII
    var numToStringAction = function(nnum) {
      var num = nnum - 1;
      var a = parseInt(num / 26);
      var b = num % 26;
      array.push(b);
      if (a > 0) {
        numToStringAction(a);
      }
    }
    numToStringAction(number);
    array = array.reverse();
    // Return excel letter: such => C / AA / BBA
    for (var i = 0; i < array.length; i++) {
      char += String.fromCharCode(64 + parseInt(array[i] + 1));
    }
    return char;
  },
  /**
   * 弧度转角度
   */
  r2a: function(r) {
    return 180 / (Math.PI / r);
  },
  /**
   * 角度转弧度
   */
  a2r: function(a) {
    return Math.PI * (a) / 180
  },
  /**
   * 计算两点直线的角度
   */
  getRadina: function(p1, p2, angle) {
    var d = Math.atan((p2.y - p1.y) / (p2.x - p1.x));
    d = d + (angle || 0);

    //修正第二、三象限中的弧度
    if ((p2.y - p1.y > 0 && p2.x - p1.x < 0) || (p2.y - p1.y < 0 && p2.x - p1.x < 0)) {
      d += Math.PI;
    }
    // 修正第一象限弧度
    else if (p2.y - p1.y < 0 && p2.x - p1.x > 0) {
      d += Math.PI * 2;
    }
    // x轴负方向 180度
    if (p2.x < p1.x && p2.y == p1.y) {
      // console.log("x轴负方向");
      d = Math.PI;
    }
    // y轴负方向 270度
    else if (p2.x == p1.x && p2.y < p1.y) {
      d = 1.5 * Math.PI;
    }
    // console.log(d * 180 / Math.PI)
    return d
  },
  //获取以指定点按中心点旋转一定角度后所在的位置
  getRotatedPiont: function(x, y, xcenter, ycenter, angle) {
    var radian = Math.PI * angle / 180;
    var x2 = (x - xcenter);
    var y2 = (y - ycenter)
    var x1 = x2 * Math.cos(radian) - y2 * Math.sin(radian) + xcenter;
    var y1 = x2 * Math.sin(radian) + y2 * Math.cos(radian) + ycenter;
    return {
      x: x1,
      y: y1
    }
  },
  //计算亮距离
  getDistance: function(p1, p2) {
    if (!p1 || !p2) {
      return 0;
    }
    var x_len = p2.x - p1.x;
    var y_len = p2.y - p1.y;
    var len = Math.sqrt(Math.pow(x_len, 2) + Math.pow(y_len, 2));
    return len;
  },

  //坐标系转换
  convertLocalCoordinate:function(el, global, scale) {
    el = $(el);
    var offset = el.offset();
    var top = offset.top;
    var left = offset.left;
    var local = {
      x: 0,
      y: 0
    }
    local.x = global.x - left;
    local.y = global.y - top;
    if (!dsf.isDef(scale)) {
      scale = 1;
    }
    local.x /= scale;
    local.y /= scale;
    return local;
  }
}
