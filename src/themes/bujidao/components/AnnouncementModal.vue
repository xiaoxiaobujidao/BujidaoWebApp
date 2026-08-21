<script setup lang="ts">
import { onMounted } from 'vue'
import BjModal from '@bujidao/components/ui/BjModal.vue'
import BjButton from '@bujidao/components/ui/BjButton.vue'
import { usePinAnnouncement } from '@bujidao/composables/usePinAnnouncement'

const { visible, pinnedHtml, tryShowOnce, close } = usePinAnnouncement()

onMounted(() => {
  tryShowOnce()
})
</script>

<template>
  <BjModal v-model="visible" title="岛岛公告" wide>
    <div class="announce-rich" v-html="pinnedHtml" />
    <template #footer>
      <BjButton @click="close">知道了</BjButton>
    </template>
  </BjModal>
</template>

<style scoped>
.announce-rich {
  color: var(--color-text-primary);
  font-size: 0.94rem;
  line-height: 1.85;
  word-break: break-word;
}

.announce-rich :deep(p) {
  margin: 0 0 0.85em;
}

.announce-rich :deep(p:last-child) {
  margin-bottom: 0;
}

.announce-rich :deep(a) {
  color: var(--color-ocean-deep);
  text-decoration: underline;
  text-underline-offset: 0.18em;
}

.dark .announce-rich :deep(a) {
  color: var(--color-ocean-light);
}

.announce-rich :deep(img) {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 0.75rem 0;
  border-radius: var(--radius-sm);
}

.announce-rich :deep(ul),
.announce-rich :deep(ol) {
  margin: 0.4em 0 0.9em;
  padding-left: 1.25em;
}

.announce-rich :deep(h1),
.announce-rich :deep(h2),
.announce-rich :deep(h3) {
  margin: 0.35em 0 0.55em;
  color: var(--color-ocean-deep);
  font-weight: 700;
  line-height: 1.4;
}

.dark .announce-rich :deep(h1),
.dark .announce-rich :deep(h2),
.dark .announce-rich :deep(h3) {
  color: var(--color-ocean-light);
}

.announce-rich :deep(code),
.announce-rich :deep(pre) {
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: 0.85em;
  background: rgba(61, 165, 232, 0.08);
  border-radius: 6px;
}

.announce-rich :deep(code) {
  padding: 0.1em 0.35em;
}

.announce-rich :deep(pre) {
  padding: 0.75rem 0.9rem;
  overflow-x: auto;
}
</style>
