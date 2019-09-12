<template>
  <v-card max-width="375" class="mx-auto mt-12">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn fab color="accent-2" top left absolute v-on="on">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>Edit Profile</v-card-title>
        <v-card-text>
          <v-form class="px-3" ref="form">
            <v-text-field
              label="Name"
              :value="currentUser"
              @input="name = $event"
              prepend-icon="mdi-account-outline"
              :rules="[rules.required, rules.counter]"
              counter
              maxlength="20"
            ></v-text-field>
            <v-file-input label="Avatar input" prepend-icon="mdi-camera" v-model="avatar" disabled></v-file-input>
            <v-text-field
              v-model="email"
              :rules="[rules.required, rules.email]"
              label="E-mail"
              prepend-icon="mdi-email"
            ></v-text-field>
            <v-select
              :items="items"
              label="Position"
              :rules="[rules.required]"
              :value="position"
              @input="newPosition = $event"
              prepend-icon="mdi-account-badge-outline"
            ></v-select>
            <v-spacer></v-spacer>
            <v-btn color="success" text @click="submit" :loading="loading">Save</v-btn>
            <v-btn color="error" text @click="dialog = false">Close</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <div class="text-center pt-6">
      <v-avatar size="70">
        <img :src="image" alt="avatar" />
      </v-avatar>
    </div>
    <v-card-title class="pt-6 justify-center">{{ currentUser}}</v-card-title>

    <v-list two-line>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="indigo">mdi-phone</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ mobile }}</v-list-item-title>
          <v-list-item-subtitle>Mobile</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset></v-divider>

      <v-list-item>
        <v-list-item-icon>
          <v-icon color="indigo">mdi-email</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{email}}</v-list-item-title>
          <v-list-item-subtitle>Work</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset></v-divider>

      <v-list-item>
        <v-list-item-icon>
          <v-icon color="indigo">mdi-account-badge-outline</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ position }}</v-list-item-title>
          <v-list-item-subtitle>Job title</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import db from '@/firebase/init'
import firebase, { firestore } from 'firebase'
import { close } from 'fs'
import { constants } from 'os'

export default {
  data() {
    return {
      dialog: false,
      loading: false,
      items: ['Graphic Designer', 'Front-end Developer', 'Project Manager'],
      name: '',
      email: '',
      newPosition: '',
      userId: null,
      mobile: '000 000 000',
      avatar: null,
      image: 'https://vuetifyjs.com/apple-touch-icon-180x180.png',
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 20 || 'Max 20 characters',
        min: v => v.length >= 8 || 'Min 8 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      }
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const form = {
          name: this.name ? this.name : this.currentUser,
          position: this.newPosition ? this.newPosition : this.position,
          email: this.email
        }
        db.collection('users')
          .where('user_id', '==', this.userId)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              db.collection('users')
                .doc(doc.id)
                .update({
                  name: form.name,
                  position: form.position
                })
            })
          })
          .then(() => {
            this.$store.commit('user', form.name)
            this.$store.commit('position', form.position)
            this.loading = false
            this.dialog = false
          })
          .catch(e => {
            console.log(e)
          })
      }
    }
  },
  mounted() {
    let user = firebase.auth().currentUser
    this.userId = user.uid
    this.email = user.email
  },
  computed: {
    currentUser() {
      return this.$store.getters.getUser
    },
    position() {
      return this.$store.getters.getPosition
    }
  }
}
</script>

<style>
</style>