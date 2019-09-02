<template>
  <nav>
    <v-app-bar flat app class="grey lighten-5">
      <v-app-bar-nav-icon class="grey--text" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase">
        <span class="font-weight-light">Todo</span>
        <span>Tomaszek</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text color="grey">
        <span>Sign Out</span>
        <v-icon right>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app class="primary">
      <v-row class="mt-4 mb-3">
        <v-col class="text-center">
          <AddProject />
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
</template>

<script>
import AddProject from '@/components/AddProject'
export default {
  components: {
    AddProject
  },
  data() {
    return {
      drawer: false,
      items: [
        { icon: 'mdi-view-dashboard', text: 'Dashboard', route: '/' },
        { icon: 'mdi-folder', text: 'My Projects', route: '/projects' },
        { icon: 'mdi-account', text: 'Team', route: '/team' }
      ]
    }
  }
}
</script>

<style>
</style>