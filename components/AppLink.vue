<template>
  <component :is="linkTag" v-bind="attr">
    <slot />
    <v-icon
      v-if="_showIcon"
      class="ExternalLinkIcon"
      :class="iconClass"
      :size="_iconSize"
      :aria-label="this.$t('別タブで開く')"
      role="img"
      :aria-hidden="false"
    >
      {{ iconPath }}
    </v-icon>
  </component>
</template>

<script lang="ts">
import { mdiOpenInNew } from '@mdi/js'

import { isExternal } from '@/utils/urls.ts'

type InternalAttr = {
  to: String
  class: String
}

type ExternalAttr = {
  href: String
  target: String
  rel: String
  class: String
}

const options = {
  props: {
    to: {
      type: String,
      required: true,
      default: '',
    },
    showIcon: {
      type: Boolean,
      default: null,
    },
    iconSize: {
      type: Number,
      default: 12,
    },
    iconPath: {
      type: String,
      default: mdiOpenInNew,
    },
    iconClass: {
      type: String,
      default: '',
    },
  },
  computed: {
    isExternal(): boolean {
      return isExternal(this.$props.to)
    },
    linkTag(): string {
      return this.$props.isExternal ? 'a' : 'nuxt-link'
    },
    attr(): ExternalAttr | InternalAttr {
      if (this.$props.isExternal) {
        return {
          href: this.$props.to,
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'ExternalLink',
        }
      } else {
        return {
          to: this.$props.to,
          class: 'Link',
        }
      }
    },
    _showIcon(): boolean {
      // 指定がない場合、外部なら表示、内部なら表示しない
      return this.$props.showIcon ?? this.$props.isExternal
    },
    _iconSize(): string {
      return `${this.$props.iconSize / 10}rem`
    },
  },
}

export default options
</script>

<style lang="scss" scoped>
.ExternalLink {
  text-decoration: none;
}
</style>
