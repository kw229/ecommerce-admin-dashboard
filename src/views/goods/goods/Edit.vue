<template>
  <div class="good-edit-wrapper">
    <el-form
      label-width="140px">
      <h5>Basic information</h5>
      <el-form-item required label="Product name">
        <el-input 
        maxlength="120" 
        show-word-limit
        type="text" 
        v-model="name">
        </el-input>
      </el-form-item>
      <el-form-item label="Product description">
        <el-input 
        maxlength="200" 
        show-word-limit
        type="textarea"
        v-model="desc">
        </el-input>
      </el-form-item>
      <el-form-item style="margin-bottom: 0" label="Product images">
        <div>
          <ImagePicker :num="9" :data="images" />
          <div class="form-tips">Recommended size: 750x750 px. Up to 9 images.</div>
        </div>
      </el-form-item>
      <el-form-item label="Product video">
        <VideoPicker :data="video"  />
      </el-form-item>
      <el-form-item label="Primary category">
        <el-select v-model="firstCategory" placeholder="Select primary category"  @change="onFirstChange">
          <el-option
            v-for="(first) in categories"
            :key="first.id"
            :label="first.name"
            :value="first.id"
            :disabled="first.enable == 0"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Subcategory">
        <el-select v-model="secondCategory" placeholder="Select subcategory">
          <el-option
            v-for="second in seconds"
            :key="second.id"
            :label="second.name"
            :value="second.id"
            :disabled="second.enable == 0"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Product tags">
        <el-space>
          <el-select
            v-model="selectedLabels"
            multiple
            filterable
            allow-create
            default-first-option
            :reserve-keyword="false"
            placeholder="Select product tags"
          >
            <el-option
              v-for="item in labels"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-popover
            v-model:visible="addLabelVisible"
            placement="right"
            :width="350"
            trigger="click"
            >
            <template #reference>
              <el-button @click="addLabelVisible = true">Add tag</el-button>
            </template>
            <template #default>
              <el-space>
                <el-input style="width: 200px" placeholder="Enter tag name" v-model="newLabelName"></el-input>
                <el-button type="primary" @click="addLabel">Confirm</el-button>
                <el-button @click="addLabelVisible = false">Cancel</el-button>
              </el-space>
            </template>
          </el-popover>
        </el-space>
      </el-form-item>
      <el-form-item label="Published">
        <el-radio v-model="isOnSale" :label="1">Publish now</el-radio>
        <el-radio v-model="isOnSale" :label="0">Save as draft</el-radio>
      </el-form-item>
      <h5>Inventory information</h5>
      <el-form-item label="Product variants">
        <div class="add-sku-category" v-for="(spec, index) in specList" :key="index">
          <div>
            <div class="add-sku-first">
              <el-input class="sku-category-input" 
                v-model="spec.name" size="small" 
                placeholder="Add variant type, such as color or size" />
            </div>
            <div class="add-sku-second">
              <div class="child-sku-input" v-for="(childSpec, childIndex) in spec.children" :key="childIndex">
                <el-input v-model="childSpec.name" size="small" @change="(value) => specChange(value, index)">
                  <template #suffix>
                    <el-icon class="sub-sku-delete" @click="removeChildSpec(spec, childIndex)"><Delete /></el-icon>
                  </template>
                </el-input>
              </div>
              <el-button size="small" type="text" @click="addChildSpec(spec)">Add option</el-button>
            </div>
          </div>
          <el-icon class="category-delete" @click="removeSpec(index)" ><Delete /></el-icon>
        </div>
        <div class="add-sku-button">
          <el-button @click="addSpec">{{specList.length > 0 ? 'Add another variant' : 'Add variant'}}</el-button>
        </div>
        <div v-if="specList.length > 0" class="sku-table-content">
          <div class="sku-table-text">Select variant options below and apply bulk values.</div>
          <el-space wrap>
            <el-select
              multiple
              v-for="(spec, index) in specList"
              :key="index"
              :placeholder="spec.name"
              size="small"
              v-model="spec.selectedValue"
              >
              <el-option
                v-for="childSpec in spec.children"
                :key="childSpec.name"
                :label="childSpec.name"
                :value="childSpec.name"
              >
              </el-option>
            </el-select>
            <span>Sale price:</span><el-input-number placeholder="Sale price" :precision="2" :step="0.1" v-model="skuSettingForm.price" class="sku-setting-input" size="small"><template #append>USD</template></el-input-number>
            <span>Cost:</span><el-input-number placeholder="Cost" :precision="2" :step="0.1" v-model="skuSettingForm.cost" class="sku-setting-input" size="small"><template #append>USD</template></el-input-number>
             <span>Stock:</span><el-input-number placeholder="Stock"  v-model="skuSettingForm.quantity" class="sku-setting-input" size="small"/>
            <el-button type="primary" size="small" @click="skuSetting">Bulk apply</el-button>
          </el-space>
          <el-table
            table-layout="auto"
            class="sku-table"
            :data="skuData"
            size="small">
            <el-table-column type="index" label="#" width="50">
            </el-table-column>
            <el-table-column
              :width="tableColumnWidht"
              v-for="(spec, index) in specList"
              :prop="spec.name"
              :key="index"
              :label="spec.name">
            </el-table-column>
            <el-table-column label="SKU code" :width="tableColumnWidht">
              <template #default="scope">
                <el-input size="small" placeholder="Enter value" v-model="scope.row.externalSkuCode"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="Price" :width="tableColumnWidht">
              <template #default="scope">
                <el-input-number size="small" placeholder="Enter value" :precision="2" :step="0.1" v-model="scope.row.price"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="Cost" :width="tableColumnWidht">
              <template #default="scope">
                <el-input-number size="small" placeholder="Enter value" :precision="2" :step="0.1" v-model="scope.row.cost"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="Stock" :width="tableColumnWidht">
              <template #default="scope">
                <el-input-number size="small" placeholder="Enter value"  v-model="scope.row.quantity"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="Image" width="120">
              <template #default="scope">
                <ImagePicker :num="1" :data="scope.row.images" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item label="Product price">
        <el-input-number
          v-model="price"
          :precision="2" :step="0.1"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="Compare-at price">
        <el-input-number
          v-model="marketPrice"
          :precision="2" :step="0.1"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="Affiliate commission">
        <el-input-number
          v-model="commission"
          :precision="2" :step="0.1"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="Cost">
        <el-input-number
          v-model="cost"
          :precision="2" :step="0.1"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="SKU code">
        <div class="sku-code">
          <el-input
            v-model="externalSkuCode">
          </el-input>
        </div>
      </el-form-item>
      <el-form-item label="Stock">
        <el-input-number
          v-model="quantity"
          controls-position="right"
        />
      </el-form-item>
      <!-- <h5>Group-buying QR code</h5>
      <el-form-item label="QR code">
        <div class="image-wrapper" v-if="kttImage">
          <i class="image" :style="{backgroundImage: `url(${kttImage})`}" />
          <div @click="kttImage = null" class="delete-icon"></div>
          <div class="preview-wrapper" @click="previewKTTImage()">Preview</div>
        </div>
        <el-upload
          v-else
          :thumbnail-mode="false"
          class="upload-button-wrapper"
          :action="uploadImage"
          accept="image/*"
          :disabled="uploadingKttImage"
          :show-file-list="false"
          :on-success="uploadkttImageSuccess"
          :before-upload="() => uploadingKttImage = true"
        >
          <el-icon v-if="uploadingKttImage"><loading /></el-icon>
          <el-icon v-else><plus /></el-icon>
        </el-upload>
      </el-form-item> -->
      <h5>Details</h5>
      <ContentEditor :data="detail" />
    </el-form>
  </div>
  <PreviewImage ref="previewImageRef" />
  <div class="footer-wrapper">
    <el-space wrap>
      <el-button type="primary" @click="submit">Save</el-button>
      <el-button @click="cancel">Cancel</el-button>
    </el-space>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useStore } from 'vuex'
import PreviewImage from '@components/PreviewImage.vue'
import baseConfig from '@config/base.ts'
import httpUtils from '@/api/httpUtils';
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import ContentEditor from '@components/ContentEditor.vue'
import ImagePicker from '@components/ImagePicker.vue'
import VideoPicker from '@components/VideoPicker.vue'

const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const name = ref('')
const desc = ref('')
const images = ref<any[]>([])
const store = useStore()
const previewImageRef = ref(null)
const video = ref({ src: '' })
const price = ref(0)
const marketPrice = ref(0)
const cost = ref(0)
const commission = ref(0)
const firstCategory = ref('')
const secondCategory = ref('')
const kttImage = ref(null)
const uploadingVideo = ref(false)
const categories = ref<any[]>([])
const seconds = ref([])
const labels = ref<any[]>([])
const selectedLabels = ref([])
const newLabelName = ref('')
const addLabelVisible = ref(false)
const uploadingKttImage = ref(false)
const isOnSale = ref(1)
const detail = ref([])
const specList = ref<Array<any>>([])
const externalSkuCode = ref('')
const quantity = ref(0)
const skuData = ref<Array<any>>([])
const tableColumnWidht = ref(0)
const skuSettingForm = reactive({
  price: 0,
  cost: 0,
  quantity: 0,
})

const addSpec = () => {
  specList.value.push({
    name: '',
    children: [
      {
        name: ''
      }
    ],
    selectedValue: []
  })
  tableColumnWidht.value = (document.getElementsByClassName('add-sku-button')[0].clientWidth - 200) / (specList.value.length + 4)
}

const addChildSpec = (item: any) => {
  item.children.push({
    name: ''
  })
}

const removeChildSpec = (item: any, childIndex: number) => {
  item.children.splice(childIndex, 1)
  specChange()
}

const removeSpec = (index: number) => {
  specList.value.splice(index, 1)
}

const specChange = () => {
  let tempSkuData: Array<any> = [];
  let tempSpecList= JSON.parse(JSON.stringify(specList.value))
  tempSpecList.reverse().map((spec: any, index: number) => {
    let lastTemp = JSON.parse(JSON.stringify(tempSkuData))
    spec.children.map((subSpec: any, childIndex: number) => {
      if (index == 0) {
        tempSkuData.push({
          [spec.name]: subSpec.name,
          specList: [subSpec.name]
        })
      } else if (childIndex == 0) {
        tempSkuData.map(tempItem => {
          tempItem[spec.name] = subSpec.name
          tempItem.specList.push(subSpec.name)
        })
      } else {
        lastTemp.map((tempItem: any) => {
          const newTempItem = JSON.parse(JSON.stringify(tempItem))
          newTempItem.specList.push(subSpec.name)
          tempSkuData.push({
            ...newTempItem,
            [spec.name]: subSpec.name
          })
        })
      }
    })
  })
  
  const newSkuData: any[] = []
  tempSkuData.map(tempItem => {
    let specList = tempItem.specList.reverse().join(';')
    delete tempItem['specList']
    const skuDataIndex = skuData.value.findIndex((item: any) => item.specList == specList)
    if (skuDataIndex >=0) {
      newSkuData.push({
        ...tempItem,
        ...skuData.value[skuDataIndex],
        specList,
      })
    } else {
      newSkuData.push({
        ...tempItem,
        price: 0,
        cost: 0,
        quantity: 0,
        specList,
        externalSkuCode: '',
        images: [],
        specValue: tempItem
      })
    }
  })
  skuData.value = newSkuData
}

const skuSetting = () => {
  const props: any[] = []
  specList.value.map(item => {
    if (item.selectedValue.length > 0) {
      props.push({
        key: item.name,
        value: item.selectedValue
      })
    }
  })
  // Apply values to all SKUs when no variant option is selected.
  if (props.length <= 0) {
    skuData.value.map(item => {
      if (skuSettingForm.price > 0) {
        item.price = skuSettingForm.price
      }
      if (skuSettingForm.cost > 0) {
        item.cost = skuSettingForm.cost
      }
      if (skuSettingForm.quantity > 0) {
        item.quantity = skuSettingForm.quantity
      }
    })
  } else {
    skuData.value.map(item => {
      let needSet = true;
      props.map(prop => {
        if (prop.value.indexOf(item[prop.key]) < 0) {
          needSet = false
        }
      })
      if (needSet) {
        if (skuSettingForm.price > 0) {
          item.price = skuSettingForm.price
        }
        if (skuSettingForm.cost > 0) {
          item.cost = skuSettingForm.cost
        }
        if (skuSettingForm.quantity > 0) {
          item.quantity = skuSettingForm.quantity
        }
      }
    })
  }
}

const uploadImage = baseConfig().baseUrl + '/file/image'

const uploadkttImageSuccess = (res: any) => {
  kttImage.value = res.data.url
  uploadingKttImage.value = false
}

const previewKTTImage = () => {
  previewImageRef.value.showImage([kttImage.value], 0)
}


const onFirstChange = (val: number) => {
  seconds.value = categories.value.find((item) => item.id == val).seconds
}

const loadCategory = () => {
  httpUtils.loadFirstCategorys()
    .then(res => {
      categories.value = res.data
    })
}

const loadGoodsLabel = () => {
  httpUtils.loadGoodsLabel()
    .then(res => {
      labels.value = res.data
    })
}

const addLabel = () => {
  httpUtils.addGoodLabel(newLabelName.value)
    .then(res => {
      addLabelVisible.value = false
      labels.value.push({
        id: res.data,
        name: newLabelName
      })
    })
}

const loadGood = () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  httpUtils.getGood(id)
    .then(res => {
      loading.close()
      if (!res.data) {
        return
      }
      name.value = res.data.name
      desc.value = res.data.desc
      images.value = res.data.images
      video.value.src = res.data.video
      firstCategory.value = res.data.category_first
      secondCategory.value = res.data.category_second
      price.value = res.data.price / 100
      marketPrice.value = res.data.market_price / 100
      commission.value = res.data.commission / 100
      cost.value = res.data.cost / 100
      kttImage.value = res.data.ktt_image
      selectedLabels.value = res.data.labels
      isOnSale.value = res.data.is_on_sale,
      detail.value = res.data.content ?? []
      externalSkuCode.value = res.data.external_sku_code ?? ''
      quantity.value = res.data.quantity ?? ''
      if (res.data.skus) {
        const newSkuData: any[] = []
        res.data.skus.map((sku: any) => {
          let skuItem = {
            ...sku,
            ...sku.spec_value,
            specList: sku.name
          }
          skuItem.specValue = sku.spec_value
          delete skuItem.spec_value
          newSkuData.push(skuItem)
        })
        skuData.value = newSkuData
      }
      if (res.data.spec_list) {
        specList.value = res.data.spec_list
      }
    })
}

loadCategory()
loadGoodsLabel()
if (id > 0) {
  loadGood()
}

const submit = () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  const specListData: any[] = []
  specList.value.map((spec) => {
    specListData.push({
      name: spec.name,
      children: spec.children
    })
  })

  const skus: any[] = []
  skuData.value.map((item) => {
    skus.push({
      ...item,
      image: item.images
    })
  })

  const data = {
    id,
    name: name.value,
    desc: desc.value,
    images: images.value,
    video: video.value.src,
    categoryFirst: firstCategory.value,
    categorySecond: secondCategory.value,
    price: price.value * 100,
    marketPrice: marketPrice.value * 100,
    commission: commission.value * 100,
    cost: cost.value * 100,
    kttImage: kttImage.value,
    labels: selectedLabels.value,
    isOnSale: isOnSale.value,
    content: detail.value,
    externalSkuCode:  externalSkuCode.value,
    quantity: quantity.value,
    specList: specListData,
    skus
  }
  httpUtils.updateGood(data)
    .then(res => {
      loading.close()
      router.push('/main/goods/goods/list')
      ElMessage.success('Product saved')
    })
}

const cancel = () => {
  router.back()
}

</script>
<style lang="scss">
.good-edit-wrapper {
  background-color: #fff;
  border-radius: 1px;
  margin-bottom: 50px;
  padding: 5px 20px;
  position: relative;
  text-align: left;

  .sku-code {
    width: 150px;
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

  .image-wrapper {
    width: 94px;
    height: 94px;
    position: relative;
    :hover~ .preview-wrapper {
      opacity: 1;
    }
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

  .form-tips {
    font-size: 10px;
    text-align: left;
    color: var(--el-color-danger);
  }

  .add-sku-button {
    width: 100%;
  }

  .add-sku-category {
    width: 100%;
    background-color: #efefef;
    padding: 15px 15px .1px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    .add-sku-first {
      display: flex;
      margin-bottom: 10px;
      align-items: flex-start;
    }

    .sku-category-input {
      width: 300px;
    }

    .sku-category-image {
      margin-left: 10px;
    }

    .add-sku-second {
      display: flex;
      margin-bottom: 10px;
      align-items: flex-start;
    }

    .child-sku-input {
      width: 200px;
      line-height: normal;
      margin-right: 10px;
    }

    .category-delete {
      cursor: pointer;
    }

    .sub-sku-delete {
      height: 24px;
      cursor: pointer;
    }
  }

  .sku-table-content {
    width: 100%;
    margin-top: 10px;
    background-color: #efefef;
    padding: 15px;
    line-height: normal;

    .sku-table-text {
      font-size: 12px;
      color: #999;
      line-height: 1.5;
    }

    .el-input-group__append {
      padding: 0 10px;
    }

    .sku-setting-input {
      width: 200px;
      vertical-align: middle;
    }

    .sku-table {
      width: 100%;
      margin-top: 10px;
    }

    .image-wrapper {
      width: 50px;
      height: 50px;
    }

    .upload-button-wrapper {
      width: 50px;
      height: 50px;
      line-height: 50px;
    }
  }
}
</style>
