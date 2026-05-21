<template>
<div class="layout">
  <div class="left-sider">
    <div class="scroll-wrapper">
      <el-menu
        active-text-color="#ffd04b"
        background-color="#2c3e50"
        class="el-menu-vertical"
        default-active="2"
        text-color="#fff"
        :collapse="isCollapse"
      >
        <template v-for="menu in menus" :key="menu.id">
          <el-sub-menu v-if="menu.subMuenus && menu.subMuenus.length >=1" :index="menu.id">
            <template #title>
              <el-icon v-if="menu.icon"><component :is="menu.icon"></component></el-icon> 
              <span>{{menu.name}}</span>
            </template>
            <el-menu-item  @click="menuClick(subMenu)" v-for="subMenu in menu.subMuenus" :key="subMenu.id" index="3">
              <el-icon v-if="subMenu.icon"><component :is="subMenu.icon"></component></el-icon> 
              <span>{{subMenu.name}}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item @click="menuClick(menu)" v-else :index="menu.id">
            <el-icon v-if="menu.icon"><component :is="menu.icon"></component></el-icon> 
            <span>{{menu.name}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="collapse-button" @click="isCollapse = !isCollapse">
      <el-icon v-show="!isCollapse"><arrow-left-bold /></el-icon>
      <el-icon v-show="isCollapse"><arrow-right-bold /></el-icon>
    </div>
  </div>
  <div class="content-wrapper">
    <div class="header-wrapper">
      <img class="avatar" :src="avatar" />
      <div>{{nickName}}</div>
      <el-icon class="exit" @click="logout"><component :is="'right'"></component></el-icon> 
    </div>
    <div class="content">
      <router-view/>
    </div>
  </div>
</div>
<FileSelectDialog />
</template>
<script setup lang="ts">
import { computed, ref, watch, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { ArrowLeftBold, ArrowRightBold, Goods, Setting, Shop } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import FileSelectDialog from '../../components/FileSelecteDialog.vue'
import httpUtils from '@/api/httpUtils'

const router = useRouter()

const nickName = ref('')
const avatar = ref('')
const getUserInfo = () => {
  httpUtils.loginUserInfo()
    .then(res => {
      nickName.value = res.data.nick_name
      avatar.value = res.data.avatar
    })
}

onBeforeMount(() => {
  useStore().dispatch('fetchSysSetting')
})

getUserInfo()

const logout = () => {
  localStorage.clear()
  router.push('/login')
}

const isCollapse = ref<boolean>(true)

const menus = [
  {
    id: '4',
    name: 'Products',
    icon: 'goods',
    subMuenus: [{
      id: '4-2',
      name: 'Product List',
      icon: '',
      url: '/main/goods/goods/list'
    },{
      id: '4-1',
      name: 'Categories',
      icon: '',
      url: '/main/goods/category/list'
    }
    // ,{
    //   id: '4-3',
    //   name: 'Content assets',
    //   icon: '',
    //   url: '/main/goods/source/list'
    // }
    ]
  },
  {
    id: '6',
    name: 'Customers',
    icon: 'user',
    url: '/main/customer/list'
  },
  {
    id: '1',
    name: 'Storefront',
    icon: 'shop',
    subMuenus: [{
      id: '2',
      name: 'Landing Pages',
      icon: '',
      url: '/main/wpage/list'
    }]
  },
  {
    id: '3',
    name: 'Settings',
    icon: 'setting',
    url: '/main/setting/basic'
  }
]

const menuClick = (item: any) => {
  if (item.url) {
    router.push(item.url)
  }
}

</script>
<style lang="scss" scoped>
.layout {
  display: flex;
  overflow: hidden;
}
.left-sider {
  position: relative;
  height: 100vh; 
  z-index: 1000;

  .scroll-wrapper {
    height: 100vh;
    overflow: auto;
  }
}
.el-menu-vertical {
  min-height: 100vh;
  max-width: 200vh;
  padding-bottom: 50px;
}

.collapse-button {
  width: calc(100% - 1px);
  height: 50px;
  line-height: 50px;
  position: absolute;
  bottom: 0;
  left: 0;
  color: #fff;
  border-right: solid 1rem var(--el-menu-border-color);
  background-color: #42505e;
}

.collapse-button-hodler {
  height: 50px;
  background-color: #2c3e50;
}

.content-wrapper {
  width: 100%;
  background: #f0f2f5;

  .header-wrapper {
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    background-color: #fff;
    border-bottom: solid 1px var(--el-border-color-base);
    display: flex;
    justify-content: flex-end;
    font-size: 10px;
    align-items: center;
    padding-right: 20px;
    font-weight: 500;

    .avatar {
      width: 35px;
      height: 35px;
      border-radius: 30px;
    }
    .exit {
      font-size: 20px;
      margin-left: 10px;
      cursor: pointer;
    }
  }

  .content {
    padding: 16px;
    height: calc(100vh - 82px);
    overflow: auto;
  }
}
</style>
