<template>
  <div>
    <v-divider></v-divider>
    <div>
      <v-divider></v-divider>
      <div class="text-right pa-2">
        <v-btn icon rounded>
          <v-icon
            @click="deleteNode"
            v-text="items.delete.icon"
            color="error"
          >mdi-delete-forever-outline</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "GraphMenuNodeDelete",
  props: ["prep"],

  data() {
    return {
      showMenuNode: false,
      items: {
        delete: {
          type: "delete",
          text: "Ta bort nod",
          icon: "mdi-delete-forever-outline"
        }
      }
    };
  },

  methods: {
    async deleteNode() {
      let response = confirm(
        `Är du säker på att du vill ta bort "${this.prep.title}"?`
      );

      if (response) {
        if (this.$store.state.selectedGraph == "Config") {
          await this.$store.dispatch("deleteConfigNode", this.prep);
        } else if (this.$store.state.selectedGraph == "Admin") {
          await this.$store.dispatch("deleteAsidNode", this.prep);
        } else {
          await this.$store.dispatch("deleteNode", this.prep);
        }
      }
    }
  }
};
</script>

