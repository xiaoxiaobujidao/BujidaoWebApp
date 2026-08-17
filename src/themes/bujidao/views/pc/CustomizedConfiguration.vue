<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  getCustomizedConfiguration,
  uploadCustomizedConfiguration,
  deleteCustomizedConfiguration,
} from '@/utils/user'
import { touchCopy } from '@/utils/copy'
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/stores/userInfoStore'
import UserMainView from './UserMainView.vue'
import BjButton from '@bujidao/components/ui/BjButton.vue'

type SortKey = 'name' | 'type' | 'allow_share' | 'value'

const configuration_list = ref<any[]>()
const search = ref('')
const configuration = ref()
const configuration_types = [{ value: 'clash_yaml', label: 'Clash Yaml 配置文件' }]
const sortKey = ref<SortKey>('name')
const sortAsc = ref(true)

const dialogVisible = ref(false)
const actionType = ref('')
function new_cc() {
  configuration.value = {
    name: '',
    type: '',
    value: '',
    allow_share: false,
  }
  actionType.value = '新建配置文件'
  dialogVisible.value = true
}
function edit_cc(name: string, type: string) {
  configuration.value = configuration_list.value?.find((v: any) => v.name == name && v.type == type)
  actionType.value = '编辑配置文件'
  dialogVisible.value = true
}
const show = ref(false)
const show_cc = (name: string, type: string) => {
  configuration.value = configuration_list.value?.find((v: any) => v.name == name && v.type == type)
  show.value = true
}
const only_self = ref(true)
const view_data = computed(() => {
  if (!configuration_list.value) return []
  let list = only_self.value
    ? configuration_list.value.filter((v: any) => v.user_id == user_info?.value?.user_id)
    : [...configuration_list.value]
  if (search.value) {
    const keyword = search.value.toLowerCase()
    list = list.filter(
      (v: any) =>
        String(v.name || '')
          .toLowerCase()
          .includes(keyword) ||
        String(v.type || '')
          .toLowerCase()
          .includes(keyword),
    )
  }
  list.sort((a, b) => {
    const av = a[sortKey.value] ?? ''
    const bv = b[sortKey.value] ?? ''
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return sortAsc.value ? cmp : -cmp
  })
  return list
})

function toggleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

function sortMark(key: SortKey) {
  if (sortKey.value !== key) return ''
  return sortAsc.value ? ' ↑' : ' ↓'
}

function del_cc(name: string, type: string) {
  deleteCustomizedConfiguration(type, name)
    .then((res: any) => {
      if (res.result) {
        ElMessage.success('成功删除配置文件')
      } else {
        ElMessage.error('删除配置文件失败：' + JSON.stringify(res.error))
      }
      init()
      dialogVisible.value = false
    })
    .catch((e: any) => {
      ElMessage.error('网络错误：' + e)
      init()
      dialogVisible.value = false
    })
}
function upload_cc(v: any) {
  uploadCustomizedConfiguration({
    name: v.name,
    type: v.type,
    value: v.value,
    allow_share: v.allow_share,
  })
    .then((res: any) => {
      if (res.result) {
        ElMessage.success('成功上传配置文件')
      } else {
        ElMessage.error('上传配置文件失败：' + JSON.stringify(res.error))
      }
      init()
      dialogVisible.value = false
    })
    .catch((e: any) => {
      ElMessage.error('网络错误：' + e)
      init()
      dialogVisible.value = false
    })
}

const userInfoStore = useUserInfoStore()
userInfoStore.updateUserInfo()
const user_info = computed(() => userInfoStore.getUserInfo())
const init = () => {
  getCustomizedConfiguration().then((res) => {
    configuration_list.value = res.result
  })
}
init()
</script>

<template>
  <UserMainView>
    <div class="box">
      <div class="add-cc">
        <BjButton @click="new_cc()">新建配置</BjButton>
      </div>
      <div class="flex-row-wrap">
        <div>
          <el-switch v-model="only_self" active-text="仅自己" inactive-text="所有人" />
        </div>
        <div>
          <el-input v-model="search" placeholder="请输入搜索关键字" clearable />
        </div>
      </div>
      <div class="cc">
        <div class="bj-table-wrap">
          <table class="bj-table">
            <thead>
              <tr>
                <th class="is-sortable" @click="toggleSort('name')">名称{{ sortMark('name') }}</th>
                <th class="is-sortable" @click="toggleSort('type')">类型{{ sortMark('type') }}</th>
                <th class="is-sortable" @click="toggleSort('allow_share')">
                  是否共享{{ sortMark('allow_share') }}
                </th>
                <th>操作</th>
                <th class="is-sortable" @click="toggleSort('value')">值{{ sortMark('value') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in view_data" :key="`${row.user_id}-${row.type}-${row.name}`">
                <td class="bj-table__name">{{ row.name }}</td>
                <td>
                  <span class="bj-table__badge">{{ row.type }}</span>
                </td>
                <td>
                  <span
                    class="bj-table__badge"
                    :class="row.allow_share ? 'bj-table__badge--ok' : 'bj-table__badge--warn'"
                  >
                    {{ row.allow_share ? '允许共享' : '个人专用' }}
                  </span>
                </td>
                <td class="bj-table__actions">
                  <BjButton
                    size="sm"
                    @click="touchCopy(user_info?.sub_address[0] + '&cc=' + row.name)"
                  >
                    复制订阅
                  </BjButton>
                  <BjButton
                    v-if="row.user_id == user_info?.user_id"
                    size="sm"
                    @click="edit_cc(row.name, row.type)"
                  >
                    编辑
                  </BjButton>
                  <BjButton
                    v-if="row.user_id != user_info?.user_id"
                    size="sm"
                    @click="show_cc(row.name, row.type)"
                  >
                    查看
                  </BjButton>
                  <BjButton
                    v-if="row.user_id == user_info?.user_id"
                    size="sm"
                    variant="ghost"
                    @click="del_cc(row.name, row.type)"
                  >
                    删除
                  </BjButton>
                </td>
                <td>
                  <span class="bj-table__mono" :title="row.value">{{ row.value }}</span>
                </td>
              </tr>
              <tr v-if="!view_data.length">
                <td colspan="5" class="bj-table__empty">暂无配置</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="footer"></div>
    </div>
    <el-dialog v-model="dialogVisible" :title="actionType" width="500">
      <p>
        类型
        <el-select
          v-model="configuration.type"
          placeholder="Select"
          size="large"
          style="width: 240px"
        >
          <el-option
            v-for="item in configuration_types"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </p>
      <p>
        名称
        <el-input v-model="configuration.name" />
      </p>
      <p>
        值
        <el-input type="textarea" v-model="configuration.value" />
      </p>
      <p>
        是否允许其他用户使用
        <el-switch v-model="configuration.allow_share" active-text="允许" inactive-text="拒绝" />
      </p>
      <p>
        <BjButton @click="upload_cc(configuration)">确认上传</BjButton>
      </p>
      <p>节点信息已清除，请放心上传</p>
    </el-dialog>
    <el-dialog v-model="show" title="配置文件" width="80%">
      <p>
        值
        <el-input autosize type="textarea" v-model="configuration.value" />
      </p>
    </el-dialog>
  </UserMainView>
</template>

<style lang="scss" scoped>
.add-cc {
  margin: 20px 3px;
}

.footer {
  margin-top: 6vh;
}

.cc {
  margin-top: 1rem;
}

.flex-row-wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.flex-row-wrap > div {
  min-width: min(40vw, 280px);
  flex: 1;
}

.box {
  padding: 15px;
  border-radius: 15px;
  min-height: calc(100vh - 100px);
}

.bj-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-card), var(--shadow-glow);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.bj-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.bj-table th,
.bj-table td {
  padding: 0.8rem 0.85rem;
  text-align: left;
  border-bottom: 1px solid rgba(61, 165, 232, 0.1);
  vertical-align: middle;
}

.bj-table tbody tr:last-child td {
  border-bottom: none;
}

.bj-table tbody tr:nth-child(even) {
  background: rgba(61, 165, 232, 0.04);
}

:global(.dark) .bj-table tbody tr:nth-child(even) {
  background: rgba(255, 255, 255, 0.03);
}

.bj-table th {
  font-weight: 600;
  font-size: 0.82rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
  background: rgba(61, 165, 232, 0.06);
}

:global(.dark) .bj-table th {
  background: rgba(255, 255, 255, 0.04);
}

.bj-table th.is-sortable {
  cursor: pointer;
  user-select: none;
}

.bj-table th.is-sortable:hover {
  color: var(--color-ocean-deep);
}

.bj-table__name {
  font-weight: 500;
  color: var(--color-text-primary);
}

.bj-table__mono {
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: 0.78rem;
  max-width: 16rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-secondary);
}

.bj-table__actions {
  white-space: nowrap;
  text-align: right;
}

.bj-table__empty {
  text-align: center;
  color: var(--color-text-secondary);
  padding: 2rem 0.85rem !important;
}

.bj-table__badge {
  display: inline-block;
  padding: 0.15rem 0.55rem;
  font-size: 0.78rem;
  color: var(--color-ocean-deep);
  background: rgba(61, 165, 232, 0.12);
  border-radius: 999px;
  white-space: nowrap;
}

:global(.dark) .bj-table__badge {
  color: var(--color-ocean-light);
}

.bj-table__badge--ok {
  color: #1a7a4c;
  background: rgba(46, 160, 100, 0.14);
}

.bj-table__badge--warn {
  color: var(--color-sand-deep);
  background: rgba(201, 149, 74, 0.16);
}
</style>
