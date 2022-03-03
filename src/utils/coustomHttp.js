// 请求函数封装
import axios from "axios";
import qs from "qs";
import url from "./url";
import utils from "./utils";

const Axios = axios.create({
    baseURL: "",
    timeout: 20000,
    responseType: "json",
    crossDomain: true,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Code: "pc"
    },
    withCredentials: true
});

const DEFAULT_ERROR = "网络存在异常";

Axios.interceptors.response.use(response => {
    //处理IE9请求json时不能自动转化成对象的问题
    if (response.data == null && response.config.responseType === "json" && response.request.responseText != null) {
        try {
            response.data = JSON.parse(response.request.responseText);
        } catch (e) {
            // ignored
        }
    }
    return response;
});

Promise.prototype.done = function(fn) {
    function responseHanlder(response) {
        if (response.headers) {
            var result = response.data || {};
            //success、state、message这3个属性都存在表示是我们自己应用的程序
            if (utils.isDef(result.success) && utils.isDef(result.state) && utils.isDef(result.message)) {
                if (result.state == "20001" && !result.message) {
                    result.message = DEFAULT_ERROR;
                }
                return fn(result);
            } else {
                return fn(result);
            }
        } else {
            var result = response;
            //success、state、message这3个属性都存在表示是我们自己应用的程序
            if (utils.isDef(result.success) && utils.isDef(result.state) && utils.isDef(result.message)) {
                if (result.state == "20001" && !result.message) {
                    result.message = DEFAULT_ERROR;
                }
                return fn(result);
            } else {
                return fn(result);
            }
        }

    }
    let r = this.then(response => {
        return responseHanlder(response);
    });
    return r;
};

Promise.prototype.error = function(fn) {
    function errorHandler(error) {
        fn({
            capture: false,
            state: -1,
            message: DEFAULT_ERROR,
            error: error
        });
    }
    return this.catch(error => {
        errorHandler(error);
    });
};

Promise.prototype.always = function(fn) {
    this.finally(fn);
};

function get(path, params, options, rootPath) {
    if (dsf.type(options) == 'string') {
        rootPath = options;
        options = null;
    }
    path = url.getCustomPath(path, rootPath);
    let opts = {
        params: params,
        paramsSerializer: function(params) {
            return qs.stringify(params, {
                arrayFormat: "repeat"
            });
        }
    };
    opts = dsf.mix(opts, options || {});
    let p = Axios.get(path, opts);
    return p;
}

function post(path, params, options, rootPath) {
    if (dsf.type(options) == 'string') {
        rootPath = options;
        options = null;
    }
    path = url.getCustomPath(path, rootPath);
    let configContentType = options && options.headers && options.headers["Content-Type"] ? options.headers["Content-Type"] : "";
    if (configContentType !== "multipart/form-data") {
        params = qs.stringify(params);
    }
    let opts = {};
    opts = dsf.mix(opts, options || {});
    let p = Axios.post(path, params, opts);
    return p;
}

function all(arr) {
    return axios.all(arr).then(axios.spread((...res) => {
        const list = res.map(item => item.data);
        return list;
    }))
}

function upload(path, file, params, options, rootPath) {
    if (dsf.type(options) == 'string') {
        rootPath = options;
        options = null;
    }
    let opts = {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    };
    opts = dsf.mix(opts, options || {});
    var forms = new FormData();
    forms.append("file", file);
    for (let k in params) {
        forms.append(k, params[k]);
    }
    path = url.getCustomPath(path, rootPath);
    let p = Axios.post(path, forms, opts);
    return p;
}

window.$$allLoadFiles = {};
window.$$allLoadFilesArray = [];

function importFiles(files) {
    let states = [];
    let loadFiles = dsf.type(files) == "array" ? files.slice(0) : [files];
    let promise = new Promise(resolve => {
        recursionLoad(() => {
            resolve(states);
        });
    });

    function recursionLoad(callback) {
        let f = loadFiles.shift();
        if (f) {
            loadFile(f)
                .then(result => {
                    states.push(result);
                    result = null;
                })
                .catch(result => {
                    importFiles.kill(result.src, true);
                    states.push(result);
                    result = null;
                })
                .finally(() => {
                    recursionLoad(callback);
                });
        } else {
            callback && callback();
        }
    }
    return promise;
}

function getFileType(url) {
    if (url != null && url.length > 0) {
        if (url.lastIndexOf("?") > 0) {
            url = url.substr(0, url.lastIndexOf("?"));
        }
        return url.substr(url.lastIndexOf(".")).toLowerCase();
    }
}

function loadFile(url) {
    let type = getFileType(url);
    let fileObj = null;
    let promise = new Promise((resolve, reject) => {
        if (!window.$$allLoadFiles[url]) {
            if (type == ".js") {
                fileObj = document.createElement("script");
                fileObj.src = url;
            } else if (type == ".css") {
                fileObj = document.createElement("link");
                fileObj.href = url;
                fileObj.type = "text/css";
                fileObj.rel = "stylesheet";
            }
            if (fileObj) {
                fileObj.__views__ = [];
                fileObj.onload = fileObj.onreadystatechange = function() {
                    if (!this.readyState || "loaded" === this.readyState || "complete" === this.readyState) {
                        window.$$allLoadFiles[url].state = "success";
                        resolve(window.$$allLoadFiles[url]);
                        _.each(window.$$allLoadFiles[url].promiseList, p => {
                            p.resolve(window.$$allLoadFiles[url]);
                        });
                    }
                };
                fileObj.onerror = function() {
                    window.$$allLoadFiles[url].state = "error";
                    _.each(window.$$allLoadFiles[url].promiseList, p => {
                        p.reject(window.$$allLoadFiles[url]);
                    });
                };
                if (!window.$$allLoadFiles[url]) {
                    window.$$allLoadFiles[url] = {
                        elem: fileObj,
                        state: "pending",
                        type: type,
                        src: url,
                        promiseList: [{ resolve: resolve, reject: reject }]
                    };
                    window.$$allLoadFilesArray.push(url);
                    document.getElementsByTagName("BODY")[0].appendChild(fileObj);
                }
            }
        } else {
            window.$$allLoadFilesArray.push(url);
            let state = window.$$allLoadFiles[url].state;
            if (state == "pending") {
                window.$$allLoadFiles[url].promiseList.push({ resolve: resolve, reject: reject });
            } else if (state == "success") {
                resolve(window.$$allLoadFiles[url]);
            } else {
                reject(window.$$allLoadFiles[url]);
            }
        }
    });
    return promise;
}
importFiles.kill = function(src, mark) {
    dsf.array.remove(window.$$allLoadFilesArray, src);
    let result = _.filter(window.$$allLoadFilesArray, url => url == src);
    if (result.length <= 0 || mark === true) {
        let f = window.$$allLoadFiles[src];
        if (f && f.elem && f.elem.parentNode) {
            f.elem.parentNode.removeChild(f.elem);
        }
        delete window.$$allLoadFiles[src];
    }
};
importFiles.has = function(src) {
    let result = _.filter(window.$$allLoadFilesArray, url => url == src);
    return result.length > 0;
};

export default {
    get,
    post,
    all,
    upload,
    importFiles
};

// 示例:
// this.dsf.http.get('wfm/getWFDefinition', {
//   sID: '5b2d48d830c44b509d4fa730fa9d0b9b'
// }).done((d) => {
//   _this.dsf.layer.toast('模拟Get请求成功', true)
// }).error((response) => {
//   _this.dsf.layer.toast('模拟Get请求失败', false)
// }).always((res) => {
//   debugger
// })

// this.dsf.http.post('dsfa/tags/saveOrCancel', {
//   ywlxValue: '00',
//   ywlxText: '课程',
//   ywid: '6ec7aadc7e1c49a7a3ac454d939da5cd'
// }).done((d) => {
//   _this.dsf.layer.toast('模拟Post请求成功', true)
// }).error((response) => {
//   _this.dsf.layer.toast('模拟Post请求失败', false)
// }).always((res) => {
//   debugger
// })