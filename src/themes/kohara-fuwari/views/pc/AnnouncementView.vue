<script setup lang="ts">
import UserMainView from './UserMainView.vue'
import { computed, onMounted } from 'vue'
import { useAnnouncementStore } from '@/stores/announcementStore'

// 使用公告 store
const announcementStore = useAnnouncementStore()

// 初始化公告数据
onMounted(async () => {
  await announcementStore.updateAnnouncement()
})

// 获取公告列表
const announcement_list = computed(() => {
  return announcementStore.getAnnouncement() || []
})

// 置顶公告列表
const pin_announcement_list = computed(() => {
  return announcement_list.value
    .filter((item) => item.pin)
    .sort((a, b) => b.edit_time - a.edit_time)
})

// 非置顶公告列表
const unpin_announcement_list = computed(() => {
  return announcement_list.value
    .filter((item) => !item.pin)
    .sort((a, b) => b.create_time - a.create_time)
})
</script>

<template>
  <UserMainView>
    <div class="announcement-main">
      <div>
        <h3>置顶公告</h3>
        <div class="announcement box" v-for="item in pin_announcement_list" :key="item.create_time">
          <div v-html="item.announcement"></div>
          <hr />
          <p class="timeline">创建时间:{{ new Date(item.create_time / 1000).toLocaleString() }}</p>
          <p class="timeline">修改时间:{{ new Date(item.edit_time / 1000).toLocaleString() }}</p>
        </div>
      </div>
      <div>
        <h3>公告</h3>
        <div
          class="announcement box"
          v-for="item in unpin_announcement_list"
          :key="item.create_time"
        >
          <div v-html="item.announcement"></div>
          <hr />
          <p class="timeline">创建时间:{{ new Date(item.create_time / 1000).toLocaleString() }}</p>
          <p class="timeline">修改时间:{{ new Date(item.edit_time / 1000).toLocaleString() }}</p>
        </div>
      </div>
    </div>
  </UserMainView>
</template>

<style scoped lang="scss">
.announcement-main {
  display: flex;
  flex-wrap: wrap;
  padding: 1vh 2vh 1vh 2vh;
  flex-direction: column;

  /* height: calc(100vh - 120px); */
  /* overflow: scroll; */
  :deep(*) {
    line-height: 2.5;
  }
}

.announcement {
  flex: 1 1 auto;
  margin: 2vh;
  // padding: 2vh;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 38px;
}

.timeline {
  font-size: 12px;
}

h3 {
  text-align: center;
  margin: 10px;
}
</style>
