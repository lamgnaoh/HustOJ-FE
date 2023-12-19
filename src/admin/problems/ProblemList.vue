<template>
  <div class="problem">
    <Panel title="Problem List">
      <div slot="header">
        <Input
            v-model="keyword"
            search enter-button
            placeholder="Keywords">
        </Input>
      </div>
      <div>
        <el-table element-loading-text="loading"
                  ref="table"
                  :data="problems"
                  style="width: 100%">
          <el-table-column
              prop="id"
              label="ID"
              width="100">
          </el-table-column>
          <el-table-column
              label="Code"
              prop="problemCode"
              width="130">
          </el-table-column>
          <el-table-column
              label="Title"
              prop="title"
              width="200">
          </el-table-column>
          <el-table-column
              label="Create date"
              prop="create"
              width="200">
          </el-table-column>
          <el-table-column
              label="Author"
              prop="author"
              width="150">
          </el-table-column>
          <el-table-column
              width="100"
              label="Visible">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.visible"
                         active-text=""
                         inactive-text=""
                         @change="updateVisible(scope.row.id)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
              label="Rate"
              prop="rate"
              width="150">
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
              <Button style="margin-left: 8px" icon="md-download"
                      @click.native="downloadTestCase(scope.row.id)" >
              </Button>
              <Button type="error" style="margin-left: 8px" icon="md-trash"
                      @click="deleteProblem(scope.row.id)">
              </Button>
            </div>
          </el-table-column>

        </el-table>
        <Row class-name="last-row">
          <Col span="4"
          >Show only visible
            <i-Switch v-model="visible" @on-change="visibleChange"></i-Switch>
          </Col>
          <Col offset="6">
            <Page
                :total="totalPage"
                show-sizer
                @on-change="pageChange"
                @on-page-size-change="pageSizeChange"
            />
          </Col>
        </Row>
      </div>
    </Panel>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'
import api from '@/api/api.ts'
import ProblemForm from '@/components/ProblemForm.vue'
import Panel from "@/components/Panel.vue";
import {downloadFile} from "@/util/util"

@Component({
  components: {
    ProblemForm,
    Panel
  },
})
export default class Problemlist extends Vue {
  problems: Array<any> = []
  visible: boolean = false
  pageSize: number = 10
  page: number = 0
  totalPage: number = 100
  keyword: string = ''
  total: any = 0
  contestId: any = ''

  @Watch('keyword')
  onSearchByKeyword() {
    this.search(this.keyword);
  }

  getProblems(page: number = 0, pageSize: number = 10) {
    // Get all data
    this.problems.splice(0, this.problems.length)
    api
    .adminGetProblems({
      page: page,
      size: pageSize,
      visible: this.visible,
    })
    .then((res: any) => {
      this.totalPage = res.data.total
      const that = this
      res.data.list.forEach(function (item: any) {
        that.problems.push({
          problemCode: item.problemCode,
          id: item.id,
          title: item.title,
          level: item.difficulty,
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
        })
      })
    })
    .catch((err: any) => {
      console.log(err, 'err')
    })
  }

  updateVisible(id: string) {
    api.adminGetProblemsDetail({id}).then((res: any) => {
      res.data.visible = !res.data.visible
      api.updateProblem({
        id,
        problem: res.data
      }).then((res: any) => {
        this.$Message.success("Update successfully")
      }).catch((err: any) => {
        this.$Message.error("Update Failed")
      })
    }).catch((err: any) => {
      this.$Message.error(err.message)
    })
  }

  search(keyword: string) {
    api
    .adminGetProblemsIdByTitle({keyword})
    .then((res: any) => {
      const that = this
      const temp: any = []
      this.total = res.data.total
      res.data.list.forEach(function (item: any) {
        temp.push({
          problemCode: item.problemCode,
          id: item.id,
          title: item.title,
          level: item.difficulty,
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
        })
      })
      that.problems = temp
    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
    })
  }

  visibleChange() {
    // get problem visible
    this.getProblems()
  }

  pageChange(pages: number) {
    this.page = pages - 1
    this.getProblems(pages - 1, this.pageSize)
  }

  pageSizeChange(size: number) {
    this.getProblems(this.page, size)
    this.pageSize = size
  }

  editor(problemId: string) {
    this.$router.push({name: 'edit-problem', params: {problemId}})
  }

  deleteProblem(id: string) {
    this.$confirm('Sure to delete this problem? The associated submissions will be deleted as well.',
        'Delete Problem', {
          type: 'warning'
        }).then(() => {
      api
      .deleteProblem({id: id})
      .then(() => {
        ;(this as any).$Message.success('Delete successfully')
        this.getProblems(this.page, this.pageSize)
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
    this.getProblems()
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
