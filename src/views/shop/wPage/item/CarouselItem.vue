<template>
  <el-carousel height="80px" :interval="5000" arrow="never">
    <el-carousel-item style="background-color: #99a9bf;" v-for="item in props.value" :key="item">
      <img class="carousel-image" :src="item.imageUrl" />
    </el-carousel-item>
  </el-carousel>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps({
  value: {
    default: [{}]
  }
})
</script>
<style scoped>
.carousel-image {
  max-width: 100%;
  height: auto;
}
</style>