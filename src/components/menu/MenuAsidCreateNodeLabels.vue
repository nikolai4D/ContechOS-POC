<template>
  <div>
      <v-sheet class="ma-2" outlined dark rounded>
        <v-list-item>
          <v-list-item-subtitle>Labels</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <div>
            <v-list-item v-for="item in asid.root.node.labels" :key="item.keyId">
              <v-list-item-content v-if="item.value !=''">{{item.value}}</v-list-item-content>
              <v-text-field v-else v-model="$store.state.label" :label="item.key" />
            </v-list-item>
          </div>
        </v-list-item>
      </v-sheet>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState([
      "asid"
    ])
  }
};
</script>