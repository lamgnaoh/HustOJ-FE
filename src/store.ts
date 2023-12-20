import Vue from 'vue'
import Vuex from 'vuex'
import api from './api/api'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: undefined,
    token: '',
    username: '',
    loginStatus: '',
    role: '',
    contestList: [],
    currentContest: {},

  },
  mutations: {
    login(state, payload) {
      state.username = payload.username
      state.token = payload.token
      window.localStorage.setItem('token', payload.token)
      window.localStorage.setItem('username', payload.username)
    },
    logout(state) {
      state.username = ''
      state.token = ''
      window.localStorage.setItem('token', '')
      window.localStorage.setItem('username', '')
      window.localStorage.setItem('times', '')
      window.localStorage.setItem('role', '')
    },
    refresh(state, payload) {
      state.token = payload.token
      window.localStorage.setItem('token', payload.token)
    },
    setUserInfo(state, payload) {
      state.userInfo = payload
      window.localStorage.setItem('userInfo', JSON.stringify(payload))
    },
    setRole(state, payload) {
      state.role = payload
      window.localStorage.setItem('role', payload)
    },
  },
  actions: {
    login(context, payload) {
      return new Promise((resolve, reject) => {
        api.user
          .login(payload)
          .then((res: any) => {
            context.commit('login', {
              token: res.data.token,
              username: payload.username,
            })
            resolve(res)
          })
          .catch((err: any) => {
            reject(err)
          })
      })
    },
    logout(context) {
      context.commit('logout')
    },
    refresh(context, payload) {
      api.user
        .refresh(payload)
        .then((res: any) => {
          context.commit('refresh', {
            token: res.data.token,
          })
        })
        .catch((err: any) => {
          console.log(err, 'errRefresh')
        })
    },
  },
  getters: {
    isSuperAdmin(state){
      return state.role.includes('SUPER_ADMIN')
    },
    getUserId(state) {
      // @ts-ignore
      return state.userInfo.id;
    }
  }
})
