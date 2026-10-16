<script setup lang="ts">
import { computed } from 'vue'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { touchCopy } from '@/utils/copy'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { tutorialImage, type TutorialClient } from '@/utils/tutorialContent'
import ClButton from '@claude/components/ui/ClButton.vue'
import ClCopyField from '@claude/components/ui/ClCopyField.vue'

const props = defineProps<{ client: TutorialClient }>()

const userInfoStore = useUserInfoStore()
const subAddress = computed(() => userInfoStore.getUserInfo()?.sub_address[0] ?? '')

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
        <span class="guide__num cl-serif">{{ index + 1 }}</span>
        <span v-if="index < client.steps.length - 1" class="guide__line" />
      </div>

      <div class="guide__body">
        <h4 class="guide__title cl-serif">{{ step.title }}</h4>
        <p v-if="step.note" class="guide__note"><LucideIcon name="info" /> {{ step.note }}</p>

        <div v-if="step.kind === 'install' && step.downloads?.length" class="guide__downloads">
          <ClButton
            v-for="link in step.downloads"
            :key="link.href"
            variant="secondary"
            size="sm"
            icon="download"
            :href="link.href"
          >
            {{ link.label }}
          </ClButton>
        </div>

        <div v-if="step.kind === 'copy-sub'" class="guide__copy">
          <ClCopyField v-if="subAddress" label="通用订阅地址" :value="subAddress" />
          <p v-else class="cl-faint">登录后这里会显示你的订阅地址</p>
        </div>

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
                <ClButton
                  v-for="link in item.links ?? []"
                  :key="link.href"
                  variant="ghost"
                  size="sm"
                  icon="external-link"
                  :href="link.href"
                >
                  {{ link.label }}
                </ClButton>
                <ClButton
                  v-if="item.copy"
                  variant="ghost"
                  size="sm"
                  icon="copy"
                  @click="touchCopy(item.copy.value)"
                >
                  {{ item.copy.label }}
                </ClButton>
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
  background: var(--cl-text);
  color: var(--cl-bg);
  font-size: 0.95rem;
  flex-shrink: 0;
}

.guide__line {
  flex: 1;
  width: 1px;
  margin: 0.35rem 0;
  background: var(--cl-border-strong);
}

.guide__body {
  padding-bottom: 1.75rem;
  min-width: 0;
}

.guide__title {
  font-size: 1.1rem;
  line-height: 2rem;
}

.guide__note {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.25rem;
  padding: 0.45rem 0.7rem;
  border-radius: var(--cl-radius-sm);
  background: var(--cl-warning-soft);
  color: var(--cl-warning-ink);
  font-size: 0.82rem;
  width: fit-content;
  max-width: 100%;
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
  border-radius: var(--cl-radius-md);
  background: var(--cl-surface-2);
  border: 1px solid var(--cl-border);
  min-width: 0;
}

.guide__img {
  width: 100%;
  height: 15rem;
  border-radius: var(--cl-radius-sm);
  background: var(--cl-surface);
  cursor: zoom-in;
}

.guide__caption {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: var(--cl-text-2);
  line-height: 1.5;
}

.guide__caption-text b {
  color: var(--cl-accent-ink);
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
  border-radius: var(--cl-radius-md);
  background: var(--cl-surface-2);
  color: var(--cl-text-3);
  font-size: 0.82rem;
}
</style>
