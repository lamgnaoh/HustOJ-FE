<template>
  <div class="user-manage">
    <Panel title="User management">
      <div slot="header">
        <el-col :span="24">
          <el-input v-model="keyword" placeholder="Keywords"
                    prefix-icon="el-icon-search"></el-input>
        </el-col>
      </div>

      <el-table
          ref="table"
          v-loading="loadingTable"
          :data="users"
          element-loading-text="loading"
          style="width: 100%">
        <el-table-column label="ID" prop="id"></el-table-column>

        <el-table-column label="Username" prop="username"></el-table-column>

        <el-table-column label="Create Time" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.createDate }}
          </template>
        </el-table-column>

        <el-table-column label="Full Name" prop="name"></el-table-column>
        <el-table-column label="AC" prop="acCount"></el-table-column>
        <el-table-column label="Email" prop="email"></el-table-column>

        <el-table-column label="User Type">
          <template slot-scope="scope">
            {{ getRole(scope.row.authorities[0].name) }}
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="Option" width="200">
          <template slot-scope="{row}">
            <Button icon="md-create" name="Edit" @click.native="openUserDialog(row.id)"></Button>
            <Button icon="md-trash" name="Delete" @click.native="deleteUser(row.id)"></Button>
          </template>
        </el-table-column>
      </el-table>
      <div class="panel-options">
        <el-button type="primary" size="small"
                   @click="goCreateAdminUser" icon="el-icon-plus">Create Admin
        </el-button>
        <Page class="page"
              :total="total"
              show-sizer
              @on-change="pageChange"
              @on-page-size-change="pageSizeChange"
        />
      </div>
    </Panel>
    <!--      <Modal-->
    <!--          v-model="newModal"-->
    <!--          title="Create new user"-->
    <!--          width="50%"-->
    <!--          @on-ok="createUser"-->
    <!--          @on-cancel="newModal = false"-->
    <!--      >-->
    <!--        <div style="display: flex;">-->
    <!--          <div-->
    <!--              style="display: flex;height: 220px;padding-top:10px;width: 60px;flex-direction: column;justify-content: space-between"-->
    <!--          >-->
    <!--            <div>Username</div>-->
    <!--            <div>Password</div>-->
    <!--            <div>Email</div>-->
    <!--            <div>First name</div>-->
    <!--            <div>Last name</div>-->
    <!--            <div>Role</div>-->
    <!--          </div>-->
    <!--          <div>-->
    <!--            <Input v-model="newUser.username" />-->
    <!--            <Input v-model="newUser.password" />-->
    <!--            <Input v-model="newUser.email" />-->
    <!--            <Input v-model="newUser.firstname" />-->
    <!--            <Input v-model="newUser.lastname" />-->
    <!--            <Select v-model="role" style="width:200px">-->
    <!--              <Option-->
    <!--                  v-for="item in roleList"-->
    <!--                  :value="item.value"-->
    <!--                  :key="item.value"-->
    <!--              >{{ item.label }}</Option-->
    <!--              >-->
    <!--            </Select>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </Modal>-->

    <el-dialog :close-on-click-modal="false" :visible.sync="showUserDialog" title="User Info">
      <el-form :model="user" label-position="left" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Username" required>
              <el-input v-model="user.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Name" required>
              <el-input v-model="user.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Email" required>
              <el-input v-model="user.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="User type">
              <el-select v-model="role">
                <el-option label="User" value="ROLE_USER"></el-option>
                <el-option label="Admin" value="ROLE_ADMIN"></el-option>
                <el-option label="Super Admin" value="ROLE_SUPER_ADMIN"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Problem Permission">
              <el-select v-model="user.problemPermission" :disabled="role !== 'ROLE_ADMIN' ">
                <el-option label="None" value="NONE"></el-option>
                <el-option label="Own" value="OWN"></el-option>
                <el-option label="All" value="ALL"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Enable">
              <el-switch
                  v-model="user.enabled">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <Button @click.native="showUserDialog = false">Cancel</Button>
        <Button @click.native="updateUserInfo()">Save</Button>
      </span>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :visible.sync="showCreateAdminDialog" title="Create admin account">
      <el-form :model="newUser" label-position="left" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="First Name" required>
              <el-input v-model="newUser.firstname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Last Name" required>
              <el-input v-model="newUser.lastname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Username" required>
              <el-input v-model="newUser.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Email" required>
              <el-input v-model="newUser.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Password" required>
              <el-input v-model="newUser.password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="User type">
              <el-select v-model="role">
                <el-option label="User" value="ROLE_USER"></el-option>
                <el-option label="Admin" value="ROLE_ADMIN"></el-option>
                <el-option label="Super Admin" value="ROLE_SUPER_ADMIN"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Problem Permission">
              <el-select v-model="newUser.problemPermission" :disabled="role !== 'ROLE_ADMIN' ">
                <el-option label="None" value="NONE"></el-option>
                <el-option label="Own" value="OWN"></el-option>
                <el-option label="All" value="ALL"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <Button @click.native="showUserDialog = false">Cancel</Button>
        <Button @click.native="createUser()">Save</Button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import api from '@/api/api'
import md5 from 'js-md5'
import Panel from "@/components/Panel.vue";

@Component({
      components: {
        Panel
      }
    }
)
export default class UserManager extends Vue {
  users: any = []
  pageSize: number = 10
  page: number = 0
  total: any = 0
  reviseUser: any = {}
  newUser: any = {}
  role: string = ''
  roleList: Array<any> = [
    {
      label: 'User',
      value: 'ROLE_USER',
    },
    {
      label: 'Admin',
      value: 'ROLE_ADMIN',
    },
    {
      label: 'Super Admin',
      value: 'ROLE_SUPER_ADMIN',
    },
  ]

  keyword: string = ''
  loadingTable: boolean = false
  showUserDialog: boolean = false
  user: any = {}
  authority: string = ''
  showCreateAdminDialog: boolean = false


  createUser() {
    api.user
    .createUser({
      ...this.newUser,
      password: this.newUser.password,
      authorities: [{name: this.role}],
    })
    .then(() => {
      this.showCreateAdminDialog = false
      ;(this as any).$Message.success('Create successful')
      this.getUsers(this.page, this.pageSize)
      this.newUser = {}
    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
    })
  }

  updateUserInfo() {
    const user = {
      ...this.user,
      authorities: [{name: this.role}],
    }
    api.user.updateUserInfo(user).then(res => {
      this.$Message.success("Update successful")
      this.getUsers(this.page, this.pageSize)
      this.showUserDialog = false
    }).catch(err => {
      this.$Message.error(err.data.message)
    })
  }

  getRole(role: string) {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'Admin'
      case 'ROLE_USER':
        return 'User'
      case 'ROLE_SUPER_ADMIN':
        return 'Super Admin'
      default:
        return ''
    }
  }

  pageChange(pages: number) {
    this.page = pages - 1
    this.getUsers(pages - 1, this.pageSize)
  }

  pageSizeChange(size: number) {
    this.getUsers(this.page, size)
    this.pageSize = size
  }

  deleteUser(id: string) {
    this.$confirm('Sure to delete the user? The associated resources created by this user will be deleted as well, like problem, contest, announcement, etc.', 'confirm', {
      type: 'warning'
    }).then(() => {
      api
      .deleteUser({
        id,
      })
      .then(res => {
        ;(this as any).$Message.success('Delete successful')
        this.getUsers(this.page, this.pageSize)
      })
      .catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      })
    })
  }

  openUserDialog(id: string) {
    this.showUserDialog = true
    api.user.getUserInfo({id}).then(res => {
      this.user = res.data
      this.role = this.user.authorities[0].name
    })
  }

  getUsers(page: number, size: number) {
    api
    .getUser({
      size: size,
      page: page,
    })
    .then((res: any) => {
      this.users = res.data.list
      this.total = res.data.total
      console.log(this.users)
    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
    })
  }
  goCreateAdminUser(){
    this.showCreateAdminDialog = true
    this.newUser = {}
  }
  mounted() {
    this.getUsers(0, 10)
  }
}
</script>

<style lang="less" scoped>
.user-manage {
  text-align: left;
}

.card-margin {
  margin-top: 20px;
  display: flex;
  justify-content: center;

  button {
    margin-right: 2px;
    padding: 3px 7px 3px;
  }
}

.pro-table {
  list-style: none;
  display: flex;
  justify-content: space-between;
  height: 48px;
  line-height: 48px;
  text-align: left;
  border-bottom: rgb(221, 221, 221) solid 1px;

  .name {
    width: 10%;
    cursor: pointer;

    &:hover {
      color: rgb(17, 85, 204);
    }
  }

  .username {
    width: 20%;
    cursor: pointer;

    &:hover {
      color: rgb(17, 85, 204);
    }
  }

  .mail {
    width: 20%;
  }

  .diff {
    width: 10%;
  }

  .rate {
    width: 20%;
    text-align: center;
  }

  .btn-primary {
    margin-left: 10px;
  }
}

h2 {
  font-weight: 500;
  font-size: 36px;
  text-align: left;
  margin: 12px auto 18px 0;
}
</style>
