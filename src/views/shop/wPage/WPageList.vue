<template>
  <div class="wpage-list-wrapper">
    <div class="actions">
      <el-button-group>
        <el-popconfirm 
          title="Delete selected landing pages?"
          @confirm="deleteMultiple">
          <template #reference>
            <el-button type="warning">Bulk delete</el-button>
          </template>
        </el-popconfirm>
        <el-button type="primary" @click="addWPage">Add landing page</el-button>
      </el-button-group>
      <el-space>
        <el-input v-model="title" placeholder="Search by page title">
          <template #append>
            <el-button @click="searchData">Search</el-button>
          </template>
        </el-input>
      </el-space>
    </div>
    <el-table
      border
      width="100%"
      :data="data"
      @selection-change="selectionChange">
       <el-table-column type="selection" />
       <el-table-column property="title" label="Title" />
       <el-table-column property="create_time" label="Created at" />
       <el-table-column fixed="right" label="Actions" width="240">
         <template #default="scope">
           <el-button
            type="text"
            size="small"
            @click="edit(scope.row)"
          >
            Edit
          </el-button>
          <el-button
            class="copy-button"
            type="text"
            size="small"
            :data-clipboard-text="`/pages/wpage/wpage?id=${scope.row.id}`"
            @click="onCopy"
          >
            Copy link
          </el-button>
           <el-popconfirm 
            title="Delete this landing page?"
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
import { ElMessage } from 'element-plus';
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Clipboard from 'clipboard'

const router = useRouter()
const query = router.currentRoute.value.query;
const pageNo = ref(Number(query.pageNo ?? 1))
const pageSize = ref(Number(query.pageSize ?? 20))
const total = ref(0)
const title = ref(query.title ?? '')

const data = ref([])

const edit = (value: any) => {
  router.push(`/main/wpage/edit/${value.id}`)
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

const deleteRow = (value: any) => {
  httpUtils.deleteWPage(value.id)
    .then(res => {
      ElMessage.success('Deleted')
      loadData()
    })
}

const loadData = () => {
  router.replace({
    query: {
      title: title.value,
      pageNo: pageNo.value,
      pageSize: pageSize.value
    }
  })
  httpUtils.loadWPage(title.value, pageNo.value, pageSize.value)
    .then(res => {
      if (res.data.pageNo == pageNo.value) {
        data.value = res.data.data
        total.value = res.data.total
      }
    })
}

const addWPage = () => {
  router.push(`/main/wpage/edit/-1`)
}

const searchData = () => {
  pageNo.value = 1
  loadData()
}

let selectionData: any[] = []
const selectionChange = (value: any[]) => {
  selectionData = value
}

const deleteMultiple = () => {
  if (selectionData.length <= 0) {
    ElMessage.error('No rows selected')
    return
  }

  let selectedIds: Array<number> = []
  selectionData.map(item => {
    selectedIds.push(item.id)
  })
  httpUtils.deleteWPages(selectedIds)
    .then(res => {
      ElMessage.success('Deleted')
      loadData()
    })
}
loadData()
</script>
<style lang="scss">
.wpage-list-wrapper {
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

  .pagination-wrapper {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
