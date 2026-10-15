import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  deleteCustomizedConfiguration,
  getCustomizedConfiguration,
  uploadCustomizedConfiguration,
} from '@/utils/user'
import { touchCopy } from '@/utils/copy'
import { useUserInfoStore } from '@/stores/userInfoStore'

export interface CustomConfig {
  user_id?: string
  type: string
  name: string
  value: string
  allow_share: boolean
}

export const configTypes = [{ value: 'clash_yaml', label: 'Clash YAML 配置文件' }]

/**
 * 个性化配置页通用逻辑：列表筛选、新建 / 编辑 / 查看 / 删除、复制带配置的订阅。
 */
export function useCustomConfig() {
  const userInfoStore = useUserInfoStore()
  const userInfo = computed(() => userInfoStore.getUserInfo())

  const list = ref<CustomConfig[]>([])
  const loading = ref(true)
  const onlyMine = ref(true)
  const search = ref('')

  const editorVisible = ref(false)
  const editorMode = ref<'create' | 'edit' | 'view'>('create')
  const saving = ref(false)
  const form = reactive<CustomConfig>({
    name: '',
    type: 'clash_yaml',
    value: '',
    allow_share: false,
  })

  const myCount = computed(
    () => list.value.filter((item) => item.user_id === userInfo.value?.user_id).length,
  )

  const viewData = computed(() => {
    let data = onlyMine.value
      ? list.value.filter((item) => item.user_id === userInfo.value?.user_id)
      : list.value
    const keyword = search.value.trim().toLowerCase()
    if (keyword) {
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(keyword) || item.type.toLowerCase().includes(keyword),
      )
    }
    return data.slice().sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'))
  })

  function isMine(item: CustomConfig) {
    return item.user_id === userInfo.value?.user_id
  }

  function subscriptionFor(item: CustomConfig) {
    const sub = userInfo.value?.sub_address[0]
    return sub ? `${sub}&cc=${encodeURIComponent(item.name)}` : ''
  }

  function copySubscription(item: CustomConfig) {
    const link = subscriptionFor(item)
    if (link) touchCopy(link)
  }

  function openCreate() {
    editorMode.value = 'create'
    Object.assign(form, { name: '', type: 'clash_yaml', value: '', allow_share: false })
    editorVisible.value = true
  }

  function openEdit(item: CustomConfig) {
    editorMode.value = 'edit'
    Object.assign(form, { ...item })
    editorVisible.value = true
  }

  function openView(item: CustomConfig) {
    editorMode.value = 'view'
    Object.assign(form, { ...item })
    editorVisible.value = true
  }

  async function load() {
    loading.value = true
    try {
      const res = await getCustomizedConfiguration()
      list.value = (res.result ?? []) as CustomConfig[]
    } catch {
      ElMessage.error('配置列表加载失败')
    } finally {
      loading.value = false
    }
  }

  async function save() {
    if (!form.name.trim()) return ElMessage.warning('请填写配置名称')
    if (!form.type) return ElMessage.warning('请选择配置类型')
    if (!form.value.trim()) return ElMessage.warning('请填写配置内容')
    saving.value = true
    try {
      const res = await uploadCustomizedConfiguration({
        name: form.name.trim(),
        type: form.type,
        value: form.value,
        allow_share: form.allow_share,
      })
      if (res.result) {
        ElMessage.success('配置已保存')
        editorVisible.value = false
        await load()
      } else {
        ElMessage.error('保存失败：' + (res.error?.message ?? JSON.stringify(res.error)))
      }
    } catch (e) {
      ElMessage.error('网络错误：' + String(e))
    } finally {
      saving.value = false
    }
  }

  async function remove(item: CustomConfig) {
    try {
      await ElMessageBox.confirm(`确定删除配置「${item.name}」吗？此操作不可撤销。`, '删除配置', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
      })
    } catch {
      return
    }
    try {
      const res = await deleteCustomizedConfiguration(item.type, item.name)
      if (res.result) {
        ElMessage.success('已删除')
      } else {
        ElMessage.error('删除失败：' + (res.error?.message ?? JSON.stringify(res.error)))
      }
      await load()
    } catch (e) {
      ElMessage.error('网络错误：' + String(e))
    }
  }

  onMounted(() => {
    userInfoStore.updateUserInfo()
    load()
  })

  return {
    userInfo,
    list,
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
    reload: load,
  }
}
