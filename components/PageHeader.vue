<template>
  <div class="header">
    <h2 class="pageTitle">
      <v-icon v-if="iconPath" size="4rem" class="mr-2">
        {{ iconPath }}
      </v-icon>
      <slot />
    </h2>
  </div>
</template>

<script lang="ts">
const options = {
  props: {
    iconPath: {
      type: String,
      required: false,
      default: '',
    },
  },
}

export default options
</script>

<style lang="scss" scoped>
@import url('@/assets/_variables.scss');
.header {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
}

.pageTitle {
  @include font-size(30);

  color: $gray-2;
  display: flex;
  align-items: center;
  line-height: 1.35;
  font-weight: normal;
  margin: 0 0.5em 0 0;

  @include lessThan($small) {
    @include font-size(20);
  }
}
</style>
