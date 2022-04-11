import $axios from './index'

export function login(data) {
  const url = '/admin_login'
  return $axios.post(url, data)
}
// export function getInfo() {
//   const url = '/admin_getUserInfo'
//   return $axios.get(url)
// }
