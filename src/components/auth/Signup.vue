<template>
  <v-row justify="center">
    <v-col cols="12" sm="10" md="8" lg="4">
      <v-card ref="form" class="mt-12 text-center">
        <v-card-title class="justify-center display-2 font-weight-light text-uppercase">Sign Up</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="name"
            :rules="[rules.required, rules.counter]"
            label="Name"
            counter
            maxlength="20"
          ></v-text-field>
          <v-text-field v-model="email" :rules="[rules.required, rules.email]" label="E-mail"></v-text-field>
          <v-text-field
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]"
            :type="showPassword ? 'text' : 'password'"
            label="Not visible"
            hint="At least 8 characters"
            v-model="password"
            class="input-group--focused"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
        </v-card-text>
        <v-btn class="ma-2 mb-10" tile color="primary" @click="submit">Submit</v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import slugify from 'slugify'
import db from '@/firebase/init'
import firebase, { firestore } from 'firebase'
export default {
  data() {
    return {
      password: '',
      name: '',
      email: '',
      showPassword: false,
      slug: null,
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
      this.slug = slugify(this.name, {
        replacement: '-',
        remove: /[$*_+~.()'"!\-:@]/g,
        lower: true
      })
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(cred => {
          db.collection('users')
            .doc(this.slug)
            .set({
              name: this.name,
              user_id: cred.user.uid
            })
        })
        .then(() => {
          this.$router.push({ name: 'Dashboard' })
        })
        .catch(error => {
          console.log(error)
          //   this.feedback = error.message
        })
      //   this.feedback = 'This alias is free to use'
    }
  }
}
</script>

<style>
</style>