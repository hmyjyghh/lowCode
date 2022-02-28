import Vue from 'vue'
import Vuex from 'vuex'
import props from './props'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    components: [] // 预览视图的组件树
  },
  modules: {
    props
  }
})

export default store
