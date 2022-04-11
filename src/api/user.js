import $axios from './index'

export function getAllUsers(params) {
  const url = '/admin_getAllUsers'
  return $axios.get(url, params)
}

