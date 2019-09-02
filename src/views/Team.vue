<template>
  <div class="team">
    <h1 class="subtitle-1 grey--text">Team</h1>
    <v-container class="my-5">
      <v-row>
        <v-col cols="12" sm="6" md="4" lg="3" v-for="person in team" :key="person.name">
          <v-card flat class="text-center">
            <v-img
              src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg"
              gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
            ></v-img>
            <v-card-text>
              <div class="subheading">{{ person.name }}</div>
              <div class="grey--text">{{ person.role }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      team: [
        { name: 'The Net Ninja', role: 'Web developer' },
        { name: 'Ryu', role: 'Graphic designer' },
        { name: 'Chun Li', role: 'Web developer' },
        { name: 'Gouken', role: 'Social media maverick' },
        { name: 'Yoshi', role: 'Sales guru' }
      ]
    }
  }
}
</script>