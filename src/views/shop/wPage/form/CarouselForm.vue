<template>
  <h4>Carousel</h4>
  <div class="form-tips">
    * Recommended image size: 320x80
  </div>
  <div class="carouse-form-wapper"  v-for="(item, index) in items" :key="index">
    <el-space>
      <div class="image-hoder">
        <el-button class="select-file-button" type="text" @click="selectFile(index)">Select image</el-button>
        <i class="image" :style="{ backgroundImage: `url(${item.imageUrl})` }"></i>
      </div>
      <el-input v-model="item.jumpUrl" placeholder="Enter link URL" />
      <el-button circle size="small" :icon="ArrowUp" @click="up(index)"></el-button>
      <el-button circle size="small" :icon="ArrowDown" @click="down(index)"></el-button>
      <el-button circle size="small" :icon="Delete" @click="deleteItem(index)"></el-button>
    </el-space>
    <el-divider class="devider"></el-divider>
  </div>
  <el-button style="width: 100%" :icon="Plus" @click="addItem">Add</el-button>
</template>
<script setup lang="ts">
import { defineProps, toRef } from 'vue'
import { useStore } from 'vuex'
import { Plus, ArrowUp, ArrowDown, Delete } from '@element-plus/icons-vue'

const prop = defineProps({
  value: {
    default: [{
      imageUrl: '',
      jumpUrl: ''
    }]
  }
})

const items = toRef(prop, 'value')

const store = useStore()
const selectFile = (index: number) => {
  store.commit('selectFile', (files: any) => {
    items.value[index].imageUrl = files[0].url
  })
}

const addItem = () => {
  items.value.push({
    imageUrl: '',
    jumpUrl: ''
  })
}

const up = (index: number) => {
  if (index == 0) {
    return
  }
  const tempItems = items.value.splice(index, 1)
  items.value.splice(index - 1, 0, tempItems[0])
}

const down = (index: number) => {
  if (index == items.value.length - 1) {
    return
  }

  const tempItems = items.value.splice(index, 1)
  items.value.splice(index + 1, 0, tempItems[0])
}

const deleteItem = (index: number) => {
  items.value.splice(index, 1)
}

</script>
<style lang="scss">
.form-tips {
  font-size: 10px;
  text-align: left;
  margin-bottom: 10px;
  color: var(--el-color-danger);
}

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
