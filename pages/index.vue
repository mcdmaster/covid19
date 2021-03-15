<template>
  <div>
    <site-top-upper />
    <lazy-cards-tab v-if="$vuetify.breakpoint.smAndUp || showCardsTab"  v-scroll.self="onScroll" />
  </div>
</template>

<script lang="ts">
import Vue from '@nuxt/types'

const options: Vue.NuxtConfig = {
  data() {
    return {
      showCardsTab: false,
    }
  },
  methods: {
    onScroll() {
      this.showCardsTab = true
    },
  },
}

export default options as Vue.NuxtAppOptions
</script>
