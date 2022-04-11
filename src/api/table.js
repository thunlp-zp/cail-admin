import $axios from './index'

export function getPageTab1(params) {
  const url = '/getPageData1'
  return $axios.get(url, params)
}
export function getPageTab2() {
  const url = '/getPageData2'
  return $axios.get(url)
}

/**
 * 
 * @param {race_id: 赛道 id}
 * @returns 返回参赛队伍的列表
 * @author z.z.p
 * @email zhoupeng@mail.tsinghua.edu.cn
 */
export function getGroupByRaceID(param) {
  const url = '/admin_getGroup'
  return $axios.get(url, param)
}

/**
 * 
 * @param {race_id: 赛道 id}
 * @returns 返回模型的执行结果
 * @author z.z.p
 * @email zhoupeng@mail.tsinghua.edu.cn
 */
export function getModelExeResult(param) {
  const url = '/admin_getModelExeResult'
  return $axios.get(url, param)
}