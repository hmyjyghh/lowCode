import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/page/mainPage'
import MyPage from '@/page/MyPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/mainpage',
      name: 'MainPage',
      component: MainPage
    },
    {
      path: '/',
      name: 'MyPage',
      component: MyPage
    }
  ]
})
