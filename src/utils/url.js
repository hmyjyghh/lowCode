import qs from "qs";

function getWebPath(url, rootPath) {
    if (!url) {
        return "";
    }
    let isHtmlDir = false;
    let isAssetsDir = false;
    let isWebRoot = false;
    if (url.startsWiths("~")) {
        isHtmlDir = true;
        url = url.substr(1);
    } else if (url.startsWiths("$")) {
        isAssetsDir = true;
        url = url.substr(1);
    } else if (url.startsWiths("@")) {
        isWebRoot = true;
        url = url.substr(1);
    }
    if (url.startsWiths("/")) {
        url = url.substr(1);
    } else if (url.startsWiths("./") || url.startsWiths("../") || url.startsWiths("http://") || url.startsWiths("https://")) {
        return url;
    }
    if (isHtmlDir) {
        return dsf.config.htmlDir + url;
    } else if (isAssetsDir) {
        return dsf.config.assetsDir + url;
    } else if (isWebRoot) {
        return dsf.config.webRoot.webPath + url;
    } else {
        let root = rootPath || dsf.config.webRoot.default;
        return root + url;
    }
}


function getCustomPath(url, rootPath) {
    if (!url) {
        return "";
    }
    let isHtmlDir = false;
    let isAssetsDir = false;
    if (url.startsWiths("~")) {
        isHtmlDir = true;
        url = url.substr(1);
    } else if (url.startsWiths("$")) {
        isAssetsDir = true;
        url = url.substr(1);
    }
    if (url.startsWiths("/")) {
        url = url.substr(1);
    } else if (url.startsWiths("./") || url.startsWiths("../") || url.startsWiths("http://") || url.startsWiths("https://")) {
        return url;
    }
    if (isHtmlDir) {
        return dsf.config.htmlDir + url;
    } else if (isAssetsDir) {
        return dsf.config.assetsDir + url;
    } else {
        let root = rootPath || "/";
        return root + url;
    }
}


function getWebUrl(url, rootPath) {
    if (!url) {
        return "";
    }
    let isHtmlDir = false;
    let isAssetsDir = false;
    if (url.startsWiths("~")) {
        isHtmlDir = true;
        url = url.substr(1);
    } else if (url.startsWiths("$")) {
        isAssetsDir = true;
        url = url.substr(1);
    }
    if (url.startsWiths("/")) {
        url = url.substr(1);
    } else if (url.startsWiths("./") || url.startsWiths("../") || url.startsWiths("http://") || url.startsWiths("https://")) {
        return url;
    }
    if (isHtmlDir) {
        return dsf.config.htmlDir + url;
    } else if (isAssetsDir) {
        return dsf.config.assetsDir + url;
    } else {
        let root = rootPath || dsf.config.webRoot.webPath;
        return root + url;
    }
}

// function getAssetsDir(url) {
//   if (!url) {
//     return "";
//   }
//   if (url.indexOf("/") == 0) {
//     url = url.substr(1);
//   } else if (url.startsWith(".") || url.startsWith("http://") || url.startsWith("https://")) {
//     return url;
//   }
//   return (dsf.config.assetsDir || "./static/") + url;
// }

var globalCache = {};

function queryString(key) {
    if (!globalCache["url_queryString"]) {
        globalCache["url_queryString"] = {};
    }
    if (!globalCache["url_queryString"][key]) {
        var url = window.location.hash;
        var oRegex = new RegExp("[?&]" + key + "=([^&]+)", "i");
        var oMatch = oRegex.exec(url);
        if (oMatch && oMatch.length > 1) {
            var val = decodeURI(oMatch[1]);
            globalCache["url_queryString"][key] = val;
            return val;
        } else {
            return "";
        }
    }
    return globalCache["url_queryString"][key];
}

function getAbsolutePath(url) {
    if (url.indexOf("~/") == 0) {
        url = dsf.url.getWebPath(url.substr(1));
    } else if (url.indexOf("/") == 0) {
        url = dsf.url.getWebPath(url.substr(1));
    }
    return url;
}


function stringify(params, options) {
    let defaultOptions = {
        arrayFormat: "repeat"
    };
    options = dsf.mix({}, defaultOptions, options);
    return qs.stringify(params, options);
}

function parse(str, options) {
    let defaultOptions = {
        arrayFormat: "repeat"
    };
    options = dsf.mix({}, defaultOptions, options);
    return qs.parse(str, options);
}

/**
 * 解析url
 * @param url
 */
function analyzing(url) {
    let i;
    if (!url || url === '') {
        return {
            url: null,
            protocol: null,
            slash: null,
            host: null,
            port: null,
            path: null,
            queryString: null,
            hash: null,
            query: {}
        };
    }
    url = decodeURIComponent(url);
    const parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
    const _result = parse_url.exec(url);
    const names = ['url', 'protocol', 'slash', 'host', 'port', 'path', 'queryString', 'hash'];
    const result = {};
    for (i = 0; i < names.length; i++) {
        result[names[i]] = _result[i];
    }
    result.protocol = result.protocol && (result.protocol + ':');
    result.path = result.slash !== '//' ? ('/' + result.host + '/' + result.path) : '/' + result.path;
    result.host = result.slash !== '//' ? null : result.host;
    if (!result.port) {
        result.port = result.protocol === 'http:' ? '80' : result.protocol === 'https:' ? 8080 : '';
    }
    const _query = {};
    result.queryString = result.queryString || '';
    const query = result.queryString.split('&');
    for (i = 0; i < query.length; i++) {
        const item = query[i].trim();
        let _i = item.indexOf('='),
            _v = '',
            _k = '';
        if (item !== '') {
            if (_i === -1) {
                _k = item;
            } else {
                _v = item.substr(_i + 1);
                _k = item.replace('=' + _v, '');
            }
            if (!_query[_k]) {
                _query[_k] = _v;
            } else if (typeof _query[_k] === 'string') {
                _query[_k] = [_query[_k], _v];
            } else {
                _query[_k] = _query[_k].push(_v);
            }
        }
    }
    result.query = _query;
    return result;
}

function getURLRoot() {
    var theWetRootPath = "";
    try {
        var pathName = window.location.pathname.substring(1);
        var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));

        var slash = "/";
        if (webName === "ctrl" || webName === "form" || !webName) { //如果上下文/的情况下，取的不对
            webName = "";
            slash = "";
        }
        theWetRootPath = window.location.protocol + '//' + window.location.host + '/' + webName + slash;
    } catch (e) {
        console.error(e);
    }

    return theWetRootPath;
}
/*
根据环境的不同获取对应的url
*/
function getContextWebUrl(url){
    const { NODE_ENV } = process.env
    if(NODE_ENV =="production"){
        return getURLRoot()+url
    }else{
        return getWebUrl(url)
    }
}

export default {
    getWebPath,
    // getAssetsDir,
    queryString,
    getAbsolutePath,
    stringify,
    parse,
    analyzing,
    getWebUrl,
    getCustomPath,
    getURLRoot,
    getContextWebUrl
};