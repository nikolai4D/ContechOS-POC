<template>
  <div>
    <h1 color="dark">{{title}}</h1>

    <v-card>
      <v-card-text>
        <v-form v-model="valid">
          <v-text-field
            v-model="userInfo.name"
            label="Namn"
            :rules="[required('namn')]"
            v-if="hasName"
          />

          <v-text-field
            v-model="userInfo.email"
            label="Epost"
            :rules="[required('epost'), emailFormat()]"
          />

          <v-text-field
            v-model="userInfo.password"
            label="Lösenord"
            :type="!showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            :append-icon="!showPassword ? 'mdi-eye': 'mdi-eye-off'"
            counter
            :rules="[required('lösenord'), minLength('lösenord', 8)]"
          />
          <v-card-actions>
            <v-btn class="blue--text"  :disabled="!valid" @click="submitForm(userInfo)">{{buttonText}}</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
    <!-- <v-btn class="blue--text"  v-if="!getUserSent" :to="route" small text>{{nextTitle}}</v-btn> -->
  </div>
</template>

<script>
import validations from "../utils/validations";

export default {
  data() {
    return {
      showPassword: true,
      valid: true,
      userInfo: {
        email: "",
        password: ""
      },
      ...validations
    };
  },
  computed: {
    getUserSent() {
      let res = window.localStorage.userRegistrationSent;
      if (res == undefined) {
        return false;
      }
      return res;
    }
  },
  props: ["submitForm", "buttonText", "hasName", "title", "nextTitle", "route"]
};
</script>

<style lang="scss" scoped>
.loggaIn {
  justify-content: center;
}
</style>