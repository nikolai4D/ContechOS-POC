<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <UserAuthForm
        title="Registrera"
        :submitForm="registerUser"
        buttonText="Registrera"
        hasName="true"
      />
    </v-row>
  </v-container>
</template>

<script>
import UserAuthForm from "../components/UserAuthForm";

export default {
  components: {
    UserAuthForm
  },
  methods: {
    async registerUser(userInfoRegister) {

      await this.$store.dispatch("registerUser", userInfoRegister);
      await this.$router.push({ name: "user-login" });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>