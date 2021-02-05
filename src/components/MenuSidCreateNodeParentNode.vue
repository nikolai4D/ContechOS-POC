<template>
  <div>
    <v-sheet class="ma-2" outlined dark rounded>
      <v-list-item>
        <v-list-item-subtitle>Parent Node</v-list-item-subtitle>
      </v-list-item>
      <v-list-item>
        <div>
          <v-list-item>
            <v-select
              item-text="value"
              item-value="value"
              return-object
              @change="checkInput"
              v-model="$store.state.propsToAdd"
              :items="$store.state.asid.root.node.parentNodes"
              :rules="[v => !!v || 'Select an option, please.']" required
            />
          </v-list-item>
        </div>
      </v-list-item>
    </v-sheet>
  </div>
</template>

<script>

export default {
  computed: {},
  methods: {
    checkInput() {
      this.$store.state.propsToShow = this.$store.state.propsToAdd.childProps.concat(
        this.$store.state.asid.root.node.props
      );
    }
  }
};
</script>