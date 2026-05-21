<template>
  <img class="image-one-card" :src="value.imageUrl" />
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps({
  value: {
    default: {}
  }
})
</script>

<style lang="scss" scoped>

.image-one-card {
  min-height: 50px;
  width: 100%;
  height: auto;
}
</style>