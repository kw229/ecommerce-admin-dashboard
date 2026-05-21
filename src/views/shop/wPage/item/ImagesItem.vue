<template>
  <div class="image-card-wrapper">
    <div v-for="(item, index) in props.value" :key="index" :style="{width: `${100/props.value.length}%` }">
      <img class="card-image" :src="item.imageUrl" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps({
  value: {
    default: [{}]
  }
})
</script>
<style lang="scss" scoped>

.image-card-wrapper {
  min-height: 50px;
  display: flex;

  .card-image {
    max-width: 100%;
    height: auto;
  }
}
</style>