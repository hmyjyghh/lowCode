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
