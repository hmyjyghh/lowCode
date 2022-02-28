import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/page/mainPage'
import MyPage from '@/page/MyPage'
import GsPage from '@/page/GsPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GsPage',
      component: GsPage
    },
    {
      path: '/mainpage',
      name: 'MainPage',
      component: MainPage
    },
    {
      path: '/mypage',
      name: 'MyPage',
      component: MyPage
    }
  ]
})
