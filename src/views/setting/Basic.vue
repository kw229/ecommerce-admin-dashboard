<template>
  <el-card>
    <el-tabs>
      <el-tab-pane label="Basic info">
        <el-form style="max-width: 560px" label-width="100px" label-position="right">
          <el-form-item required label="System name">
            <el-input v-model="basicInfo.title" placeholder="Enter system name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitBasicCofnig">Save</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Upload settings">
        <el-form style="max-width: 560px" label-width="100px" label-position="right">
          <el-form-item label="Cloud storage">
            <el-switch v-model="uploadConfig.open" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="Accesskey">
            <el-input v-model="uploadConfig.accessKey"></el-input>
          </el-form-item>
          <el-form-item label="Secretkey">
            <el-input v-model="uploadConfig.secretKey"></el-input>
          </el-form-item>
          <el-form-item label="Bucket">
            <el-input v-model="uploadConfig.bucket"></el-input>
          </el-form-item>
          <el-form-item label="Url">
            <el-input v-model="uploadConfig.url"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitUploadConfig">Save</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="WeChat settings">
        <el-form style="max-width: 560px" label-width="100px" label-position="right">
          <h5>WeCom</h5>
          <el-form-item label="Corp ID">
            <el-input v-model="wework.corp_id"></el-input>
          </el-form-item>
          <el-form-item label="Secret">
            <el-input v-model="wework.secret"></el-input>
          </el-form-item>
          <el-form-item label="APPID">
            <el-input v-model="wework.agentid"></el-input>
          </el-form-item>
          <h5>Mini Program</h5>
          <el-form-item label="App ID">
            <el-input v-model="minip.app_id"></el-input>
          </el-form-item>
          <el-form-item label="Secret">
            <el-input v-model="minip.secret"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitWechatConfig">Save</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script setup lang="ts">
import httpUtils from '@/api/httpUtils'
import { ElMessage } from 'element-plus'
import { reactive } from 'vue'
const uploadConfig = reactive({
  open: 0,
  accessKey: '',
  secretKey: '',
  bucket: '',
  url: ''
})
const wework = reactive({
  corp_id: '',
  secret: '',
  agentid: ''
})

const minip = reactive({
  app_id: '',
  secret: ''
})

const basicInfo = reactive({
  title: ''
})

const getSetting = () => {
  httpUtils.requestData('/setting/get', { key: 'basic_info' })
    .then(res => {
      if (res.data) {
        basicInfo.title = res.data.title
      }
    })

  httpUtils.requestData('/setting/get', { key: 'upload_config' })
    .then(res => {
      if (res.data) {
        uploadConfig.open = res.data.open ?? 0
        uploadConfig.accessKey = res.data.accessKey ?? 0
        uploadConfig.secretKey = res.data.secretKey ?? 0
        uploadConfig.bucket = res.data.bucket ?? 0
        uploadConfig.url = res.data.url ?? 0
      }
    })
  httpUtils.requestData('/setting/get', { key: 'wechat' })
    .then(res => {
      if (res.data) {
        wework.corp_id = res.data.wework.corp_id ?? ''
        wework.secret = res.data.wework.secret ?? ''
        wework.agentid = res.data.wework.agentid ?? ''
        minip.app_id = res.data.minip.app_id ?? ''
        minip.secret = res.data.minip.secret ?? ''
      }
    })
}

getSetting()

const submitUploadConfig = () => {
  httpUtils.requestData('/setting/set', { key: 'upload_config', value: uploadConfig })
    .then(res => {
      ElMessage.success('Saved')
    })
}

const submitWechatConfig =() => {
  httpUtils.requestData('/setting/set', { key: 'wechat', value: { wework,  minip } })
    .then(res => {
      ElMessage.success('Saved')
    })
}

const submitBasicCofnig = () => {
  httpUtils.requestData('/setting/set', { key: 'basic_info', value: basicInfo })
    .then(res => {
      ElMessage.success('Saved')
    })
}
</script>

<style lang="scss">
h5 {
  text-align: left;
  margin: 10px;
}
</style>
