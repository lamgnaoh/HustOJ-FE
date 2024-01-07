<template>
  <PanelOJ shadow :padding="10">
    <div slot="title" style="text-align: left">
      Announcement
    </div>
    <div slot="extra">
      <Button v-if="listVisible" type="info" @click="init" :loading="btnLoading">Refresh</Button>
      <Button v-else type="info" icon="ios-undo" @click="goBack">Back</Button>
    </div>
    <transition-group name="announcement-animate" mode="in-out">
      <div class="no-announcement" v-if="!announcements.length" key="no-announcement">
        <p>No announcement</p>
      </div>
      <template v-if="listVisible">
        <ul class="announcements-container" key="list">
          <li v-for="announcement in announcements" :key="announcement.title">
            <el-row>
              <el-col :span="19">
                <a class="entry" @click="goAnnouncement(announcement)">
                  <el-icon class="el-icon-chat-round"></el-icon>
                  <span style="padding: 0 10px">{{ announcement.title }}</span>
                </a>
              </el-col>
              <el-col :span="3">{{ announcement.createDate }}</el-col>
              <el-col :span="2"> By {{ announcement.authorName }}</el-col>
            </el-row>
          </li>
        </ul>
        <Page v-if="!isContest"
              key="page"
              style="text-align: center;"
              :total="total"
              :page-size="limit"
              @on-change="getAnnouncements">
        </Page>
      </template>
      <template v-else>
        <div v-html="announcement.content" key="content" class="content-container"></div>
      </template>
    </transition-group>
  </PanelOJ>

</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import api from '../api/api'
import PanelOJ from "@/components/PanelOJ.vue";

@Component({
  components: {
    PanelOJ
  }
})
export default class Announcement extends Vue {
  announcements: any = []
  listVisible: boolean = true
  announcement: any = null
  isContest: boolean = false
  total: number = 10
  limit: number = 10
  page: number = 0
  btnLoading: boolean = false

  getAnnouncements() {
    this.btnLoading = true
    api
    .getAllAnnouncements({
      page: this.page,
      size: this.limit
    })
    .then((res: any) => {
      this.btnLoading = false
      res.data.list.forEach((item: any) => {
        this.announcements.push({
          authorId: item.authorId,
          authorName: item.authorName,
          content: item.content,
          id: item.id,
          modifiedDate: item.modifiedDate,
          createDate: item.createDate,
          title: item.title,
        })
      })
    })
    .catch((err: any) => {
      this.btnLoading = false
      ;(this as any).$Message.error(err.data.message)
    })
  }

  goAnnouncement(announcement: any) {
    console.log(announcement)
    this.announcement = announcement
    this.listVisible = false
  }

  goBack () {
    this.listVisible = true
    this.announcement = null
  }

  init(){
    this.announcements = []
    this.getAnnouncements()
  }

  mounted() {
    this.getAnnouncements()
  }
}
</script>

<style lang="less" scoped>
.announcements-container {
  margin-top: -10px;
  margin-bottom: 10px;

  li {
    padding-top: 15px;
    list-style: none;
    padding-bottom: 15px;
    margin-left: 20px;
    font-size: 16px;
    border: 1px solid rgba(187, 187, 187, 0.5);
  }

  .entry {
    float: left;
    padding: 0 30px;
  }
}

.content-container {
  padding: 0 20px 20px 20px;
  text-align: left;
}

.no-announcement {
  text-align: center;
  font-size: 16px;
}
.announcement-animate-enter-active {
  animation: fadeIn 1s;
}

.content {
  text-align: left;
  min-height: 600px;
}
</style>
