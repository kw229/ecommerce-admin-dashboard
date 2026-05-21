<template>
  <div class="big-image-wrapper" :style="{display: bigImageVisible ? 'flex': 'none'}">
    <div class="backgroup"></div>
    <el-icon class="left" color="#fff" size="30" @click="currenFileIndex = currenFileIndex >= 1 ? currenFileIndex - 1 : currenFileIndex"><arrow-left /></el-icon>
    <el-icon class="right" color="#fff" size="30" @click="currenFileIndex = currenFileIndex < images.length -1 ? currenFileIndex + 1 : currenFileIndex"><arrow-right /></el-icon>
    <el-icon class="close" color="#fff" size="30" @click="bigImageVisible = false"><close /></el-icon>
    <img v-if="images[currenFileIndex]" :src="images[currenFileIndex]" alt="">
  </div>
</template>
<script setup lang="ts">
import { ref, defineExpose } from 'vue'

const bigImageVisible = ref(false)
const currenFileIndex = ref(0)

const images = ref<Array<string>>([])
const showImage = (showImages: Array<string>, index: number) => {
  bigImageVisible.value = true
  images.value = showImages
  currenFileIndex.value = index
}

defineExpose({
  showImage
})

</script>

<style lang="scss">
.big-image-wrapper {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 3000;

  img {
    position: relative;
    min-width: 50px;
    min-height: 50px;
    max-width: 90%;
    max-height: 90%;
    margin: auto;
    background-color: #fff;
  }

  .backgroup {
    width: 100%;
    height: 100%;
    position: absolute;
    background: #000;
    opacity: 0.3;
  }

  .left {
    position: absolute;
    top: 50%;
    left: 50px;
    cursor: pointer;
    user-select: none;
  }

  .right {
    position: absolute;
    top: 50%;
    right: 50px;
    cursor: pointer;
    user-select: none;
  }

  .close {
    position: absolute;
    top: 50px;
    right: 50px;
    cursor: pointer;
    user-select: none;
  }
}
</style>