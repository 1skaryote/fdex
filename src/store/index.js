import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appURL: 'https://fedex-api.herokuapp.com/api/v1',
    appUsers: []
  },
  mutations: {
    UPDATE_APP_USERS(state,users) {
      state.appUsers = users
    }
  },
  actions: {

    SET_APP_USERS({commit}, users) {
      commit('UPDATE_APP_USERS', users)
    }

  },
  modules: {
  },
  getters: {
    getAppUrl(state) {
      return state.appURL
    },
    getUserInfo() {
      return localStorage.getItem('user')
    },
    getAppUsers(state) {
      return state.appUsers
    }
  }
})
