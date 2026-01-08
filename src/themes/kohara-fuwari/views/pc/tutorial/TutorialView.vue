<script setup lang="ts">
import { ref } from 'vue'
import UserMainView from '../UserMainView.vue'
import CC from './components/CC.vue'
import AndroidTutorial from './components/AndroidTutorial.vue'
import iOS from './components/iOS.vue'
import WindowsTutorial from './components/WindowsTutorial.vue'
import macOS from './components/macOS.vue'
const activeName = ref('cc')
</script>

<template>
  <UserMainView>
    <div class="box">
      <div>
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="个性化" name="cc" />
          <el-tab-pane label="安卓" name="android" />
          <el-tab-pane label="iOS" name="ios" />
          <el-tab-pane label="macOS" name="macos" />
          <el-tab-pane label="Windows" name="windows" />
        </el-tabs>
      </div>
      <div>
        <div v-if="activeName == 'cc'">
          <CC />
        </div>
        <div v-if="activeName == 'android'">
          <AndroidTutorial />
        </div>
        <div v-if="activeName == 'ios'">
          <iOS />
        </div>
        <div v-if="activeName == 'macos'">
          <macOS />
        </div>
        <div v-if="activeName == 'windows'">
          <WindowsTutorial />
        </div>
      </div>
    </div>
  </UserMainView>
</template>

<style lang="scss" scoped>
.box {
  padding: 20px;
  min-height: calc(100vh - 100px);
  border-radius: 15px;
}
</style>