<template>
  <div>
    <v-toolbar v-if="!user" color="primary" dark>
      <v-toolbar-title>
        <img src="@/assets/logo.png" alt="PTR Agencja Interaktywna" class="toolbar_logo mt-2" />
      </v-toolbar-title>
      <div class="flex-grow-1"></div>
      <v-toolbar-items>
        <v-btn text :to="{name: 'Signup'}">
          <v-icon left>mdi-account-plus</v-icon>Signup
        </v-btn>
        <v-btn text :to="{name: 'Login'}">
          <v-icon left>mdi-login</v-icon>Login
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <nav v-if="user">
      <v-snackbar v-model="snackbar" :timeout="3000" top color="primary">
        <span>Awesome! You added a new project.</span>
        <v-btn text color="white" @click="snackbar = false">Close</v-btn>
      </v-snackbar>
      <v-app-bar flat app class="grey lighten-5">
        <v-app-bar-nav-icon class="grey--text" @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="text-uppercase">
          <span class="font-weight-light">Logged as</span>
          <span>{{ ` ${currentUser}` }}</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <AddProject @projectAdded="snackbar = true" plus="true" />
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn text color="grey" v-on="on">
              <v-icon left>mdi-chevron-down</v-icon>
              <span>Menu</span>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in items" :key="index" router :to="item.route">
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn text color="grey" @click="logout">
          <span>Log Out</span>
          <v-icon right>mdi-exit-to-app</v-icon>
        </v-btn>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" app class="primary">
        <v-row class="mt-4 mb-3">
          <v-col class="text-center">
            <v-avatar>
              <img src="https://vuetifyjs.com/apple-touch-icon-180x180.png" alt="avatar" />
            </v-avatar>
            <p class="white--text subheading mt-2">{{ currentUser }}</p>
          </v-col>
          <v-col class="text-center">
            <AddProject @projectAdded="snackbar = true" />
          </v-col>
        </v-row>
        <v-list>
          <v-list-item v-for="item in items" :key="item.text" router :to="item.route">
            <v-list-item-icon>
              <v-icon class="white--text">{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="white--text">{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </nav>
  </div>
</template>

<script>
import AddProject from '@/components/AddProject'
import db from '@/firebase/init'
import firebase, { firestore } from 'firebase'

export default {
  components: {
    AddProject
  },
  data() {
    return {
      user: null,
      drawer: false,
      items: [
        { icon: 'mdi-view-dashboard', text: 'Dashboard', route: '/' },
        { icon: 'mdi-folder', text: 'My Projects', route: '/projects' },
        { icon: 'mdi-account-group', text: 'Team', route: '/team' },
        { icon: 'mdi-account', text: 'My Profile', route: '/profile' }
      ],
      snackbar: false
    }
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({ name: 'Login' })
        })
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user
      } else {
        this.user = null
      }
    })
  },
  computed: {
    currentUser() {
      return this.$store.getters.getUser
    }
  }
}
</script>

<style>
.toolbar_logo {
  width: 150px;
  height: auto;
}
</style>