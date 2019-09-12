<template>
  <div class="projects">
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
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.title" label="Project name"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.due" label="Deadline"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-select v-model="editedItem.status" :items="status" label="Status"></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
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
      singleExpand: false,
      dialog: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
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
        created: 0,
        due: 0,
        status: 0
      },
      defaultItem: {
        title: '',
        created: 0,
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

    deleteItem(item) {
      const index = this.projects.indexOf(item)
      confirm('Are you sure you want to delete this item?') &&
        this.projects.splice(index, 1)
    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save() {
      console.log(this.editedItem)
      this.close()
      db.collection('projects')
        .doc(this.editedItem.id)
        .update({
          content: this.editedItem.content,
          due: this.editedItem.due,
          person: this.editedItem.person,
          position: this.editedItem.position,
          status: this.editedItem.status,
          title: this.editedItem.title
        })
        .then(ref => {
          console.log('hehe')
        })
      // .then(() => {
      //   this.$store.commit('user', form.name)
      //   this.$store.commit('position', form.position)
      //   this.loading = false
      //   this.dialog = false
      // })
      // .catch(e => {
      //   console.log(e)
      // })
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
