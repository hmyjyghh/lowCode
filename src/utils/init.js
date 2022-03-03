/* eslint-disable no-unused-vars */
import dynamicComponent from '_platform/dsf/output/dynamicComponent'

let designPages = {}

function initRouter (router, clientString) {
  // 检查动态组件（通过设计器配置的页面），并动态创建路由

  const VueRouterPush = router.push
  router.push = function push (to) {
    return VueRouterPush.call(this, to).catch(err => {
      dsf.warn(err)
    })
  }
  const VueRouterReplace = router.replace
  router.replace = function push (to) {
    return VueRouterReplace.call(this, to).catch(err => {
      dsf.warn(err)
    })
  }

  if (clientString) {
    router.beforeEach((to, from, next) => {
      if (to.matched.length <= 0 && to.path.startsWith('/' + clientString + '/') && !designPages[to.path]) {
        /**
         * 动态路由
         */
        let rmCode = to.path.substr(4).replace(/\//g, '.')
        let rmCodeArr = rmCode.split('.')
        let nameSpace = rmCodeArr.slice(0, rmCodeArr.length - 1).join('.')
        let pageName = rmCodeArr[rmCodeArr.length - 1]
        dynamicComponent(rmCode, clientString).then((result) => {
          router.addRoutes([{
            path: to.path,
            name: result.name,
            component: result,
            meta: {
              title: dsf.express.replace(result.pageTitle, dsf.config)
            },
            props (router) {
              return {
                'nameSpace': nameSpace,
                'pageName': pageName,
                'queryString': router.query
              }
            }
          }])
          designPages[to.path] = true
          next({ path: to.fullPath })
        }).catch(() => {
          next()
        })
      } else {
        next()
      }
    })
  }

  // 将路由参数外放到window全局对象，使dsf.express表达式获取url参数功能可用
  router.afterEach((to, from) => {
    window.__dsfUrlInfo__ = to
  })
}

export default {
  initRouter
}
