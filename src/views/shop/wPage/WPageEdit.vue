<template>
<div class="w-page-edit">
  <el-scrollbar class="srcoll-wrapper">
    <div class="item-select">
      <el-space wrap>
        <el-button v-for="(item, index) in itemMaps" :key="index" @click="addItem(item)">{{item.name}}</el-button>
      </el-space>
    </div>
  </el-scrollbar>
  <el-scrollbar class="srcoll-wrapper">
  <div class="mobile-wapper">
    <div class="title-wapper">
      <el-input placeholder="Enter title" class="title-input" v-model="title" />
    </div>
    <div class="item-wrapper" 
      :class="selectedItemIndex == index ? 'selected-style' : ''" 
      v-for="(item, index) in data" :key="index"
      :draggable="true"
      @dragstart="dragstart(index)"
      @dragenter="dragenter(index)"
      @dragend="dragend(index)"
      @click="itemSelected(index)">
      <div v-if="enterIndex == index && currentIndex > index" class="drag-placeholder-begin"></div>
      <component v-if="item.type == 'search'" :is="SearchItem" />
      <component v-if="item.type == 'carousel'" :value="item.value" :is="CarouselItem" />
      <component v-if="item.type == 'imageCard'" :value="item.value" :is="ImageCardItem" />
      <component v-if="item.type == 'placeholder'" :value="item.value" :is="PlaceholderItem" />
      <component v-if="item.type == 'images'" :value="item.value" :is="ImagesItem" />
      <component v-if="item.type == 'image'" :value="item.value" :is="ImageItem" />
      <component v-if="item.type == 'html'" :value="item.value" :is="HtmlItem" />
      <div v-if="enterIndex == index && currentIndex < index" class="drag-placeholder-end"></div>
      <el-button class="delele-button" size="small" type="text" @click="deleteItem(index, $event)">Delete</el-button>
    </div>
  </div>
  </el-scrollbar>
  <el-scrollbar class="srcoll-wrapper">
    <div class="form-wapper">
      <template v-if="selectedItemIndex >= 0">
        <component v-if="data[selectedItemIndex]['type'] == 'carousel'" :value="data[selectedItemIndex].value" :is="CarouselForm"></component>
        <component v-if="data[selectedItemIndex]['type'] == 'imageCard'" :value="data[selectedItemIndex].value" :is="ImageCardForm"></component>
        <component v-if="data[selectedItemIndex]['type'] == 'placeholder'" :value="data[selectedItemIndex].value" :is="PlaceholderForm"></component>
        <component v-if="data[selectedItemIndex]['type'] == 'images'" :value="data[selectedItemIndex].value" :is="ImagesForm"></component>
        <component v-if="data[selectedItemIndex]['type'] == 'image'" :value="data[selectedItemIndex].value" :is="ImageForm"></component>
        <component v-if="data[selectedItemIndex]['type'] == 'html'" :value="data[selectedItemIndex].value" :is="HtmlForm"></component>
      </template>
    </div>
  </el-scrollbar>
  <div class="footer-wrapper">
    <el-space wrap>
      <el-button type="primary" @click="sumbit">Save</el-button>
      <el-button>Cancel</el-button>
    </el-space>
  </div>
</div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SearchItem from './item/SearchItem.vue'
import CarouselItem from './item/CarouselItem.vue'
import ImageCardItem from './item/ImageCardItem.vue'
import PlaceholderItem from './item/PlaceholderItem.vue'
import ImagesItem from './item/ImagesItem.vue'
import ImageItem from './item/ImageItem.vue'
import HtmlItem from './item/HtmlItem.vue'
import CarouselForm from './form/CarouselForm.vue'
import ImageCardForm from './form/ImageCardForm.vue'
import PlaceholderForm from './form/PlaceholderForm.vue'
import ImagesForm from './form/ImagesForm.vue'
import ImageForm from './form/ImageForm.vue'
import HtmlForm from './form/HtmlForm.vue'
import httpUtils from '@/api/httpUtils'
import { ElMessage } from 'element-plus'

const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const data = ref<any[]>([])
const selectedItemIndex = ref(-1)
const title = ref('')

const getWPage = () => {
  httpUtils.getWPage(id)
    .then(res => {
      title.value = res.data.title
      data.value = res.data.content
    })
}
if (id > 0) {
  getWPage()
}

const itemMaps = {
  search: {
    name: 'Product search',
    type: 'search',
    defaultValue: ''
  },
  carousel: {
    name: 'Carousel',
    type: 'carousel',
    defaultValue: [{
      imageUrl: '',
      jumpUrl: ''
    }]
  },
  imageCard: {
    name: 'Image card navigation',
    type: 'imageCard',
    defaultValue: [{
      imageUrl: '',
      jumpUrl: '',
      title: ''
    }]
  },
  placeholder: {
    name: 'Spacer',
    type: 'placeholder',
    defaultValue: {
      color: '#fff',
      height: 10
    }
  },
  image: {
    name: 'Single image navigation',
    type: 'image',
    defaultValue: {
      imageUrl: '',
      jumpUrl: '',
    }
  },
  images: {
    name: 'Multi-image navigation',
    type: 'images',
    defaultValue: [{
      imageUrl: '',
      jumpUrl: '',
    }]
  },
  html: {
    name: 'Rich text',
    type: 'html',
    defaultValue: {
      text: 'Rich text content goes here.'
    }
  }
}

const addItem = (item: any) => {
  data.value.push({
    type: item.type,
    value: JSON.parse(JSON.stringify(item.defaultValue)),
  })
  selectedItemIndex.value = data.value.length - 1
}

const itemSelected = (index: number) => {
  selectedItemIndex.value = index
}

const deleteItem = (index: number, e: Event) => {
  data.value.splice(index, 1)
  e.preventDefault()
  e.stopPropagation()
}

const currentIndex = ref(-1)
const enterIndex = ref(-1)
const dragstart = (index: number) => {
  currentIndex.value = index
}

const dragenter = (index: number) => {
  enterIndex.value = index
}

const dragend = (index: number) => {
  if (currentIndex.value != enterIndex.value) {
    const tempItem = data.value.splice(currentIndex.value, 1)
    if (currentIndex.value > enterIndex.value) {
      data.value.splice(enterIndex.value, 0, tempItem[0])
    } else {
      data.value.splice(enterIndex.value + 1, 0, tempItem[0])
    }
  }
  currentIndex.value = -1
  enterIndex.value = -1
}

const sumbit = () => {
  const params = {
    id,
    title: title.value,
    data: data.value
  }
  httpUtils.submitWPage(params)
    .then(res => {
      ElMessage.success('Saved.')
      router.push('/main/wpage/list')
    })
}

</script>

<style lang="scss" scoped>
.content {
  padding: 0;
}
.w-page-edit {
  // background-color: #fff;
  margin: -16px -16px 0;
  border-radius: 1px;
  position: relative;
  height:  calc(100% - 16px);
  display: flex;
  justify-content: space-between;
  overflow: hidden;

  .srcoll-wrapper {
    background: #fff;
    height: 100%;
  }

  .mobile-wapper {
    width: 350px;
    min-height: 300px;

    .title-wapper {
      width: 100%;
      height: 60px;
      background: #ffffff;
      border-bottom: 1px solid #edf0f5;

      text-align: center;
      line-height: 80px;
      font-size: 20px;
      font-weight: 800;

      .title-input {
        width: 120px;
      }
    }

    .item-wrapper {
      border: 2px dashed transparent;
      position: relative;
    }

    .item-wrapper:hover {
      border: 2px dashed #ff000080;
    }

    .selected-style {
      border: 2px dashed #ff000080;
    }

    .delele-button {
      display: none;
      position: absolute;
      right: 10px;
      bottom: 0;
    }

    .item-wrapper:hover .delele-button {
      display: block;
    }
  }

  .drag-placeholder-begin, .drag-placeholder-end {
    height: 10px;
    background-color: cornflowerblue;
    width: 100%;
  }

  .item-select {
    width: 200px;
    text-align: left;
    margin-top: 10px;
  }

  .form-wapper {
    width: 350px;
    // min-height: 500px;
    // position: relative;
    // border-left: 2px dashed #4685fd;
    // position: absolute;
    // top: 0;
    // left: 400px;
    padding: 0 10px 20px;
    background-color: #fff;
    // bottom: 60px;
    // padding-bottom: 60px;

    // .arrow-item {
    //   display: block;
    //   position: absolute;
    //   width: 14px;
    //   height: 14px;
    //   left: -10px;
    //   top: 50px;
    //   background: #fff;
    //   transform:rotate(45deg);
    //   border-bottom: 2px solid #4685fd;
    //   border-left: 2px solid #4685fd;
    // }
  }

  .footer-wrapper {
    height: 48px;
    padding: 10px;
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    background: #fff;
    box-sizing: border-box;
    border-top: solid 1px var(--el-border-color-base);
  }
}

</style>
