<template>
  <div class="announcement view">
    <Panel title="Announcement">
      <div class="list">
        <el-table
            v-loading="loading"
            element-loading-text="loading"
            ref="table"
            :data="announcements"
            style="width: 100%">
          <el-table-column
              width="100"
              prop="id"
              label="ID">
          </el-table-column>
          <el-table-column
              prop="title"
              label="Title">
          </el-table-column>
          <el-table-column
              prop="createDate"
              label="Create Date">
            <template slot-scope="scope">
              {{ scope.row.createDate }}
            </template>
          </el-table-column>
          <el-table-column
              prop="modifiedDate"
              label="Last Update">
            <template slot-scope="scope">
              {{scope.row.modifiedDate }}
            </template>
          </el-table-column>
          <el-table-column
              prop="authorName"
              label="Author">
          </el-table-column>
          <el-table-column
              fixed="right"
              label="Option"
              width="200">
            <div slot-scope="scope">
              <Button style="margin-left: 8px" icon="md-create" @click.native="openAnnouncementDialog(scope.row.id)"></Button>
              <Button type="error" name="Delete" icon="md-trash" @click.native="deleteAnnouncement(scope.row.id)"></Button>
            </div>
          </el-table-column>
        </el-table>
        <div class="panel-options">
          <el-button type="primary" size="small" @click="openAnnouncementDialog(null)" icon="el-icon-plus">Create</el-button>
          <Page v-if="!contestID" class="page"
                key="page"
                :total="total"
                :page-size="size"
                @on-change="getAllAnnouncements">
          </Page>
        </div>
      </div>
    </Panel>
    <!--dialog-->
    <el-dialog :title="announcementDialogTitle" :visible.sync="showEditAnnouncementDialog"
               :close-on-click-modal="false" style="text-align: left">
      <el-form label-position="top">
        <el-form-item label="Title" required>
          <el-input
              v-model="announcement.title"
              placeholder="Announcement title" class="title-input">
          </el-input>
        </el-form-item>
        <el-form-item label="Content" required>
          <Simditor v-model="announcement.content"></Simditor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click.native="showEditAnnouncementDialog = false" plain type="primary">Cancel</el-button>
          <el-button @click.native="submitAnnouncement" type="primary">Save</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../../api/api'
import Panel from "@/components/Panel.vue";
import Simditor from "@/components/Simditor.vue";


@Component({
  components: {
    Simditor,
    Panel
  },
})
export default class Announcement extends Vue {
  announcements: Array<any> = []
  title: any = ''
  content: any = 'ggg'
  id: any = ''
  contestID: string = ''
  page: number =  0
  size: number = 10
  total: number = 0

  loading : boolean = true
  showEditAnnouncementDialog:boolean = false

  currentAnnouncementId: string = ''
  announcementDialogTitle: string = ''
  // new - edit model
  announcement: any =  {
    title:  '',
    content: ''
  }
  mode: string = 'create'
  getAllAnnouncements() {
    this.loading = true
    api
    .getAllAnnouncements({
      page: this.page ,
      size: this.size
    })
    .then((res: any) => {
      this.loading = false
      this.total = res.data.total
      this.announcements = res.data.list
    })
    .catch((err: any) => {
      console.log(err, 'err')
      this.loading  = false
    })
  }

  removeAnnouncement(id: string) {
    api
    .removeAnnouncement({ id })
    .then((res: any) => {
      ;(this as any).$Message.success('Delete successful')
      this.getAllAnnouncements()
    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
    })
  }

  openAnnouncementDialog(id: any) {
    this.showEditAnnouncementDialog = true
    if (id !== null) {
      this.currentAnnouncementId = id
      this.announcementDialogTitle = 'Edit Announcement'

      this.announcements.find((item: any) => {
        if (item.id === this.currentAnnouncementId) {
          this.announcement.title = item.title
          this.announcement.content = item.content
          this.mode = 'edit'
        }
      })
    } else {
      this.announcementDialogTitle = 'Create Announcement'
      this.announcement.title = ''
      this.announcement.content = ''
      this.mode = 'create'
    }
  }
  deleteAnnouncement(id: string){
    this.$confirm('Are you sure you want to delete this announcement?', 'Warning', {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }).then(()=> {
      this.loading = true
      this.removeAnnouncement(id)
    })
  }

  submitAnnouncement(data: any){
    if(!data.title){
      data = {
        id: this.currentAnnouncementId,
        title: this.announcement.title,
        content: this.announcement.content,
      }
    }
    if (this.mode === 'edit'){
      api.updateAnnouncement(data).then(res => {
        this.$Message.success("Update successfully")
        this.showEditAnnouncementDialog = false
        this.getAllAnnouncements()
      }).catch(err => {
        this.$Message.error(err.data.message)
      })
    } else {
      api.createAnnouncement(data).then(res => {
        this.$Message.success("Create successfully")
        this.showEditAnnouncementDialog = false
        this.getAllAnnouncements()
      }).catch(err => {
        this.$Message.error(err.data.message)
      })
    }
  }

  mounted() {
    this.getAllAnnouncements()
  }
}
</script>

<style scoped lang="less">
.title-input {
  margin-bottom: 20px;
}

.item {
  border-bottom: 1px solid #e8eaec;
  padding-top: 10px;
}
</style>
