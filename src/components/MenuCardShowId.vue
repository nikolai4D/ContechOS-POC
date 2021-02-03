<template>
  <v-sheet class="ma-2" outlined dark rounded>
    <v-list-item>
      <v-list-item-subtitle>ID</v-list-item-subtitle>
    </v-list-item>
    <v-list-item>
      <div>
        <v-list-item-content>
          <div>{{activeObj.id}}</div>
        </v-list-item-content>
      </div>
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