<template>
  <v-sheet class="ma-2" outlined dark rounded>
    <v-list-item>
      <v-list-item-subtitle>Child Properties</v-list-item-subtitle>
      <v-list-item-action>
        <v-tooltip right open-delay="1100">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" @click="add" icon depressed small>
              <v-icon small>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Lägg till egenskap</span>
        </v-tooltip>
      </v-list-item-action>
    </v-list-item>
    <v-list-item v-if="this.$store.state.textFields.length >0">
      <div>
        <v-list-item dense v-for="(textField, i) in this.$store.state.textFields" :key="i">
          <div>
            <v-divider />
            <v-combobox
              label="Prop"
              :items="asid.childProps.props"
              item-text="value"
              return-object
              v-model="textField.value1"
              :rules="[v => !!v || 'Fill in or select an option, please.']"
              required
            ></v-combobox>
            <v-select
              v-if="!asid.childProps.props.includes(textField.value1)"
              label="DataType"
              :items="asid.childProps.dataTypes"
              item-value="id"
              item-text="value"
              v-model="textField.value2"
              :rules="[v => !!v || 'Select an option, please.']"
              required
            ></v-select>
          </div>
          <v-list-item-action>
            <v-btn small icon>
              <v-icon small @click="remove(i)" color="grey lighten-1">mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </div>
    </v-list-item>
  </v-sheet>
</template>

<script>
import { mapState } from "vuex";

export default {
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