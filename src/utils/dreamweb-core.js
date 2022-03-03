/*========================================*/

/*-----------------------嵌套表单 Begin-------------------------*/
var isNestedForm = window._Q_ && window._Q_["nestedForm"] === "true";
function getTopFormWindow(){
    try {
        if (window.top === window) {
            return window;
        }
        if (window.top && window.top.xform) {
            return window.top;
        }
        return window.parent;
    }catch (e){
        window.console && console.warn(e);
        return window;
    }
}
var __topFormWindow = getTopFormWindow();
/**
 * 注意:
 * 考虑到有嵌套表单，dreamweb-core.js使用layer(除了top.layer)的地方
 *      都要使用getTopFormLayer()替代。
 */
function getTopFormLayer(){
    return isNestedForm ? __topFormWindow.layer : layer;
}

function closePage() {
    if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") != -1) {
       /* __topFormWindow.location.href = "about:blank";
        __topFormWindow.close();*/
        __topFormWindow.location.href = top.applictionUrl;
        __topFormWindow.close();
    } else {
       /* __topFormWindow.opener = null;
        __topFormWindow.open("", "_self");
        __topFormWindow.close();*/
        __topFormWindow.location.href = top.applictionUrl;
        __topFormWindow.close();
    }
}
/*-----------------------嵌套表单 End-------------------------*/

/*========================================*/
/**
 * DSF - Global Extention
 */
(function($){

    /**
     * sample:
     * var s = "{0} text".format(["sample"]);
     */
    String.prototype.format = function (args) {
        var result = this;
        var reg;
        if (arguments.length > 0) {
            if (arguments.length == 1 && typeof (args) == "object") {
                if($.isArray(args)){
                    for(var index=0; index < args.length; index++){
                        var arg = args[index];
                        if (arg != undefined) {
                            reg = new RegExp("({)" + index + "(})", "g");
                            result = result.replace(reg, arg);
                        }
                    }
                }else{
                    for (var key in args) {
                        if (args[key] != undefined) {
                            reg = new RegExp("({" + key + "})", "g");
                            result = result.replace(reg, args[key]);
                        }
                    }
                }
            } else {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] != undefined) {
                        reg = new RegExp("({)" + i + "(})", "g");
                        result = result.replace(reg, arguments[i]);
                    }
                }
            }
        }
        return result;
    }

    String.prototype.startsWith=function(str){
        var reg=new RegExp("^"+str);
        return reg.test(this);
    }

    String.prototype.endsWith=function(str){
        var reg=new RegExp(str+"$");
        return reg.test(this);
    }
})($);

/**
 * DSF - Utils
 */
(function (window, $) {
    "use strict";
    window.DSF = window.DSF || {};

    var Utils = {};
    //是否执行定时任务，默认1是，-1否
    var timerFlag=1;

    Utils.serializeObject = function (form) {
        var o = {};

        /**
        var map = {};
        $(form).find("[name^='query_']").each(function(){
            var that = $(this);
            map[that.attr("name")] = that.attr("controlType") || "" ;
        });
         */

        $.each(form.serializeArray(), function(index) {
            var key = this['name'] ;

            /**
            var controlType = map[key];
            if(!_.isEmpty(controlType)){
                key =  key + "." + controlType ;
            }*/

            if(this['value']){
                var ovalue = $.trim(this['value']) ;
                if (o[key]) {
                    o[key] = o[key] + "," + ovalue;
                } else {
                    o[key] = ovalue ;
                }
            }
        });

        return o;
    }

    /**
     * 解析JSON。
     * 在JSON.parse()基础上加上try catch。
     */
    Utils.parseJSON = function (jsonString) {
        var resultObj = null;
        if(jsonString){
            try {
                resultObj = JSON.parse(jsonString);
            } catch (e) {
                Utils.error("Error parsing JSON:" , e , ",jsonString=", jsonString);
            }
        }
        return resultObj;
    };

    Utils.stringify = function (json) {
        var resultObj = null;
        if(json){
            try {
                resultObj = JSON.stringify(json);
            } catch (e) {
                Utils.error("Error stringify JSON:" , e , ",jsonString=", json);
            }
        }
        return resultObj;
    };

    Utils.getQueryString = function(){
        var queryStr = "" ;
        //TODO 未加密注销
        if(window._Q_){
            var queryArray = [] ;
            for(var key in window._Q_){
                /*if(/.*[\u4e00-\u9fa5]+.*$/.test(window._Q_[key])) {
                    //判断是否有中文,如果有则加密URI
                    window._Q_[key] = encodeURIComponent(window._Q_[key]);
                }*/
                queryArray.push(key + "=" + window._Q_[key]) ;
            }

            if(queryArray.length > 0){
                queryStr = queryArray.join("&") ;
            }
        }

        if(!queryStr){
            queryStr = window.location.search || "";
            if (queryStr.length) {//去掉问号
                queryStr = queryStr.substring(1, queryStr.length);
            }
        }
        return queryStr;
    }

    /**
     * 将查询字符串转换为Object
     * @param queryString "a1=v1&a2=&a3=a3";// test only
     */
    Utils.getQueryObject = function (queryString) {
        var result = {};
        if (queryString) {
            var pairs = queryString.split("&");
            for (var i = 0; pairs && i < pairs.length; i++) {
                var pair = pairs[i];
                var pos = pair.indexOf('=');
                if (pos == -1) continue;
                var key = pair.substring(0, pos);
                var value = pair.substring(pos + 1);
                value = decodeURIComponent(value); // 若需要，则解码
                result[key] = value;
            }
        }
        return result;
    };

    Utils.getJSONString = function(json){
        var array = [] ;
        for(var key in json){
            /*if(/.*[\u4e00-\u9fa5]+.*$/.test(json[key])) {
                //判断是否有中文,如果有则加密URI
                json[key] = encodeURIComponent(json[key]);
            }*/
            array.push(key + "=" + json[key]);
        }
        return array.join("&") ;
    };

    Utils.pushArray = function(array , other_array) {
        /* you should include a test to check whether other_array really is an array */
        other_array.forEach(function(v) {
            array.push(v)
        }, this);
    }

    Utils.log = function () {
        if (__DSF_DEBUG__) {
            window.console && window.console.log.apply(window.console, arguments);
        }
    }
    Utils.error = function () {
        if (__DSF_DEBUG__) {
            window.console && window.console.error.apply(window.console, arguments);
        }
    }


    /**
     * ajax, post异步情况
     * @param url
     * @param param
     * @param success
     */
    Utils.ajaxRequest = function(url,param, success, error, customConfig){
        if(window.dreamWebDev == "1") {
            if (url && url.indexOf("keepsilent") > -1) {
                return;
            }
        }

        if(timerFlag==-1){
            return;
        }

        param = param || {};

        var uTicket = DSF.getURLParam("uTicket");
        if(uTicket){
            param.uTicket = uTicket;
        }

        var config = {
            type: "post",
            url: DSF.getURLRoot() + url,
            dataType: 'json',
            success: function(json){
                if(typeof success == "function"){
                    success(json);
                }else{
                    if(json && json.type == "success"){
                        layuiOk(json.message);
                    }else{
                        layuiError(json.message);
                    }
                }
            },error : function(jqXHR, textStatus, errorThrown){

                if(jqXHR.responseJSON && jqXHR.responseJSON.code == "30001"){
                    timerFlag=-1;
                }

                console.log("url:" + url);
                // 状态:0-未初始化，1-正在载入，2-已经载入，3-数据进行交互，4-完成。
                console.log(jqXHR.readyState);
                // 状态码:返回的HTTP状态码，比如常见的404,500等错误代码
                console.log(jqXHR.status);
                //对应状态码的错误信息，比如404错误信息是not found,500是Internal Server Error
                console.log(jqXHR.statusText);
                //服务器响应返回的文本信息
                console.log(jqXHR.responseText);
                // 返回状态
                console.log(textStatus);
                // 服务器错误
                console.log(errorThrown);

                if(typeof error == "function"){
                    error(jqXHR, textStatus, errorThrown);
                }else{
                    layer.closeAll();
                    if(jqXHR.responseJSON && jqXHR.responseJSON.message){
                        getTopFormLayer().msg("请求失败，" + jqXHR.responseJSON.message, {icon: 2});
                    }else if(jqXHR.readyState == 0){
                        getTopFormLayer().msg("请求失败: 网络错误", {icon: 2});
                    }else{
                        getTopFormLayer().msg("请求失败", {icon: 2});
                    }
                    if(jqXHR.responseJSON && jqXHR.responseJSON.code == "30001"){
                        top.layer.alert(
                            '请重新登录！',
                            {icon: 2,closeBtn: 0 },
                            function () {
                                closePage();
                                //window.location.href = DSF.getURLRoot()+"ctrl/logout?loginFrom="+top.applicationUrl;
                            });
                    }
                }

            }
        };

        if(customConfig){
            //用来后台可以接收list等集合形式的参数，后台的controller方法必须使用@RequestBody参数接收
            if(customConfig.contentType && customConfig.contentType == "application/json"){
                config.contentType = "application/json";

                if(param){
                    config.data = JSON.stringify(param);
                }
            }
        }

        if(!config.data){
            config.data = param;
        }

        $.ajax(config);
    };

    /**
     * ajax, post异步情况
     * application/json
     * @param url
     * @param param
     * @param success
     */
    Utils.ajaxRequestStr = function(url,param, success, error){
        DSF.Utils.ajaxRequest(url, param, success, error, {contentType : "application/json"})
    };

    Utils.showConfigItemDialog = function(target,module,opts){
        var dialogOpts = {
            codeType: "action",
            title: opts.title,
            multiple: opts.multiple,
            type: "codeselect",
            codeValue: opts.url,
            callback: function (text, ids,dataList) {
                if(opts.okCallback){
                    opts.okCallback(text,ids,dataList);
                }
            }
        };

        if(opts.initData){
            dialogOpts.initData = opts.initData ;
        }

        top.openCodeWindow = window;
        top.openCodeOpts = dialogOpts ;
        top.openCodeIndex = top.layer.open({
            type: 2,
            area: ['890px', '646px'],
            fixed: false,
            title: opts.title || ' ',
            closeBtn: 1,
            resize: true,
            content: DSF.getURLRoot() + 'ctrl/code/select/view'
        });
    };


    /**
     * ajax, post同步情况
     * @param url
     * @param param
     * @param success
     */
    Utils.ajaxSyncRequest = function(url,param,success,errorCallback){
        var result = {};

        param = param || {};
        var uTicket = DSF.getURLParam("uTicket");
        if(uTicket){
            param.uTicket = uTicket;
        }

        $.ajax({
            type: "post",
            async: false,
            url: DSF.getURLRoot() + url,
            data: param,
            dataType: 'json',
            success: function(json){
                if(json && json.type == "success"){
                    if(typeof success == "function"){
                        success(json);
                    }else{

                    }
                }else{
                    if(typeof errorCallback === "function"){
                        errorCallback();
                    }

                    getTopFormLayer().msg(json.message, {icon: 2});
                }

                result = json;
            },error : function(jqXHR, textStatus, errorThrown){
                if(typeof errorCallback === "function"){
                    errorCallback();
                }

                if(jqXHR.responseJSON && jqXHR.responseJSON.message){
                    getTopFormLayer().msg(jqXHR.responseJSON.message, {icon: 2});
                }else if(jqXHR.readyState == 0){
                    getTopFormLayer().msg("请求失败: 网络错误", {icon: 2});
                }else{
                    getTopFormLayer().msg("请求失败", {icon: 2});
                }
                if(jqXHR.responseJSON && jqXHR.responseJSON.code == "30001"){
                    top.layer.alert(
                        '请重新登录！',
                        {icon: 2,closeBtn: 0 },
                        function () {
                            closePage();
                            //window.location.href = DSF.getURLRoot()+"ctrl/logout?loginFrom="+top.applicationUrl;
                        });
                }
                result = {
                    type : "error",
                    data : ''
                }
            }
        });

        return result;
    };

    Utils.ajaxSyncRequestStr = function(url,param){
        var result = {};

        param = param || {};
        var uTicket = DSF.getURLParam("uTicket");
        if(uTicket){
            param.uTicket = uTicket;
        }

        $.ajax({
            type: "post",
            async: false,
            url: DSF.getURLRoot() + url,
            data: JSON.stringify(param),
            dataType: 'json',
            contentType : "application/json",
            success: function(json){
                result = json;
            },error : function(jqXHR, textStatus, errorThrown){
                if(typeof errorCallback === "function"){
                    errorCallback();
                }

                if(jqXHR.responseJSON && jqXHR.responseJSON.message){
                    getTopFormLayer().msg(jqXHR.responseJSON.message, {icon: 2});
                }else if(jqXHR.readyState == 0){
                    getTopFormLayer().msg("请求失败: 网络错误", {icon: 2});
                }else{
                    getTopFormLayer().msg("请求失败", {icon: 2});
                }
                if(jqXHR.responseJSON && jqXHR.responseJSON.code == "30001"){
                    top.layer.alert(
                        '请重新登录！',
                        {icon: 2,closeBtn: 0 },
                        function () {
                            closePage();
                            //window.location.href = DSF.getURLRoot()+"ctrl/logout?loginFrom="+top.applicationUrl;
                        });
                }
                result = {
                    type : "error",
                    data : ''
                }
            }
        });

        return result;
    };


    Utils.checkSession = function(mute){
        if(window["_sessionCheck"] === false || mute){
            return;
        }
        setTimeout(function(){
            DSF.Utils.ajaxRequest("ctrl/checkSession?mute=" + mute,{}, function (result) {},
                function(jqXHR){
                    layer.closeAll();
                    if(jqXHR.responseJSON && jqXHR.responseJSON.code == "30001"){
                        top.layer.alert(
                            '请重新登录！',
                            {icon: 2,closeBtn: 0 },
                            function () {
                                closePage();
                                //window.location.href = DSF.getURLRoot()+"ctrl/logout?loginFrom="+top.applicationUrl;
                            });
                    }
                });
        }, 20);
    };

    Utils.json2Param = function (param, keys) {
        var result = "";

        if(keys && keys instanceof Array && keys.length > 0){
            for(var i=1; i<keys.length; i++){
                if (param[keys[i]] && typeof param[keys[i]] != 'function') {
                    result += "&" + keys[i] + "=" + encodeURI(param[keys[i]]);
                }
            }
        }else{
            for (var name in param) {
                if (typeof param[name] != 'function') {
                    result += "&" + name + "=" + encodeURI(param[name]);
                }
            }
        }

        return result.substring(1)
    };

    var REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;

    var REGX_HTML_DECODE = /&\w+;|&#(\d+);/g;

    var HTML_DECODE = {
        "&lt;" : "<",
        "&gt;" : ">",
        "&amp;" : "&",
        "&nbsp;": " ",
        "&quot;": "\"",
        "&copy;": ""
    };

    /**
     * html 特殊字符转义
     * @param s
     * @returns {any}
     */
    Utils.encodeHtml = function(s){
        s = (s != undefined) ? s : this.toString();
        return (typeof s != "string") ? s :
            s.replace(REGX_HTML_ENCODE,
                function($0){
                    var c = $0.charCodeAt(0), r = ["&#"];
                    c = (c == 0x20) ? 0xA0 : c;
                    r.push(c); r.push(";");
                    return r.join("");
                });
    };

    /**
     * html 特殊字符反转义
     * @param s
     * @returns {any}
     */
    Utils.decodeHtml = function(s){
        s = (s != undefined) ? s : this.toString();
        return (typeof s != "string") ? s :
            s.replace(REGX_HTML_DECODE,
                function($0, $1){
                    var c = HTML_DECODE[$0];
                    if(c == undefined){
                        // Maybe is Entity Number
                        if(!isNaN($1)){
                            c = String.fromCharCode(($1 == 160) ? 32:$1);
                        }else{
                            c = $0;
                        }
                    }
                    return c;
                });
    };

    /**
     * 用于设置表单变量和url中解密后的参数
     * @param key
     * @param value
     */
    DSF.setQParam = function(key, value){
        if(!window._Q_){
            window._Q_ = {};
        }

        window._Q_[key] = value;
    };

    /**
     * 获取URL参数
     * 加密的url其参数会存放在表单的Q标量中
     * 先从Q对象中取值，再从url中取
     * 示例:
     * 		DSF.getURLParam("infoId");
     */
    DSF.getURLParam = function (key) {
        if(window._Q_ && window._Q_[key]){
            return window._Q_[key];
        }

        var queryStr = Utils.getQueryString();
        var queryObject = Utils.getQueryObject(queryStr);
        if (queryObject[key] === undefined) {
            return "";
        } else {
            return queryObject[key];
        }
    };

    /**
     * 删除指定参数，并返回删除后的url
     * @param key
     * @returns {string}
     */
    DSF.delURLParam = function(url, key){
        var urlParam = url.substr(url.indexOf("?")+1);
        var beforeUrl = url.substr(0,url.indexOf("?"));
        var nextUrl = "";

        var arr = new Array();
        if(urlParam!=""){
            var urlParamArr = urlParam.split("&");
            for(var i=0;i<urlParamArr.length;i++){
                var paramArr = urlParamArr[i].split("=");
                if(paramArr[0]!=key){
                    arr.push(urlParamArr[i]);
                }
            }
        }

        if(arr.length>0){
            nextUrl = "?"+arr.join("&");
        }
        return beforeUrl+nextUrl;
    }

    DSF.getURLRoot = function () {
        var theWetRootPath = "";
        try {
            var pathName = window.location.pathname.substring(1);
            var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));

            var slash = "/";
            if(webName === "ctrl" || webName === "form" || !webName){ //如果上下文/的情况下，取的不对
                webName = "";
                slash = "";
            }
            theWetRootPath = window.location.protocol + '//' + window.location.host + '/' + webName + slash;
        } catch (e) {
            console.error(e);
        }

        return theWetRootPath;
    }

    DSF.getJSONLength = function(json){
        var size = 0 ;
        for(var key in json){
            size++ ;
        }
        return size ;
    };

    /**
     * 当前页面是否为表单
     * @returns {boolean}
     */
    DSF.isXForm = function (url/*Optional*/) {
        url = url || window.location.href;
        if(url.indexOf(".xform?") > 0){
            return true;
        }else{
            return false;
        }
    };

    /**
     * 取文件后缀名
     * @param fileName
     * @returns {RegExpExecArray}
     */
    Utils.suffix = function (fileName) {
        var index = fileName.lastIndexOf(".");
        var suffix = fileName.substring(index, fileName.length);
        return suffix;
    };

    Utils.serverLog = function(action , desc){
        var debug = DSF.getURLParam("_systemDebug");
        if(debug === "true" ||  debug === true){
            DSF.Utils.ajaxRequest("ctrl/logger/action", {action : action , desc : desc} , function (result) {
            } , function(error){
            });
        }
    };

    /**
     * 显示遮罩层
     */
    window.layuiShade = function(){
        var index = getTopFormLayer().load(1, {
            shade: [0.5 , '#000'] //0.5透明度
        });
        return index;
    };

    window.layuiOk = function (content, end, time) {
        time = time || 1000;
        var options = {icon: 1, time: time};
        getTopFormLayer().msg(content, options, function () {
            if (typeof (end) == "function") {
                end();
            }
        });
    };

    window.layuiError = function (content, end) {
        var options = {icon: 2, time: 3000};
        getTopFormLayer().msg(content, options, function () {
            if (typeof (end) == "function") {
                end();
            }
        });
    };

    window.layuiConfirm = function(content,end, cancel){
        var index = getTopFormLayer().confirm(content, {
            btn: ['确定','取消'] //按钮
        }, function(index, layero){
            if (typeof (end) == "function") {
                end(index);
            }
        }, function(){
            if (typeof (cancel) == "function") {
                cancel(index);
            }
        });
        return index;
    };

    window.layuiPrompt = function(title, callback){
        getTopFormLayer().prompt({title: title, formType: 3}, function(text, index){
            getTopFormLayer().close(index);
            if (typeof (callback) == "function") {
                callback(text);
            }
        });
    };


    window.openDiv = function (opts) {
        var config = {
            type: 1,
            skin : 'ds-btn-skin',
            offset: '200px',
            btn: ['确认', '关闭'],
            btnAlign: 'c', //按钮居中
        };

        $.extend(config, opts || {});

        return getTopFormLayer().open(config);
    };

    window.openWin = function(obj,target,url,isTabReload){
        $(obj).mouseout();

        if(url==null || url == ""){
            $(obj).removeAttr('href');
            return false;
        }else if(target!=null && target!=""){
            if(target=="newmain"){
                if(top.useMainTab && "undefined" != typeof top.window.C00037){
                    top.window.C00037.openByType(obj, target, url, $(obj).text().trim(),undefined,isTabReload);
                }else {
                    simpleWin(this, {"url": url});
                }
            }else if(target=="divmain"){
                openWinView(this, {"url": url})
            }else if(target=="main"){
                if(top.useMainTab && "undefined" != typeof top.window.C00037){
                    top.window.C00037.openByType(obj, target, url, $(obj).text().trim(),undefined,isTabReload);
                }else {
                    $(document).find("iframe[name='main']").attr("src", url);
                }
            }
        }
    };

    window.simpleWin = function(target,opts){
       /* debugger;
        if(top.useMainTab && "undefined" != typeof top.window.C00037){
            var name = opts.name || $(target).text().trim();
            var isTabReload = opts.isTabReload || "-1";
            var fid = opts.fid || "";
            top.window.C00037.openByType(target, "main", opts.url, name,fid,isTabReload);
            return;
        }*/
        top.currentWindow = window;
        var url = opts.url;
        var urlName = "";

        if(opts.windowId&&opts.windowId!=null&&opts.windowId!=""){
            urlName = opts.windowId;
        }

        var urlSearchNum = url.indexOf("?");
        if(urlSearchNum>-1){
            var urlSearch = url.substring(urlSearchNum+1,url.length);
            var queryObject = Utils.getQueryObject(urlSearch);
            if(queryObject!=null){
                if(queryObject.pk){
                    urlName = queryObject.pk;
                }

                if(urlName==null||urlName==""){
                    if(queryObject.id){
                        urlName = queryObject.id;
                    }
                }

                if(urlName==null||urlName==""){
                    if(queryObject.infoId){
                        urlName = queryObject.infoId;
                    }
                }

                if(urlName==null||urlName==""){
                    if(queryObject.todoId){
                        urlName = queryObject.todoId;
                    }
                }
            }
        }

        opts.url = supplyParam(opts.url);

        window.openWind_Temp=window.open(opts.url,urlName);
        window.openWind_Temp.parentWindow = top.currentWindow;
        DSF.Utils.checkSession();
    };



    window.openWinView = function(target,opts){
        top.openViewModel = target ;
        top.openViewWindow = window ;
        top.openViewOpts = opts ;

        var reloadGrid = !opts || opts["reloadGrid"] !== false ;

        var maxWidth = $(top.window).width() - 20 ;
        var maxHeight = $(top.window).height() - 20;

        var isfresh = opts.isfresh;

        var _area = ["auto","auto"] ;
        if (opts.area) {
            _area = opts.area.split(',');
            var width = parseInt(_area[0]);
            if (width > maxWidth) {
                _area[0] = maxWidth ;
            }

            var height = parseInt(_area[1]);

            if (height > maxHeight) {
                _area[1] = maxHeight ;
            }
        }else{
            _area[0] = maxWidth -80 ;
            _area[1] = maxHeight- 80;
        }

        _area[0] = _area[0] + "px;"
        _area[1] = _area[1] + "px;"

        opts.url = supplyParam(opts.url);

        var config = {
            type: 2,
            fixed: false,
            resize: true,
            area:_area,
            success: function(layero, index){
            },
            end:function(){
                if(top){
                    var openViewWindow = top.openViewWindow;
                    if(top.openViewOpts && top.openViewOpts.callback){
                        top.openViewOpts.callback();
                    }
                    if(top.openViewWindow&&isfresh){
                        top.openViewWindow.location.reload();
                    }
                    if((opts.reloadGrid == undefined || opts.reloadGrid) && openViewWindow){
                        openViewWindow.closeWinView({reloadGrid : reloadGrid});
                    }
                }
            }
        };

        $.extend(config, opts || {});

        config.title = opts.title === false? false : opts.title || " ";
        config.content = opts.url || "";
        config.closeBtn = opts.closeBtn === undefined ? 1 : opts.closeBtn;
        config.area = _area;

        top.openViewIndex =	top.layer.open(config);
    };

    window.openInnerWinView = function(target,opts){
        top.openInnerViewModel = target ;
        top.openInnerViewWindow = window ;
        top.openInnerViewOpts = opts ;

        var reloadGrid = !opts || opts["reloadGrid"] !== false ;

        var maxWidth = $(top.window).width() - 20 ;
        var maxHeight = $(top.window).height() - 20;

        var isfresh = opts.isfresh;

        var _area = ["auto","auto"] ;
        if (opts.area) {
            _area = opts.area.split(',');
            var width = parseInt(_area[0]);
            if (width > maxWidth) {
                _area[0] = maxWidth ;
            }

            var height = parseInt(_area[1]);

            if (height > maxHeight) {
                _area[1] = maxHeight ;
            }
        }else{
            _area[0] = maxWidth -80 ;
            _area[1] = maxHeight- 80;
        }

        _area[0] = _area[0] + "px;"
        _area[1] = _area[1] + "px;"

        opts.url = supplyParam(opts.url);

        var opts = {
            type: 2,
            fixed: false,
            title:opts.title || " ",
            content: opts.url || "",
            closeBtn: 1,
            resize: true,
            shadeClose: opts.shadeClose || "",//点击遮罩关闭层
            area:_area,
            end:function(){
                if(top){
                    var openViewWindow = top.openInnerViewWindow;
                    if(top.openInnerViewOpts && top.openInnerViewOpts.callback){
                        top.openInnerViewOpts.callback();
                    }
                    if(top.openInnerViewWindow&&isfresh){
                        top.openInnerViewWindow.location.reload();
                    }
                    if(openViewWindow){
                        openViewWindow.closeInnerWinView({reloadGrid : reloadGrid});
                    }
                }
            }
        };
        top.openInnerViewIndex =	top.layer.open(opts);
    };

    window.openTabWinView = function(target,opts){
        top.openTabViewModel = target ;
        top.openTabViewWindow = window ;
        top.openTabViewOpts = opts ;

        var reloadGrid = !opts || opts["reloadGrid"] !== false ;

        var maxWidth = $(top.window).width() - 20 ;
        var maxHeight = $(top.window).height() - 20;

        var isfresh = opts.isfresh;

        var _area = ["auto","auto"] ;
        if (opts.area) {
            _area = opts.area.split(',');
            var width = parseInt(_area[0]);
            if (width > maxWidth) {
                _area[0] = maxWidth ;
            }

            var height = parseInt(_area[1]);

            if (height > maxHeight) {
                _area[1] = maxHeight ;
            }
        }else{
            _area[0] = maxWidth -80 ;
            _area[1] = maxHeight- 80;
        }

        _area[0] = _area[0] + "px;"
        _area[1] = _area[1] + "px;"

        opts.url = supplyParam(opts.url);

        var opts = {
            type: 2,
            fixed: false,
            title: opts.title === false? false : opts.title || " ",
            content: opts.url || "",
            closeBtn: opts.closeBtn === undefined ? 1 : opts.closeBtn,
            resize: true,
            shadeClose: opts.shadeClose || "",//点击遮罩关闭层
            area:_area,
            success: function(layero, index){
            },
            end:function(){
                var openTabViewWindow = top.openTabViewWindow;
                if(top.openTabViewOpts && top.openTabViewOpts.callback){
                    top.openTabViewOpts.callback();
                }
                if(top.openTabViewWindow&&isfresh){
                    top.openTabViewWindow.location.reload();
                }
                if(openTabViewWindow){
                    openTabViewWindow.closeTabWinView({reloadGrid : reloadGrid});
                }

            }
        };
        top.openTabViewIndex =	top.layer.open(opts);
    };

    window.supplyParam = function(url){
        var uTicket = DSF.getURLParam("uTicket");
        if(url && uTicket){
            var urlSearchNum = url.indexOf("?");
            if(urlSearchNum > -1){
                url = url + "&uTicket=" + uTicket;
            }else{
                url = url + "?uTicket=" + uTicket;
            }
        }

        return url;
    }

    window.closeWinView = function(opts){

        var reloadGrid = opts && opts["reloadGrid"] ;

        var openViewWindow = top.openViewWindow ;
        if(openViewWindow){

            if(reloadGrid&&openViewWindow.layui &&
                openViewWindow.layui.dataGridUtil && openViewWindow.layui.dataGridUtil.reloadDataGrid){
                openViewWindow.layui.dataGridUtil.reloadDataGrid();
            }

            var index = top.openViewIndex ;
            if(index){

                if(top.beforeCloseWinView && 'function'===  typeof top.beforeCloseWinView){
                    top.beforeCloseWinView();
                    delete top.beforeCloseWinView ;
                }

                top.layer.close(index);

                delete top.openViewModel ;
                delete top.openViewWindow ;
                delete top.openViewIndex ;
                delete top.openViewOpts;
            }
        }
    };

    window.closeInnerWinView = function(opts){

        var reloadGrid = opts && opts["reloadGrid"] ;

        var openViewWindow = top.openInnerViewWindow ;
        if(openViewWindow){

            if(reloadGrid&&openViewWindow.layui &&
                openViewWindow.layui.dataGridUtil && openViewWindow.layui.dataGridUtil.reloadDataGrid){
                openViewWindow.layui.dataGridUtil.reloadDataGrid();
            }

            if(top.openInnerViewOpts && top.openInnerViewOpts.callback){
                top.openInnerViewOpts.callback();
            }

            if(openViewWindow && top.openInnerViewOpts["isfresh"] === true){
                openViewWindow.location.href = openViewWindow.location.href;
            }

            var index = top.openInnerViewIndex ;
            if(index){
                top.layer.close(index);

                delete top.openInnerViewModel ;
                delete top.openInnerViewWindow ;
                delete top.openInnerViewIndex ;
                delete top.openInnerViewOpts;
            }
        }
    };

    window.closeTabWinView = function(opts){

        var reloadGrid = opts && opts["reloadGrid"] ;

        var openTabViewWindow = top.openTabViewWindow ;
        if(openTabViewWindow){

            if(reloadGrid&&openTabViewWindow.layui &&
                openTabViewWindow.layui.dataGridUtil && openTabViewWindow.layui.dataGridUtil.reloadDataGrid){
                openTabViewWindow.layui.dataGridUtil.reloadDataGrid();
            }

            var index = top.openTabViewIndex ;
            if(index){

                if(top.beforeCloseTabWinView && 'function'===  typeof top.beforeCloseTabWinView){
                    top.beforeCloseTabWinView();
                    delete top.beforeCloseTabWinView ;
                }

                top.layer.close(index);

                delete top.openTabViewModel ;
                delete top.openTabViewWindow ;
                delete top.openTabViewIndex ;
                delete top.openTabViewOpts;
            }
        }
    };

    window.favorite=function(obj){
        var infoId=DSF.getURLParam("pk");
        var pid=DSF.getURLParam("pid")||'';
        var pnid=DSF.getURLParam("pnid")||'';
        var typeVal = obj;
        var data={"infoId":infoId,"type":obj,"pid":pid,"pnid":pnid};
        var obj=$(".x-form-buttons button[op='favorite']");
        obj.attr('disabled',true);
        var favoriteFlag = "failure";
        window.favoriteObj = obj;
        if(typeVal==1){
            Utils.ajaxRequest("ctrl/myFavorite/queryFavorite", {}, function (result) {
                if ("success" == result.type) {
                    var count = result.data.count;
                    if(count>0){
                        getTopFormLayer().open({
                            type: 2,
                            area: ['770px', '500px'],
                            fixed: false,
                            title: '',
                            content: '../ctrl/myFavorite/favoriteIndex?dataId='+infoId
                        });
                    }else{
                        Utils.ajaxRequest("ctrl/favorite/enshrine", data, function (result) {
                            if ("success" == result.type) {
                                if(window.parentWindow&&window.parentWindow.refresh){
                                    window.parentWindow.refresh();
                                }
                                var data=result.message;
                                var oriName = obj.attr("original-name");
                                if("enshrine"==data){
                                    favoriteFlag = "success";
                                    if(oriName){
                                        obj.text(oriName);
                                    }else{
                                        obj.text("收藏");
                                    }
                                    obj.attr("onclick","favorite(1)");
                                }else if("cancel"==data){
                                    favoriteFlag = "success";
                                    if(oriName){
                                        obj.text("取消" + oriName);
                                    }else{
                                        obj.text("取消收藏");
                                    }

                                    obj.attr("onclick","favorite(-1)");
                                }else if("notsave"==data){
                                    if(oriName){
                                        layuiError("请保存后再" + oriName)
                                    }else{
                                        layuiError("请保存后再收藏")
                                    }
                                }
                                obj.removeAttr('disabled');
                            }
                            if (typeof (afterFavorite)== "function"){
                                afterFavorite(favoriteFlag,typeVal);
                            }
                        },function(){
                            obj.removeAttr('disabled');
                            layuiError("请求失败请重试");
                        });
                    }
                }
            });


        }else{
            Utils.ajaxRequest("ctrl/favorite/enshrine", data, function (result) {
                if ("success" == result.type) {
                    if(window.parentWindow&&window.parentWindow.refresh){
                        window.parentWindow.refresh();
                    }
                    var data=result.message;
                    var oriName = obj.attr("original-name");
                    if("enshrine"==data){
                        favoriteFlag = "success";
                        if(oriName){
                            obj.text(oriName);
                        }else{
                            obj.text("收藏");
                        }
                        obj.attr("onclick","favorite(1)");
                    }else if("cancel"==data){
                        favoriteFlag = "success";
                        if(oriName){
                            obj.text("取消" + oriName);
                        }else{
                            obj.text("取消收藏");
                        }
                        obj.attr("onclick","favorite(-1)");
                    }else if("notsave"==data){
                        if(oriName){
                            layuiError("请保存后再" + oriName)
                        }else{
                            layuiError("请保存后再收藏")
                        }
                    }
                    obj.removeAttr('disabled');
                }
                if (typeof (afterFavorite)== "function"){
                    afterFavorite(favoriteFlag,typeVal);
                }
            },function(){
                obj.removeAttr('disabled');
                layuiError("请求失败请重试");
            });
        }

    };
    window.deleteXForm=function(moduleId){
        layuiConfirm("请确认是否删除？",function(index){
            moduleId = moduleId || DSF.getURLParam("moduleId");
            var pk=DSF.getURLParam("pk");
            var array = new Array();
            var param = {
                "pk": pk, "moduleId": moduleId
            };
            array.push(param);
            var data = {"data": JSON.stringify(array),"moduleId":moduleId};
            var obj=$(".x-form-buttons button[op='deleteXForm']");
            obj.attr('disabled',true);
            Utils.ajaxRequest("ctrl/recycle/physical", data, function (result) {
                if ("success" == result.type) {
                    var data=result.data;
                    if(typeof (afterDeleteXForm) == "function"){
                        afterDeleteXForm(data);
                    }else{
                        var params={"status":DSF.SaveStatus.Success};
                        xform.reloadDataGrid(params);
                        if(self == top){
                            window.close();
                        }else{
                            top.openViewWindow && top.openViewWindow.closeWinView();
                        }
                    }
                    obj.removeAttr('disabled');
                    getTopFormLayer().close(index);
                }
            },function(){
                obj.removeAttr('disabled');
                layuiError("请求失败请重试");
                getTopFormLayer().close(index);
            });
        });

    }
    window.logicDeleteXForm=function(moduleId){
        layuiConfirm("请确认是否删除？<br />删除后的信息请在回收站中处理",function(index){
            getTopFormLayer().load();
            var pk=DSF.getURLParam("pk");
            moduleId = moduleId || DSF.getURLParam("moduleId");
            var array = new Array();
            var param = {
                "pk": pk, "moduleId": moduleId
            };
            array.push(param);
            var data = {"data": JSON.stringify(array),"moduleId":moduleId};
            var obj=$(".x-form-buttons button[op='logicDeleteXForm']");
            obj.attr('disabled',true);
            Utils.ajaxRequest("ctrl/recycle/logic", data, function (result) {
                getTopFormLayer().closeAll('loading');
                if ("success" == result.type) {

                    if(window.parentWindow&&window.parentWindow.reloadAllTab){
                        layuiOk("删除成功",function () {//2019/07/20 wuj 删除提示
                            window.parentWindow.reloadAllTab();
                        });

                    }
                    var data=result.data;
                    if(typeof (afterLogicDeleteXForm) == "function"){
                        afterLogicDeleteXForm(data);
                    }else{
                        var params={"status":DSF.SaveStatus.Success};
                        xform.reloadDataGrid(params);
                        if(self == top){
                            layuiOk("删除成功",function () {//2019/07/20 wuj 删除提示
                                window.close();
                            });
                        }
                        Public.closeMainTab();
                    }

                    obj.removeAttr('disabled');
                }
                getTopFormLayer().close(index);
            },function(){
                getTopFormLayer().closeAll('loading');
                getTopFormLayer().close(index);
                obj.removeAttr('disabled');
                layuiError("请求失败请重试");
            });
        });

    }
    window.recoverXForm=function(moduleId){
        layuiConfirm("请确认是否恢复？",function(index){
            getTopFormLayer().load();
            var pk=DSF.getURLParam("pk");
            moduleId = moduleId || DSF.getURLParam("moduleId");
            var array = new Array();
            var param = {
                "pk": pk, "moduleId": moduleId
            };
            array.push(param);
            var data = {"data": JSON.stringify(array),"moduleId":moduleId};
            var obj=$(".x-form-buttons button[op='recoverXForm']");
            obj.attr('disabled',true);
            Utils.ajaxRequest("ctrl/recycle/recover", data, function (result) {
                getTopFormLayer().closeAll('loading');
                if ("success" == result.type) {
                    var params={"status":DSF.SaveStatus.Success};
                    xform.reloadDataGrid(params);
                    if(self == top){
                        window.close();
                    }
                    obj.removeAttr('disabled');
                }
                getTopFormLayer().close(index);
            },function(){
                getTopFormLayer().closeAll('loading');
                getTopFormLayer().close(index);
                obj.removeAttr('disabled');
                layuiError("请求失败请重试");
            });
        });

    }


    window.openTripartite = function(tripartiteId){

        DSF.Utils.ajaxRequest("ctrl/tripartite/getTripartite", {id:tripartiteId}, function (result) {
            if(result.type == "success"){

                var actType = result.data.actType;
                var content = result.data.content;
                var createUname = result.data.createUname;
                var createTime = result.data.createTime;

                var actTypeText = "";
                if(actType==1){
                    actTypeText = "新增数据";
                }else if(actType==2){
                    actTypeText = "修改数据";
                }else if(actType==3){
                    actTypeText = "删除数据";
                }
                var html = "";
                html+="<table class = 'layui-table text-center'>";
                html+="<tr><td width=80>操作类型：</td><td>"+actTypeText+"</td></tr>";
                html+="<tr><td>操作内容：</td><td>"+content+"</td></tr>";
                html+="<tr><td>操作人：</td><td>"+createUname+"</td></tr>";
                html+="<tr><td>操作时间：</td><td>"+createTime+"</td></tr>";
                html+="</table>";
                getTopFormLayer().alert(html);
            }
        });
    }


    //批量下载表单中的附件
    window.formBatchDownload = function (pk, moduleId, nrType, allowSave,flowId , nodeId) {
        pk = pk || DSF.getURLParam("pk");
        nrType = nrType || '';
        allowSave = allowSave || false;
        moduleId = moduleId || DSF.getURLParam("moduleId");
        flowId = flowId || DSF.getURLParam("flowId");
        nodeId = nodeId || DSF.getURLParam("nodeId");
        var downloadUrl = DSF.getURLRoot() + 'ctrl/file/batchDownload?moduleId=' + moduleId + '&infoId=' + pk + '&nrType=' + nrType+"&flowId="+flowId+"&nodeId="+nodeId;
        if(allowSave){
            xform.saveForm({enableTip: false}, function (result) {
                if (result.status == "Success") {
                    window.open(downloadUrl);
                } else {
                    top.layuiError(result.message);
                }
            });
        }else{
            window.open(downloadUrl);
        }
    };


    /**
     * 发送消息
     */
    window.saveSendNoticeMessage = function(){
        try{
            var pwindow = window.parent ;
            if(pwindow){
                var parentLocation = pwindow.location.href ;
                if(parentLocation && parentLocation.indexOf("/ctrl/formTab/") > 0){
                    pwindow.postMessage && pwindow.postMessage({
                        srcSendUrl:window.location.href,
                        data:{
                            action:'save',
                            currPk:DSF.getURLParam("pk") || '', //保存的PK
                            A0006:$("input[name='A0006']").val() || '',
                            A0007:$("input[name='A0007']").val() || '',
                        }
                    },"*");
                }
            }
        }catch(e){}
    };
    $(document).keydown(function (e){
        var doPrevent;// 是否阻止事件
        if (e.keyCode == 8) { // 退格键
            var d = e.srcElement || e.target;
            if (d.tagName.toUpperCase() == 'INPUT' || d.tagName.toUpperCase() == 'TEXTAREA') {
                doPrevent = d.readOnly || d.disabled;
            }else {
                doPrevent = true;
            }
        }else{
            doPrevent = false;
        }
        if (doPrevent)
            e.preventDefault();
    });
    /**
     * 通过添加 script标签的方式导入指定的模块开始
     * 导入的模块进来用 module 开头
     * */
    /*获取项目路径 很多页面没有使用jsp 或 没有 contextPath*/
    var proPath  = (function() {
        var curWwwPath = window.document.location.href;
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        var localhostPaht = curWwwPath.substring(0, pos);
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        return (localhostPaht + projectName);
    })()
    var moduleMap = {
        "jcTitle": {
          "js": "/external/jcTitle.js"
        },
        "jqCallback":{
            "js":"/external/jqCallback.js"
        }
    };
    var loadCss = function(name,path){
        var cssEle = document.createElement("link");
        cssEle.setAttribute("rel","stylesheet");
        cssEle.setAttribute("name",name);
        cssEle.setAttribute("href",path);
        document.head.appendChild(cssEle);
    };
    var loadJs = function(name,path,after){
        var jsEle = document.createElement("script");
        jsEle.setAttribute("charset","utf-8");
        jsEle.setAttribute("type","text/javascript")
        jsEle.setAttribute("name",name);
        jsEle.setAttribute("src",path);
        if(document.body)
            document.body.appendChild(jsEle);
        else//如果js写在前面
            document.head.appendChild(jsEle)
        if ( jsEle.onreadystatechange ){
            jsEle.onreadystatechange = function(){
                if (this.readyState == "complete" || this.readyState == "loaded" ){
                    jsEle.onreadystatechange = null;
                    after();
                }
            };
        }else{
            jsEle.onload = function(){  // 文件加载成功则触发 onload
                after();
            }
        }
    };
    var importModule = function(moduleNmae,after) {
        var moduleItem = moduleMap[moduleNmae];
        if(!moduleItem)
            console.log("module."+moduleNmae+" is not defined");
        var moduleCss = moduleItem["css"];
        if(moduleCss){
            if(typeof moduleCss === 'string' || moduleCss instanceof String)
                moduleCss = [moduleCss];

            for (var i=0;i<moduleCss.length;i++){
                if(moduleCss[i].startsWith("/"))
                    loadCss(moduleNmae,proPath+moduleCss[i])
                else
                    loadCss(moduleNmae,moduleCss[i])
            }
        }
        var moduleJs = moduleItem["js"];
        if(moduleJs){
            if(typeof moduleJs === 'string' || moduleJs instanceof String)
                moduleJs = [moduleJs];
            var fn = after;
            for(i=moduleJs.length-1;i>=0;i--){
                var path = moduleJs[i]
                if(moduleJs[i].startsWith("/"))
                    path = proPath+moduleJs[i]
                fn =function(fn,moduleNmae,path){
                        return function(){
                            loadJs(moduleNmae,path,fn);
                        }
                }(fn,moduleNmae,path)
            }
            fn();

           /* for (var i=0;i<moduleJs.length;i++){
                if(moduleJs[i].startsWith("/"))
                    loadJs(moduleNmae,proPath+moduleJs[i])
                else
                    loadJs(moduleNmae,moduleJs[i])
            }*/
        }
    };
    window.module = {};
    window.module.use = function(modules,callback) {
        var that = this;
        if(!this.used)
            this.used = [];
        var ms = modules;
        if(typeof ms === 'string' || ms instanceof String)
            ms = [ms];
        if(!(ms instanceof Array))
            throw Error("modules should be string or Array");
        if(! (typeof callback === 'function') )
            throw Error("callback should be function")
        var fn = callback;
        for(var i=ms.length-1;i>=0;i--){
            var moduleName = ms[i]
            fn =function(fn,moduleName){
                return function(){
                    //检测是否已经导入过此模块
                    var isUsed = false;
                    for(var j=0;j<that.used.length;j++){
                        if(that.used[j] === moduleName.toString()){
                            isUsed = true;
                            console.log(moduleName+" used");
                            break
                        }
                    }
                    if(!isUsed){
                        importModule(moduleName,fn)
                        that.used.push(moduleName.toString())
                    }
                }
            }(fn,moduleName)
        }
        fn()
       /* for(var i = 0; i<ms.length; i++){
            //检测是否已经导入过此模块
            var isUsed = false;
            for(var j=0;j<this.used.length;j++){
                if(this.used[j] === ms[i].toString()){
                    isUsed = true;
                    console.log(ms[i]+" used");
                    break
                }
            }
            if(!isUsed){
                importModule(ms[i]);
                this.used.push(ms[i])
            }
        }
        callback()*/
    };
    /**
     * 通过添加 script标签的方式导入指定的模块结束
     * */
    // exports:
    window.DSF = window.DSF || {};
    window.DSF.Utils = window.DSF.Utils || Utils;
})(window, $);