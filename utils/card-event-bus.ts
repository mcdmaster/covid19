import { Off, On, Vue } from 'nuxt-property-decorator'
export const EventBus = Vue
export const $on = function (event?: any, method?: any) {
  On(`${event}`)
  return `${method}`
}
export const $off = function (event?: any) {
  return Off(`${event}`)
}
export const TOGGLE_EVENT = 'TOGGLE_TAB'
