<template>
  <div class="projects">
    <v-expansion-panels>
      <v-expansion-panel v-for="project in myProjects" :key="project.id">
        <v-expansion-panel-header>{{ project.title }}</v-expansion-panel-header>
        <v-expansion-panel-content>{{ project.content }}</v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import db from '@/firebase/init'
export default {
  data() {
    return {
      projects: []
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
  computed: {
    myProjects() {
      return this.projects.filter(project => {
        return project.person === this.currentUser
      })
    },
    currentUser() {
      return this.$store.getters.getUser
    }
  }
}
</script>
