// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'

import './assets/designer/designer.scss';

import DsfDesignerProperties from './config/page/dsfDesignerProperties'
import DsfDesignerProperty from './config/page/dsfDesignerProperty'

import dsf from "./utils/index";

Vue.component(DsfDesignerProperties.name, DsfDesignerProperties);
Vue.component(DsfDesignerProperty.name, DsfDesignerProperty);

Vue.use(ElementUI)

Vue.prototype.$http = axios
Vue.prototype.dsf = dsf;

//为vue对象注入表达式执行
Vue.prototype.$eval = function (express, varible) {
  return dsf.express.eval.call(this, express, varible);
};

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
