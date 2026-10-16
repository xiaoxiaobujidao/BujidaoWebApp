<script setup lang="ts">
import { computed } from 'vue'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import type { NodeConnectInfo, NodeItem } from '@/utils/nodeConnect'
import { nodeTypeLabel } from '@/utils/nodeConnect'
import { touchCopy } from '@/utils/copy'
import ClDialog from '@claude/components/ui/ClDialog.vue'
import ClButton from '@claude/components/ui/ClButton.vue'
import ClBadge from '@claude/components/ui/ClBadge.vue'

const props = defineProps<{
  node: NodeItem | null
  connect: NodeConnectInfo | null
}>()

const model = defineModel<boolean>({ required: true })
const canOpen = computed(() => !!props.connect && !props.connect.multiline)
</script>

<template>
  <ClDialog v-model="model" size="md">
    <template #header>
      <div v-if="node" class="ncd__head">
        <h3 class="ncd__title cl-serif">{{ node.name }}</h3>
        <ClBadge tone="accent">{{ nodeTypeLabel(node.node_type) }}</ClBadge>
      </div>
    </template>

    <div v-if="connect" class="ncd">
      <div class="ncd__qr">
        <vue-qr
          :key="connect.qr"
          :text="connect.qr"
          :size="640"
          :margin="24"
          :correct-level="1"
          color-dark="#141413"
          color-light="#faf9f5"
          class="ncd__qr-img"
        />
        <p class="ncd__qr-hint"><LucideIcon name="qr-code" /> 使用客户端扫码导入</p>
      </div>
      <div>
        <p class="ncd__label">连接信息</p>
        <pre class="ncd__text">{{ connect.text }}</pre>
      </div>
    </div>

    <template #footer>
      <ClButton v-if="canOpen" variant="secondary" icon="external-link" :href="connect?.qr">
        在客户端中打开
      </ClButton>
      <ClButton variant="primary" icon="copy" @click="connect && touchCopy(connect.text)">
        复制连接信息
      </ClButton>
    </template>
  </ClDialog>
</template>

<style scoped>
.ncd__head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding-right: 2rem;
}

.ncd__title {
  font-size: 1.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.ncd {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.ncd__qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.ncd__qr-img {
  width: min(16rem, 70vw);
  height: auto;
  border-radius: var(--cl-radius-md);
  border: 1px solid var(--cl-border);
}

.ncd__qr-hint {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: var(--cl-text-3);
}

.ncd__label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--cl-text-2);
  margin-bottom: 0.4rem;
}

.ncd__text {
  margin: 0;
  padding: 0.8rem 0.95rem;
  border-radius: var(--cl-radius-md);
  background: var(--cl-code-bg);
  color: var(--cl-code-text);
  font-family: var(--cl-font-mono);
  font-size: 0.78rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 14rem;
  overflow: auto;
}
</style>
