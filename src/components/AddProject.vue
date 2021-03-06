<template>
  <v-dialog width="600" v-model="dialog">
    <template v-if="plus" v-slot:activator="{ on }">
      <v-btn class="mx-4" fab dark x-small outlined color="grey" v-on="on">
        <v-icon dark>mdi-plus</v-icon>
      </v-btn>
    </template>
    <template v-else v-slot:activator="{ on }">
      <v-btn class="success" v-on="on">Add a new project</v-btn>
    </template>
    <v-card>
      <v-card-title>Add a new Project</v-card-title>
      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-text-field
            label="Title"
            v-model="title"
            prepend-icon="mdi-folder"
            :rules="[rules.required, rules.min]"
          ></v-text-field>
          <v-textarea
            label="Information"
            v-model="content"
            prepend-icon="mdi-pencil"
            :rules="[rules.required, rules.min]"
          ></v-textarea>
          <v-menu v-model="menu" :close-on-content-click="false" min-width="290px">
            <template v-slot:activator="{on}">
              <v-text-field
                :value="formattedDate"
                label="Due date"
                clearable
                prepend-icon="mdi-calendar-month"
                v-on="on"
                :rules="[rules.required]"
              ></v-text-field>
            </template>
            <v-date-picker no-title v-model="date" @change="menu = false"></v-date-picker>
          </v-menu>
          <v-spacer></v-spacer>
          <v-btn text class="success mx-0 mt-3" @click="submit" :loading="loading">Add project</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment'
import db from '@/firebase/init'
export default {
  data() {
    return {
      title: '',
      content: '',
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters'
      },
      loading: false,
      dialog: false
    }
  },
  props: ['plus'],
  computed: {
    formattedDate() {
      return this.date ? moment(this.date).format('Do MMM YYYY') : ''
    },
    currentUser() {
      return this.$store.getters.getUser
    },
    position() {
      return this.$store.getters.getPosition
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const newDate = Date.now()
        const project = {
          title: this.title,
          content: this.content,
          created: newDate,
          due: moment(this.date).format('Do MMM YYYY'),
          person: this.currentUser,
          position: this.position,
          status:
            new Date(newDate) > new Date(this.date) ? 'overdue' : 'ongoing'
        }
        db.collection('projects')
          .add(project)
          .then(() => {
            this.loading = false
            this.dialog = false
            this.$emit('projectAdded')
          })
      }
    }
  }
}
</script>

<style>
</style>