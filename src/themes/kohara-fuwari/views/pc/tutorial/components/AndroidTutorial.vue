<script setup lang="ts">
import { ref } from 'vue'
import v2rayNG from './android/v2rayNG.vue'
import clashMeta from './android/clashMeta.vue'
const activeName = ref('v2rayng')
</script>
<template>
  <el-tabs type="card" v-model="activeName">
    <el-tab-pane label="V2rayNG" name="v2rayng" />
    <el-tab-pane label="ClashMetaForAndroid" name="clashMeta" />
  </el-tabs>
  <div class="tutorial">
    <v2rayNG v-if="activeName == 'v2rayng'" />
    <clashMeta v-if="activeName == 'clashMeta'" />
  </div>
</template>