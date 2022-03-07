// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'

// import $ from 'jquery'

import dsf from './utils'

// 此处引入要使用的组件
import PCBhc from './usecomponents'

import './assets/designer/designer.scss'

import DsfDesignerProperties from './config/page/dsfDesignerProperties'
import DsfDesignerProperty from './config/page/dsfDesignerProperty'
import DsfLayoutTree from './config/page/layoutTree'

// //加载jquery-ui的拖拽功能
import(/* webpackChunkName: "jquery-ui" */ 'jqueryui/jquery-ui.min.css')
let jqui = import(/* webpackChunkName: "jquery-ui" */ 'jqueryui/jquery-ui.min.js')

Vue.component(DsfDesignerProperties.name, DsfDesignerProperties)
Vue.component(DsfDesignerProperty.name, DsfDesignerProperty)
Vue.component(DsfLayoutTree.name, DsfLayoutTree)

Vue.use(ElementUI)
Vue.use(PCBhc)

Vue.prototype.$http = axios
Vue.prototype.dsf = dsf
// Vue.prototype.$jq = $

// 获取实际展示的字体大小
Vue.prototype.getFontSizeNum = function (settingFontSize, globalFontSize, ishover) {
  let fontsize = 14
  if (settingFontSize == 0) {
    switch (globalFontSize) {
      case 'small':
        fontsize = 14
        break
      case 'medium':
        fontsize = 16
        break
      case 'large':
        fontsize = 18
        break
    }
    // 如果是使用用户选择的字体且是悬浮状态下的字体增加2，否则就还是使用组件属性设置的字体
    if (ishover) {
      fontsize = fontsize + 2
    }
  } else {
    fontsize = settingFontSize
  }
  return fontsize
}

// 获取页面地址参数
Vue.prototype.getUrlParam = function (paramName) {
  var url = window.location.href
  var oRegex = new RegExp('[\?&]' + paramName + '=([^&]+)', 'i')
  var oMatch = oRegex.exec(url)
  if (oMatch && oMatch.length > 1) {
    return decodeURI(oMatch[1])
  } else {
    return ''
  }
}

// 加载js
Vue.prototype.loadOuterJs = function (src, reload, fun) {
  var scriptsList = $("script[src='" + src + "']")
  if (scriptsList.length > 0) return
  var head = document.getElementsByTagName('head')[0] || document.head || document.documentElement
  if (reload) {
    var scriptList = head.getElementsByTagName('script')
    for (let index = 0; index < scriptList.length; index++) {
      const element = scriptList[index]
      if (element.getAttribute('objectID') == 'dreamweb-' + src) {
        element.remove()
      }
    }
  }
  var script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('charset', 'UTF-8')
  script.setAttribute('src', src)
  script.setAttribute('objectID', 'dreamweb-' + src)

  if (typeof fun === 'function') {
    if (window.attachEvent) {
      script.onreadystatechange = function () {
        var r = script.readyState
        if (r === 'loaded' || r === 'complete') {
          script.onreadystatechange = null
          fun()
        }
      }
    } else {
      script.onload = fun
    }
  }
  head.appendChild(script)
}

// 为vue对象注入表达式执行
Vue.prototype.$eval = function (express, varible) {
  return dsf.express.eval.call(this, express, varible)
}

jqui.then(() => {
  Vue.config.productionTip = false
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
})

// Vue.config.productionTip = false

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   store,
//   components: { App },
//   template: '<App/>'
// })
