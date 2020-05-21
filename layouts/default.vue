<template>
  <v-app app>
    <v-navigation-drawer app v-model="drawer" mobile-break-point="650">
      <v-list subheader>
        <v-subheader>People list</v-subheader>
        <v-list-item
          v-for="us in users"
          :key="us.id"
          @click.prevent=""
        >
          <v-list-item-content>
            <v-list-item-title>{{ us.name }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon :color="us.id === user.id ? 'deep-purple accent-4' : 'grey'">mdi-chat</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer">
      </v-app-bar-nav-icon>
      <v-btn icon @click="exit">
        <v-icon>mdi-keyboard-backspace</v-icon>
      </v-btn>

      <v-toolbar-title>Chat rom {{ user.room }}</v-toolbar-title>

      <v-spacer></v-spacer>

      

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <div style="height: 100%">
        <nuxt />
      </div>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      drawer: true,
    }
  },
  computed: mapState(['user', 'users']),
  methods: {
    ...mapMutations(['clearDate']),
    exit() {
      this.$socket.emit('userLeft', this.user.id, () => {
      this.$router.push('/?message=leftChat')
      this.clearDate()
      })
    }
  }
}
</script>
