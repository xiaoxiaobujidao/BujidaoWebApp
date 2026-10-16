<script setup lang="ts">
import { onMounted } from 'vue'
import { usePinAnnouncement } from '@/composables/usePinAnnouncement'
import FwDialog from '@kohara-fuwari/components/ui/FwDialog.vue'
import FwButton from '@kohara-fuwari/components/ui/FwButton.vue'

const { visible, pinnedHtml, tryShowOnce, close } = usePinAnnouncement()

onMounted(() => {
  tryShowOnce()
})
</script>

<template>
  <FwDialog v-model="visible" title="岛岛公告" size="lg">
    <div class="rich" v-html="pinnedHtml" />
    <template #footer>
      <FwButton variant="regular" to="/announcement" @click="close">查看全部公告</FwButton>
      <FwButton variant="primary" @click="close">知道了</FwButton>
    </template>
  </FwDialog>
</template>
