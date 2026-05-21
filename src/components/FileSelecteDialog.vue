<template>
<el-dialog 
  v-model="store.state.fileSelect.fileSelectedVisible" 
  title="Select asset"
  width="70%" 
  custom-class="fileWrapper"
  center>
  <div style="display: flex">
    <div class="fileSelectedMenu">
      <el-scrollbar height="500px">
        <el-menu default-active="" @select="menuSelected">
          <el-menu-item index="">
            <span>All</span>
          </el-menu-item>
          <el-menu-item v-for="group in groups" :key="group.id" :index="`${group.id}`">
            <span>{{group.name}}</span>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
      <el-popover
        v-model:visible="addGroupVisible"
        placement="right"
        :width="200"
        trigger="click"
        >
        <template #reference>
          <el-button type="text" class="add-button" @click="addGroupVisible = true">Add group</el-button>
        </template>
        <template #default>
          <el-space>
            <el-input placeholder="Enter group name" v-model="newGroupName"></el-input>
            <el-button type="primary" @click="addGroup">Confirm</el-button>
          </el-space>
        </template>
      </el-popover>
    </div>
    <div class="file-content-wrapper">
      <div class="upload-wrapper">
        <span>* Only jpg, png, and jpeg images under 2 MB are allowed.</span>
        <el-upload
          multiple
          :action="uploadFile"
          :before-upload="beforeUpload"
          :show-file-list="false"
          :on-success="uploadSuccess"
          :data="fileinfo"
          :on-error="uploadError"
          :headers="headers"
          >
          <el-button :loading="uploading">Upload image</el-button>
        </el-upload>
      </div>
      <el-row>
        <el-col :span="4" v-for="(file, index) in files" :key="file.id" @mouseenter="focusId = file.id" @mouseleave="focusId = ''">
          <div class="item-image-wrapper">
            <div class="image" :style="{backgroundImage: `url(${file.url})`}"></div>
            <el-space class="actions" :style="{opacity: checkedFileIds.indexOf(file.id) >= 0 || focusId == file.id ? 1 : 0}">
              <el-checkbox v-model="file.checked" @change="(value) => onChecked(value, index)"></el-checkbox>
              <el-button size="small" circle :icon="ZoomIn" @click="showBigImage(index)"></el-button>
            </el-space>
          </div>
        </el-col>
      </el-row>
      <el-pagination @current-change="changePageNo" class="pagination" small layout="prev, pager, next" :page-size="pageSize" :total="total"></el-pagination>
    </div>
  </div>
  <template #footer>
    <span class="dialog-footer">
      <el-button type="primary" @click="selectDone"
        >Confirm</el-button>
      <el-button @click="store.state.fileSelect.fileSelectedVisible = false">Cancel</el-button>
    </span>
  </template>
</el-dialog>
<div class="big-image-wrapper" :style="{display: bigImageVisible ? 'flex': 'none'}">
  <div class="backgroup"></div>
  <el-icon class="left" color="#fff" size="30" @click="currenFileIndex = currenFileIndex >= 1? currenFileIndex - 1 : currenFileIndex"><arrow-left /></el-icon>
  <el-icon class="right" color="#fff" size="30" @click="currenFileIndex = currenFileIndex < pageSize -1 ? currenFileIndex + 1 : currenFileIndex"><arrow-right /></el-icon>
  <el-icon class="close" color="#fff" size="30" @click="bigImageVisible = false"><close /></el-icon>
  <img v-if="files[currenFileIndex]" :src="files[currenFileIndex].url" alt="">
</div>
</template>

<script setup type="ts">
import { ref, watch, warn } from 'vue'
import { useStore } from 'vuex'
import baseConfig from '@config/base.ts'
import httpUtils from '../api/httpUtils'
import { ElMessage } from 'element-plus'
import { ZoomIn, ArrowLeft, ArrowRight, Close } from '@element-plus/icons-vue'

const headers = {
  token: localStorage.getItem('token') ?? ''
}
const uploadFile = baseConfig().baseUrl + '/file/image'
const store = useStore()
const uploading = ref(false)
const groups = ref([])
const newGroupName = ref("")
const files= ref([])
const total = ref(0)
const focusId = ref("")
const bigImageVisible = ref(false)
const carousel = ref(null)
const currenFileIndex = ref(0)
let checkedFiles = []
const checkedFileIds = ref([])
let addGroupVisible = ref(false)
let fileinfo = ref({ name: 1, group: 0 })

const beforeUpload = (file) => {
  if (['image/png', 'image/jpg', 'image/jpeg', 'image/gif'].indexOf(file.type) < 0) {
    ElMessage.error('Only png, jpeg, and jpg images are allowed.')
    return false
  }
  if (file.size > 2 * 1024 *1024) {
    ElMessage.error('Image size must be under 2 MB.')
    return false
  }
  uploading.value = true
  fileinfo.value = {
    name: file.name,
    group: groupId
  }
  return true
}

const uploadSuccess = (res, file) => {
  uploading.value = false
  files.value.splice(0, 0, res.data)
}

const uploadError = () => {
  ElMessage.error('Image upload failed.')
  uploading.value = false
}
let pageNo = 1
let pageSize = 24
let groupId = ''

const loadFiles = () => {
  httpUtils.getMediaList(pageNo, pageSize, groupId)
    .then(res=> {
      if (res.data.pageNo === pageNo) {
        files.value = res.data.data
        total.value = res.data.total
      }
    })
}

const loadGroups = () => {
  httpUtils.getMediaGroup()
    .then(res => {
      groups.value = res.data;
    })
}

const addGroup = () => {
  httpUtils.addGroup(newGroupName.value)
    .then((res) => {
      if (res.data) {
        groups.value.push({
          id: res.data,
          name: newGroupName.value
        })
        addGroupVisible.value = false
        ElMessage.success('Created')
      }
    })
}

const changePageNo= (newPageNo) => {
  pageNo = newPageNo
  loadFiles()
}

const menuSelected = (key) => {
  groupId = key
  pageNo = 1
  loadFiles()
}

const showBigImage = (index) => {
  bigImageVisible.value = true
  currenFileIndex.value = index
}

const onChecked = (value, index) => {
  if (value) {
    checkedFileIds.value.push(files.value[index].id)
    checkedFiles.push(files.value[index])
  } else {
    let checkedIndex = checkedFileIds.value.indexOf(index)
    checkedFiles.splice(checkedIndex, 1)
    checkedFileIds.value.splice(checkedIndex, 1)
  }
}

const selectDone = () => {
  store.commit('selectFileDone', { payload: checkedFiles })
  checkedFiles = []
  checkedFileIds.value = []
  files.value.map(item => item.checked = false)
}

let hasInit = false
watch(() => store.state.fileSelect.fileSelectedVisible, () => {
  if (!hasInit) {
    // Load image assets and groups by default.
    loadGroups()
    loadFiles()
  }
  hasInit = true
})

</script>
<style lang="scss">
.fileSelectedMenu {
  width: 200px;
  margin-left: -20px;
  position: relative;

  .add-button {
    position: absolute;
    bottom: -35px;
    left: 18px;
  }
}

.file-content-wrapper {
  width: 100%;
  margin-left: 10px;
  position: relative;

  .upload-wrapper {
    display: flex;
    justify-content: flex-end;

    span {
      display: block;
      line-height: 32px;
      margin-right: 10px;
    }
  }

  .pagination {
    position: absolute;
    bottom: -30px;
    right: 0;
  }

  .item-image-wrapper {
    width: auto;
    height: 100%;
    padding: 5px 15px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

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

    .actions {
      position: absolute;
      opacity: 0;
      right: 15px;
      top: 15px;
    }

    .el-checkbox__inner {
      width: 24px;
      height: 24px;

      &::after {
        top: 2px;
        left: 7px;
        width: 7px;
        height: 14px;
      }
    }
  }
}

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
