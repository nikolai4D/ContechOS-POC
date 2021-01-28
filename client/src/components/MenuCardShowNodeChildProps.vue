<template>
  <div>
    <v-list-item>
      <v-list-item-subtitle>Child Properties</v-list-item-subtitle>
      <v-tooltip right open-delay="1100">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" @click="add" icon depressed small :disabled="$store.state.textFields.length > 0">
            <v-icon small>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Lägg till egenskap</span>
      </v-tooltip>
    </v-list-item>
    <v-list-item v-if="activeObj.childProps != 0">
      <div>
        <v-list-item dense v-for="(item, i) in activeObj.childProps" :key="i">
          <v-list-item-content>{{item.key}}</v-list-item-content>
        </v-list-item>
      </div>
    </v-list-item>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["activeObj", "asid"])
  },
  methods: {
    add() {
      this.$store.state.textFields.push({
        label1: "Prop",
        value1: "",
        label2: "DataType",
        value2: ""
      });
    },
    remove(index) {
      this.$store.state.textFields.splice(index, 1);
    }
  }
};
</script>

<style scoped>
</style>