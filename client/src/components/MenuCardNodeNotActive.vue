<template>
  <div>
    <div class="pa-2" v-if="setConfigConfig.rels == null">Välj (Bef) för att sedan välja rel-typ</div>
    <v-sheet outlined dark rounded>
      <v-list-item>
        <v-list-item-subtitle>(Bef)</v-list-item-subtitle>
      </v-list-item>

      <v-list-item v-if=" secondAct == null">
        <v-list-item-content>
          <h5>Tryck på nod i graf</h5>
        </v-list-item-content>
      </v-list-item>
    </v-sheet>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["setConfigConfig"])
  },
  props: ["secondAct"]
};
</script>