<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import api from "@/api/api";
import ReportIssue from "@/components/ReportIssue.vue";
import Panel from "@/components/Panel.vue";

@Component({
  components: {ReportIssue, Panel}
})
export default class IssuePage extends Vue {
  listIssue: Array<any> = []
  page: number = 0
  size: number = 10
  status: string = ''
  total: number = 0
  loading: boolean = false
  showDetail: boolean = false
  issue: any = {
    name: '',
    description: '',
    problemId: ''
  }
  listStatus: Array<any> = [
    {label: 'NEW', value: 'NEW'},
    {label: 'PROCESSING', value: 'PROCESSING'},
    {label: 'DONE', value: 'DONE'},
  ]

  getPage() {
    this.loading = true
    let data
    if (this.status) {
      data = {
        page: this.page,
        size: this.size,
        status: this.status
      }
    } else {
      data = {
        page: this.page,
        size: this.size
      }
    }
    api
        .pageIssue(data)
        .then((res: any) => {
          this.total = res.data.total
          this.listIssue = res.data.content
        })
        .catch((err: any) => {
          console.log(err, 'err')
        })
    this.loading = false
  }

  detail(id: number) {
    this.loading = true
    api
        .detailIssue({
          id: id
        })
        .then((res: any) => {
          this.issue.name = res.data.name
          this.issue.description = res.data.description
          this.issue.problemId = res.data.problemId.toString()
          this.showDetail = true
        })
        .catch((err: any) => {
          console.log(err, 'err')
        })
    this.loading = false
  }

  changeStatus(id: number, status: string) {
    api
        .saveIssue({id: id, status: status})
        .then((res: any) => {
          let response = res.data
          if (response.id) {
            (this as any).$Message.success("Success!")
          } else {
            (this as any).$Message.error("Fail! Try again later!")
          }
        })
        .catch((err: any) => {
          ;(this as any).$Message.error(err.data.message)
        })
  }

  mounted() {
    this.getPage()
  }
}
</script>

<template>
  <Panel title="Issue">
    <div v-if="!showDetail" class="issue-table-wrapper">
      <el-table ref="issueTable"
                v-loading="loading"
                :data="listIssue"
                class="issue-table"
                element-loading-text="loading">
        <el-table-column label="Id" prop="id" width="50"></el-table-column>
        <el-table-column label="Name" prop="name"></el-table-column>
        <el-table-column label="Status" prop="status">
          <template slot-scope="scope">
            <el-select v-model="scope.row.status" @change="changeStatus(scope.row.id, scope.row.status)" size="mini">
              <el-option
                  v-for="item in listStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Problem title" prop="problemTitle"></el-table-column>
        <el-table-column label="Create Date" prop="createDate"></el-table-column>
        <el-table-column label="Last Update" prop="modifiedDate"></el-table-column>
        <el-table-column label="Author" prop="authorName"></el-table-column>
        <el-table-column label="" prop="id" width="100">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="detail(scope.row.id)">Detail</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Page key="page"
            :page-size="size"
            :total="total"
            @on-change="getPage">
      </Page>
    </div>
    <div v-else>
      <report-issue :description="issue.description"
                    :name="issue.name"
                    :problem-id="issue.problemId"
                    :is-detail="true"
                    @back="showDetail = false">
      </report-issue>
    </div>
  </Panel>
</template>

<style lang="less" scoped>
.issue-table {
  margin-bottom: 30px;
}
</style>