<script setup lang="ts">
import { computed } from 'vue'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { touchCopy } from '@/utils/copy'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { tutorialImage, type TutorialClient } from '@/utils/tutorialContent'
import FwButton from '@kohara-fuwari/components/ui/FwButton.vue'
import FwCopyField from '@kohara-fuwari/components/ui/FwCopyField.vue'

const props = defineProps<{ client: TutorialClient }>()

const userInfoStore = useUserInfoStore()
const subAddress = computed(() => userInfoStore.getUserInfo()?.sub_address[0] ?? '')

/** 当前客户端所有图片，用于预览时左右翻页 */
const allImages = computed(() =>
  props.client.steps.flatMap((step) =>
    (step.items ?? [])
      .map((item) => item.img)
      .filter((k): k is string => !!k)
      .map(tutorialImage),
  ),
)

function previewIndex(img: string) {
  return Math.max(0, allImages.value.indexOf(tutorialImage(img)))
}
</script>

<template>
  <ol class="guide">
    <li v-for="(step, index) in client.steps" :key="index" class="guide__step">
      <div class="guide__marker">
        <span class="guide__num">{{ index + 1 }}</span>
        <span v-if="index < client.steps.length - 1" class="guide__line" />
      </div>

      <div class="guide__body">
        <h4 class="guide__title">{{ step.title }}</h4>
        <p v-if="step.note" class="guide__note">
          <LucideIcon name="info" />
          {{ step.note }}
        </p>

        <!-- 下载入口 -->
        <div v-if="step.kind === 'install' && step.downloads?.length" class="guide__downloads">
          <FwButton
            v-for="link in step.downloads"
            :key="link.href"
            variant="regular"
            size="sm"
            icon="download"
            :href="link.href"
          >
            {{ link.label }}
          </FwButton>
        </div>

        <!-- 复制订阅 -->
        <div v-if="step.kind === 'copy-sub'" class="guide__copy">
          <FwCopyField v-if="subAddress" label="通用订阅地址" :value="subAddress" />
          <p v-else class="text-3">登录后这里会显示你的订阅地址</p>
        </div>

        <!-- 子步骤 -->
        <div v-if="step.items?.length" class="guide__items">
          <figure v-for="(item, i) in step.items" :key="i" class="guide__item">
            <el-image
              v-if="item.img"
              :src="tutorialImage(item.img)"
              :preview-src-list="allImages"
              :initial-index="previewIndex(item.img)"
              fit="contain"
              loading="lazy"
              hide-on-click-modal
              preview-teleported
              class="guide__img"
              :alt="item.text ?? step.title"
            />
            <figcaption v-if="item.text || item.links?.length || item.copy" class="guide__caption">
              <span v-if="item.text" class="guide__caption-text">
                <b v-if="(step.items?.length ?? 0) > 1">{{ index + 1 }}.{{ i + 1 }}</b>
                {{ item.text }}
              </span>
              <span v-if="item.links?.length || item.copy" class="guide__caption-actions">
                <FwButton
                  v-for="link in item.links ?? []"
                  :key="link.href"
                  variant="plain"
                  size="sm"
                  icon="external-link"
                  :href="link.href"
                >
                  {{ link.label }}
                </FwButton>
                <FwButton
                  v-if="item.copy"
                  variant="plain"
                  size="sm"
                  icon="copy"
                  @click="touchCopy(item.copy.value)"
                >
                  {{ item.copy.label }}
                </FwButton>
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </li>
  </ol>
  <p v-if="client.footnote" class="guide__footnote">{{ client.footnote }}</p>
</template>

<style scoped>
.guide {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.guide__step {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr);
  gap: 0.9rem;
}

.guide__marker {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.guide__num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--primary);
  color: #fff;
  font-weight: 800;
  font-size: 0.9rem;
  flex-shrink: 0;
  box-shadow: 0 6px 14px -6px oklch(0.6 0.14 var(--hue) / 0.8);
}

.guide__line {
  flex: 1;
  width: 2px;
  margin: 0.35rem 0;
  border-radius: 999px;
  background: var(--line-divider);
}

.guide__body {
  padding-bottom: 1.75rem;
  min-width: 0;
}

.guide__title {
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 2rem;
}

.guide__note {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.25rem;
  padding: 0.45rem 0.7rem;
  border-radius: var(--radius-sm);
  background: var(--warning-soft);
  color: oklch(0.5 0.14 70);
  font-size: 0.82rem;
  width: fit-content;
  max-width: 100%;
}

:root.dark .guide__note {
  color: var(--warning);
}

.guide__downloads,
.guide__copy {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.6rem;
}

.guide__copy {
  flex-direction: column;
}

.guide__items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr));
  gap: 0.9rem;
  margin-top: 0.75rem;
}

.guide__item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  padding: 0.6rem;
  border-radius: var(--radius-md);
  background: var(--btn-plain-bg-hover);
  border: 1px solid var(--line-divider);
  min-width: 0;
}

.guide__img {
  width: 100%;
  height: 15rem;
  border-radius: var(--radius-sm);
  background: var(--card-bg);
  cursor: zoom-in;
}

.guide__caption {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: var(--text-2);
  line-height: 1.5;
}

.guide__caption-text b {
  color: var(--primary);
  margin-right: 0.25rem;
}

.guide__caption-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.guide__footnote {
  margin-top: 0.25rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  background: var(--btn-plain-bg-hover);
  color: var(--text-3);
  font-size: 0.82rem;
}
</style>
