<template>
  <div v-if="video.src" class="video-wrapper">
    <video :src="video.src" />
    <div @click="clearVideo" class="delete-icon"></div>
    <div class="preview-wrapper" @click="playVideo(video.src)">Play</div>
  </div>
  <el-upload
    v-else
    :thumbnail-mode="false"
    class="video-uploader"
    :action="uploadFile"
    accept="video/*"
    :disabled="uploadingVideo"
    :show-file-list="false"
    :on-success="uploadVideoSuccess"
    :before-upload="() => uploadingVideo = true"
    :headers="headers"
  >
    <el-icon v-if="uploadingVideo" class="video-uploader-icon"><loading /></el-icon>
    <el-icon v-else class="video-uploader-icon"><plus /></el-icon>
  </el-upload>
  <div class="video-link">
    <span>Video URL:</span>
    <el-input placeholder="Enter video URL" v-model="video.src" />
  </div>
</template>
<script setup lang="ts">
import { ref, toRef, defineProps } from 'vue'
import baseConfig from '@config/base.ts'

const props = defineProps({
  data: {
    type: Object,
    default: {
      src: ''
    }
  }
})

const headers = {
  token: localStorage.getItem('token') ?? ''
}

const video = toRef(props, 'data')

const uploadFile = baseConfig().baseUrl + '/file/video'

const uploadingVideo = ref(false)
const playVideo = (url: string) => {
  window.open(url)
}

const uploadVideoSuccess = (res: any) => {
  video.value.src = res.data.url
  uploadingVideo.value = false
}

const clearVideo = () => {
  video.value.src = ''
}

</script>
<style lang="scss">
.video-wrapper {
  width: 178px;
  min-height: 120px;
  overflow: hidden;
  position: relative;

  video {
    width: 100%;
    height: auto;
  }
  :hover~ .preview-wrapper {
    opacity: 1;
  }
}

.video-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.video-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 120px;
  text-align: center;
}

.video-link {
  margin-left: 20px;
  width: 300px;
}
</style>
