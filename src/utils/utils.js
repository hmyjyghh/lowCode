let hasConsole = true; //typeof console === 'object';
let getProto = Object.getPrototypeOf;
let $types = ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Error", "Symbol"];
let class2type = {};
let hasOwn = class2type.hasOwnProperty;
let fnToString = hasOwn.toString;
let ObjectFunctionString = fnToString.call(Object);
let toString = class2type.toString;
let _console = window.console;
// if (process.env.NODE_ENV === "production") {
//     window.console = {
//         log: () => {},
//         info: () => {},
//         warn: () => {},
//         time: () => {},
//         timeEnd: () => {},
//         error: () => {},
//         debug: () => {}
//     };
// }
let _setInterval = window.setInterval;
// let _setTimeout=window.setTimeout;
let _clearInterval = window.clearInterval;
window.setInterval = (fn, time) => {
    let timerId = _setInterval(fn, time);
    dsf.warn("启动了setInterval" + timerId);
    return timerId;
}
window.clearInterval = (timerId) => {
    dsf.warn("关闭了setInterval" + timerId);
    _clearInterval(timerId);
}

window.consoleOn = () => {
    hasConsole = true;
};

$types.forEach(elem => {
    class2type["[object " + elem + "]"] = elem.toLowerCase();
});

let uuidCharts = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");

let $files = [{
    absolutePath: "",
    contentType: "",
    id: "",
    name: "",
    originalFileName: "",
    relativePath: "",
    size: 0,
    suffix: "",
    uploadDate: ""
}];
let hasOwnProperty = Object.prototype.hasOwnProperty;

export default {
    noop: function() {},
    //获取唯一标识
    uuid: function(len, radix) {
        var chars = uuidCharts,
            uuid = [],
            i;
        radix = radix || chars.length;
        len = len || 16;
        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = "";
            uuid[14] = "4";

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | (Math.random() * 16);
                    uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join("");
    },
    UUID: function() {
        return this.uuid();
    },
    //验证是否不为undefind或者null
    isDef: function(obj) {
        return obj !== undefined && obj != null;
    },
    //验证是否为undefind或者null
    isUnDef: function(obj) {
        return obj === undefined || obj === null;
    },
    //获取对象类型
    type: function(obj) {
        if (obj == null) {
            return obj + "";
        }
        // Support: Android <=2.3 only (functionish RegExp)
        return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
    },
    hasOwn: function(obj, key) {
        return hasOwnProperty.call(obj, key);
    },
    //是否原生支持的方法
    isNative: function(Ctor) {
        return typeof Ctor === "function" && /native code/.test(Ctor.toString());
    },
    kebabCase: function(str, joinChar) {
        let hyphenateRE = /\B([A-Z])/g;
        return str.replace(hyphenateRE, joinChar + "$1").toLowerCase();
    },
    camelCase: function(str, joinChar) {
        var camelizeRE = new RegExp("\\" + joinChar + '(\\w)', 'g');
        return str.replace(camelizeRE, function(_, c) {
            return c ? c.toUpperCase() : '';
        })
    },
    //验证是否是个数字
    isNumber: function(val) {
        if (dsf.isUnDef(val) || val == "") {
            return false;
        } else {
            return !isNaN(val);
        }
    },
    escapeFilter(str) {
        if (str == null) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },
    unescapeHTML(html) {
        return String(html).replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    },
    //验证是否为一个空对象
    isEmptyObject: function(obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    },
	// 2021-12-07  start
	isString: function(s) {
		return typeof s === 'string';
	},
	isObject: function(obj) {
		return typeof obj === 'object';
	},
	isArray: function(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	},
	// 2021-12-07  end
    //验证是否是一个纯粹的对象
    isPlainObject: function(obj) {
        var proto, Ctor;
        if (!obj || toString.call(obj) !== "[object Object]") {
            return false;
        }

        proto = getProto(obj);
        if (!proto) {
            return true;
        }
        Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
        return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
    },
    //验证类型是否为函数
    isFunction(fn) {
        return this.type(fn) == "function";
    },
    //代理console.log
    log: function() {
        if (hasConsole) {
            Function.apply.call(_console.log, _console, arguments);
        }
    },
    //代理console.time
    time: function() {
        if (hasConsole) {
            var method = _console.time;
            Function.apply.call(method, _console, arguments);
        }
    },
    //代理console.timeEnd
    timeEnd: function() {
        if (hasConsole) {
            var method = _console.timeEnd;
            Function.apply.call(method, _console, arguments);
        }
    },
    //代理console.warn
    warn: function() {
        if (hasConsole) {
            var method = console.warn || console.log;
            Function.apply.call(method, console, arguments);
        }
    },
    //代理console.error
    error: function() {
        if (hasConsole) {
            var method = console.error || console.log;
            Function.apply.call(method, console, arguments);
        }
    },
    //类似jQuery.extend方法，可用于浅拷贝，深拷贝
    mix: function() {
        var options,
            name,
            src,
            copy,
            copyIsArray,
            clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;

            // Skip the boolean and the target
            target = arguments[i] || {};
            i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !this.isFunction(target)) {
            target = {};
        }

        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    copy = options[name];

                    // Prevent Object.prototype pollution
                    // Prevent never-ending loop
                    if (name === "__proto__" || target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (this.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                        src = target[name];

                        // Ensure proper type for the source value
                        if (copyIsArray && !Array.isArray(src)) {
                            clone = [];
                        } else if (!copyIsArray && !this.isPlainObject(src)) {
                            clone = {};
                        } else {
                            clone = src;
                        }
                        copyIsArray = false;

                        // Never move original objects, clone them
                        target[name] = this.mix(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    },
    //获取元素某个计算后的css属性
    getCss: function(curEle, attr) {
        var val = null,
            reg = null;
        if ("getComputedStyle" in window) {
            val = window.getComputedStyle(curEle, null)[attr];
        } else {
            //ie6~8不支持上面属性
            //不兼容
            if (attr === "opacity") {
                val = curEle.currentStyle["filter"]; //'alpha(opacity=12,345)'
                reg = /^alphaopacity=(\d+(?:\.\d+)?)opacity=(\d+(?:\.\d+)?)$/i;
                val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
            } else {
                val = curEle.currentStyle[attr];
            }
        }
        return parseFloat(val);
    },
    getUploadFileInfo(str, index) {
        let files = $files;
        if (str) {
            let result = JSON.parse(str);
            if (this.type(result) == "array") {
                files = result;
            } else if (this.type(result) == "object") {
                files = [result];
            }
        }
        if (this.isDef(index)) {
            return files[index];
        }
        return files;
    },
    //获取cookie值
    getCookie: function(cookie_name) {
        var allcookies = document.cookie;
        //索引长度，开始索引的位置
        var cookie_pos = allcookies.indexOf(cookie_name);
        // 如果找到了索引，就代表cookie存在,否则不存在
        if (cookie_pos != -1) {
            //把cookie_pos放在值的开始，只要给值加1即可
            //计算取cookie值得开始索引，加的1为“=”
            cookie_pos = cookie_pos + cookie_name.length + 1;
            //计算取cookie值得结束索引
            var cookie_end = allcookies.indexOf(";", cookie_pos);
            if (cookie_end == -1) {
                cookie_end = allcookies.length;
            }
            //得到想要的cookie的值
            var value = unescape(allcookies.substring(cookie_pos, cookie_end));
        }
        return value;
    }
};