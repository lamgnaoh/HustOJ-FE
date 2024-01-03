<template>
  <div>
    <Row>
      <Col span="4" style="overflow-y: scroll;height:100vh;">
        <Menu
          theme="light"
          active-name="$route.path"
          style="width:auto;padding-left: 20px;height:100vh;"
        >
          <RouterLink to="/">
            <div class="icon-title" style="color: #515a6e">HUST OJ</div>
          </RouterLink>
          <Submenu name="Home" align="left">
            <template #title>
              <Icon type="" />
              Home
            </template>
            <MenuItem name="/admin/index" to="/admin/index">
              <Icon type="md-speedometer" />Home Page
            </MenuItem>
          </Submenu>
          <Submenu name="General" v-if="isSuperAdmin" align="left" >
            <template #title>
              <Icon type="ios-keypad" />
              General
            </template>
            <MenuItem name="/admin/judge-server" to="/admin/judge-server">
              Judge Server
            </MenuItem>
            <MenuItem
                name="/admin/admin-announcement"
                to="/admin/admin-announcement"
            >
              Announcement management
            </MenuItem>

            <MenuItem name="/admin/user-manager" to="/admin/user-manager">
              User
            </MenuItem>
          </Submenu>
          <Submenu name="Problem" align="left">
            <template #title>
              <Icon type="md-menu" />
              Problem
            </template>
            <MenuItem name="/admin/problems-list" to="/admin/problems-list">
              Problem list
            </MenuItem>
            <MenuItem name="/admin/create-problem" to="/admin/create-problem">
              Create Problem
            </MenuItem>
          </Submenu>
          <Submenu name="Contest" align="left">
            <template #title>
              <Icon type="md-trophy" />
              Contest
            </template>
            <MenuItem name="/admin/contests-list" to="/admin/contests-list">
              Contest List
            </MenuItem>
            <MenuItem name="/admin/create-contest" to="/admin/create-contest">
              Create Contest
            </MenuItem>
          </Submenu>
<!--          <Submenu name="Group" align="left">-->
<!--            <template #title>-->
<!--              Group-->
<!--            </template>-->
<!--            <MenuItem name="/admin/group-list" to="/admin/group-list">-->
<!--              <Icon type="md-list" />Group list-->
<!--            </MenuItem>-->
<!--          </Submenu>-->
        </Menu>
      </Col>
      <Col span="18" offset="1" style="overflow-y: scroll;height:100vh;">
        <router-view></router-view>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AdminIndex extends Vue {

  get isSuperAdmin() {
    return this.$store.getters.isSuperAdmin;
  }

}
</script>

<style lang="less" scoped>
.icon-title {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 12px;
  padding-top: 18px;
}
</style>
