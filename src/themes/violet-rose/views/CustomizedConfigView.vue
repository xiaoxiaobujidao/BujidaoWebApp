<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getCustomizedConfiguration,
  uploadCustomizedConfiguration,
  deleteCustomizedConfiguration,
} from '@/utils/user'
import { touchCopy } from '@/utils/copy'
import { useUserInfoStore } from '@/stores/userInfoStore'
import DashboardLayout from '@violet-rose/components/layout/DashboardLayout.vue'
import PanelCard from '@violet-rose/components/ui/PanelCard.vue'
import VrButton from '@violet-rose/components/ui/VrButton.vue'
import VrModal from '@violet-rose/components/ui/VrModal.vue'

interface CustomConfig {
  type: string
  name: string
  value: string
  allow_share: boolean
  user_id?: string
}

const userInfoStore = useUserInfoStore()
userInfoStore.updateUserInfo()
const userInfo = computed(() => userInfoStore.getUserInfo())

const list = ref<CustomConfig[]>([])
const search = ref('')
const onlySelf = ref(true)
const editorVisible = ref(false)
const viewerVisible = ref(false)
const editorTitle = ref('')
const editing = ref<CustomConfig>({ type: '', name: '', value: '', allow_share: false })

const typeOptions = [{ value: 'clash_yaml', label: 'Clash YAML' }]

function load() {
  getCustomizedConfiguration().then((res) => {
    list.value = res.result ?? []
  })
}
load()

const filtered = computed(() => {
  let items = onlySelf.value
    ? list.value.filter((v) => v.user_id === userInfo.value?.user_id)
    : list.value
  const q = search.value.trim().toLowerCase()
  if (!q) return items
  return items.filter((v) => v.name.toLowerCase().includes(q) || v.type.toLowerCase().includes(q))
})

function openNew() {
  editing.value = { type: 'clash_yaml', name: '', value: '', allow_share: false }
  editorTitle.value = '新建配置'
  editorVisible.value = true
}

function openEdit(item: CustomConfig) {
  editing.value = { ...item }
  editorTitle.value = '编辑配置'
  editorVisible.value = true
}

function openView(item: CustomConfig) {
  editing.value = { ...item }
  viewerVisible.value = true
}

function save() {
  uploadCustomizedConfiguration(editing.value).then((res) => {
    if (res.result) {
      ElMessage.success('保存成功')
      load()
      editorVisible.value = false
    } else {
      ElMessage.error('保存失败')
    }
  })
}

function remove(item: CustomConfig) {
  if (!confirm(`确认删除「${item.name}」？`)) return
  deleteCustomizedConfiguration(item.type, item.name).then((res) => {
    if (res.result) {
      ElMessage.success('已删除')
      load()
    } else {
      ElMessage.error('删除失败')
    }
  })
}
</script>

<template>
  <DashboardLayout>
    <PanelCard title="自定义配置" subtitle="管理 Clash 等客户端配置文件">
      <template #actions>
        <VrButton size="sm" @click="openNew">新建</VrButton>
      </template>

      <div class="toolbar">
        <input v-model="search" class="search" type="search" placeholder="搜索配置…" />
        <label class="filter">
          <input v-model="onlySelf" type="checkbox" />
          仅看我的
        </label>
      </div>

      <div class="config-list">
        <article v-for="item in filtered" :key="item.type + item.name" class="config-item">
          <div class="config-item__head">
            <h3 class="config-item__name">{{ item.name }}</h3>
            <span class="config-item__type">{{ item.type }}</span>
          </div>
          <p class="config-item__share">
            {{ item.allow_share ? '允许共享' : '个人专用' }}
          </p>
          <div class="config-item__actions">
            <VrButton variant="text" size="sm" @click="openView(item)">查看</VrButton>
            <VrButton variant="text" size="sm" @click="openEdit(item)">编辑</VrButton>
            <VrButton variant="text" size="sm" @click="remove(item)">删除</VrButton>
          </div>
        </article>
        <p v-if="!filtered.length" class="empty">暂无配置</p>
      </div>
    </PanelCard>

    <VrModal v-model="editorVisible" :title="editorTitle" wide>
      <div class="form">
        <label class="form__field">
          <span>名称</span>
          <input v-model="editing.name" type="text" />
        </label>
        <label class="form__field">
          <span>类型</span>
          <select v-model="editing.type">
            <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </label>
        <label class="form__field">
          <span>内容</span>
          <textarea v-model="editing.value" rows="10" />
        </label>
        <label class="form__check">
          <input v-model="editing.allow_share" type="checkbox" />
          允许共享
        </label>
      </div>
      <template #footer>
        <VrButton variant="ghost" @click="editorVisible = false">取消</VrButton>
        <VrButton @click="save">保存</VrButton>
      </template>
    </VrModal>

    <VrModal v-model="viewerVisible" :title="editing.name" wide>
      <pre class="viewer">{{ editing.value }}</pre>
      <template #footer>
        <VrButton @click="touchCopy(editing.value)">复制</VrButton>
      </template>
    </VrModal>
  </DashboardLayout>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1rem;
}

.search {
  flex: 1;
  min-width: 180px;
  padding: 0.6rem 0.85rem;
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.45);
  outline: none;
}

.filter {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.config-list {
  display: grid;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .config-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

.config-item {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
}

.config-item__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.config-item__name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.config-item__type {
  font-size: 0.72rem;
  padding: 0.1rem 0.45rem;
  color: var(--color-accent-deep);
  background: rgba(171, 71, 188, 0.12);
  border-radius: 999px;
}

.config-item__share {
  margin-top: 0.35rem;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.config-item__actions {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.65rem;
}

.empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  color: var(--color-text-secondary);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.form__field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.form__field input,
.form__field select,
.form__field textarea {
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.5);
  font: inherit;
  outline: none;
}

.form__field textarea {
  resize: vertical;
  font-family: ui-monospace, monospace;
  font-size: 0.82rem;
}

.form__check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.88rem;
  cursor: pointer;
}

.viewer {
  padding: 0.85rem;
  max-height: 50vh;
  overflow: auto;
  font-size: 0.8rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
}
</style>
