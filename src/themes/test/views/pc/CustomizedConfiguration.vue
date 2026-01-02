<script setup lang="ts">
import { ref, h, computed } from 'vue'
import {
  getCustomizedConfiguration,
  uploadCustomizedConfiguration,
  deleteCustomizedConfiguration,
} from '@/utils/user'
import { touchCopy } from '@/utils/copy'
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/stores/userInfoStore'
import UserMainView from './UserMainView.vue'

const configuration_list = ref()
const search = ref('')
const configuration = ref()
const configuration_types = [{ value: 'clash_yaml', label: 'Clash Yaml 配置文件' }]

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
  configuration.value = configuration_list.value.find((v: any) => v.name == name && v.type == type)
  actionType.value = '编辑配置文件'
  dialogVisible.value = true
}
const show = ref(false)
const show_cc = (name: string, type: string) => {
  configuration.value = configuration_list.value.find((v: any) => v.name == name && v.type == type)
  show.value = true
}
const only_self = ref(true)
const view_data = computed(() => {
  return configuration_list.value
    ? (only_self.value
        ? configuration_list.value.filter((v: any) => v.user_id == user_info?.value?.user_id)
        : configuration_list.value
      ).filter((v: any) => JSON.stringify(v).toLowerCase().includes(search.value.toLowerCase()))
    : []
})

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

function allowShareFormatter(row: any, column: any, cellValue: any, rowIndex: any) {
  return cellValue
    ? h('span', { style: 'color: var(--el-color-success);' }, '允许共享')
    : h('span', { style: 'color: var(--el-color-warning);' }, '个人专用')
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
        <el-button type="primary" @click="new_cc()">新建配置</el-button>
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
        <el-table
          :data="view_data"
          height="100%"
          stripe
          table-layout="auto"
          :default-sort="{ prop: 'name', order: 'ascending' }"
          flexible
        >
          <el-table-column prop="name" label="名称" sortable />
          <el-table-column prop="type" label="类型" sortable />
          <!-- <el-table-column prop="value" label="值" sortable show-overflow-tooltip /> -->
          <el-table-column
            prop="allow_share"
            label="是否共享"
            sortable
            :formatter="allowShareFormatter"
          />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click="touchCopy(user_info?.sub_address[0] + '&cc=' + scope.row.name)"
              >
                复制订阅
              </el-button>
              <el-button
                type="primary"
                size="small"
                @click="edit_cc(scope.row.name, scope.row.type)"
                v-if="scope.row.user_id == user_info?.user_id"
              >
                编辑
              </el-button>
              <el-button
                type="primary"
                size="small"
                @click="show_cc(scope.row.name, scope.row.type)"
                v-if="scope.row.user_id != user_info?.user_id"
              >
                查看
              </el-button>
              <el-button
                type="primary"
                size="small"
                @click="del_cc(scope.row.name, scope.row.type)"
                v-if="scope.row.user_id == user_info?.user_id"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="value" label="值" sortable />
        </el-table>
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
        <el-button type="primary" @click="upload_cc(configuration)">确认上传</el-button>
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

.cc :deep(.el-table .cell) {
  white-space: nowrap;
}

.footer {
  margin-top: 6vh;
}

.cc {
  :deep(.el-table--fit) {
    border-radius: 5px;
  }

  overflow-x: auto;
}

.flex-row-wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.flex-row-wrap > div {
  justify-content: space-between;
}

.flex-row-wrap > div {
  min-width: 40vw;
}

.box {
  padding: 15px;
  border-radius: 15px;
  min-height: calc(100vh - 100px);
}
</style>
