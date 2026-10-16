<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    /** sm 420px / md 560px / lg 760px / xl 1040px */
    size?: 'sm' | 'md' | 'lg' | 'xl'
    /** 关闭时销毁内容（表单类弹窗建议开启） */
    destroyOnClose?: boolean
    alignCenter?: boolean
  }>(),
  { size: 'md', destroyOnClose: true, alignCenter: true },
)

const model = defineModel<boolean>({ required: true })

const width = computed(() => {
  const px = { sm: 420, md: 560, lg: 760, xl: 1040 }[props.size]
  return `min(calc(100vw - 2rem), ${px}px)`
})
</script>

<template>
  <el-dialog
    v-model="model"
    :title="title"
    :width="width"
    :destroy-on-close="destroyOnClose"
    :align-center="alignCenter"
    append-to-body
    class="fw-dialog"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <slot />
    <template v-if="$slots.footer" #footer>
      <div class="fw-dialog__footer">
        <slot name="footer" />
      </div>
    </template>
  </el-dialog>
</template>

<style>
.fw-dialog__footer {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.6rem;
}
</style>
