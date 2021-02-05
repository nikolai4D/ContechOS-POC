<template>
  <div>

      <v-sheet class="ma-2" outlined dark rounded v-if="$store.state.propsToAdd.rels != null && $store.state.propsToAdd.rels.length < 0">
        <v-list-item>
          <v-list-item-subtitle>Rels</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <div>
            <v-list-item v-for="(item,i) in $store.state.propsToAdd.rels" :key="i">
              <v-select item-value="id" item-text="value" :items=" $store.state.propsToAdd.rels" :rules="[v => !!v || 'Select an option, please.']" required></v-select>
            </v-list-item>
          </div>
        </v-list-item>
      </v-sheet>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return { aLabel: {} };
  },
  watch: {
    aLabel: function() {
      this.$store.state.label = this.aLabel;
    }
  },
  computed: {
    ...mapState([
      "objCreate",
      "createObj",
      "setConfigDataType",
      "selectConfigType",
      "setConfigConfig",
      "label",
      "asid"
    ]),
    getItems() {
      if (this.objCreate.type == "create") {
        return {
          items: this.setConfigDataType.node.props,
          value: "key",
          text: "key",
          id: "id"
        };
      } else if (
        this.objCreate.type == "create to" ||
        this.objCreate.type == "create from"
      ) {
        return {
          items: this.setConfigConfig.nodes,
          value: "nodeLabel",
          text: "nodeLabel",
          id: "id"
        };
      } else {
        return 0;
      }
    }
  }
};
</script>