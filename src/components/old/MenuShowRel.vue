<template>
  <div>
    <v-sheet outlined dark rounded>
      <v-list-item>
        <v-list-item-subtitle>Rel</v-list-item-subtitle>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>{{activeObj.title}}</v-list-item-content>
      </v-list-item>
    </v-sheet>
    <br />
    <v-sheet outlined dark rounded>
      <v-list-item>
        <v-list-item-subtitle>Source</v-list-item-subtitle>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>{{activeObj.source.title}}</v-list-item-content>
      </v-list-item>
    </v-sheet>
    <br />
    <v-sheet outlined dark rounded>
      <v-list-item>
        <v-list-item-subtitle>Target</v-list-item-subtitle>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>{{activeObj.target.title}}</v-list-item-content>
      </v-list-item>
    </v-sheet>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      button: { text: "Skapa", disabled: false, color: "" },
      toggle_exclusive: null,
      drawer: true,
      options: [{ title: "Från" }, { title: "Till" }]
    };
  },
  computed: {
    ...mapState(["activeObj", "objEditingId", "objCreate", "successful"])
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        if (this.toggle_exclusive == 0) {
          this.$store.state.objCreate.direction = "to";
          this.$store.state.objCreate.id = this.activeObj.id;
          this.$store.state.successful = "...";

          this.button.disabled = true;

          this.$store.dispatch("createNodeRel", this.objCreate);
        } else if (this.toggle_exclusive == 1) {
          this.$store.state.objCreate.direction = "from";
          this.$store.state.objCreate.id = this.activeObj.id;

          this.$store.dispatch("createNodeRel", this.objCreate);
          this.button.disabled = true;
          this.$store.state.successful = "...";
        } else {
          this.$store.dispatch("createNode", this.objCreate);
          this.button.disabled = true;
          this.$store.state.successful = "...";
        }
      }
    }
  }
};
</script>

<style scoped>
</style>