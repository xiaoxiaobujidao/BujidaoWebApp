<script setup lang="ts">
import { ref } from 'vue'
import ClashVerge from './ClashVerge.vue'
import ShadowRocket from './ios/ShadowRocket.vue'
const activeName = ref('shadowrocket')
</script>
<template>
  <el-tabs type="card" v-model="activeName">
    <el-tab-pane label="Shadowrocket" name="shadowrocket" />
    <el-tab-pane label="ClashVerge" name="clash_verge" />
  </el-tabs>
  <div class="tutorial">
    <ClashVerge v-show="activeName == 'clash_verge'" />
    <ShadowRocket v-show="activeName == 'shadowrocket'" />
  </div>
</template>