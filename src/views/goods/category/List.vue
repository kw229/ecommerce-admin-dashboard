<template>
  <div class="category-list-wrapper">
    <div class="actions">
      <el-button-group>
        <el-button type="primary" @click="addFirstCategory">Add category</el-button>
        <!-- <el-button type="primary">Add subcategory</el-button> -->
      </el-button-group>
    </div>
    <div class="space"></div>
    <el-table
      border
      width="100%"
      :row-key="(scope) => scope.id"
      :data="data">
      <el-table-column property="name" label="Category name" />
      <el-table-column label="Enabled">
        <template #default="scope">
          <el-switch :active-value="scope.enable == 1"></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Actions" width="240">
        <template #default="scope">
          <el-button
            type="text"
            size="small"
            @click="editFirst(scope.row)"
          >
            Edit
          </el-button>
           <el-popconfirm 
            title="Delete this category?"
            @confirm="deleteFirst(scope.row)">
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
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import httpUtils from '@/api/httpUtils'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const data = ref([])

const router = useRouter()
const addFirstCategory = () => {
  router.push(`/main/goods/category/edit/-1`)
}

const editFirst = (category: any) => {
  router.push(`/main/goods/category/edit/${category.id}`)
}

const loadData = () => {
  httpUtils.loadFirstCategorys()
    .then(res => {
      data.value = res.data
    })
}

const deleteFirst = (row: any) => {
  httpUtils.deleteCategoryFirst(row.id)
    .then((res) => {
      ElMessage.success('Updated')
      loadData()
    })
}

loadData()
</script>
<style lang="scss">
.category-list-wrapper {
  background-color: #fff;
  border-radius: 1px;
  margin-bottom: 50px;
  padding: 20px;
  position: relative;
  text-align: left;

  .space {
    width: 100%;
    height: 10px;
  }
}
</style>
