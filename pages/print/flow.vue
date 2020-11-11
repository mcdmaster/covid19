<template>
  <flow />
</template>

<script>
import Flow from '@/pages/flow.vue'

const options = {
  components: {
    Flow,
  },
  metaInfo: {
    head() {
      return {
        layout: 'print',
        title: this.$t('新型コロナウイルス感染症にかかる相談窓口について'),
        link: [
          ...this.getLinksLanguageAlternative(
            'print/flow',
            this.$i18n.locales,
            this.$i18n.defaultLocale
          ),
        ],
      }
    },
  },
}

export default options
</script>
