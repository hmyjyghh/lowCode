/* eslint-disable no-unused-vars */

import cachePool from './cache';

export default class express {
  constructor(data) {
    this.variable = {};
    for (let k in data) {
      this.variable[k] = data[k];
    }
  }
}

let reg = /\@\[([^@]+)\]/ig;
// let reg2 = /(\w+)(\[\d+\])/ig;
function findData(key, data) {
  data = data || this.variable;
  if (data[key] != undefined) {
    return data[key];
  } else {
    //根据表达式层层切割查找
    let arr = key.split(".");
    let count = arr.length;
    let i = 0;
    let newkey = arr[i];
    if (newkey) {
      while (!data[newkey] && i < count - 1) {
        newkey += "." + arr[++i];
      }
    }
    if (data[newkey]) {
      let d = data[newkey];
      let tmp = arr.slice(i + 1);
      for (let i = 0; i < tmp.length; i++) {
        let t = tmp[i];
        if (t.endsWiths(")") || t.endsWiths("]")) {
          eval("d=d" + "." + t);
        } else {
          d = d[t];
        }
      }
      return d;
    }
  }
}

express.url = function (key) {
  if (this.vueComponent) {
    let $vm = this.vueComponent.$vm;
    if ($vm && $vm.queryString) {
      let vm = $vm;
      while (vm.queryString[key] === undefined) {
        vm = vm.$parentView;
        if (!vm) {
          return undefined;
        }
      }
      return vm ? vm.queryString[key] : this.vueComponent.$route.query[key];
    } else {
      return this.vueComponent.$route.query[key];
    }
  } else {
    return dsf.url.queryString(key)
  }
}

express.session = function (key) {
  return dsf.getCookie(key) || "";
}
//
express.map = function (arr, index, key) {
  let v = arr[index];
  if (v) {
    if (!key) {
      return v;
    } else {
      return v[key] || ""
    }
  }
  return null;
}

express.isExist = function (key) {
  let arr = [];
  for (let i = 1; i < arguments.length; i++) {
    arr.push(arguments[i]);
  }
  return arr.indexOf(key) >= 0 ? true : false
}
express.disabled = function (key) {
  let arr = [];
  for (let i = 1; i < arguments.length; i++) {
    arr.push(arguments[i]);
  }
  return arr.indexOf(key) >= 0 ? false : true;
}

express.filePath = function (data) {
  let fileInfo = JSON.parse(data || '{}');
  if (dsf.type(fileInfo) == "array") {
    fileInfo = fileInfo[0];
  } else if (dsf.type(fileInfo) == "object") {
    fileInfo = fileInfo;
  }
  return fileInfo.relativePath;
}

express.pri = function (key) {
  if (this.vueComponent) {
    let vm = this.vueComponent.$vm;
    if (vm) {
      return vm.$viewInitData._privilege[key] == "1"
    }
  }
  return false;
}

express.isView = function () {
  if (this.vueComponent) {
    let qs = this.vueComponent.queryString;
    if (qs) {
      return qs['isView'] == "1"
    }
  }
  return false;
}

express.has = function (expressStr, openTag, closeTag) {
  let mat = expressStr.match(reg);
  if (mat && mat.length > 0) {
    return true;
  }
  return false;
}

//获取属性值
express.__getter__ = function (key, data, isFlag) {
  let r = findData(key, data);
  if (isFlag === true) {
    if (dsf.isUnDef(r)) {
      return "";
    }
  }
  return r;
}

//解析表达式
let evalMap = cachePool(200);
let replaceMap = cachePool(200);

express.config = function (key) {

}

express.eval = function (expressStr, data) {
  if (!expressStr) {
    return null
  }
  // dsf.time("执行表达式"+expressStr)
  let fn = evalMap.get(expressStr);
  if (!fn) {
    let isCodeBlock = false;
    if (expressStr.startsWiths("<%") && expressStr.endsWiths("%>")) {
      isCodeBlock = true;
      expressStr = expressStr.replace("<%", "");
      expressStr = expressStr.replace("%>", "");
    }
    let result = parseExpress(expressStr);
    let exp = result.expStr;
    let r = parseInterpolate(exp, "{{", "}}");
    let str = r.expr;
    _.each(r.pools, (p, k) => {
      let c = addScope(p);
      str = str.replace(k, c);
    });
    let code = [];
    if (isCodeBlock) {
      code = [
        "\ttry{",
        "\t\twith(__local__){",
        "\t\t\t" + (str ? str : "return null"),
        "\t\t}",
        "\t}catch(ex){",
        "\t\tdsf.error(ex);",
        "\t}",
      ]
    } else {
      str = str ? "(" + str + ")" : "null";
      code = [
        "\tvar result;",
        "\ttry{",
        "\t\twith(__local__){",
        "\t\t\tresult=" + str + ";",
        "\t\t}",
        "\t}catch(ex){",
        "\t\tdsf.error(ex);",
        "\t}",
        "\treturn result;"
      ];
    }

    fn = new Function('__local__', '__isFlag__', code.join("\n"))
    evalMap.put(expressStr, fn)
  }
  let obj = Object.create(express);
  obj.variable = data || {};
  obj.vueComponent = this._isVue ? this : null;
  let s = fn(obj);
  obj.vueComponent = null;
  obj = null;
  // dsf.timeEnd("执行表达式"+expressStr)
  return s;
}

express.replace = function (expressStr, data, isFlag) {
  // console.time('替换表达式' + expressStr)
  let fn = replaceMap.get(expressStr);
  if (!fn) {
    let result = parseExpress(expressStr);
    if (result && result.has) {
      let exp = result.expStr;
      let r = parseInterpolate(exp, "{{", "}}", true);
      let str = r.expr;
      _.each(r.pools, (p, k) => {
        let c = addScope(p);
        str = str.replace(k, c);
      })
      str = str ? "(" + str + ")" : '""';
      let code = [
        "\tvar result;",
        "\ttry{",
        "\t\twith(__local__){",
        "\t\t\tresult=" + str + ";",
        "\t\t}",
        "\t}catch(ex){",
        "\t\tdsf.error(ex);",
        "\t}",
        "\treturn result;"
      ];
      fn = new Function('__local__', '__isFlag__', code.join("\n"))
      replaceMap.put(expressStr, fn);
    } else {
      return expressStr;
    }
  }
  let obj = Object.create(express);
  obj.variable = data || {};
  obj.vueComponent = this._isVue ? this : null;
  let s = fn(obj, (dsf.isUnDef(isFlag)) ? true : isFlag);
  // console.timeEnd('替换表达式' + expressStr)
  obj.vueComponent = null;
  obj = null;
  return s;
}





var rimprovePriority = /[+-\?]/;
let rexpr = /\{\{([\s\S]*)\}\}/;
var rvmKey = /(^|[^\w\u00c0-\uFFFF_])(@|##)(?=[$\w])/g;
var ruselessSp = /\s*(\.|\|)\s*/g;
var rshortCircuit = /\|\|/g;
var brackets = /\(([^)]*)\)/;
var rpipeline = /\|(?=\?\?)/;
var rregexp = /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/g;
var robjectProp = /\.[\w\.\$]+/g; //对象的属性 el.xxx 中的xxx
var robjectKey = /(\{|\,)\s*([\$\w]+)\s*:/g; //对象的键名与冒号 {xxx:1,yyy: 2}中的xxx, yyy
var rfilterName = /\|(\w+)/g;
var rlocalVar = /[$a-zA-Z_][$a-zA-Z0-9_\.]*(\()?/g;
var rentities = /&[a-z0-9#]{2,10};/;
var stringNum = 0;
var stringPool = {
  map: {}
};
var skipMap = {
  'if': 1,
  'else': 1,
  'Math': 1,
  'Date': 1,
  'Number': 1,
  'String': 1,
  'Boolean': 1,
  'Object': 1,
  '$event': 1,
  'window': 1,
  '__vmodel__': 1,
  '__local__': 1,
  'JSON': 1,
  'this': 1,
  'true': 1,
  'false': 1,
  'dsf': 1,
  'return': 1,
  '__isFlag__': 1,
  '__getter__': 1
};

var $temp = document.createElement("div");

function decode(str) {
  if (rentities.test(str)) {
    $temp.innerHTML = str;
    return $temp.innerText || $temp.textContent;
  }
  return str;
}

function unescapeHTML(html) {
  return String(html).replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

var rfill = /\?\?\d+/g;

function dig(a) {
  var key = '??' + stringNum++;
  stringPool.map[key] = a;
  return key + ' ';
}

function fill(a) {
  var val = stringPool.map[a];
  return val;
}

function clearString(str) {
  var array = readString(str);
  for (var i = 0, n = array.length; i < n; i++) {
    str = str.replace(array[i], dig);
  }
  return str;
}

function readString(str, i, ret) {
  var end = false,
    s = 0,
    i = i || 0;
  ret = ret || [];
  for (var n = str.length; i < n; i++) {
    var c = str.charAt(i);
    if (!end) {
      //判断一个字符串开始必须是"或者'且前面不能带有\转义
      if (c === "'" && str.charAt(i - 1) !== '\\') {
        end = "'";
        s = i;
      } else if (c === '"' && str.charAt(i - 1) !== '\\') {
        end = '"';
        s = i;
      }
    } else {
      if (c === end && str.charAt(i - 1) !== '\\') {
        ret.push(str.slice(s, i + 1));
        end = false;
      }
    }
  }
  if (end !== false) {
    return readString(str, s + 1, ret);
  }
  return ret;
}

function addScopeForLocal(str, local) {
  let props = str; // str.replace(robjectProp, dig);
  let result = props.replace(rlocalVar, function (el) {
    //表示函数
    if (el.endsWiths("(")) {
      return el;
    }
    //表示属性
    else {
      if (!skipMap[el]) {
        return "__getter__(" + JSON.stringify(el) + ",variable,__isFlag__)";
      }
    }
    return el;
  });
  return result;
}

function addScope(expr, local) {
  stringPool.map = {};
  var input = expr.replace(rregexp, function (a, b) {
    return b + dig(a.slice(b.length));
  }); //移除所有正则
  input = clearString(input); //移除所有字符串
  input = input.replace(rshortCircuit, dig) //移除所有短路运算符
    .replace(ruselessSp, '$1') //移除.|两端空白
    .replace(robjectKey, function (_, a, b) {
      //移除所有键名
      return a + dig(b) + ':'; //比如 ms-widget="[{is:'ms-address-wrap', $id:'address'}]"这样极端的情况 
    })
    .replace(rvmKey, '$1__vmodel__.') //转换@与##为__vmodel__.
    .replace(rfilterName, function (a, b) {
      //移除所有过滤器的名字
      return '|' + dig(b);
    });

  input = input.replace(/(\)|\])(\.([\w\.\$])+)/g, function (a, b, c, d) {
    //处理@[dsfa_rm.state].value这种极端情况的属性,正确的写法应该是@[dsfa_rm.state.value]
    return b + dig(c);

  });

  input = addScopeForLocal(input, local); //在本地变量前添加__vmodel__

  var filters = input.split(rpipeline); //根据管道符切割表达式
  var body = filters.shift().replace(rfill, fill).trim();
  if (/\?\?\d/.test(body)) {
    body = body.replace(rfill, fill);
  }
  return body;
}

function parseInterpolate(dir, openTag, closeTag, isReplace) {
  var rlineSp = /\n\r?/g;
  var str = $.trim(dir).replace(rlineSp, '');
  var tokens = [];
  openTag = openTag;
  closeTag = closeTag;
  let exportPools = {};
  let count = 0;
  do {
    //aaa{{@bbb}}ccc
    var index = str.indexOf(openTag);
    index = index === -1 ? str.length : index;
    var value = str.slice(0, index);
    if (/\S/.test(value)) {
      if (isReplace) {
        tokens.push(JSON.stringify(decode(value)));
      } else {
        tokens.push(decode(value));
      }
    }
    str = str.slice(index + openTag.length);
    if (str) {
      index = str.indexOf(closeTag);
      var value = str.slice(0, index);
      var expr = unescapeHTML(value);
      if (rimprovePriority) {
        let key = "$$" + count + "$$";
        let v = expr;
        expr = '(' + key + ')';
        exportPools[key] = v;
        count++;
      }
      tokens.push(expr);
      str = str.slice(index + closeTag.length);
    }
  } while (str.length);
  return {
    expr: tokens.join(isReplace ? "+" : ""),
    pools: exportPools
  }
}

function readExpress(str, i, ret) {
  var open = false;
  var counter = 0,
    s = 0,
    i = i || 0;
  ret = ret || [];
  for (var n = str.length; i < n; i++) {
    var c = str.charAt(i);
    if (!open) {
      //验证表达式开始
      if (c === "[" && str.charAt(i - 1) === '@') {
        open = true;
        s = i;
      }
    } else {
      if (c == "[") {
        counter++;
      }
      if (c == "]") {
        if (counter > 0) {
          counter--;
          continue;
        } else {
          ret.push(str.slice(s - 1, i + 1));
          open = false;
          counter = 0;
        }
      }
    }
  }
  if (open !== false) {
    return readExpress(str, s + 1, ret);
  }
  return ret;
}

let parseMap = {};

function parseExpress(exp) {
  if (!parseMap[exp]) {
    let mat = readExpress(exp);
    stringPool.map = {};
    for (var i = 0, n = mat.length; i < n; i++) {
      let s = mat[i].slice(2, mat[i].length - 1);
      exp = exp.replace(mat[i], function (a) {
        return "{{" + s + "}}"
      });
    }
    parseMap[exp] = {
      has: (mat && mat.length > 0),
      expStr: exp
    };
  }
  return parseMap[exp];
}