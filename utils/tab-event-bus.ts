import { Emit, Off, On, Vue } from 'nuxt-property-decorator'
const options = Vue
export default options
export const $on = function (event?: any, method?: any) {
  On(`${event}`)
  Emit(`${method}`)
}
export const $off = function (event?: any) {
  return Off(`${event}`)
}
export const TOGGLE_EVENT = 'TOGGLE_TAB'
