<script setup lang="ts">
import { computed } from 'vue'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { useCustomConfig } from '@/composables/useCustomConfig'
import AppShell from '@claude/components/layout/AppShell.vue'
import ClCard from '@claude/components/ui/ClCard.vue'
import ClButton from '@claude/components/ui/ClButton.vue'
import ClBadge from '@claude/components/ui/ClBadge.vue'
import ClSwitch from '@claude/components/ui/ClSwitch.vue'
import ClSegmented from '@claude/components/ui/ClSegmented.vue'
import ClDialog from '@claude/components/ui/ClDialog.vue'
import ClEmpty from '@claude/components/ui/ClEmpty.vue'
import ClCopyField from '@claude/components/ui/ClCopyField.vue'

const {
  viewData,
  loading,
  onlyMine,
  search,
  myCount,
  editorVisible,
  editorMode,
  saving,
  form,
  configTypes,
  isMine,
  subscriptionFor,
  copySubscription,
  openCreate,
  openEdit,
  openView,
  save,
  remove,
} = useCustomConfig()

const scope = computed({
  get: () => (onlyMine.value ? 'mine' : 'all'),
  set: (v: string) => {
    onlyMine.value = v === 'mine'
  },
})

const editorTitle = computed(() =>
  editorMode.value === 'create'
    ? '新建配置'
    : editorMode.value === 'edit'
      ? '编辑配置'
      : '查看配置',
)
const readonly = computed(() => editorMode.value === 'view')
</script>

<template>
  <AppShell>
    <template #actions>
      <ClButton variant="primary" icon="plus" @click="openCreate">新建配置</ClButton>
    </template>

    <ClCard title="配置列表" subtitle="上传自定义 Clash 配置，订阅时按名称套用" flush>
      <template #actions>
        <ClSegmented
          v-model="scope"
          size="sm"
          :options="[
            { value: 'mine', label: `我的 (${myCount})` },
            { value: 'all', label: '全部可用' },
          ]"
        />
      </template>

      <div class="toolbar">
        <label class="search">
          <LucideIcon name="search" />
          <input
            v-model="search"
            class="search__input"
            type="search"
            placeholder="搜索名称 / 类型"
          />
        </label>
      </div>

      <ClEmpty v-if="loading && !viewData.length" loading />
      <ClEmpty
        v-else-if="!viewData.length"
        icon="file-text"
        :title="onlyMine ? '你还没有配置' : '没有可用配置'"
        description="新建一个配置文件，上传后即可生成带 &cc= 参数的专属订阅链接。"
      >
        <ClButton variant="primary" icon="plus" @click="openCreate">新建配置</ClButton>
      </ClEmpty>

      <ul v-else class="list">
        <li v-for="item in viewData" :key="item.type + item.name" class="row">
          <div class="row__main">
            <div class="row__title">
              <strong>{{ item.name }}</strong>
              <ClBadge>{{ item.type }}</ClBadge>
              <ClBadge v-if="item.allow_share" tone="success" dot>共享</ClBadge>
              <ClBadge v-else tone="warning" dot>仅自己</ClBadge>
              <ClBadge v-if="!isMine(item)" tone="info">他人</ClBadge>
            </div>
            <ClCopyField compact :value="subscriptionFor(item)" class="row__sub" />
          </div>
          <div class="row__actions">
            <ClButton size="sm" icon="copy" @click="copySubscription(item)">复制订阅</ClButton>
            <ClButton
              v-if="isMine(item)"
              size="sm"
              variant="ghost"
              icon="pencil"
              @click="openEdit(item)"
              >编辑</ClButton
            >
            <ClButton v-else size="sm" variant="ghost" icon="eye" @click="openView(item)"
              >查看</ClButton
            >
            <ClButton
              v-if="isMine(item)"
              size="sm"
              variant="ghost"
              icon="trash"
              @click="remove(item)"
              >删除</ClButton
            >
          </div>
        </li>
      </ul>
    </ClCard>

    <ClDialog v-model="editorVisible" :title="editorTitle" size="lg">
      <form class="editor" @submit.prevent="save">
        <div class="editor__grid">
          <label class="field">
            <span class="field__label">类型</span>
            <select v-model="form.type" class="cl-input" :disabled="readonly">
              <option v-for="t in configTypes" :key="t.value" :value="t.value">
                {{ t.label }}
              </option>
            </select>
          </label>
          <label class="field">
            <span class="field__label">名称</span>
            <input
              v-model="form.name"
              class="cl-input"
              placeholder="例如 my-rules"
              :readonly="readonly || editorMode === 'edit'"
              required
            />
          </label>
        </div>
        <label class="field">
          <span class="field__label">配置内容</span>
          <textarea
            v-model="form.value"
            class="cl-input editor__textarea"
            placeholder="粘贴 Clash YAML 配置。节点信息会在上传时被清除，请放心上传。"
            :readonly="readonly"
            spellcheck="false"
          />
        </label>
        <ClSwitch
          v-if="!readonly"
          v-model="form.allow_share"
          label="允许其他岛民使用"
          description="开启后别人也能在“全部可用”里看到并使用这份配置"
        />
        <p class="editor__note">
          <LucideIcon name="shield-check" />
          上传时会清除配置中的节点信息，只保留规则与分组，请放心上传。
        </p>
      </form>
      <template #footer>
        <ClButton variant="ghost" @click="editorVisible = false">{{
          readonly ? '关闭' : '取消'
        }}</ClButton>
        <ClButton v-if="!readonly" variant="primary" icon="check" :loading="saving" @click="save">
          {{ editorMode === 'create' ? '上传配置' : '保存修改' }}
        </ClButton>
      </template>
    </ClDialog>
  </AppShell>
</template>

<style scoped>
.toolbar {
  padding: 0 1.5rem 0.75rem;
}

.search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.85rem;
  height: 2.5rem;
  border-radius: 999px;
  border: 1px solid var(--cl-border-strong);
  background: var(--cl-surface);
  color: var(--cl-text-3);
  transition:
    border-color var(--cl-fast) var(--cl-ease),
    box-shadow var(--cl-fast) var(--cl-ease);
}

.search:focus-within {
  border-color: var(--cl-accent);
  box-shadow: 0 0 0 3px var(--cl-accent-soft);
  color: var(--cl-accent-ink);
}

.search__input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--cl-text);
  font: inherit;
  font-size: 0.9rem;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1.5rem;
  border-top: 1px solid var(--cl-border);
  transition: background-color var(--cl-fast) var(--cl-ease);
}

.row:hover {
  background: var(--cl-surface-2);
}

.row__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.row__title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  font-size: 0.95rem;
}

.row__sub {
  max-width: 40rem;
}

.row__actions {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.editor__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field__label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--cl-text-2);
}

.editor__textarea {
  min-height: 16rem;
}

.editor__note {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--cl-text-3);
}

.editor__note :deep(.lucide) {
  color: var(--cl-success-ink);
}

@media (max-width: 767px) {
  .toolbar {
    padding: 0 1rem 0.75rem;
  }

  .row {
    flex-direction: column;
    align-items: stretch;
    padding: 0.85rem 1rem;
  }

  .row__actions {
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .editor__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
