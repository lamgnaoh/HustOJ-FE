<template>
  <div>
    <Panel title="Contest member list">
      <div slot="header">
        <Input
            v-model="keyword"
            search
            enter-button
            placeholder="Keywords">
        </Input>
      </div>
      <Row style="text-align: left">
        <Col span="24">
          <el-table
              element-loading-text="loading"
              ref="table"
              :data="users"
              style="width: 100%"
          >
            <el-table-column
                width="150"
                prop="id"
                label="ID">
            </el-table-column>

            <el-table-column
                prop="userName"
                label="Username">
            </el-table-column>
            <el-table-column
                width="100"
                prop="rate"
                label="AC rate">
            </el-table-column>
            <el-table-column
                fixed="right"
                align="center"
                width="250"
                label="Action">
              <template slot-scope="scope">
                <Button type="error"  icon="md-trash" @click="deleteMember(scope.row.id)"></Button>
              </template>
            </el-table-column>
          </el-table>
        </Col>
      </Row>
      <div class="panel-options">
        <el-button type="primary"
                   size="small" icon="el-icon-plus"
                   @click="addUserToContest = true">Add User

        </el-button>
        <Page class="page"
            :total="total"
            show-sizer
            @on-change="pageChange"
            @on-page-size-change="pageSizeChange"
        />
      </div>
    </Panel>

    <el-dialog title="Add Contest User"
               v-if="contestId"
               width="80%"
               :visible.sync="addUserToContest"
               @close-on-click-modal="false">
      <AddUserComponent :contestID="contestId" @on-change="getUser"></AddUserComponent>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'
import api from '../../api/api'
import Panel from "@/components/Panel.vue";
import AddProblemComponent from "@/admin/problems/AddPublicProblem.vue";
import AddUserComponent from "@/admin/users/AddUserComponent.vue";

@Component({
  components: {
    AddUserComponent,
    AddProblemComponent,
    Panel
  }
})
export default class ContestMember extends Vue {
  total: number = 0
  page: number = 0
  pageSize: number = 10
  groups: any = ''
  users: any = []
  member: any = ''
  searchData: any = []
  keyword: any = ''
  addUserToContest: boolean = false
  contestId: any = ''

  getMemberId() {
    if (this.member) {
      api
      .getUser({ query: { username: this.member }, size: 10, page: 0 })
      .then((res: any) => {
        this.searchData.splice(0, this.searchData.length)
        const list = res.data.list
        list.forEach((item: any) => {
          this.searchData.push({
            id: item.id,
            username: item.username,
          })
        })
      })
      .catch(() => {
        console.log('error')
      })
    }
  }

  pushInto(id: any) {
    const params = this.$route.params
    const contestId: any = params.id
    this.member = ''
    if (id) {
      const userId: Array<number> = [id]
      api
      .addUserToContest({ id: contestId, userId: userId })
      .then(() => {
        this.getUser()
        ;(this as any).$Message.success('Add successfully!')
      })
      .catch(() => {
        ;(this as any).$Message.error('Add Failed !!')
      })
    }
  }

  @Watch('keyword')
  onSearchByKeyword(){
    this.search();
  }

  search(){
    this.getUser(0,this.pageSize);
  }

  getUser(page: number = 0 , pageSize: number = 10) {
    this.addUserToContest = false
    // clear all data
    this.users = [];
    const contestId: any = this.$route.params.id
    api
    .getAllUserFromContest({
      id: contestId ,
      params: {
        page: page,
        pageSize: pageSize,
        name: this.keyword
      }
    })
    .then((res: any) => {
      console.log(res.data.list)
      res.data.list.forEach((user: any) => {
        this.users.push({
          id: user.userId,
          userName: user.userName,
          acceptCount: user.acceptCount,
          submitCount: user.submitCount,
          rate: user.acceptCount + '/' + user.submitCount,
          score: user.score
        })
      })
    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
    })
  }

  deleteMember(userId: number) {
    const params = this.$route.params
    const id: any = params.id
    const groupArray: Array<number> = []
    groupArray.push(userId)

    this.$confirm('Sure to delete the user? The associated resources created by this user ' +
        'will be deleted as well, like problem, contest, announcement, etc.', 'Confirm delete', {
      type: 'warning'
    }).then(() => {
          api
          .deleteUserFromContest({
            id: id,
            userId: groupArray,
          })
          .then(() => {
            this.getUser()
            ;(this as any).$Message.success('Delete successfully')
          })
          .catch((err: any) => {
            ;(this as any).$Message.error(err.data.message)
          })
        }
    )
  }

  pageChange(pages: number) {
    this.page = pages - 1
    this.getUser(pages - 1, this.pageSize)
  }

  pageSizeChange(size: number) {
    this.pageSize = size
    this.getUser(this.page, size)
  }

  mounted() {
    this.contestId = this.$route.params.id
    this.getUser()
  }
}
</script>

<style scoped lang="less">

</style>
