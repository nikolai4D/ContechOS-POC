<template>
  <div>
    <v-list-item>
      <v-select
        :return-object="getItems.object"
        :items="getItems.items"
        :item-value="getItems.value"
        :item-text="getItems.text"
        label="Rel"
        v-model="$store.state.createObj.rel.type"
        @change="getNodeValues()"
        :rules="[v => !!v || 'Select an option, please.']" required
      ></v-select>
    </v-list-item>
    <v-list-item>
      <v-text-field
        v-model="$store.state.createObj.rel.type.valueField"
        v-if="$store.state.createObj.rel.type != null && $store.state.createObj.rel.type.value == ''"
        :rules="[v => !!v || 'Please fill in the field.']" required
      ></v-text-field>
      <v-list-item-action>
        <v-btn-toggle v-model="objCreate.toggle" mandatory>
          <v-btn v-if="objCreate.type == 'create to' || objCreate.type == 'create rel' " small icon>
            <v-icon color="grey lighten-1">mdi-arrow-down-bold</v-icon>
          </v-btn>
          <v-btn v-if="objCreate.type == 'create from'" small icon>
            <v-icon active-class color="grey lighten-1">mdi-arrow-up-bold</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-list-item-action>
    </v-list-item>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  watch: {},
  props: ["relList"],
  computed: {
    ...mapState(["activeObj", "setConfigConfig", "objCreate"]),
    getItems() {
      if (this.objCreate.type == "create rel") {
        return {
          items: this.relList.rels,
          value: "value",
          text: "value",
          id: "id",
          object: false
        };
      } else if (
        this.objCreate.type == "create to" ||
        this.objCreate.type == "create from"
      ) {
        return {
          items: this.setConfigConfig.rels,
          value: "id",
          text: "value",
          id: "id",
          object: true
        };
      } else {
        return 0;
      }
    }
  },
  methods: {
    async getNodeValues() {
      if (
        this.objCreate.type == "create to" ||
        this.objCreate.type == "create from"
      ) {
        await this.$store.dispatch(
          "getConfigConfigNodes",
          this.$store.state.createObj.rel.type.id
        );
      }
    }
  }
};
</script>