<template>
  <div>
    <el-input
        v-model="keyword"
        placeholder="Keywords"
        prefix-icon="el-icon-search">
    </el-input>
    <el-table :data="users" v-loading="loading">
      <el-table-column
          label="ID"
          width="100"
          prop="id">
      </el-table-column>
      <el-table-column
          label="Username"
          width="200"
          prop="userName">
      </el-table-column>
      <el-table-column
          label="Email"
          prop="email">
      </el-table-column>
      <el-table-column
          label="AC rate"
          prop="rate">
      </el-table-column>
      <el-table-column
          label="Option"
          align="center"
          width="100"
          fixed="right">
        <template slot-scope="{row}">
          <Button icon="md-add" name="Add user"
                  @click.native="handleAddUser(row.id)"></Button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        class="page"
        layout="prev, pager, next"
        @current-change="getUser"
        :page-size="pageSize"
        :total="total">
    </el-pagination>
  </div>
</template>
<script lang="ts">

import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import api from "@/api/api";
@Component({})
export default class AddUserComponent extends Vue {
  keyword: string = ''
  loading: boolean = false
  pageSize: number = 10
  total: number = 0
  page: number = 0
  users : any = []
  contest: any ={}

  @Prop({}) contestID: any


  getUser(page: number = 0){
    this.loading = true;
    // clear data
    this.users.splice(0, this.users.length)
    api.getUser({
      page: page,
      size: this.pageSize,
      username: this.keyword
    }).then((res : any) =>{
      console.log(res.data.list)
      this.total = res.data.total;
      res.data.list.forEach((item : any) => {
        this.users.push({
          id: item.id,
          userName: item.username,
          email: item.email,
          acceptCount: item.acCount,
          submitCount: item.submitCount,
          rate: item.acCount + '/' + item.submitCount,
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
    this.getUser(this.page);
  }

  handleAddUser(id: number){
    const userId: Array<number> = [id]
    api
    .addUserToContest({ id: this.contestID, userId: userId })
    .then(() => {
      this.$emit('on-change');
      ;(this as any).$Message.success('Add successfully!')
    })
    .catch((err: any) => {
      this.$emit('on-change');
      this.$Message.error(err.data.message)
    })
  }
  mounted(){
    api.adminGetContestDetail({
      id: this.contestID
    }).then((res : any) =>{
      this.contest = res.data
      this.getUser(0);
    }).catch((err : any) =>{
      console.log(err)
    })
  }

}

</script>

<style scoped lang="less">

</style>