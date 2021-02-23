const EventBus = {
  $on (ev: any, cb: () => {}) {},
  $off (ev: any) {},
  $emit (ev: any) {},
  created() {
    this.$on = this.$nuxt.$on()
    this.$off = this.$nuxt.$off()
    this.$emit = this.$nuxt.$emit()
  },
}

export default EventBus
export const TOGGLE_EVENT = 'TOGGLE_TAB'
