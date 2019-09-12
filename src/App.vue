<template>
  <v-app>
    <Navbar />
    <v-content class="mx-4 mb-4">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar'
import firebase, { firestore } from 'firebase'
import db from '@/firebase/init'

export default {
  name: 'App',
  components: {
    Navbar
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
