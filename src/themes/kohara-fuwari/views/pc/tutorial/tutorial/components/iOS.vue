<script setup lang="ts">
import { ref } from 'vue'
import ShadowRocket from './ios/ShadowRocket.vue'
const activeName = ref('shadowrocket')
</script>
<template>
  <el-tabs type="card" v-model="activeName">
    <el-tab-pane label="Shadowrocket" name="shadowrocket" />
  </el-tabs>
  <div class="tutorial">
    <ShadowRocket v-show="activeName == 'shadowrocket'" />
  </div>
</template>
