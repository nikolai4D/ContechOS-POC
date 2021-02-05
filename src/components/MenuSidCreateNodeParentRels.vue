<template>
  <div>
    <v-sheet
      class="ma-2"
      outlined
      dark
      rounded
      v-if="$store.state.propsToAdd.rels != null && $store.state.propsToAdd.rels.length > 0"
    >
      <v-list-item>
        <v-list-item-subtitle>Parent Rels</v-list-item-subtitle>
      </v-list-item>
      <v-list-item>
        <div>
          <v-list-item v-for="(item, i) in $store.state.propsToAdd.rels" :key="i">
            <v-select
              @click="checkInput"
              :label="item.relType"
              :items="item.options"
              return-object
              item-text="option"
              item-value="hello"
              v-model="$store.state.relsInfoData['rel_' + i]"
              :rules="[v => !!v || 'Select an option, please']" required
            ></v-select>
          </v-list-item>
        </div>
      </v-list-item>
    </v-sheet>
  </div>
</template>
<script>

export default {
  computed: {},
  data() {
    return {
      rel: {},
      rel2: {},
      checked: false
    };
  },
  methods: {
    checkInput() {
      if (!this.checked) {
        this.$store.state.propsToAdd.rels.map((obj, i) => {
          this.$store.state.relsInfoData["rel_" + i] = {};
        });
      }
      this.checked = true;
    }
  }
};
</script>