<template>
  <el-dialog
    v-model="visible"
    title="Edit subcategory"
    width="50%" 
  >
    <el-form
      class="second-form">
      <el-form-item label="Subcategory name">
        <el-input placeholder="Enter name" v-model="name"></el-input>
      </el-form-item>
      <el-form-item v-if="showFirst" label="Primary category">
        <el-input v-model="name"></el-input>
      </el-form-item>
      <el-form-item label="Enabled">
        <el-switch v-model="enable"></el-switch>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="createDone"
          >Confirm</el-button>
        <el-button @click="visible = false">Cancel</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { ref, reactive, defineExpose, defineEmits } from 'vue'

  const emit = defineEmits(['createDone'])

  const visible = ref(false)
  const name = ref('')
  const enable = ref(true)
  let id = -1

  const showFirst = ref(false)

  const editCategory = (category: any, needFirst: boolean) => {
    name.value = category.name ?? ''
    enable.value = category.enable === 1
    id = category.id
    visible.value = true
    showFirst.value = needFirst
  }

  const createDone = () => {
    visible.value = false
    emit('createDone', {
      id,
      name: name.value,
      enable: enable.value ? 1 : 0
    })
  }

  defineExpose({
    editCategory
  })
</script>
<style lang="scss">
.second-form {
  max-width: 400px;
}
</style>
