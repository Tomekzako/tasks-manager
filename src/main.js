import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import firebase from 'firebase'
import { store } from './store/store'

Vue.config.productionTip = false

let app = null

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      store: store,
      router,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})
