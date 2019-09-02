<template>
  <v-dialog width="500">
    <template v-slot:activator="{ on }">
      <v-btn class="success" v-on="on">Add new project</v-btn>
    </template>
    <v-card>
      <v-card-title>Add a new Project</v-card-title>
      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-text-field label="Title" v-model="title" prepend-icon="mdi-folder" :rules="inputRules"></v-text-field>
          <v-textarea
            label="Information"
            v-model="content"
            prepend-icon="mdi-pencil"
            :rules="inputRules"
          ></v-textarea>
          <v-menu v-model="menu" :close-on-content-click="false" min-width="290px">
            <template v-slot:activator="{on}">
              <v-text-field
                :value="formattedDate"
                label="Due date"
                clearable
                prepend-icon="mdi-calendar-month"
                v-on="on"
                :rules="inputRules"
              ></v-text-field>
            </template>
            <v-date-picker no-title v-model="date" @change="menu = false"></v-date-picker>
          </v-menu>
          <v-spacer></v-spacer>
          <v-btn text class="success mx-0 mt-3" @click="submit">Add project</v-btn>
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
      dialog: false,
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      inputRules: [v => v.length >= 3 || 'Minimum length is 3 characters']
    }
  },
  computed: {
    formattedDate() {
      return this.date ? moment(this.date).format('Do MMM YYYY') : ''
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        const project = {
          title: this.title,
          content: this.content,
          due: moment(this.date).format('Do MMM YYYY'),
          person: null,
          status: 'ongoing'
        }
        db.collection('projects')
          .add(project)
          .then(() => {
            console.log('Added to db')
          })
      }
    }
  }
}
</script>

<style>
</style>