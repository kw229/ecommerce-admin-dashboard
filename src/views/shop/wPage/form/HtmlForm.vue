<template>
  <h4>Rich text</h4>
  <RichTextEditor :value="item" />
</template>
<script setup lang="ts">
import RichTextEditor from '@components/RichTextEditor.vue'
import { defineProps, toRef } from 'vue'
const prop = defineProps({
  value: {
    default: {
      text: ''
    }
  }
})

const item = toRef(prop, 'value')

</script>
