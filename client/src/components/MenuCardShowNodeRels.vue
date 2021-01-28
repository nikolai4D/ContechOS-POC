<template>
  <v-sheet class="ma-2" outlined dark rounded>
    <v-list-item>
      <v-list-item-subtitle>Rels</v-list-item-subtitle>
    </v-list-item>
    <v-list-item>
      <div>
        <!-- <v-list-item dense v-for="(item, i) in activeObj.rels" :key="i">
          <v-list-item-content>
            {{item}}
          </v-list-item-content>
        </v-list-item> -->
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