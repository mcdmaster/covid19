import i18n from './nuxt-i18n.config'
const environment = process.env.NODE_ENV || 'development'

const options = {
  // Since nuxt@2.14.5, there have been significant changes.
  // We dealt with typical two (2) out of them:
  // 1) The "mode:" directive got deprecated (seen right below);
  // 2) Autoprefixer has been included so that we can lessen upgrade burden.
  // mode: 'universal',
  target: 'static',
  /*
   ** Headers of the page
   */
  metaInfo: {
    head() {
      return {
        htmlAttrs: {
          prefix: 'og: http://ogp.me/ns#',
        },
        meta: [
          { charset: 'utf-8' },
          { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          { hid: 'og:type', property: 'og:type', content: 'website' },
          {
            hid: 'og:url',
            property: 'og:url',
            content: 'https://stopcovid19.metro.tokyo.lg.jp',
          },
          {
            hid: 'twitter:card',
            name: 'twitter:card',
            content: 'summary_large_image',
          },
          {
            hid: 'twitter:site',
            name: 'twitter:site',
            content: '@tokyo_bousai',
          },
          {
            hid: 'twitter:creator',
            name: 'twitter:creator',
            content: '@tokyo_bousai',
          },
          {
            hid: 'fb:app_id',
            property: 'fb:app_id',
            content: '2879625188795443',
          },
          {
            hid: 'note:card',
            property: 'note:card',
            content: 'summary_large_image',
          },
        ],
        link: [
          { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
          {
            rel: 'apple-touch-icon',
            href: '/apple-touch-icon-precomposed.png',
          },
        ],
      }
    },
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/assets/global.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    {
      src: '@/plugins/vue-chart.ts',
      ssr: true,
    },
    {
      src: '@/plugins/axe',
      ssr: true,
    },
    {
      src: '@/plugins/vuetify.ts',
      ssr: true,
    },
    {
      src: '@/plugins/chartjs-adapter-dayjs.ts',
      ssr: true,
    },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/device',
    '@nuxtjs/google-analytics',
    '@nuxtjs/gtm',
    '@nuxtjs/pwa',
    '@nuxtjs/router',
    'nuxt-svg-loader',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/dotenv-module
    ['@nuxtjs/dotenv', { filename: `.env.${environment}` }],
    ['nuxt-i18n', i18n],
    ['vue-scrollto/nuxt', { duration: 1000, offset: -72 }],
  ],
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['@/assets/variables.scss'],
    treeShake: true,
    defaultAssets: false,
  },
  googleAnalytics: {
    id: process.env.GOOGLE_ANALYTICS_ID, // .env.production などに設定してください。
  },
  /*
   ** @nuxtjs/gtm config
   */
  gtm: {
    id: process.env.GTM_CONTAINER_ID,
    pageTracking: true,
    enabled: true,
  },
  /*
   * nuxt-i18n による自動リダイレクトを停止したためコメントアウト
   * @todo 「Cookieがあるときのみ、その言語にリダイレクトする」を実装する場合は復活させる
   * 実装しない場合は以下の記述を完全に削除する
   */
  /* optionalCookies: [
    {
      name: 'i18n_redirected',
      label: 'i18n Redirection Cookie',
      description:
        'For automatically switching UI languages in accordance with locale preferences in the web browser configuration.',
      cookies: ['i18n_redirected']
    }
  ], */
  build: {
    postcss: {
      preset: {
        autoprefixer: {
          // Built-in since nuxt@2.14.5
          grid: 'autoplace',
        },
      },
    },
    loaders: {
      file: {
        regExp: /\.svg$/,
        name: '[path][name].[ext]?inline',
      },
    },
    extend(config) {
      // default externals option is undefined
      config.externals = [{ moment: 'moment' }]
      config.node = { fs: 'empty' }
    },
    // https://ja.nuxtjs.org/api/configuration-build/#hardsource
    // hardSource: process.env.NODE_ENV === 'development'
  },
  'nuxt-purgecss': {
    mode: 'postcss',
    enabled: environment !== 'development' && process.client,
    '@fullhuman/postcss-purgecss': {
      content: [
        '@/pages/**/*.vue',
        '@/layouts/**/*.vue',
        '@/components/**/*.vue',
        'vuetify/dist/vuetify.js',
        'vue-spinner/src/ScaleLoader.vue',
      ],
      safelist: ['html', 'body', 'nuxt-progress', 'DataCard', /(col|row)/],
    },
  },
  manifest: {
    name: '東京都 新型コロナウイルス感染症対策サイト',
    theme_color: '#00a040',
    background_color: '#ffffff',
    display: 'standalone',
    Scope: '/',
    start_url: '/',
    splash_pages: null,
  },
  generate: {
    fallback: true,
    routes: [
      // './.nuxt/router.js',
      // './utils/router.ts',
      {
        locales: ['en', 'zh-cn', 'zh-tw', 'ko', 'ja-basic'],
        pages: [
          '/cards/details-of-confirmed-cases',
          '/cards/number-of-confirmed-cases',
          '/cards/number-of-confirmed-cases-by-municipalities',
          '/cards/attributes-of-confirmed-cases',
          '/cards/number-of-tested',
          '/cards/number-of-reports-to-covid19-telephone-advisory-center',
          '/cards/predicted-number-of-toei-subway-passengers',
          '/cards/agency',
          '/cards/positive-rate',
          '/cards/positive-number-by-diagnosed-date',
          '/cards/monitoring-number-of-confirmed-cases',
          '/cards/untracked-rate',
          '/cards/positive-status-severe-case',
          '/cards/number-of-hospitalized',
          '/cards/monitoring-number-of-reports-to-covid19-consultation-desk',
          '/cards/monitoring-status-overview',
          '/cards/number-of-reports-to-consultations-about-fever-in-7119',
          '/cards/number-of-tokyo-rules-applied',
          '/cards/monitoring-items-overview',
          '/cards/positive-number-by-developed-date',
        ],
        localizedPages() {
          const loc = this.locales
            .map((locale: any) =>
              this.pages.map((page: any) => `/${locale}${page}`)
            )
            .reduce((a: any, b: any) => [...a, ...b], [])
          return [...loc]
        },
      },
    ],
  },
  render: {
    compressor: {
      test: /\.(eot|woff2?|ttf)$/,
    },
  },
  // /*
  // ** hot read configuration for docker
  // */
  watchers: {
    webpack: {
      poll: true,
    },
  },
}

export default options
