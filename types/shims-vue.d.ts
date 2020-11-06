import { NuxtI18nSeo } from 'nuxt-i18n/types/nuxt-i18n'
import Vue from 'nuxt-property-decorator'
declare module 'vue/types/vue' {
  interface VueI18n extends Vue {
    $nuxtI18nSeo(): NuxtI18nSeo
    $style: { [key: string]: string }
  }
}
export default Vue
