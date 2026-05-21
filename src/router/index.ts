import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/login.vue'),
  },
  {
    path: '/main',
    name: 'Layout',
    component: () => import('../views/layout/Index.vue'),
    children: [
      {
        path: '/main/wpage/list',
        name: 'WPageList',
        component: () => import('../views/shop/wPage/WPageList.vue')
      },
      {
        path: '/main/wpage/edit/:id',
        name: 'WPageEdit',
        component: () => import('../views/shop/wPage/WPageEdit.vue')
      },
      {
        path: '/main/goods/category/list',
        name: 'categoryList',
        component: () => import('../views/goods/category/List.vue')
      },
      {
        path: '/main/goods/category/edit/:id',
        name: 'categoryEdit',
        component: () => import('../views/goods/category/FirstEdit.vue')
      },
      {
        path: '/main/goods/goods/list',
        name: 'goodsList',
        component: () => import('../views/goods/goods/List.vue')
      },
      {
        path: '/main/goods/goods/edit/:id',
        name: 'goodEdit',
        component: () => import('../views/goods/goods/Edit.vue')
      },
      {
        path: '/main/goods/source/edit/:id',
        name: 'SourceEidt',
        component: () => import('../views/goods/source/Edit.vue')
      },
      {
        path: '/main/customer/list',
        name: 'CustomerList',
        component: () => import('../views/customer/List.vue')
      },
      {
        path: '/main/setting/basic',
        name: 'BasicSetting',
        component: () => import('../views/setting/Basic.vue')
      },
      // {
      //   path: '/main/goods/source/list',
      //   name: 'SourceList',
      //   component: SourceList
      // },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.length == 0) {
    next({ path: '/main/goods/goods/list' })
  } else {
    next()
  }
})

export default router
