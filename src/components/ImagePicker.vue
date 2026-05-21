<template>
  <el-space>
    <div class="image-wrapper" v-for="(image, index) in value" :key="image">
      <i class="image" :style="{backgroundImage: `url(${image})`}" />
      <div v-if="!props.disabled" @click="deleteImage(index)" class="delete-icon"></div>
      <div class="preview-wrapper" @click="previewImage(index)">Preview</div>
    </div>
    <div v-if="!props.disabled" class="upload-button-wrapper" @click="addImage">+ Add image</div>
  </el-space>
  <PreviewImage ref="previewImageRef" />
</template>
<script setup lang="ts">
import { defineProps, toRef, defineEmits, ref } from 'vue'
import { useStore } from 'vuex'
import PreviewImage from './PreviewImage.vue'

const previewImageRef = ref(null)

const props = defineProps({
  num: {
    type: Number,
    default: 1,
  },
  data: {
    type: Array,
    default: []
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

// const value = ref<Array<string>>(props.value)
const value = toRef(props, 'data')
const store = useStore()
const emit = defineEmits(['input'])

const deleteImage = (index: number) => {
  value.value.splice(index, 1)
}

const addImage = () => {
  store.commit('selectFile', (files: any[]) => {
    files.map(file => {
      if (value.value.length >= props.num) {
        value.value.pop()
      }
      value.value.push(file.url)
    })
  })
}

const previewImage = (index: number) => {
  previewImageRef.value.showImage(value.value, index)
}

</script>

<style lang="scss">
.image-wrapper {
    width: 94px;
    height: 94px;
    position: relative;
    :hover~ .preview-wrapper {
      opacity: 1;
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
    border: 2px solid transparent;
  }

  .delete-icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 18px;
    height: 18px;
    cursor: pointer;
    box-sizing: border-box;
    border-radius: 0px 3px 0px 12px;
    background-color: rgba(0, 0, 0, 0.4);
  }
  .delete-icon::before {
      top: calc(50% - 1px);
      left: calc(50% + 1px);
      width: 10px;
      height: 2px;
      content: '';
      display: inline-block;
      background-color: #fff;
      border-radius: 1px;
      position: absolute;
      transform: translate3d(-50%, -50%, 0) rotate(45deg)
    }

    .delete-icon::after {
      top: calc(50% - 1px);
      left: calc(50% + 1px);
      width: 10px;
      height: 2px;
      content: '';
      position: absolute;
      display: inline-block;
      background-color: #fff;
      border-radius: 1px;
      transform: translate3d(-50%, -50%, 0) rotate(-45deg)
    }
  }
  .upload-button-wrapper {
    width: 94px;
    height: 94px;
    border: 1px dashed #d9d9d9;
    border-radius: 3px;
    cursor: pointer;
    display: flex;
    font-size: 12px;
    justify-content: center;
    line-height: 94px;
  }

  .preview-wrapper {
    position: absolute;
    border-radius: 0px 0px 3px 3px;
    color: #fff;
    width: 100%;
    bottom: 0;
    left: 0;
    background-color: rgba(0,0,0,0.6);
    cursor: pointer;
    height: 24px;
    opacity: 0;
    font-size: 12px;
    line-height: 24px;
    text-align: center;
  }
  .preview-wrapper:hover {
    opacity: 1;
    background-color: rgba(0,0,0,1);
  }
</style>
