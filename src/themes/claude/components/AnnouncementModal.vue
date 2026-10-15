<script setup lang="ts">
import { onMounted } from 'vue'
import { usePinAnnouncement } from '@/composables/usePinAnnouncement'
import ClDialog from '@claude/components/ui/ClDialog.vue'
import ClButton from '@claude/components/ui/ClButton.vue'

const { visible, pinnedHtml, tryShowOnce, close } = usePinAnnouncement()

onMounted(() => {
  tryShowOnce()
})
</script>

<template>
  <ClDialog v-model="visible" title="岛岛公告" size="lg">
    <div class="rich" v-html="pinnedHtml" />
    <template #footer>
      <ClButton variant="ghost" to="/announcement" @click="close">查看全部公告</ClButton>
      <ClButton variant="primary" @click="close">知道了</ClButton>
    </template>
  </ClDialog>
</template>
