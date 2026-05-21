<template>
  <div class="palceholder-wrapper" :style="{ height: `${value.height}px`, background: value.color }">
    Spacer
  </div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps({
  value: {
    default: {
      height: 10,
      color: '#fff'
    }
  }
})
</script>
<style lang="scss">
.palceholder-wrapper {
  font-size: 10px;
  font-weight: 600;
  color: #999;
}
</style>
