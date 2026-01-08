<script setup lang="ts">
import { ref } from 'vue'
import ClashCC from './cc/ClashCC.vue'
const activeName = ref('clash')
</script>
<template>
  <el-tabs type="card" v-model="activeName">
    <el-tab-pane label="Clash自定义配置" name="clash" />
  </el-tabs>
  <div class="tutorial">
    <ClashCC v-show="activeName == 'clash'" />
  </div>
</template>