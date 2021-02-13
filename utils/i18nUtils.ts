import { NuxtOptionsHead as MetaInfo } from '@nuxt/types/config/head'
import type { NuxtVueI18n } from 'nuxt-i18n'

export type LinkPropertyHref = MetaInfo

export const getLinksLanguageAlternative = (
  routeBaseName: string,
  locales?: Array<NuxtVueI18n.Locale | NuxtVueI18n.Options.LocaleObject>,
  defaultLocale?: string
) => {
  const links: LinkPropertyHref[] = []
  const getFullPathWihLocale = (locale: string) => {
    const pathLocale = locale === 'ja' ? '' : `/${locale}`
    if (routeBaseName === 'index') {
      return `https://stopcovid19.metro.tokyo.lg.jp${pathLocale}`
    } else {
      return `https://stopcovid19.metro.tokyo.lg.jp${pathLocale}/${routeBaseName}`
    }
  }

  if (locales) {
    for (const locale of locales) {
      if (typeof locale === 'string') continue
      if (locale.code === 'ja-basic') continue

      links.push({
        hid: `alternate-hreflang-${locale.iso}`,
        rel: 'alternate',
        href: getFullPathWihLocale(locale.code),
        hreflang: locale.iso,
      } as MetaInfo)
    }
  }
  if (defaultLocale) {
    links.push({
      hid: 'alternate-hreflang-x-default',
      rel: 'alternate',
      href: getFullPathWihLocale(defaultLocale),
      hreflang: 'x-default',
    } as MetaInfo)
  }

  return links
}
