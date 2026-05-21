<template>
  <div class="edit-source-wrapper">
    <h5>Product information</h5>
    <div class="good-info-wrapper">
      <div class="info-image-wrapper">
        <i class="image" :style="{ backgroundImage: `url(${goodInfo.image})` }" />
      </div>
      <div>
        <div class="good-title">{{goodInfo.name}}</div>
        <div class="price">${{utils.translatePrice(goodInfo.price)}}<span>${{utils.translatePrice(goodInfo.market_price)}}</span></div>
      </div>
    </div>
    <h5>Content assets</h5>
    <el-button class="add-source-button" icon="plus" type="primary" size="small" @click="addSource">Add content asset</el-button>
    <el-table
      border
      :data="source">
      <el-table-column label="Copy">
        <template #default="scope">
          <div v-html="scope.row.text.replace(/\n|\r\n/g, '<br>')"></div>
        </template>
      </el-table-column>
      <el-table-column label="Images">
        <template #default="scope">
          <div class="image-wrapper" v-for="(image, index) in scope.row.images" :key="image">
            <i class="image" :style="{backgroundImage: `url(${image})`}" />
            <div class="preview-wrapper" @click="previewImage(scope.row.images, index)">Preview</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Video">
        <template #default="scope">
          <div v-if="scope.row.video" class="video-wrapper">
            <video :src="scope.row.video" />
            <div class="preview-wrapper" @click="playVideo(scope.row.video)">Play</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Visible">
        <template #default="scope">
          <el-switch :model-value="scope.row.is_show" :active-value="1" :inactive-value="0" @change="showSource(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="Actions">
        <template #default="scope">
           <el-button
            type="text"
            size="small"
            @click="edit(scope.row)"
          >
            Edit
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="deleteItem(scope.row)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="isEditting" 
      title="Edit asset"
      width="70%" 
      center>
       <el-form
        label-width="140px">
        <el-form-item label="Copy">
          <el-input 
            maxlength="200" 
            show-word-limit
            type="textarea"
            v-model="text">
          </el-input>
        </el-form-item>
        <el-form-item label="Images">
          <div>
            <ImagePicker :num="50" :data="images" />
          </div>
        </el-form-item>
        <el-form-item label="Video">
          <VideoPicker :data="video" />
        </el-form-item>
       </el-form>
       <template #footer>
        <span>
          <el-button :loading="submitting" type="primary" @click="submitSource"
            >Confirm</el-button>
          <el-button @click="closeSource">Cancel</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <PreviewImage ref="previewImageRef" />
  <div class="footer-wrapper">
    <el-space wrap>
      <el-button type="primary" @click="done">Done</el-button>
    </el-space>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import utils from '@/utils'
import ImagePicker from '@components/ImagePicker.vue'
import VideoPicker from '@components/VideoPicker.vue'
import PreviewImage from '@components/PreviewImage.vue'
import httpUtils from '@/api/httpUtils'
import { ElMessage } from 'element-plus'

const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const previewImageRef = ref(null)

const goodInfo = ref({
  name: '',
  image: '',
  price: 0,
  market_price: 0
})

const source = ref([])

const isEditting = ref(false)

const submitting = ref(false)

const text = ref('')

const images = ref([])

let editSourceId = -1

const video = ref({
  src: ''
})

const addSource = () => {
  text.value = ''
  images.value = []
  video.value = {
    src: ''
  }
  isEditting.value = true
  editSourceId = -1
}

const closeSource = () => {
  text.value = ''
  images.value = []
  video.value = {
    src: ''
  }
  editSourceId = -1
  isEditting.value = false
}

const submitSource = () => {
  if (!text.value && images.value.length === 0 && !video.value.src) {
    ElMessage.error('Copy, images, and video cannot all be empty.')
    return
  }
  submitting.value = true
  const data = {
    goodId: id,
    sourceId: editSourceId,
    text: text.value,
    images: images.value,
    video: video.value.src
  }
  httpUtils.updateSource(data)
    .then(res => {
      ElMessage.success('Updated')
      closeSource()
      loadSource()
      submitting.value = false
    })
}

const loadSource = () => {
  httpUtils.loadSource(id)
    .then(res => {
      goodInfo.value = res.data
      source.value = res.data.source
    })
}

const previewImage = (images: Array<string>, index: number) => {
  previewImageRef.value.showImage(images, index)
}

const edit = (row: any) => {
  text.value = row.text
  images.value = JSON.parse(JSON.stringify(row.images))
  video.value = {
    src: row.video
  }
  isEditting.value = true
  editSourceId = row.id
}

const playVideo = (url: string) => {
  window.open(url)
}

loadSource()

const deleteItem = (row: any) => {
  httpUtils.deleteSource(row.id)
    .then(res => {
      ElMessage.success('Deleted')
      loadSource()
    })
}

const showSource = (row: any) => {
  httpUtils.setSourceShow(row.id)
    .then(res => {
      ElMessage.success('Updated')
      loadSource()
    })
}

const done = () => {
  router.push('/main/goods/goods/list')
}

</script>

<style lang="scss">
.edit-source-wrapper {
  background-color: #fff;
  border-radius: 1px;
  margin-bottom: 50px;
  padding: 5px 20px 30px;
  position: relative;
  text-align: left;

  h5 {
    margin: 5px;
  }

  .good-info-wrapper {
    display: flex;
    .info-image-wrapper {
      width: 52px;
      height: 52px;
      margin-right: 10px;
      border-radius: 2px;
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
      border: 2px solid transparent;
    }

    .good-title {
      width: 220px;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: keep-all;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.8);
    }

    .price {
      color: rgb(255, 103, 34);
      font-size: 12px;

      span {
        margin-left: 10px;
        color: rgb(51, 51, 51);
        font-size: 12px;
        text-decoration: line-through;
      }
    }
  }

  .add-source-button {
    margin: 10px 0;
  }

  .image-wrapper {
    width: 60px;
    height: 60px;
    display: inline-flex;
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
  }

  .video-wrapper {
    width: 80px;
    height: 120px;
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

  .footer-wrapper {
    z-index: 1;
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
