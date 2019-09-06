import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null,
    position: null
  },
  getters: {
    getUser: state => {
      return state.user
    },
    getPosition: state => {
      return state.position
    }
  },
  mutations: {
    user(state, user) {
      state.user = user
    },
    position(state, pos) {
      state.position = pos
    }
  }
})
