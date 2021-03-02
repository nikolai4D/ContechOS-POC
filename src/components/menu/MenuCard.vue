<template>
  <div>
    <!-- Configmodell -->
    <div v-if="activeObj.title !=null && !objCreate.status && !mini && selectedGraph == 'Config' ">
      <MenuConfigShowNode />
    </div>
    <div
      v-else-if="objCreate.status && !mini && selectedGraph == 'Config' && selectConfigType == 'Config'"
    >
      <MenuConfigCreate :secondAct="secondAct" />
    </div>
    <div
      v-else-if="objCreate.status && !mini && selectedGraph == 'Config' && (selectConfigType == 'AdminConfig' || selectConfigType == 'SystemConfig' || selectConfigType == 'InformationConfig' || selectConfigType == 'DataConfig')"
    >
      <MenuConfigAdminCreate :secondAct="secondAct" />
    </div>

    <div
      v-else-if="activeObj.title !=null && !objCreate.status && !mini && selectedGraph != 'Config' "
    >
      <MenuAsidShow :secondAct="secondAct" />
    </div>
      <div
      v-else-if="objCreate.status && !mini && selectedGraph != 'Config'"
    >
      <MenuAsidCreate :secondAct="secondAct" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MenuConfigShowNode from "./MenuConfigShowNode";
import MenuConfigCreate from "./MenuConfigCreate";
import MenuConfigAdminCreate from "./MenuConfigAdminCreate";
import MenuAsidShow from "./MenuAsidShow";
import MenuAsidCreate from "./MenuAsidCreate";


export default {
  data() {
    return {
      secondAct: null,
      showoOverlay: false,
      drawer: true,
      items: [
        { title: "Config", icon: "mdi-cog-outline" },
        { title: "Admin", icon: "mdi-cogs" },
        { title: "Systemmodell", icon: "mdi-vector-circle" },
        { title: "Informationsmodell", icon: "mdi-graph-outline" },
        { title: "Datamodell", icon: "mdi-vector-polyline" }
      ]
    };
  },
  props: ["mini"],
  computed: {
    ...mapState([
      "activeObj",
      "objCreate",
      "selectedGraph",
      "successful",
      "secondActiveObj",
      "selectConfigType",
    ])
  },
  components: {
    MenuConfigShowNode,
    MenuConfigCreate,
    MenuConfigAdminCreate,
    MenuAsidShow,
    MenuAsidCreate,
    
  },

  watch: {
    "$store.state.objCreate.type": function() {
      if (this.objCreate.type == "create to") {
        this.objCreate.toggle = 1;
      } else if (this.objCreate.type == "create from") {
        this.objCreate.toggle = 0;
      }
    },
    "$store.state.setConfigConfigString": async function() {
      this.secondAct = await this.$store.state.secondActiveObj.node.title;
      if (this.$store.state.objCreate.type == "create rel") {
        if (this.secondAct != null) {
          this.$store.dispatch("getAdminConfigRels", {
            from: this.$store.state.activeObj.title,
            to: this.secondAct
          });
        }
      }
    },

    "$store.state.secondActiveObj.node.title": function() {
      if (this.$store.state.secondActiveObj.node.title == null) {
        this.secondAct == null;
      } else {
        this.secondAct = this.$store.state.secondActiveObj.node.title;

        if (this.$store.state.objCreate.type == "create rel") {
          if (this.secondAct == null) {
            this.$store.state.setConfigConfig = {};
          } else {
            this.$store.dispatch("getAdminConfigRels", {
              from: this.$store.state.activeObj.title,
              to: this.secondAct
            });
          }
        }
      }
    },
    successful: function() {
      if (this.successful) {
        this.mini = true;
        this.$store.state.activeObj = {};
        this.$store.state.objCreate = { status: false };
        this.$store.state.successful = null;
        this.$store.state.secondActiveObj = {
          status: false,
          node: { title: null }
        };
      }
    },
    deep: true
  }
};
</script>