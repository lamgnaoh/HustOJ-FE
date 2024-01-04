<template>
  <div id="app">
    <div class="app-content">
      <Navbar v-if="isAdmin"></Navbar>
      <router-view class="content"/>
    </div>
    <footer class="footer" v-if="isAdmin">
      <div class="oj-footer">
        Copyright © 2023 ~ 2024 Hanoi University of Science and Technology. Powered by <b>HustOJ</b>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Navbar from '@/components/Navbar.vue'
import api from './api/api'

@Component({
  components: {
    Navbar,
  },
})
export default class App extends Vue {
  get isAdmin() {
    return this.$route.path.indexOf('admin') === -1
  }

  mounted() {
    if (window.localStorage.getItem('token')) {
      api.user
      .getMyInfo()
      .then((res: any) => {
        const role = res.data.authorities[0].authority
        this.$store.commit('setUserInfo', res.data)
        this.$store.commit('setRole', role)
      })
      .catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      })
      this.$store.commit('login', {
        token: window.localStorage.getItem('token'),
        username: window.localStorage.getItem('username'),
      })
    } else {
      this.$router.push('login')
    }
  }
}
</script>

<style lang="less">
@import './style/base';

* {
  box-sizing: border-box;
}
html,
body {
  min-height: 100vh;
}
::-webkit-scrollbar {
  display: none;
}
.fade-leave-to {
  opacity: 1;
}

.fade-leave-active {
  transition: all 0.4s ease;
}

.fade-enter {
  opacity: 1;
  transform: translate(0, 50px);
}

.fade-enter-active {
  transition: all 0.4s ease;
}

#app {
  font-family: 'Helvetica Neue', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  line-height: 1.4;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.code-container {
  text-align: left;
}

.CodeMirror {
  font-family: code-font !important;
}

.footer {
  padding-top: 20px;
}

.oj-footer {
  font-size: 17px;
  text-align: center;
  background-color: #f8f8f9 !important;
  padding: 15px 50px;
}

.app-content {
  height: calc(100vh - 75px);
}
</style>
