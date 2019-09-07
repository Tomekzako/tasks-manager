<template>
  <v-row justify="center">
    <v-col cols="12" sm="10" md="8" lg="4">
      <v-card class="mt-12 text-center">
        <v-card-title class="justify-center display-2 font-weight-light text-uppercase">Login</v-card-title>
        <v-card-text>
          <v-form class="px-3" ref="form">
            <v-text-field v-model="email" :rules="[rules.required, rules.email]" label="E-mail"></v-text-field>
            <v-text-field
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              hint="At least 8 characters"
              v-model="password"
              :autocomplete="password"
              class="input-group--focused"
              @click:append="showPassword = !showPassword"
            ></v-text-field>
            <v-btn class="ma-2 mb-10" tile color="primary" @click="login" :loading="loading">Login</v-btn>
            <p v-if="feedback">{{feedback}}</p>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import db from '@/firebase/init'
import firebase, { firestore } from 'firebase'
export default {
  data() {
    return {
      password: '',
      email: '',
      showPassword: false,
      feedback: null,
      loading: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      }
    }
  },
  methods: {
    login() {
      if (this.$refs.form.validate()) {
        this.loading = true
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(cred => {
            this.$router.push({ name: 'Dashboard' })
            this.loading = false
          })
          .catch(err => {
            this.feedback = err.message
            this.loading = false
          })
        this.feedback = null
      } else {
        this.feedback = 'Please fill in both fields'
      }
    }
  }
}
</script>

<style>
</style>