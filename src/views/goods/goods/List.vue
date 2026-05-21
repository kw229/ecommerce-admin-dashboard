<template>
  <div class="good-list-wrapper">
    <el-form inline>
      <el-form-item label="Product name">
        <el-input v-model="name" placeholder="Search by product name" />
      </el-form-item>
      <el-form-item label="Category">
        <el-select v-model="searchForm.firstCategory" placeholder="Select category">
          <el-option
            label="All"
            :value="''"
          >
          </el-option>
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
      <el-form-item label="Status">
        <el-select v-model="searchForm.isOnSale">
          <el-option
            label="All"
            :value="''"
          >
          </el-option>
          <el-option
            label="Published"
            :value="1"
          >
          </el-option>
          <el-option
            label="Draft"
            :value="0"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="actions">
      <el-button type="primary" @click="add">Add product</el-button>
      <el-button type="primary" @click="searchData">Search</el-button>
    </div>
    <el-table
      v-loading="loading"
      border
      :data="data">
      <el-table-column type="selection" />
      <el-table-column width="300" label="Product">
        <template #default="scope">
          <div class="good-info-wrapper">
            <div class="info-image-wrapper">
              <i class="image" :style="{ backgroundImage: `url(${scope.row.image})` }" />
            </div>
            <div>
              <div class="good-title">{{scope.row.name}}</div>
              <div class="price">${{scope.row.price / 100}}<span>${{scope.row.market_price / 100}}</span></div>
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="Tags">
      </el-table-column> -->
      <el-table-column  prop="desc" label="Description">
      </el-table-column>
      <el-table-column label="Published">
        <template #default="scope">
          <el-switch :model-value="scope.row.is_on_sale" :active-value="1" :inactive-value="0" @change="onSale(scope.row)"></el-switch>
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
            @click="editSource(scope.row)"
          >
            Edit assets
          </el-button>
          <el-button
            class="copy-button"
            type="text"
            size="small"
            :data-clipboard-text="`/pages/goods/detail/detail?id=${scope.row.id}`"
            @click="onCopy"
          >
            Copy link
          </el-button>
           <el-popconfirm 
            title="Delete this product?"
            @confirm="deleteRow(scope.row)">
             <template #reference>
               <el-button
                type="text"
                size="small"
              >
                Delete
              </el-button>
            </template>
           </el-popconfirm>
         </template>
      </el-table-column>
    </el-table>
    <div class="pagination-wrapper">
      <el-pagination
        background
        v-model:currentPage="pageNo"
        :page-sizes="[20, 50, 100, 200]"
        v-model:page-size="pageSize"
        layout="total, sizes, prev, pager, next" 
        :total="total"
        @size-change="loadData"
        @current-change="loadData"></el-pagination>
    </div>
  </div>
</template>
<script setup lang="ts">
import httpUtils from '@/api/httpUtils'
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import Clipboard from 'clipboard'

const router = useRouter()
const query = router.currentRoute.value.query;
const data = ref<any[]>([])
const name = ref(query.name ?? '')
const pageNo = ref(Number(query.pageNo ?? 1))
const pageSize = ref(Number(query.pageSize ?? 20))
const total = ref(0)
const loading = ref(false)
const is_on_sale = ref(1)
const categories = ref<any[]>([])
const searchForm = reactive({
  isOnSale: 1,
  firstCategory: ''
})

const edit = (row: any) => {
  router.push(`/main/goods/goods/edit/${row.id}`)
}

const editSource = (row: any) => {
  router.push(`/main/goods/source/edit/${row.id}`)
}

const add = () => {
  router.push(`/main/goods/goods/edit/-1`)
}

const onCopy = () => {
  const clipboard = new Clipboard('.copy-button')
  clipboard.on('success', (e) => {
    ElMessage.success('Copied')
      // Release clipboard resources.
    clipboard.destroy()
  })
  clipboard.on('error', (e) => {
    ElMessage.success('Copy failed')
    clipboard.destroy()
  })
}

const deleteRow = (row: any) => {
  httpUtils.deleteGood(row.id)
    .then(res => {
      ElMessage.success('Deleted')
      loadData()
    })
}

const searchData = () => {
  pageNo.value = 1
  loadData()
}

const onSale = (row: any) => {
  row.is_on_sale = 1 - row.is_on_sale
  httpUtils.onsale(row.id)
    .then(res => {
      ElMessage.success('Updated')
      // loadData()
    })
}

const loadData = () => {
  loading.value = true
  router.replace({
    query: {
      name: name.value,
      pageNo: pageNo.value,
      pageSize: pageSize.value
    }
  })
  httpUtils.loadGoods({
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    name: name.value,
    ...searchForm
  })
    .then(res => {
      loading.value = false
      if (pageNo.value == res.data.pageNo) {
        data.value = res.data.data
        total.value = res.data.total
      }
    })
}
loadData()

const loadCategory = () => {
  httpUtils.loadFirstCategorys()
    .then(res => {
      categories.value = res.data
    })
}

loadCategory()
</script>
<style lang="scss">
.good-list-wrapper {
  background-color: #fff;
  border-radius: 1px;
  margin-bottom: 50px;
  padding: 20px;
  position: relative;
  text-align: left;

  .actions {
    display: flex;
    justify-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
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
  .cell {
    font-size: 12px;
  }

  .pagination-wrapper {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
