<template>
  <v-app dark>
    <v-app-bar class="elevation-0" app to="/">
      <div class="d-flex align-center">
        <v-toolbar-title class="blue--text" >ContechOS Proof of Concept</v-toolbar-title>
        <v-spacer></v-spacer>
      </div>

      <v-spacer></v-spacer>
      <div class="blue--text"  v-if="this.tokenValid">
        {{currentUser.name}}
        <v-btn text  class="blue--text" @click="logoutUser">Logga ut</v-btn>
      </div>
      <div v-else>
        <v-btn text class="blue--text" to="/login">Logga in</v-btn>
        <!-- <v-btn text class="blue--text"  to="/register">Registrera</v-btn> -->
      </div>
    </v-app-bar>

    <v-main style="padding: 0px 0px 0px 0px;">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "App",
  computed: {
    ...mapState(["currentUser", "tokenValid"]),
    ...mapActions(["loadCurrentUser"])
  },
  async mounted() {
    await this.loadCurrentUser;
    if (this.currentUser.token !== null) {
      await this.$router.push({ name: "home" }).catch(error => {
        console.info(error.message);

      });
    }
  },
  methods: {
    async logoutUser() {
      await this.$store.dispatch("logoutUser", this.currentUser);
      location.reload();
    }
  }
};
</script>

<style>
.v-main {
  background-color: #F5F5F5;
  padding:0;
}

</style>
