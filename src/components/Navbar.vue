<template>
  <Menu mode="horizontal" :active-name="activeName">
    <MenuItem name="home" class="oj-logo" to="/">HUST Online Judge</MenuItem>
    <div class="layout-nav">
      <div class="nav-left">
        <MenuItem name="home" to="/">
          <Icon type="md-home"></Icon>
          Home
        </MenuItem>
        <MenuItem name="problems" to="/problems">
          <Icon type="ios-keypad"></Icon>
          Problem
        </MenuItem>
        <MenuItem name="status" to="/status">
          <Icon type="ios-pulse" />
          Submission
        </MenuItem>
        <MenuItem name="contests" to="/contests">
          <Icon type="ios-trophy" />
          Contest
        </MenuItem>
<!--        <MenuItem name="rank" to="/rank">-->
<!--          <Icon type="ios-podium" />-->
<!--          Ranking-->
<!--        </MenuItem>-->
        <Submenu name="3">
          <template slot="title">
            <Icon type="md-information-circle"></Icon>
            Help
          </template>
          <MenuItem name="help" to="/help">Help</MenuItem>
        </Submenu>
      </div>
      <div class="nav-right">
        <Dropdown
            @on-click="handleMenu"
            v-if="loginStatus"
            style="cursor: pointer"
        >
          {{ Username }}
          <Icon type="ios-arrow-down"></Icon>
          <DropdownMenu slot="list">
            <DropdownItem name="admin" v-if="isAdmin">OJ Management</DropdownItem>
            <DropdownItem divided v-if="isAdmin" name="personal"
            >My Home page</DropdownItem
            >
            <DropdownItem v-else name="personal">My Home page</DropdownItem>
            <DropdownItem name="submission">My Submission</DropdownItem>
            <DropdownItem name="setting">Setting</DropdownItem>
            <DropdownItem name="logout" divided>Log out</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <span v-else>
          <MenuItem name="login" to="/login">Login</MenuItem>
          <MenuItem name="register" to="/register">Register</MenuItem>
        </span>
      </div>
    </div>
  </Menu>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import api from '../api/api'

@Component
export default class Navbar extends Vue {
  activeName: string = 'home'

  get loginStatus() {
    return this.Username
  }

  get isAdmin() {
    if (this.$store.state.userInfo) {
      return (
          this.$store.state.userInfo.authorities[0].authority.indexOf('USER') ===
          -1
      )
    }
    return false
  }

  get Username() {
    return this.$store.state.username || window.localStorage.getItem('username')
  }

  @Watch('$route')
  handleRoute(to: any, from: any) {
    this.activeName = to.name
  }

  @Watch('loginStatus')
  handleInfo(status: boolean) {
    if (status) {
      api.user
      .getMyInfo()
      .then((res: any) => {
        this.$store.commit('setUserInfo', res.data)
      })
      .catch((err: any) => {
        console.log(err)
        ;(this as any).$Message.error(err.data.message)
      })
    }
  }

  handleMenu(name: string) {
    if (name === 'logout') {
      this.logout()
    }
    if (name === 'admin') {
      const routeData = this.$router.resolve('/admin')
      window.open(routeData.href, '_blank')

    }
    if (name === 'personal') {
      const id = this.$store.state.userInfo.id
      this.$router.push({
        path: `/personal/${id}`,
      })
    }
    if (name === 'submission') {
      const id = this.$store.state.userInfo.id
      this.$router.push({
        path: `/submission/${id}`,
      })
    }
    if (name === 'setting') {
      const id = this.$store.state.userInfo.id
      this.$router.push({
        path: `/setting/${id}`,
      })
    }
  }

  logout() {
    this.$store
    .dispatch('logout')
    .then(() => {
      this.$Message.success("Logout successful")
      this.$router.replace('/')
    })
    .catch((err: any) => console.log('logout' + err))
  }
}
</script>

<style lang="less" scoped>
.ivu-layout {
  background-color: white !important;
}

.content-background {
  background-color: white !important;
}

.oj-logo {
  text-align: center;
  width: 260px;
  height: 60px;
  font-size: 20px;
  font-weight: normal;
  /*font-family: code-font;*/
  color: #515a6e !important;
  border-bottom: 0.5px solid transparent !important;
}

.layout-nav {
  display: flex;
  justify-content: space-between;
}

.nav-right {
  margin-right: 32px;
}
</style>
