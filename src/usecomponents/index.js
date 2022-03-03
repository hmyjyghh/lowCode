import { DsfPage } from './page'
import {
  DsfRow12
} from './pages'

function install (Vue) {
  Vue.component(DsfPage.name, DsfPage)
  Vue.component(DsfRow12.name, DsfRow12)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  install,
  DsfPage,
  DsfRow12
}

export default {
  install
}
