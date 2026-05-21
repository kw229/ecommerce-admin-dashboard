<template>
  <div class="html-item-content" v-html="value.text">
  </div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps({
  value: {
    default: {
      text: ''
    }
  }
})
</script>
<style lang="scss">
.html-item-content {
  p {
    margin: 5px 0;
    text-align: left;
  }
}
</style>
