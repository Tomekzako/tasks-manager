<template>
  <div class="dashboard">
    <h1 class="subtitle-1 grey--text">Dashboard</h1>
    <v-container class="my-5">
      <v-row class="mb-3">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn small text color="grey" v-on="on" @click="sortBy('title')">
              <v-icon left small>mdi-folder</v-icon>
              <span class="caption text-lowercase">By project name</span>
            </v-btn>
          </template>
          <span>Sort projects by project name</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn small text color="grey" v-on="on" @click="sortBy('person')">
              <v-icon left small>mdi-account</v-icon>
              <span class="caption text-lowercase">By person</span>
            </v-btn>
          </template>
          <span>Sort projects by person</span>
        </v-tooltip>
      </v-row>
      <v-card flat v-for="project in projects" :key="project.title">
        <v-row :class="`pa-3 align-center project ${project.status}`">
          <v-col cols="12" md="5">
            <div class="caption grey--text">Project title</div>
            <div>{{ project.title }}</div>
          </v-col>
          <v-col cols="3" sm="2" md="1">
            <v-tooltip left :color="getColor(project.position)" dark>
              <template v-slot:activator="{ on }">
                <v-chip
                  :color="getColor(project.position)"
                  dark
                  v-on="on"
                  small
                >{{getPosition(project.position)}}</v-chip>
              </template>
              <span>{{ project.position }}</span>
            </v-tooltip>
          </v-col>
          <v-col cols="3" sm="4" md="2">
            <div class="caption grey--text">Person</div>
            <div>{{ project.person }}</div>
          </v-col>
          <v-col cols="3" sm="4" md="2">
            <div class="caption grey--text">Due by</div>
            <div>{{ project.due }}</div>
          </v-col>
          <v-col cols="3" sm="2" md="2">
            <div class="text-end">
              <v-chip small :class="`${project.status} white--text caption`">{{ project.status }}</v-chip>
            </div>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase, { firestore } from 'firebase'

export default {
  data() {
    return {
      projects: []
    }
  },
  methods: {
    sortBy(prop) {
      this.projects.sort((a, b) => (a[prop] < b[prop] ? -1 : 1))
    },
    getColor(pos) {
      if (pos == 'Project Manager') return '#00BCD4'
      else if (pos == 'Graphic Designer') return '#9C27B0'
      else if (pos == 'Front-end Developer') return '#607D8B'
      else return 'green'
    },
    getPosition(pos) {
      if (pos == 'Project Manager') return 'PM'
      else if (pos == 'Graphic Designer') return 'GRA'
      else return 'DEV'
    }
  },
  computed: {
    pages() {
      return this.pagination.rowsPerPage
        ? Math.ceil(this.projects.length / this.pagination.rowsPerPage)
        : 0
    }
  },
  created() {
    db.collection('projects').onSnapshot(res => {
      const changes = res.docChanges()
      changes.forEach(change => {
        if (change.type === 'added') {
          this.projects.push({
            ...change.doc.data(),
            id: change.doc.id
          })
        }
      })
    })
  },
  mounted() {
    let user = firebase.auth().currentUser
    if (user) {
      db.collection('users')
        .where('user_id', '==', user.uid)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            this.$store.commit('user', doc.data().name)
            this.$store.commit('position', doc.data().position)
          })
        })
    }
  }
}
</script>

<style>
.project.complete {
  border-left: 4px solid #3cd1c2;
}
.project.ongoing {
  border-left: 4px solid #ffaa2c;
}
.project.overdue {
  border-left: 4px solid #f83e70;
}
.dashboard .v-card .v-chip.complete {
  background: #3cd1c2;
}
.dashboard .v-card .v-chip.ongoing {
  background: #ffaa2c;
}
.dashboard .v-card .v-chip.overdue {
  background: #f83e70;
}
</style>
