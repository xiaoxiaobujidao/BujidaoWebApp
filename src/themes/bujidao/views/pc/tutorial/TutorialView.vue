<script setup lang="ts">
import { ref } from 'vue'
import UserMainView from '../UserMainView.vue'
import CC from './components/CC.vue'
import AndroidTutorial from './components/AndroidTutorial.vue'
import iOS from './components/iOS.vue'
import WindowsTutorial from './components/WindowsTutorial.vue'
import macOS from './components/macOS.vue'
import '@bujidao/assets/styles/tutorial.css'

const activeName = ref('cc')
</script>

<template>
  <UserMainView>
    <div class="panel tutorial-page">
      <el-tabs v-model="activeName" type="card" class="tutorial-tabs">
        <el-tab-pane label="个性化" name="cc" />
        <el-tab-pane label="安卓" name="android" />
        <el-tab-pane label="iOS" name="ios" />
        <el-tab-pane label="macOS" name="macos" />
        <el-tab-pane label="Windows" name="windows" />
      </el-tabs>

      <div class="tutorial-page__body">
        <CC v-if="activeName === 'cc'" />
        <AndroidTutorial v-else-if="activeName === 'android'" />
        <iOS v-else-if="activeName === 'ios'" />
        <macOS v-else-if="activeName === 'macos'" />
        <WindowsTutorial v-else-if="activeName === 'windows'" />
      </div>
    </div>
  </UserMainView>
</template>
