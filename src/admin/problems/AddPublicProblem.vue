<template>
  <div>
    <el-input
      v-model="keyword"
      placeholder="Keywords"
      prefix-icon="el-icon-search">
    </el-input>
    <el-table :data="problems" v-loading="loading">
      <el-table-column
        label="ID"
        width="100"
        prop="id">
      </el-table-column>
      <el-table-column
        label="Code"
        width="200"
        prop="problemCode">
      </el-table-column>
      <el-table-column
        label="Title"
        prop="title">
      </el-table-column>
      <el-table-column
        label="Option"
        align="center"
        width="100"
        fixed="right">
        <template slot-scope="{row}">
          <Button icon="md-add" name="Add the problem"
                    @click.native="handleAddProblem(row.id)"></Button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="page"
      layout="prev, pager, next"
      @current-change="getPublicProblem"
      :page-size="pageSize"
      :total="total">
    </el-pagination>
  </div>
</template>
<script lang="ts">
import api from '@/api/api.ts'
import {Component, Prop, Vue, Watch} from "vue-property-decorator";

@Component
export default class AddPublicProblem extends Vue {
  page: number = 0;
  pageSize: number = 10
  total: number = 0
  keyword: string = ""
  problems: Array<any> = []
  loading: boolean = false
  contest: any = {}

  @Prop({}) contestID: any

  handleAddProblem(problemId: number){
    const data = {
      id: this.contestID ,
      problemId
    }
    api.addProblemToContest(data).then((res : any) =>{
      this.$Message.success("Add successfully")
      this.$emit('on-change');
    }).catch((err : any) => {
      this.$emit('on-change');
      this.$Message.error(err.data.message)
    } )
  }

  getPublicProblem(page: number = 0){
    this.loading = true
    // clear data
    this.problems.splice(0, this.problems.length)
    api.adminGetProblems({
        page: page,
        size: this.pageSize,
        keyword: this.keyword,
        contestRuleType: this.contest.contestRuleType
    }).then((res : any) =>{
      console.log(res)
      this.total = res.data.total;
      res.data.list.forEach((item : any) => {
        this.problems.push({
          id: item.id,
          problemCode: item.problemCode,
          title: item.title
        })
      })
      this.loading = false;
    }).catch((err : any) =>{
      console.log(err)
    })
  }

  @Watch('keyword')
  onSearchByKeyword(){
    this.getPublicProblem(this.page);
  }


  mounted(){
    api.adminGetContestDetail({
      id: this.contestID
    }).then((res : any) =>{
      this.contest = res.data
      this.getPublicProblem(0);
    }).catch((err : any) =>{
      console.log(err)
    })
  }

}
</script>
<style scoped>
  .page {
    margin-top: 20px;
    text-align: right
  }

</style>
