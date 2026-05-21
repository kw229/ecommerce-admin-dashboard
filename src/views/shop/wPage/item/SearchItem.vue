<template>
  <div style="padding: 10px">
    <el-input
      disabled
      placeholder="Search products"
      :suffix-icon="Search"
    />
  </div>
</template>
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
</script>
