<template>
  <div>
    <v-sheet class="ma-2" outlined dark rounded>
      <v-list-item>
        <v-list-item-subtitle>Properties</v-list-item-subtitle>
      </v-list-item>
      <v-list-item>
        <div v-if="$store.state.selectedGraph == 'Admin'">
          <v-list-item v-for="item in asid.root.node.props" :key="item.keyId">
            <v-list-item-content v-if="item.dataType != 'string'">{{item.key}}:{{item.value}}</v-list-item-content>
            <v-text-field
              v-else
              @input="checkInput(item, $event)"
              :value="item.value"
              :label="item.key"
            />
          </v-list-item>
        </div>

        <div v-if="$store.state.selectedGraph != 'Config'  || $store.state.selectedGraph != 'Admin'">
          <v-list-item v-for="item in $store.state.propsToShow" :key="item.keyId">
            <v-list-item-content v-if="item.dataType != 'string'">{{item.key}}:{{item.value}}</v-list-item-content>
            <v-text-field
              v-else
              @input="checkInput(item, $event)"
              :value="item.value"
              :label="item.key"
            />
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
    return { newText: "", aLabel: {}, finds: [] };
  },
  watch: {
    aLabel: function() {
      this.$store.state.label = this.aLabel;
    }
  },
  computed: {
    ...mapState([
      "createObj",
      "setConfigDataType",
      "selectConfigType",
      "setConfigConfig",
      "label",
      "asid",
    ])
  },

  methods: { 
    checkInput(item, $event) {
      if (this.$store.state.selectedGraph == "Admin") {
        this.$store.state.propsToChange.map(obj => {
          if (obj.keyId == item.keyId) {
            obj.value = $event;
          }
        });
      } else {
        this.$store.state.propsToShow.map(obj => {
          if (obj.keyId == item.keyId) {
            obj.value = $event;
          }
        });
      }
    }
  }
};
</script>