<template>
  <div class="customer-list-wrapper">
    <div class="actions">
      <el-space>
        <el-input v-model="searchId" placeholder="Search by customer ID" />
        <el-button type="primary" @click="searchData">Search</el-button>
      </el-space>
    </div>
    <el-table
      v-loading="loading"
      border
      :data="data">
      <el-table-column type="selection" />
      <el-table-column width="300" label="Customer">
        <template #default="scope">
          <div class="customer-info-wrapper">
            <img :src="scope.row.avatar" />
            <div>
              <div class="nick-name">id:{{scope.row.id}}</div>
              <div class="nick-name">Name: {{scope.row.nick_name}}</div>
            </div>
            <div v-if="scope.row.is_promoter == 1"><el-tag type="info" size="small">Asset access</el-tag></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Actions">
        <template #default="scope">
           <el-button
            type="text"
            size="small"
            @click="setPromoter(scope.row)"
          >
            {{ scope.row.is_promoter == 1 ? 'Disable asset access' : 'Enable asset access' }}

            <el-tooltip
              effect="dark"
              content="Users with asset access can view media resources."
            >
              <el-icon color="#666"><info-filled /></el-icon>
            </el-tooltip>
          </el-button>
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
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const data = ref<any[]>([])
const searchId = ref('')
const loading = ref(false)
const pageNo = ref(1)
const pageSize = ref(20)
const router = useRouter()
const total = ref(0)


const searchData = () => {
  pageNo.value = 1
  loadData()
}

const loadData = () => {
  loading.value = true
  router.replace({
    query: {
      id: searchId.value,
      pageNo: pageNo.value,
      pageSize: pageSize.value
    }
  })
  
  httpUtils.loadCustomer({
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    searchId: searchId.value
  })
    .then(res => {
      loading.value = false
      if (pageNo.value == res.data.pageNo) {
        data.value = res.data.data
        total.value = res.data.total
      }
    })
}

const setPromoter = (row: any) => {
  httpUtils.setPromoter(row.id)
    .then(res => {
      ElMessage.success('Updated')
      loadData()
    })
}

loadData()
</script>

<style lang="scss">
.customer-list-wrapper {
  background-color: #fff;
  border-radius: 1px;
  margin-bottom: 50px;
  padding: 20px;
  position: relative;
  text-align: left;

  .actions {
    display: flex;
    justify-items: center;
    justify-content: flex-end;
    margin-bottom: 20px;
  }

  .pagination-wrapper {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }

  .customer-info-wrapper {
    display: flex;
    align-items: center;
    box-sizing: border-box;

    img {
      width: 52px;
      height: 52px;
      border-radius: 2px;
      margin-right: 10px;
    }
  }

  .nick-name {
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: keep-all;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.8);
  }

  .tip-warpper {
    color: #333;
    display: inline-block;
    padding: 1px 3px;
    border: 1px solid #666;
    border-radius: 20px;
    font-size: 10px
  }
}
</style>
