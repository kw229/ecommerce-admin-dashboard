<template>
  <div id="qrcode">
  </div>
</template>

<script setup lang="ts">
import baseConfig from '@/config/base'
import { useRouter } from 'vue-router'

import { onMounted } from 'vue'
import httpUtils from '@/api/httpUtils';
import { ElMessage } from 'element-plus';
const router = useRouter()
const query = router.currentRoute.value.query;
const createQRCode = (setting: any) => {
  let redirect_uri = `${baseConfig().baseUrl}login`
  if (baseConfig().mode == 'production') {
    redirect_uri = `${location.protocol}//${location.host}/login`
  }
  
  let wwLogin = new window.WwLogin({
    "id": "qrcode",  
    "appid": setting.corp_id,
    "agentid": setting.agentid,
    "redirect_uri": encodeURI(redirect_uri),
    "state": "1",
    "href": "",
    "lang": "en",
  })
}
if (query.redirect) {
  localStorage.setItem('lastLoginPath', query.redirect as string);
}
onMounted(() => {
  if (query.code) {
    httpUtils.login(query.code as string)
      .then(res => {
        if (res && res.data) {
          localStorage.setItem('token', res.data)
          router.push(localStorage.getItem('lastLoginPath') || '/main/goods/goods/list')
        }
      })
  } else {
    httpUtils.requestData('/setting/getWeworSetting')
      .then(res => {
        if (!res.data) {
          ElMessage.error('WeCom configuration error')
        } else {
          createQRCode(res.data)
        }
      })
  }
})

</script>

<style lang="scss">
#qrcode {
  margin-top: 50px;
}
</style>
