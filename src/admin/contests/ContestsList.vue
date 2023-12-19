<template>
  <div>
    <Panel title="Contest List">
      <div slot="header">
        <Input
            v-model="keyword"
            search enter-button
            placeholder="Keywords">
        </Input>
      </div>
      <el-table
          element-loading-text="loading"
          ref="table"
          :data="contests"
          style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <p>Start Time: {{ props.row.startDate }}</p>
            <p>End Time: {{ props.row.endDate }}</p>
            <p>Create Time: {{ props.row.createDate }}</p>
            <p>Creator: {{ props.row.authorName }}</p>
          </template>
        </el-table-column>
        <el-table-column
            prop="name"
            label="Name">
        </el-table-column>
        <el-table-column
            label="Rule Type"
            width="150">
          <template slot-scope="scope">
            <el-tag type="gray">{{ scope.row.contestRuleType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="Contest Type"
            width="200">
          <template slot-scope="scope">
            <el-tag :type="scope.row.contestType === 'PUBLIC' ? 'success' : 'primary'">
              {{ scope.row.contestType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="Status"
            width="130">
          <template slot-scope="scope">
            <el-tag
                :type="scope.row.status === 'ENDED' ? 'danger' : scope.row.status === 'PROCESSING' ? 'success' : 'primary'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
            width="100"
            label="Visible">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.visible"
                       active-text=""
                       inactive-text=""
                       @change="setVisible(scope.row.id,scope.row.visible)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            width="250"
            label="Action"
            align="center"
        >
          <div slot-scope="scope">
            <Button style="margin-left: 8px" icon="md-create"
                    @click.native="editor(scope.row.id)">
            </Button>
            <Button icon="md-list" style="margin-left: 8px"
                    @click.native="toProblem(scope.row.id)">
            </Button>
            <Button
                icon="md-people"
                style="margin-left: 8px"
                @click="toMember(scope.row.id)"
            ></Button
            >
            <Button type="error" style="margin-left: 8px" icon="md-trash"
                    @click="deleteContest(event,scope.row.id, scope.row)">
            </Button>
            <!--            Todo-->
            <!--            <icon-btn name="Announcement" icon="info-circle"-->
            <!--                      @click.native="goContestAnnouncement(scope.row.id)"></icon-btn>-->
            <!--            <icon-btn icon="download" name="Download Accepted Submissions"-->
            <!--                      @click.native="openDownloadOptions(scope.row.id)"></icon-btn>-->
          </div>
        </el-table-column>
      </el-table>
      <Row>
        <Col span="24" style="padding-top: 30px;text-align: center">
          <Page
              :total="total"
              show-sizer
              @on-change="pageChange"
              @on-page-size-change="pageSizeChange"
          />
        </Col>
      </Row>
    </Panel>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'
import api from '../../api/api'
import Panel from "@/components/Panel.vue";

@Component({
  components: {
    Panel
  },
})
export default class Index extends Vue {
  total: number = 0
  pageSize: number = 20
  page: number = 0
  contests: any = []
  rank: any = ''
  keyword: any = ''

  // contest parameter
  authorId: any = this.$store.state.userInfo.id
  name: any = ''
  description: any = ''
  contestType: any = 'PUBLIC'
  judgeType: any = ''
  enable: any = true
  visible: any = 'true'
  startDate: any = ''
  endDate: any = ''
  password: any = ''

  @Watch('keyword')
  onSearchByKeyword() {
    this.search(this.keyword);
  }

  search(keyword: string) {
    api.adminGetContests({name: keyword})
    .then((res: any) => {
      this.total = res.data.total
      this.contests = res.data.list
    }).catch(() => {
      ;(this as any).$Message.error('Failed')
    })
  }

  pageChange(pages: number) {
    this.page = pages - 1
    this.getContests(pages - 1, this.pageSize)
  }

  pageSizeChange(size: number) {
    this.getContests(this.page, size)
    this.pageSize = size
  }

  getContests(page: number = 0, pageSize: number = 10) {
    this.contests = []
    api
    .adminGetContests({
      page: page,
      size: pageSize,
    })
    .then((res: any) => {
      this.$store.state.contestList = res.data.list
      this.total = res.data.total
      this.contests = res.data.list
    })
    .catch(() => {
      ;(this as any).$Message.error('Failed')
    })
  }

  editor(contestId: string) {
    this.$router.push({name: 'edit-contest', params: {contestId}})
  }
  deleteContest(event: any, id: string, row: any) {

    this.$confirm('Sure to delete the contest? The associated resources created ' +
        'will be deleted as well, like problem, submission, announcement, ranking,  etc.', 'confirm',
        {
          type: 'warning'
        }).then(() => {
      if (row.status == "PROCESSING") {
        ;(this as any).$Message.error('Cannot delete contest while processing');
        event.preventDefault();
      }
      api
      .deleteContest({id})
      .then((res: any) => {
        ;(this as any).$Message.success('Delete successful')
        this.getContests()
      })
      .catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      })
    })
  }

  setVisible(id: string, visible: boolean) {
    api
    .setVisibleContest({
      id: id,
      visible
    })
    .then((res: any) => {
      ;(this as any).$Message.success('Update successfull')
      this.getContests()
    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
    })
  }

  toMember(id: string) {
    this.$router.push({
      path: `/admin/contest-member/${id}`,
    })
  }

  toProblem(id: string) {
    this.$router.push({
      path: `/admin/contest-problems/${id}`,
    })
  }

  mounted() {
    this.getContests()
  }
}
</script>

<style scoped lang="less">
.list {
  border-bottom: 1px solid #ddd;
  font-weight: 400;
  padding: 15px 0 15px 0;

  .list-title {
    text-align: left;
    color: rgba(0, 0, 0, 0.7);
  }
}

.item {
  border-bottom: 1px solid #e8eaec;
  padding-top: 10px;

  &:nth-child(odd) {
    background-color: #f9f9f9;
  }
}

.item-padding {
  padding: 20px 0 20px 0;
}
</style>
