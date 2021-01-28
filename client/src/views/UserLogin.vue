<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <br />
      <UserAuthForm
        route="register"
        title="Logga in"
        :submitForm="loginUser"
        buttonText="Logga in"
        nextTitle="Har inget konto?"
      />
    </v-row>
  </v-container>
</template>

<script>
import UserAuthForm from "../components/UserAuthForm";
import { mapState } from "vuex";

export default {
  components: {
    UserAuthForm
  },
  computed: {
    ...mapState(["currentUser"])
  },

  methods: {
    async loginUser(loginInfo) {
      await this.$store.dispatch("loginUser", loginInfo);
      if (this.currentUser.token !== null) {
        await this.$router.push({ name: "home" });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>