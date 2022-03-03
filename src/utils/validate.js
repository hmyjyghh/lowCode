import utils from './utils';
let validatorMap = {
  'isNull': {
    name:"是否为空",
    validator(value) {
      let v = value;
      if (dsf.type(v) == 'string') {
        v = v.trim();
      }
      if (v === '' || v == "[]"|| v == "{}") {
        return true;
      } else if (dsf.type(v) == 'object' && dsf.isEmptyObject(v)) {
        return true;
      } else if (dsf.type(v) == 'array' && v.length == 0) {
        return true;
      } else if (dsf.isUnDef(v)) {
        return true;
      }
      return false;
    }
  },
  //验证是否是一个数字
  "isNumber": {
    name:"是否是一个数字",
    validator(value, precision) {
      let reg = null;
      if (precision && precision > 0) {
        reg = new RegExp("^-?([0-9]\\d*|0(?!\\.0+$))(\\.\\d{1," + precision + "})?$", 'ig');
      } else {
        reg = new RegExp("^-?[0-9]\\d*$", 'ig');
      }
      if (!reg.test(value)) {
        return false;
      }
      return true;
    }
  },
  //验证数字是否超出
  "isNumberOver": {
    name:"是否超出指定数字",
    validator(value, ceil) {
      value = parseFloat(value);
      ceil = parseFloat(ceil);
      if (value > ceil) {
        return true;
      }
      return false;
    }
  },
  //验证数字是否小于
  "isNumberUnder":{
    name:"是否小于指定数字",
    validator(value, floor) {
      value = parseFloat(value);
      floor = parseFloat(floor);
      if (value < floor) {
        return true;
      }
      return false;
    }
  },
  //验证数字精度
  "precision":{
    name:"数字精度",
    validator(value, precision) {
      value = value.toString();
      const reg = new RegExp("^-?([0-9]\\d*|0(?!\\.0+$))(\\.\\d{1," + precision + "})?$", 'ig');
      if (!reg.test(value)) {
        return false;
      }
      return true;
    }
  },
  "maxLength":{
    name:"字符串超出指定长度",
    validator(value,maxlength){
      if(value.length>maxlength){
        return true;
      }
      return false;
    }
  },
  "minLength":{
    name:"字符小于指定长度",
    validator(value,minLength){
      if(value.length<minLength){
        return true;
      }
      return false;
    }
  },
  //身份证号码
  'isIDCard': {
    name:"身份证号码",
    type:"express",
    validator(value) {
      //身份证正则表达式(15位)
      const isIDCard1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
      //身份证正则表达式(18位)
      const isIDCard2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
      if (!isIDCard1.test(value) && !isIDCard2.test(value)) {
        return false;
      }
      return true;
    }
  },
  //是否是手机
  'isMobile': {
    name:"手机号码",
    type:"express",
    validator(value) {
      var reg = /^1(3|4|5|7|8|9|6)\d{9}$/;
      if (!reg.test(value)) {
        return false;
      }
      return true;
    }
  },
  //是否是座机
  "isTelPhone": {
    name:"座机号码",
    type:"express",
    validator(value) {
      var reg = /^(0\d{2,3}-)?\d{7,8}$/;
      if (!reg.test(value)) {
        return false;
      }
      return true;
    }
  },
  //是否是手机或座机
  "isMobileOrTelPhone": {
    name:"手机/座机号码",
    type:"express",
    validator(value) {
      var mobile = /^1(3|4|5|7|8|9|6)\d{9}$/;
      var tel = /^(0\d{2}-)?\d{7,8}$/;
      if (!mobile.test(value) && !tel.test(value)) {
        return false;
      }
      return true;
    }
  },
  //电子邮箱
  'isEmail': {
    name:"电子邮箱",
    type:"express",
    validator(value) {
      var reg = /\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/;
      if (!reg.test(value)) {
        return false;
      }
      return true;
    }
  },
  "isPlateNumber": {
    name:"车牌号码",
    type:"express",
    validator(value) {
      var reg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
      if (reg.test(value)) {
        return false;
      }
      return true;
    }
  }
}

let validate = function() {
  let args = Array.prototype.slice.call(arguments, 0);
  let validator = args[0];
  let params = args.slice(1);
  return validatorMap[validator].validator.apply(this, params);
}

if(window.$$validate){
  utils.mix(validatorMap,window.$$validate)
}
validate.map = validatorMap;
export default validate;