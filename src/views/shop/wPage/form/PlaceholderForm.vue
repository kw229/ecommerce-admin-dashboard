<template>
  <h4>Spacer</h4>
  <el-space>
    <span>Height:</span>
    <el-input type="number" v-model="item.height"></el-input>
  </el-space>
  <el-space>
    <span>Color:</span>
    <el-color-picker v-model="item.color" />
  </el-space>
</template>
<script setup lang="ts">
import { defineProps, toRef } from 'vue'
const prop = defineProps({
  value: {
    default: {
      height: 10,
      color: '#fff'
    }
  }
})
const item = toRef(prop, 'value')
</script>
