<template>
  <div class="projects">
    <v-snackbar v-model="snackbar" :timeout="3000" top color="error">
      <span>You successfully removed a project!</span>
      <v-btn text color="white" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar v-model="snackbar2" :timeout="3000" top color="info">
      <span>You successfully edited a project!</span>
      <v-btn text color="white" @click="snackbar2 = false">Close</v-btn>
    </v-snackbar>
    <v-data-table
      :headers="headers"
      :page.sync="page"
      :items="myProjects"
      :items-per-page="itemsPerPage"
      :single-expand="singleExpand"
      hide-default-footer
      show-expand
      class="elevation-1"
      @page-count="pageCount = $event"
    >
      <template v-slot:header.title="{ header }">{{ header.text.toUpperCase() }}</template>
      <template v-slot:item.status="{ item }">
        <v-chip small :class="`${item.status} white--text caption`">{{ item.status }}</v-chip>
      </template>
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>My TASKS</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <div class="flex-grow-1"></div>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-form class="px-3" ref="form">
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.title"
                          label="Project name"
                          :rules="[rules.required, rules.min]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.content"
                          label="Project description"
                          :rules="[rules.required, rules.min]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-menu
                          v-model="menu"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          full-width
                          min-width="290px"
                        >
                          <template v-slot:activator="{on}">
                            <v-text-field
                              :value="editedItem.due"
                              clearable
                              label="Due date"
                              prepend-icon="mdi-calendar-month"
                              v-on="on"
                              :rules="[rules.required]"
                            ></v-text-field>
                          </template>
                          <v-date-picker scrollable v-model="date" @change="changeDeadline()"></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12">
                        <v-select
                          v-model="editedItem.status"
                          :items="status"
                          label="Status"
                          :rules="[rules.required]"
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save" :loading="loading">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:expanded-item="{ item }">
        <td :colspan="headers.length">{{item.content}}</td>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import db from '@/firebase/init'
import firebase, { firestore } from 'firebase'
export default {
  data() {
    return {
      snackbar: false,
      snackbar2: false,
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      singleExpand: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters'
      },
      dialog: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      loading: false,
      projects: [],
      status: ['ongoing', 'complete', 'postponed', 'overdue'],
      headers: [
        {
          text: 'Project name',
          align: 'left',
          sortable: false,
          value: 'title'
        },
        { text: 'Person', value: 'person' },
        { text: 'Created at', value: 'created' },
        { text: 'Deadline', value: 'due' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'action', sortable: false }
      ],
      editedItem: {
        title: '',
        content: '',
        due: 0,
        status: 0
      },
      defaultItem: {
        title: '',
        content: '',
        due: 0,
        status: 0
      }
    }
  },
  created() {
    db.collection('projects').onSnapshot(res => {
      const changes = res.docChanges()
      changes.forEach(change => {
        if (change.type === 'added') {
          this.projects.push({
            ...change.doc.data(),
            id: change.doc.id,
            created: moment(change.doc.data().timestamp).format('lll')
          })
        } else if (change.type === 'modified') {
          const findIndex = this.projects.findIndex(
            project => project.id == change.doc.data().id
          )
          this.projects.splice(findIndex, 1, change.doc.data())
        } else {
          console.log(change.doc.data().id)
          const findIndex = this.projects.findIndex(
            project => project.id == change.doc.data().id
          )
          this.projects.splice(findIndex, 1)
        }
      })
    })
  },
  watch: {
    dialog(val) {
      val || this.close()
    }
  },
  computed: {
    myProjects() {
      return this.projects.filter(project => {
        return project.person === this.currentUser
      })
    },
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    currentUser() {
      return this.$store.getters.getUser
    }
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.myProjects.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    changeDeadline() {
      const formattedDate = moment(this.date).format('Do MMM YYYY')
      this.editedItem.due = formattedDate
      this.menu = false
    },
    deleteItem(item) {
      const index = this.projects.indexOf(item)
      confirm('Are you sure you want to delete this item?') &&
        db
          .collection('projects')
          .doc(item.id)
          .delete()
          .then(() => {
            this.snackbar = true
          })
    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.close()
        db.collection('projects')
          .doc(this.editedItem.id)
          .update({
            content: this.editedItem.content,
            created: this.editedItem.created,
            due: this.editedItem.due,
            person: this.editedItem.person,
            position: this.editedItem.position,
            status: this.editedItem.status,
            title: this.editedItem.title,
            id: this.editedItem.id
          })
          .then(ref => {
            this.loading = false
            this.snackbar2 = true
          })
          .catch(e => {
            console.log(e)
          })
      }
    }
  }
}
</script>

<style scoped>
.projects .v-data-table__wrapper .v-chip.complete {
  background: #3cd1c2;
}
.projects .v-data-table__wrapper .v-chip.ongoing {
  background: #ffaa2c;
}
.projects .v-data-table__wrapper .v-chip.overdue {
  background: #f83e70;
}
</style>
