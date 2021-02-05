<template>
  <div>
    <h3>{{activeObj.type}}</h3>
    <div v-if="objEditingId == activeObj.id">
      <div>
        <v-sheet outlined dark rounded>
          <MenuCardShowNodeLabels />
          <MenuCardEditNodeProps />
        </v-sheet>
      </div>

      <!-- <v-text-field v-model="activeObj.title" :id="`obj-edit-${activeObj.id}`" /> -->
      <v-list-item-action>
        <v-btn icon>
          <v-icon @click="updateObject" color="grey lighten-1">mdi-check</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon @click="resetEdit" color="grey lighten-1">mdi-close</v-icon>
        </v-btn>
      </v-list-item-action>
    </div>

    <div v-else>
      <div v-if="activeObj.source == null">
        <v-sheet outlined dark rounded>
          <MenuCardShowNodeLabels />
          <MenuCardShowNodeProps />

          <v-list-item>
            <v-list-item-action>
              <v-btn icon>
                <v-icon @click="setToEditing" color="grey lighten-1">mdi-pencil-box-outline</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-sheet>
      </div>
      <div v-else>
        <v-sheet outlined dark rounded>
          <MenuCardShowRel />
        </v-sheet>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MenuCardShowRel from "./MenuCardShowRel";
import MenuCardShowNodeLabels from "./MenuCardShowNodeLabels";
import MenuCardShowNodeProps from "./MenuCardShowNodeProps";
import MenuCardEditNodeProps from "./MenuCardEditNodeProps";

export default {
  data() {
    return {
      newLabel: [],
      createObj: {
        node: { labels: { nodeType: "System" }, props: {} },
        rel: {}
      },
      button: { text: "Skapa", disabled: false, color: "" }
    };
  },
  components: {
    MenuCardShowNodeLabels,
    MenuCardShowNodeProps,
    MenuCardEditNodeProps,
    MenuCardShowRel
  },
  computed: {
    ...mapState([
      "activeObj",
      "objEditingId",
      "systemConfig",
      "selectConfigType"
    ])
  },
  mounted() {
    this.createNodeConfig();
  },
  methods: {
    changeLabel(e, item) {
      this.newLabel = [e, item];
    },
    async createNodeConfig() {
      await this.$store.dispatch("getSystemConfig");
      this.createObj.node.props = this.systemConfig.props;
    },
    setToEditing() {
      let objId = this.activeObj.id;
      this.$store.state.objEditingId = objId;
      setTimeout(() => {
        document.getElementById(`obj-edit-${objId}`).focus();
      }, 1);
    },
    updateObject() {
      if (this.activeObj.source == null) {
        this.$store.dispatch("updateConfigNode", this.activeObj);
      }
      this.$store.state.objEditingId = "";
    },

    resetEdit() {
      this.$store.state.objEditingId = "";
    }
  }
};
</script>

<style scoped>
</style>