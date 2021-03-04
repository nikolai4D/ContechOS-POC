<template>
  <div>
    <v-list-item>
      <!-- <v-text-field
        label="Rel"
        v-model="$store.state.propsToAdd.parentRel"
        v-if="$store.state.selectedGraph != 'Config'  && $store.state.selectedGraph != 'Admin'"
      ></v-text-field> -->
        <v-select
          :items="validN"
          label="Rels"
        v-if="$store.state.selectedGraph != 'Config'  && $store.state.selectedGraph != 'Admin' "
        v-model="$store.state.propsToAdd.parentRel"
        
        required
        ></v-select>

        
      <v-text-field v-else label="Rel" v-model="$store.state.createObj.rel.type"></v-text-field>
    </v-list-item>
    <v-list-item>
      <v-text-field
        v-model="$store.state.createObj.rel.type.valueField"
        v-if="$store.state.selectedGraph != 'Config'  && $store.state.selectedGraph != 'Admin' && $store.state.createObj.rel.type != null && $store.state.createObj.rel.type.value == ''"
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
  props: ["relList", "secondAct"],
  computed: {
    ...mapState([
      "activeObj",
      "setConfigConfig",
      "objCreate",
      "validNodes",
      "secondActiveObj"
    ]),
    validN() {
      let validRels = [];
      this.validNodes.map(obj =>
        obj.ids.map(obj1 => {
          if (JSON.parse(obj1) == this.secondActiveObj.node.id) {
            validRels = validRels.concat(obj.rels);
          }
        })
      );
      return validRels;
    }
  },
  methods: {}
};
</script>