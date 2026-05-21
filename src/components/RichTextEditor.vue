<template>
  <div class="rich-editor">
    <div class="rich-editor__toolbar">
      <el-button size="small" @click="insertTemplate('heading')">Heading</el-button>
      <el-button size="small" @click="insertTemplate('paragraph')">Paragraph</el-button>
      <el-button size="small" @click="insertImage">Image</el-button>
      <el-button size="small" @click="updloadVideo = true">Video</el-button>
    </div>
    <el-input
      v-model="item.text"
      type="textarea"
      :rows="8"
      placeholder="Write product copy or paste trusted HTML content"
    />
    <div v-if="item.text" class="rich-editor__preview" v-html="item.text"></div>
  </div>
  <el-dialog 
    v-model="updloadVideo" 
    title="Select video"
    width="70%" 
    custom-class="fileWrapper"
    center>
    <div>
      <div class="form-tips">For a better in-app experience, use a stable hosted video URL.</div>
      <div class="flex-class input-wrapper">
        <div class="title">Video URL:</div>
        <el-input v-model="uploadVideoSrc" placeholder="Paste video URL here"></el-input>
      </div>
      <div class="content">
        <video v-if="uploadVideoSrc" controls :src="uploadVideoSrc" />
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="selectDone"
          >Confirm</el-button>
        <el-button @click="selectCancel">Cancel</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { defineProps, toRef, ref } from 'vue'
import { useStore } from 'vuex'
const prop = defineProps({
  value: {
    default: {
      text: ''
    }
  }
})

const item = toRef(prop, 'value')
const store = useStore()
const updloadVideo = ref(false)
const uploadVideoSrc = ref('')

const selectDone = () => {
  appendHtml(`<video style="width:100%" controls src="${uploadVideoSrc.value}"></video>`)
  uploadVideoSrc.value = ""
  updloadVideo.value = false
}
const selectCancel = () => {
  uploadVideoSrc.value = ""
  updloadVideo.value = false
}

const appendHtml = (html: string) => {
  item.value.text = `${item.value.text || ''}${item.value.text ? '\n' : ''}${html}`
}

const insertTemplate = (type: string) => {
  if (type === 'heading') {
    appendHtml('<h3>Seasonal Collection Highlight</h3>')
    return
  }
  appendHtml('<p>Describe the product story, usage scenario, and customer benefit here.</p>')
}

const insertImage = () => {
  store.commit('selectFile', (files: any) => {
    if (files && files[0]) {
      appendHtml(`<img style="width:100%" src="${files[0].url}" alt="Content asset" />`)
    }
  })
}
</script>
<style lang="scss">
.rich-editor {
  width: 100%;

  &__toolbar {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 8px;
  }

  &__preview {
    margin-top: 10px;
    padding: 12px;
    min-height: 80px;
    border: 1px dashed #d7dbe0;
    background: #fafbfc;
    color: #344054;
    line-height: 1.6;

    img,
    video {
      max-width: 100%;
      display: block;
      margin: 8px 0;
    }
  }
}

.fileWrapper {
  .title {
    width: 80px;
    line-height: 30px;
  }

  .content {
    height: 300px;
    width: 100%;
    margin-top: 10px;
    background: #ddd;

    video {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
