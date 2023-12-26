<template>
  <div class="problem">
    <Panel title="Contest problem list" v-if="displayPanel">
      <div slot="header">
        <Input
            v-model="keyword"
            search enter-button
            placeholder="Keywords">
        </Input>
      </div>
      <div v-if="editorProblem">
        <el-table
            element-loading-text="loading"
            ref="table"
            :data="problems"
            style="width: 100%"
        >
          <el-table-column
              width="150"
              prop="problemCode"
              label="Code">
          </el-table-column>

          <el-table-column
              prop="title"
              label="Title">
          </el-table-column>
          <el-table-column
              width="100"
              prop="rate"
              label="Rate">
          </el-table-column>
          <el-table-column
              prop="author"
              label="Author">
          </el-table-column>
          <el-table-column
              width="200"
              prop="create"
              label="Create date">
          </el-table-column>
          <el-table-column
              width="100"
              label="Visible">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.visible"
                         active-text=""
                         inactive-text=""
                         @change="updateVisible($event,scope.row.id)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
              fixed="right"
              align="center"
              width="250"
              label="Action">
            <div slot-scope="scope">
              <Button size="default" style="margin-left: 8px"
                      icon="md-create" @click.native="goEdit(scope.row.id)">
              </Button>
              <Button style="margin-left: 8px" icon="md-download"
                      @click.native="downloadTestCase(scope.row.id)" >
              </Button>
              <Button type="error" style="margin-left: 8px" icon="md-trash" @click="deleteContestProblem(scope.row.id)" >
              </Button>
            </div>
          </el-table-column>

        </el-table>

        <div class="panel-options">
          <el-button type="primary" size="small"
                     @click="goCreateProblem" icon="el-icon-plus">Create
          </el-button>
          <el-button v-if="contestId" type="primary"
                     size="small" icon="el-icon-plus"
                     @click="addProblemDialogVisible = true">Add From Public Problem
          </el-button>
          <Page class="page"
              :total="total"
              show-sizer
              @on-change="pageChange"
              @on-page-size-change="pageSizeChange"
          />
        </div>
      </div>
    </Panel>
    <el-dialog title="Add Contest Problem"
               v-if="contestId"
               width="80%"
               :visible.sync="addProblemDialogVisible"
               @close-on-click-modal="false">
      <AddProblemComponent :contestID="contestId" @on-change="getContestProblems">
      </AddProblemComponent>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'
import api from '@/api/api.ts'
import ProblemForm from '@/components/ProblemForm.vue'
import Panel from "@/components/Panel.vue";
import AddProblemComponent from '@/admin/problems/AddPublicProblem.vue'
import {downloadFile} from "@/util/util";

@Component({
  components: {
    ProblemForm,
    AddProblemComponent,
    Panel
  },
})
export default class ContestProblemList extends Vue {
  problems: Array<any> = []
  visible: boolean = false
  pageSize: number = 10
  page: number = 0
  editorProblem: boolean = true
  keyword: string = ''
  displayPanel: boolean = true
  total: any = 0
  contestId: any = ''
  addProblemDialogVisible = false
  @Watch('keyword')
  onSearchByKeyword(){
    this.search();
  }

  getContestProblems(page: number = 0, pageSize: number = 10) {
    this.addProblemDialogVisible = false
    // Get all data
    this.problems = []
    api
    .adminGetContestProblems({
      page,
      pageSize,
      id: this.contestId,
      keyword: this.keyword
    })
    .then((res: any) => {
      this.total = res.data.total
      const that = this
      res.data.list.forEach(function(item: any) {
        that.problems.push({
          id: item.id,
          problemCode: item.problemCode,
          title: item.title,
          rate:
              Math.floor(item.acceptRate * 100) +
              '%(' +
              String(item.acceptCount) +
              ' / ' +
              String(item.submitCount) +
              ')',
          create: item.createDate,
          author: item.authorName,
          visible: item.visible,
          createInContest: item.createInContest
        })
      })
    })
    .catch((err: any) => {
      console.log(err, 'err')
    })
  }

  goCreateProblem(){
    this.$router.push({name: 'create-contest-problem', params: {contestId: this.contestId}})
  }

  updateVisible(value: any  ,problemId: string) {
    api.updateContestProblemVisible(problemId , this.contestId ,value).then((res:any) => {
      this.$Message.success("Update successfully")
    }).catch((err: any) => {
      this.$Message.error("Update Failed")
    })
  }

  search() {
    this.getContestProblems(0,this.pageSize)
  }

  pageChange(pages: number) {
    this.page = pages - 1
    this.getContestProblems(pages - 1, this.pageSize)
  }

  pageSizeChange(size: number) {
    this.getContestProblems(this.page, size)
    this.pageSize = size
  }

  goEdit(problemId: string) {
    // Edit contest problem
    this.$router.push({name: 'edit-contest-problem', params: { problemId: problemId, contestId: this.contestId}})

  }

  deleteContestProblem(problemId: string) {
    this.$confirm('Sure to delete this problem? The associated submissions will be deleted as well.', 'Delete Problem', {
      type: 'warning'
    }).then(() => {
      api
      .deleteContestProblem(problemId , this.contestId)
      .then(() => {
        ;(this as any).$Message.success('Delete successfully')
        this.getContestProblems(this.page, this.pageSize)
      })
      .catch(() => {
        ;(this as any).$Message.error('Failed')
      })
    })
  }
  downloadTestCase(problemId:number){
    downloadFile('/api/v1/download/testcase?problemId=' + problemId)
  }

  mounted() {
    this.contestId = this.$route.params.contestId
    this.getContestProblems()
  }
}
</script>

<style lang="less" scoped>
h2 {
  font-weight: 500;
  font-size: 36px;
  margin-bottom: 24px;
}

.problem {
  text-align: left;
  margin-top: 48px;
}

.row-height {
  height: 42px;
  line-height: 41px;
  border-top: 1px solid rgb(221, 221, 221);
  &:nth-child(odd) {
    background-color: #f9f9f9;
  }
}

.last-row {
  margin-top: 24px;
}
</style>
