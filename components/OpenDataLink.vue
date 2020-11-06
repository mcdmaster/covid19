<template>
  <app-link :to="url">
    {{ $t('オープンデータを入手') }}
  </app-link>
</template>

<script lang="ts">
import Vue from 'vue'

import AppLink from '@/components/AppLink.vue'

const options = {
  components: { AppLink },
  props: {
    url: {
      type: String,
      default: '',
    },
  },
}

export default options
</script>

<style lang="scss">
.OpenDataLink {
  text-decoration: none;
  .ExternalLinkIcon {
    vertical-align: text-bottom;
  }
}
</style>
