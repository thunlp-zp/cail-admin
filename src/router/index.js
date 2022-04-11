import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

import Layout from '@/layout'
// import NavTest from './modules/nav-test'
import { Message } from 'element-ui'
import getTitle from '@/utils/getTitle'

/**
 * 路由相关属性说明
 * hidden: 当设置hidden为true时，意思不在sideBars侧边栏中显示
 * mete{
 * title: xxx,  设置sideBars侧边栏名称
 * icon: xxx,  设置ideBars侧边栏图标
 * noCache: true  当设置为true时不缓存该路由页面
 * }
 */

/*通用routers*/
export const currencyRoutes = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error-page/404.vue'),
    hidden: true
  },
  {
    path: '/',
    name: 'Home',
    component: Layout,
    redirect: '/dashbord',
    hidden: false,
    children: [
      {
        path: 'dashbord',
        name: 'Dashbord',
        component: () => import('@/views/dashboard'),
        meta: { title: '首页', icon: 'el-icon-s-data', requiresAuth: true }
      }
    ]
  },
  {
    path: '/personal',
    name: 'Personal',
    component: Layout,
    redirect: '/personal/index',
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'Personal-index',
        component: () => import('@/views/personal'),
        meta: { title: '个人中心', requiresAuth: true }
      }
    ]
  },
  {
    path: '/users',
    name: 'Users',
    component: Layout,
    redirect: '/users/index',
    children: [
      {
        path: 'table',
        name: 'UserTable',
        component: () => import('@/views/user/index'),
        meta: {
          icon: 'el-icon-user-solid',
          title: '用户信息',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/table',
    name: 'Table',
    redirect: '/table/base-table',
    component: Layout,
    meta: {
      title: '赛道信息',
      icon: 'el-icon-table iconfont',
      requiresAuth: true
    },
    children: [
      {
        path: 'race-id-0',
        name: 'ReadingComprehension',
        component: () => import('views/table/reading-comprehension'),
        meta: { title: '阅读理解', requiresAuth: true }
      },
      {
        path: 'race-id-1',
        name: 'SimilarCases',
        component: () => import('@/views/table/similar-cases'),
        meta: { title: '类案检索', requiresAuth: true }
      },
      {
        path: 'race-id-2',
        name: 'JudicialExamination',
        component: () => import('@/views/table/judicial-examination'),
        meta: { title: '司法考试', requiresAuth: true }
      },
      {
        path: 'race-id-3',
        name: 'JudicialSummary',
        component: () => import('@/views/table/judicial-summary'),
        meta: { title: '司法摘要', requiresAuth: true }
      },
      {
        path: 'race-id-4',
        name: 'ArgumentComprehension',
        component: () => import('@/views/table/debate-understanding'),
        meta: { title: '论辩理解', requiresAuth: true }
      },
      {
        path: 'race-id-6',
        name: 'CaseLabelPrediction',
        component: () => import('@/views/table/case-label-prediction'),
        meta: { title: '案情标签预测', requiresAuth: true }
      },
      {
        path: 'race-id-7',
        name: 'InformationExtraction',
        component: () => import('@/views/table/information-extraction'),
        meta: { title: '信息抽取', requiresAuth: true }
      }
    ]
  }
]
/*动态添加routers*/
export const asyncRoutes = [
  {
    path: '/permission',
    name: 'Permission',
    component: Layout,
    redirect: '/permission/page-use',
    meta: {
      title: '权限许可',
      icon: 'el-icon-lock',
      requiresAuth: true
    },
    children: [
      {
        path: 'page-user',
        name: 'PageUser',
        component: () => import('@/views/permission/page-user'),
        meta: {
          title: '用户页面',
          icon: 'el-icon-user',
          requiresAuth: true
        }
      },
      {
        path: 'page-admin',
        name: 'PageAdmin',
        component: () => import('@/views/permission/page-admin'),
        meta: {
          title: '管理员页面',
          icon: 'el-icon-user-solid',
          requiresAuth: true
        }
      },
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('@/views/permission/roles'),
        meta: {
          title: '权限设置',
          icon: 'el-icon-s-tools',
          requiresAuth: true
        }
      }
    ]
  }
]
const creatRouter = () => {
  return new Router({
    // mode: "history",
    routes: currencyRoutes,
    scrollBehavior() {
      return { x: 0, y: 0 }
    }
  })
}

const router = creatRouter()

// 解决addRoute不能删除动态路由问题
export function resetRouter() {
  const reset = creatRouter()
  router.matcher = reset.matcher
}

// // 导航守卫
// router.beforeEach(async (to, from, next) => {
//   document.title = getTitle(to.meta.title)
//   console.log(localStorage.token)
//   if (localStorage.token) {
//     if (to.name == 'Login') {
//       next()
//     } else {
//       try {
//         // const { roles } = await store.dispatch('user/_getInfo')
//         // const roles = store.getters.roles
//         const addRoutes = await store.dispatch('permission/getAsyncRoutes')
//         router.addRoutes(addRoutes)

//         // hack method to ensure that addRoutes is complete
//         // set the replace: true, so the navigation will not leave a history record
//         next({ ...to, replace: true })
//         // next()
//       } catch (error) {
//         Message.error(error)
//       }
//     }
//   } else {
//     next({
//       path: '/login',
//       query: {
//         redirect: to.fullPath
//       }
//     })
//   }
// })

// 路由拦截
router.beforeEach(async (to, from, next) => {
  document.title = getTitle(to.meta.title)
  try {
    const addRoutes = await store.dispatch('permission/getAsyncRoutes')
    router.addRoutes(addRoutes)
    // next({ ...to, replace: true })
    next()
  } catch (error) {
    Message.error(error)
  }
})
export default router
