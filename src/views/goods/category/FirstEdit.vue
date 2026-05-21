<template>
  <div class="category-edit-wrapper">
    <el-form 
      label-width="100px"
      :model="form"
      class="first-form-wrapper">
      <el-form-item label="Primary category:">
        <el-input  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="Enabled">
        <el-switch v-model="form.enable"></el-switch>
      </el-form-item>
    </el-form>
    <el-button size="small" type="primary" @click="addSecondCategory">Add subcategory</el-button>
    <div class="space"></div>
    <el-table
      border
      width="100%"
      row-key="id"
      :data="seconds">
      <el-table-column property="name" label="Subcategory name" />
      <el-table-column label="Enabled">
        <template #default="scope">
          <el-switch :model-value="scope.row.enable" :active-value="1" :inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Actions" width="240">
        <template #default="scope">
          <el-button
            type="text"
            size="small"
            @click="editSecond(scope.row)"
          >
            Edit
          </el-button>
           <el-popconfirm 
            title="Delete this subcategory?"
            @confirm="deleteSecond(scope.row)">
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
  <SecondEdit ref="SecondEditRef" @createDone="secondCreated" />
  <div class="footer-wrapper">
    <el-space wrap>
      <el-button type="primary" @click="sumbit">Save</el-button>
      <el-button @click="cancel">Cancel</el-button>
    </el-space>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Sortable from 'sortablejs'
import SecondEdit from './SecondEdit.vue'
import { useRouter } from 'vue-router'
import httpUtils from '@/api/httpUtils'
import { ElMessage } from 'element-plus'

const showEdit = ref(true)
const SecondEditRef = ref<SecondEdit>(null)
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)

const form = reactive({
  name: '',
  enable: true
})

const seconds = ref<any[]>([])

const rowDrop = () => {
  const tbody = document.querySelector('.el-table__body-wrapper tbody')
  Sortable.create(tbody, {
    onEnd: (result: any) => {
      const currRow = seconds.value.splice(result.oldIndex, 1)[0]
      seconds.value.splice(result.newIndex, 0, currRow)
    }
  })
}

const addSecondCategory = () => {
  SecondEditRef.value.editCategory({ id: -1, enable: 1, name: '' }, false)
}

// Subcategory created or updated locally before saving.
const secondCreated = (second: any) => {
  const editIndex = seconds.value.findIndex((item) => item.id == second.id)
  console.log(second)
  console.log(editIndex)
  if (id > 0) {
    httpUtils.updateCategorySecond({
      id: editIndex >= 0 ? second.id : -1,
      name: second.name,
      enable: second.enable
    })
      .then(res => {
        second.id = res.data
        if (editIndex >= 0) {
          seconds.value.splice(editIndex, 1, second)
          console.log(seconds)
        } else {
          seconds.value.push({
            id: second.id,
            enable: second.enable ? 1 : 0,
            name: second.name
          })
        }
      })
  } else {
    if (editIndex >= 0) {
      seconds.value.splice(editIndex, 1, second)
    } else {
      seconds.value.push({
        id: seconds.value.length,
        enable: second.enable ? 1 : 0,
        name: second.name
      })
    }
  }
}

const editSecond = (second: any) => {
  SecondEditRef.value.editCategory(second, false)
}

const deleteSecond = (second: any) => {
  const editIndex = seconds.value.findIndex((item) => item.id == second.id)
  const deletedSecond = seconds.value.splice(editIndex, 1)
  if (id > 0) {
    httpUtils.deleteCategorySecond(second.id)
      .then(res => {
        ElMessage.success('Updated')
      })
  }
}

const getCategory = () => {
  httpUtils.getFirstCategory(id)
    .then(res => {
      if (res.data) {
        form.name = res.data.name
        form.enable = res.data.enable == 1
        seconds.value = res.data.seconds
        console.log(seconds.value)
      }
    })
}

if (id > 0) {
  getCategory()
}

const sumbit = () => {
  console.log(form)
  const data: any = {
    id,
    name: form.name,
    enable: form.enable ? 1 : 0
  }
  if (id < 0) {
    data.seconds = seconds.value
  }
  httpUtils.updateCategory(data)
   .then(res => {
     ElMessage.success('Saved.')
      router.push('/main/goods/category/list')
   })
}

const cancel = () => {
  router.back()
}

onMounted(() => rowDrop())

</script>
<style lang="scss">
.category-edit-wrapper {
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
.first-form-wrapper {
  max-width: 400px;
}

.footer-wrapper {
  z-index: 1;
  height: 48px;
  padding: 10px;
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  background: #fff;
  box-sizing: border-box;
  border-top: solid 1px var(--el-border-color-base);
}

</style>
