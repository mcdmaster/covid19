import { Vue, On, Off } from 'nuxt-property-decorator'
const options = Vue
export default options
export const $on = function (event?: any, method?: any) {
  return On(`${event}`), [`${method}`]
}
export const $off = function (event?: any) {
  return Off(`${event}`)
}
export const TOGGLE_EVENT = 'TOGGLE_TAB'