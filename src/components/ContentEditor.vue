<template>
  <div class="detail-wrapper">
    <template v-for="(item, index) in value" :key="index">
      <div class="content-item-header">
        <div class="header-left">
          <span>{{item.name}}</span>
          <el-icon @click="moveup(index)"><top /></el-icon>
          <el-icon @click="movedown(index)" class="bottom"><bottom /></el-icon>
        </div>
        <div class="right">
          <el-icon @click="deleteItem(index)"><close /></el-icon>
        </div>
      </div>
      <div v-if="item.type == 'picture'">
        <ImagePicker :num="1" :data="item.value" />
      </div>
      <div v-if="item.type == 'pictures'">
        <ImagePicker :num="9" :data="item.value" />
      </div>
      <div v-if="item.type == 'text'">
        <el-input v-model="item.value" type="textarea" placeholder="Enter content" />
      </div>
      <template v-if="item.type == 'video'">
        <VideoPicker :data="item.value" />
      </template>
      <div v-if="item.type == 'html'" class="html-wrapper">
        <RichTextEditor :value="item.value" />
      </div>
      <div style="width: 100%; height: 30px"></div>
    </template>
    <div class="detail-action">
      <div v-for="(item, index) in config" :key="index" class="action-wrapper" @click="addItem(item)">
        <el-icon><component :is="item.icon"></component></el-icon> 
        <span>{{item.name}}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRef, defineProps } from 'vue'
import ImagePicker from '@components/ImagePicker.vue'
import VideoPicker from '@components/VideoPicker.vue'
import RichTextEditor from '@components/RichTextEditor.vue'

const props = defineProps({
  supportType: {
    type: Array,
    default: ['picture', 'pictures', 'video', 'text', 'html']
  },
  data: {
    type: Array,
    default: []
  }
})

const allConfig = [
  {
    name: 'Large image',
    type: 'picture',
    icon: 'picture',
    defultValue: []
  },
  {
    name: 'Multiple images',
    type: 'pictures',
    icon: 'menu',
    defultValue: []
  },
  {
    name: 'Video',
    type: 'video',
    icon: 'video-camera',
    defultValue: {
      src: ''
    }
  },
  {
    name: 'Text',
    type: 'text',
    icon: 'edit',
    defultValue: ''
  },
  {
    name: 'Rich text',
    type: 'html',
    icon: 'document',
    defultValue: {
      text: ''
    }
  }
]
const config = []

allConfig.map(item => {
  if (props.supportType.indexOf(item.type) >= 0) {
    config.push(item)
  }
})

const value = toRef(props, 'data')

const addItem = (item: any) => {
  value.value.push({
    name: item.name,
    type: item.type,
    value: JSON.parse(JSON.stringify(item.defultValue))
  })
}

const deleteItem = (index: number) => {
  value.value.splice(index, 1)
}

const moveup = (index: number) => {
  if (index == 0) {
    return
  }
  const tempItems = value.value.splice(index, 1)
  value.value.splice(index - 1, 0, tempItems[0])
  console.log(value.value)
}

const movedown = (index: number) => {
  if (index >= value.value.length - 1) {
    return
  }
  const tempItems = value.value.splice(index, 1)
  value.value.splice(index + 1, 0, tempItems[0])
}

</script>

<style lang="scss">
  .detail-wrapper {
    width: 100%;
    padding: 8px 10px 70px;
    box-sizing: border-box;
    border: 1px solid #dadada;
    min-height: 100px;
    position: relative;

    .content-item-header {
      width: 100%;
      display: flex;
      margin-top: 5px;
      padding-bottom: 5px;
      justify-items: center;
      justify-content: space-between;

      .header-left {
        display: flex;
        justify-items: center;
      }

      span {
        font-size: 16px;
        line-height: 20px;
        color: #58595b;
      }

      i {
        font-size: 20px;
        margin-left: 15px;
        cursor: pointer;
      }

      .bottom {
        font-size: 19px;
      }
    }

    .html-wrapper {
      width: 100%;
      z-index: 0;
    }
  }

  .detail-action {
    position: absolute;
    bottom: 8px;
    left: 8px;
    display: flex;
    justify-items: center;
    font-size: 24px;

    .action-wrapper {
      margin-right: 30px;
      cursor: pointer;
    }

    span {
      font-size: 10px;
      margin: 0;
      display: block;
      margin-top: -6px;
    }
  }
</style>
