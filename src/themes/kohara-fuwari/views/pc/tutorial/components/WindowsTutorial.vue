<script setup lang="ts">
import { ref } from 'vue'
import v2rayN from './windows/v2rayN.vue'
import ClashVerge from './ClashVerge.vue'
const activeName = ref('clash_verge')
</script>
<template>
  <el-tabs type="card" v-model="activeName">
    <el-tab-pane label="ClashVerge" name="clash_verge" />
    <el-tab-pane label="V2rayN" name="v2rayn" />
  </el-tabs>
  <div class="tutorial">
    <v2rayN v-show="activeName == 'v2rayn'" />
    <ClashVerge v-show="activeName == 'clash_verge'" />
  </div>
</template>