import request from './api'
import baseConfig from '@/config/base'
import { Method } from 'axios'

type ApiResponse<T = any> = Promise<{
  code: number
  message: string
  data: T
}>

const config = baseConfig()

const image = (text: string) => `https://placehold.co/160x160?text=${encodeURIComponent(text)}`

const categories = [
  {
    id: 1,
    name: 'Skincare',
    enable: 1,
    children: [
      { id: 11, name: 'Cleanser', enable: 1 },
      { id: 12, name: 'Serum', enable: 1 }
    ]
  },
  {
    id: 2,
    name: 'Lifestyle',
    enable: 1,
    children: [
      { id: 21, name: 'Home', enable: 1 },
      { id: 22, name: 'Wellness', enable: 0 }
    ]
  }
]

const goods = [
  {
    id: 1001,
    name: 'Hydrating Serum Set',
    desc: 'A bundled skincare product with gallery assets and variant pricing.',
    image: image('Serum'),
    price: 4590,
    market_price: 5990,
    is_on_sale: 1,
    category_id: 11,
    detail: '<p>Mock product detail content for portfolio screenshots.</p>',
    labels: ['Featured', 'Bundle']
  },
  {
    id: 1002,
    name: 'Travel Care Kit',
    desc: 'Compact kit for repeat-purchase campaign testing.',
    image: image('Travel'),
    price: 3290,
    market_price: 3990,
    is_on_sale: 1,
    category_id: 12,
    detail: '<p>Includes mock rich text and content blocks.</p>',
    labels: ['New']
  },
  {
    id: 1003,
    name: 'Aroma Home Diffuser',
    desc: 'Lifestyle product with storefront content assets.',
    image: image('Diffuser'),
    price: 7990,
    market_price: 8990,
    is_on_sale: 0,
    category_id: 21,
    detail: '<p>Offline mock item for admin workflow display.</p>',
    labels: ['Lifestyle']
  }
]

const customers = [
  {
    id: 501,
    nick_name: 'Emily Chen',
    avatar: image('EC'),
    is_promoter: 1
  },
  {
    id: 502,
    nick_name: 'David Miller',
    avatar: image('DM'),
    is_promoter: 0
  },
  {
    id: 503,
    nick_name: 'Sophia Wang',
    avatar: image('SW'),
    is_promoter: 1
  }
]

const wpages = [
  {
    id: 301,
    title: 'Spring Campaign Landing Page',
    create_time: '2026-05-01 10:30:00',
    content: [
      {
        type: 'search',
        value: ''
      },
      {
        type: 'carousel',
        value: [
          {
            imageUrl: 'https://placehold.co/320x100?text=Spring+Sale',
            jumpUrl: '/campaign/spring'
          }
        ]
      },
      {
        type: 'imageCard',
        value: [
          {
            imageUrl: image('Serum'),
            title: 'Hydration picks',
            jumpUrl: '/collections/skincare'
          },
          {
            imageUrl: image('Travel'),
            title: 'Travel kits',
            jumpUrl: '/collections/travel'
          }
        ]
      }
    ]
  },
  {
    id: 302,
    title: 'New Customer Welcome Page',
    create_time: '2026-05-08 14:20:00',
    content: []
  }
]

const mediaGroups = [
  { id: 0, name: 'All assets' },
  { id: 1, name: 'Products' },
  { id: 2, name: 'Campaigns' }
]

const mediaFiles = [
  { id: 1, name: 'product-serum.png', url: image('Serum'), type: 'image' },
  { id: 2, name: 'campaign-banner.png', url: 'https://placehold.co/640x320?text=Campaign', type: 'image' },
  { id: 3, name: 'lifestyle-card.png', url: image('Lifestyle'), type: 'image' }
]

const page = (data: any[], pageNo = 1, pageSize = 20) => ({
  pageNo,
  pageSize,
  total: data.length,
  data: data.slice((pageNo - 1) * pageSize, pageNo * pageSize)
})

const ok = <T>(data: T): ApiResponse<T> => Promise.resolve({
  code: 200,
  message: 'ok',
  data
})

const call = <T>(options: any, mockData: T): ApiResponse<T> => {
  if (config.mockApi) {
    return ok(mockData)
  }
  return request(options) as unknown as ApiResponse<T>
}

const getSetting = (key: string) => {
  if (key === 'basic_info') {
    return { title: 'E-commerce Admin Dashboard' }
  }
  if (key === 'upload_config') {
    return { open: 0, accessKey: '', secretKey: '', bucket: '', url: '' }
  }
  if (key === 'wechat') {
    return {
      wework: { corp_id: '', secret: '', agentid: '' },
      minip: { app_id: '', secret: '' }
    }
  }
  return {}
}

export default {
  requestData: (url: string, params: any = {}, method: Method = 'get') => {
    if (config.mockApi) {
      if (url === '/setting/adminSetting') {
        return ok({ title: 'E-commerce Admin Dashboard' })
      }
      if (url === '/setting/get') {
        return ok(getSetting(params.key))
      }
      if (url === '/setting/set') {
        return ok({ saved: true })
      }
    }

    return request({
      url,
      method,
      params
    }) as unknown as ApiResponse
  },

  login: (code: string) => call({
    url: '/login/weworkLogin',
    method: 'get',
    params: { code }
  }, 'demo-session'),

  loginUserInfo: () => call({
    url: '/user/loginUserInfo',
    method: 'get'
  }, {
    nick_name: 'Portfolio Demo',
    avatar: image('Demo')
  }),

  getMediaList: (pageNo: number, pageSize: number, groupId: number) => call({
    url: '/file/list',
    method: 'post',
    data: { pageNo, pageSize, groupId }
  }, page(mediaFiles, pageNo, pageSize)),

  getMediaGroup: () => call({
    url: '/file/grouplist',
    method: 'get'
  }, mediaGroups),

  addGroup: (name: string) => call({
    url: '/file/groupAdd',
    method: 'post',
    data: { name }
  }, { id: Date.now(), name }),

  loadWPage: (title: string, pageNo: number, pageSize: number) => call({
    url: '/wpage/list',
    method: 'get',
    params: { title, pageNo, pageSize }
  }, page(wpages.filter(item => !title || item.title.includes(title)), pageNo, pageSize)),

  submitWPage: (data: any) => call({
    url: '/wpage/update',
    method: 'post',
    data
  }, { saved: true }),

  getWPage: (id: number) => call({
    url: 'wpage/get',
    method: 'get',
    params: { id }
  }, wpages.find(item => item.id === Number(id)) || { id, title: '', content: [] }),

  deleteWPage: (id: number) => call({
    url: 'wpage/delete',
    method: 'get',
    params: { id }
  }, { deleted: true }),

  deleteWPages: (ids: Array<number>) => call({
    url: 'wpage/deleteMultiple',
    method: 'post',
    data: { ids }
  }, { deleted: true }),

  updateCategory: (data: any) => call({
    url: 'category/update',
    method: 'post',
    data
  }, { saved: true }),

  deleteCategoryFirst: (id: number) => call({
    url: 'category/firstDelete',
    method: 'get',
    params: { id }
  }, { deleted: true }),

  deleteCategorySecond: (id: number) => call({
    url: 'category/secondDelete',
    method: 'get',
    params: { id }
  }, { deleted: true }),

  updateCategorySecond: (data: any) => call({
    url: 'category/secondUpdate',
    method: 'post',
    data
  }, { saved: true }),

  loadFirstCategorys: () => call({
    url: 'category/list',
    method: 'get'
  }, categories),

  getFirstCategory: (id: number) => call({
    url: 'category/get',
    method: 'get',
    params: { id }
  }, categories.find(item => item.id === Number(id)) || { id, name: '', enable: 1, children: [] }),

  loadGoodsLabel: () => call({
    url: '/goods/labels',
    method: 'get'
  }, ['Featured', 'Bundle', 'New', 'Lifestyle']),

  addGoodLabel: (name: string) => call({
    url: '/goods/createLabel',
    method: 'post',
    data: { name }
  }, { name }),

  updateGood: (data: any) => call({
    url: '/goods/update',
    method: 'post',
    data: { data }
  }, { saved: true }),

  getGood: (id: number) => call({
    url: '/goods/get',
    method: 'get',
    params: { id }
  }, goods.find(item => item.id === Number(id)) || {
    id,
    name: '',
    desc: '',
    image: '',
    price: 0,
    market_price: 0,
    is_on_sale: 0,
    category_id: '',
    detail: '',
    labels: []
  }),

  loadGoods: (data: any) => call({
    url: '/goods/list',
    method: 'get',
    params: data
  }, page(goods.filter(item => !data.name || item.name.includes(data.name)), Number(data.pageNo || 1), Number(data.pageSize || 20))),

  deleteGood: (id: number) => call({
    url: '/goods/delete',
    method: 'get',
    params: { id }
  }, { deleted: true }),

  onsale: (id: number) => call({
    url: '/goods/onSale',
    method: 'get',
    params: { id }
  }, { updated: true }),

  updateSource: (data: any) => call({
    url: '/goods/updateSource',
    method: 'post',
    data
  }, { saved: true }),

  loadSource: (id: number) => call({
    url: '/goods/getSource',
    method: 'get',
    params: { id }
  }, [
    { id: 1, title: 'Hero image', image: image('Hero'), show: 1 },
    { id: 2, title: 'Detail card', image: image('Detail'), show: 1 }
  ]),

  deleteSource: (id: number) => call({
    url: '/goods/deleteSource',
    method: 'get',
    params: { id }
  }, { deleted: true }),

  setSourceShow: (id: number) => call({
    url: '/goods/setSourceShow',
    method: 'get',
    params: { id }
  }, { updated: true }),

  loadCustomer: (data: any) => call({
    url: '/customer/list',
    method: 'get',
    params: data
  }, page(customers, Number(data.pageNo || 1), Number(data.pageSize || 20))),

  setPromoter: (id: number) => call({
    url: '/customer/setPromoter',
    method: 'get',
    params: { id }
  }, { updated: true })
}
