import { asyncRoutes, currencyRoutes } from '@/router'

const state = {
  routes: [],
  addRoutes: []
}
const mutations = {
  SET_ROUTES(state, payload) {
    state.routes = [...currencyRoutes, ...payload]
    state.addRoutes = payload
  }
}
// 遍历asyncRoutes动态路由
function forSearchArr(route) {
  let arrNew = []
  for (let item of route) {
    let itemNew = { ...item } //解决浅拷贝共享同一内存地址
    // if (roles.includes(itemNew.name)) {
    if (itemNew.children) {
      itemNew.children = forSearchArr(itemNew.children)
    }
    arrNew.push(itemNew)
    // }
  }
  return arrNew
}
const actions = {
  getAsyncRoutes({ commit, rootGetters }) {
    return new Promise(resolve => {
      let routes = []
      if (rootGetters.userName === '18221917097') {
        routes = asyncRoutes || ''
      } else {
        routes = forSearchArr(asyncRoutes)
      }
      commit('SET_ROUTES', routes)
      resolve(routes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
