<template>
  <h4>Single image navigation</h4>
  <div class="carouse-form-wapper">
    <el-space>
      <div class="image-hoder">
        <el-button class="select-file-button" type="text" @click="selectFile">Select image</el-button>
        <i class="image" :style="{ backgroundImage: `url(${item.imageUrl})` }"></i>
      </div>
      <div>
        <el-input v-model="item.jumpUrl" placeholder="Enter link URL" />
      </div>
    </el-space>
    <el-divider class="devider"></el-divider>
  </div>
</template>

<script setup lang="ts">
import { defineProps, toRef } from 'vue'
import { useStore } from 'vuex'

const prop = defineProps({
  value: {
    type: Object,
    default: {
      imageUrl: '',
      jumpUrl: ''
    }
  }
})

const item = toRef(prop, 'value')

const store = useStore()
const selectFile = () => {
  store.commit('selectFile', (files: any) => {
    item.value.imageUrl = files[0].url
  })
}

</script>
<style lang="scss">
.carouse-form-wapper {
  text-align: left;

  .image-hoder {
    width: 100px;
    height: 100px;
    border: 2px dashed #efefef;
    position: relative;
  }
  
  .image {
    display: block;
    width: 100%;
    height: auto;
    background-size: contain;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    padding-bottom: 100%;
    border-radius: 3px;
  }

  .select-file-button {
    position: absolute;
    top: 35px;
    left: 20px;
  }

  .devider {
    margin: 10px 0;
  }
}
</style>
