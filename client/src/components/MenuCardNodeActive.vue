<template>
  <v-sheet outlined dark rounded>
    <v-list-item>
      <v-list-item-subtitle>(Nod)</v-list-item-subtitle>
    </v-list-item>

    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>{{activeObj.title}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-sheet>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["activeObj"])
  }
};
</script>