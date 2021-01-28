<template>
  <div>
    <div>
      <h3 v-if="objCreate.type =='create'">Skapa: (Ny)</h3>
      <br />
    </div>
    <v-sheet outlined dark rounded>
      <v-list-item>
        <v-list-item-subtitle>(Ny)</v-list-item-subtitle>
      </v-list-item>
      <v-sheet class="ma-2" outlined dark rounded>
        <v-list-item>
          <v-list-item-subtitle>Labels</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <div>
            <v-list-item-content>{{selectConfigType}}</v-list-item-content>
            <v-select
              :items="getItems.items"
              v-model="aLabel"
              :item-value="getItems.value"
              :item-text="getItems.text"
              label="Label"
              :key="getItems.id"
            ></v-select>
          </div>
        </v-list-item>
      </v-sheet>

      <v-sheet class="ma-2" outlined dark rounded>
        <v-list-item>
          <v-list-item-subtitle>Properties</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-text-field v-model="createObj.node.props.key" label="Key" />:
          <v-text-field v-model="createObj.node.props.value" label="Value" />
        </v-list-item>
      </v-sheet>
    </v-sheet>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {aLabel:{}};
  },
  watch: {
    aLabel: function() {
    this.$store.state.label = this.aLabel;
    },
  },
  computed: {
    ...mapState([
      "objCreate",
      "createObj",
      "setConfigDataType",
      "selectConfigType",
      "setConfigConfig",
      "label"
    ]),
    getItems() {
      if (this.objCreate.type == "create") {
        return {items: this.setConfigDataType.node.props, value: "key", text:"key", id: "id"};
      } else if (this.objCreate.type == "create to" || this.objCreate.type == "create from") {
        return {items: this.setConfigConfig.nodes, value: "nodeLabel", text:"nodeLabel",id: "id"};
      } else {
        return 0;
      }
    }
  },
};
</script>