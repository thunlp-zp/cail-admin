import { login } from '@/api/login'
// import { Message } from 'element-ui'
import router, { resetRouter } from '@/router'

const state = {
  token: localStorage.getItem('token') ? localStorage.getItem('token') : '', // 认证凭证'
  userName: '',
  roles: [],
  introduce: ''
}
const mutations = {
  SET_TOKEN(state, val) {
    state.token = val
    localStorage.setItem('token', val)
  },
  DEL_TOKEN(state) {
    state.token = ''
    state.userName = ''
    state.roles = ''
    state.introduce = ''
    localStorage.removeItem('token')
  },
  SET_ROLES(state, payload) {
    state.roles = payload
  },
  SET_NAME(state, payload) {
    state.userName = payload
  },
  SET_INTRODUCE(state, payload) {
    state.introduce = payload
  }
}
const actions = {
  // user login
  _login({ commit }, formdatas) {
    return new Promise((resolve, reject) => {
      login(formdatas)
        .then(res => {
          if (res.code === 200) {
            if (res.success) {
              const { username, role, introduce } = res.data.user_info
              commit('SET_ROLES', [role])
              commit('SET_NAME', username)
              commit('SET_INTRODUCE', introduce)
              // Message.success(res.data.msg)
              commit('SET_TOKEN', res.data.token)
            } else {
              // Message.error(res.data.msg)ßßß
            }
            resolve(res)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  loginOut({ commit }) {
    commit('DEL_TOKEN')
    resetRouter()
    router.push({
      path: '/login',
      query: {
        redirect: '/'
      }
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
