<template>
  <v-navigation-drawer permanent app v-model="drawer" dark :mini-variant.sync="mini">
    <v-list-item class="px-2">
      <v-btn icon @click.stop="mini = !mini">
        <v-icon v-if="mini">mdi-chevron-right</v-icon>
        <v-icon v-else>mdi-chevron-left</v-icon>
      </v-btn>
    </v-list-item>
    <v-divider></v-divider>

    <MenuItems :getMenuItem="getMenuItem" />

    <div>
      <!-- Configmodell -->
      <div
        v-if="activeObj.title !=null && !objCreate.status && !mini && selectedGraph == 'Config' "
      >
        <MenuConfigShow />
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
      <div v-else-if="objCreate.status && !mini && selectedGraph != 'Config'">
        <MenuAsidCreate :secondAct="secondAct" />
      </div>
    </div>

    <template v-slot:append>
      <div class="pa-2">
        <v-switch v-model="switch1" color="#a05195" hide-details></v-switch>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";
import MenuItems from "../components/MenuItems";
import MenuConfigShow from "../components/MenuConfigShow";
import MenuConfigCreate from "../components/MenuConfigCreate";
import MenuConfigAdminCreate from "../components/MenuConfigAdminCreate";
import MenuAsidShow from "../components/MenuAsidShow";
import MenuAsidCreate from "../components/MenuAsidCreate";

export default {
  name: "SideBar",
  components: {
    // MenuConfig,
    MenuItems,
    MenuConfigShow,
    MenuConfigCreate,
    MenuConfigAdminCreate,
    MenuAsidShow,
    MenuAsidCreate
  },
  watch: {
    activeObj: function() {
      if (this.activeObj.title != null) {
        this.mini = false;
        // } else {
        //   this.mini = true;
      }
      if (this.objCreate.status) {
        // this.mini = false;
        if (this.objCreate.type == "create to") {
          this.objCreate.toggle = 1;
        } else if (this.objCreate.type == "create from") {
          this.objCreate.toggle = 0;
        }
      }
    },
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
  },

  data() {
    return {
      switch1: false,
      secondAct: null,
      selectedItem: 0,
      showoOverlay: false,
      drawer: true,
      itemsConf: [
        { title: "Config", icon: "mdi-cog-outline" },
        { title: "Admin", icon: "mdi-cogs" },
        { title: "System", icon: "mdi-vector-circle" },
        { title: "Information", icon: "mdi-graph-outline" },
        { title: "Data", icon: "mdi-vector-polyline" }
      ],
      items: [
        { title: "System", icon: "mdi-vector-circle" },
        { title: "Information", icon: "mdi-graph-outline" },
        { title: "Data", icon: "mdi-vector-polyline" }
      ],
      mini: true
    };
  },
  computed: {
    ...mapState([
      "activeObj",
      "objCreate",
      "selectedGraph",
      "successful",
      "secondActiveObj",
      "selectConfigType"
    ]),
    getMenuItem() {
      if (this.switch1) {
        return this.itemsConf;
      } else {
        return this.items;
      }
    }
  },
  methods: {
    checkSelectedItem(item) {
      this.selectedItem = this.items.indexOf(item);
      this.$store.state.selectedGraph = item.title;
    },

    async deleteNode(node) {
      let response = confirm(
        `Är du säker på att du vill ta bort "${node.title}"?`
      );

      if (response) {
        await this.$store.dispatch("deleteNode", node);
      }
    },
    onClickChild(value) {
      this.showoOverlay = value;
    }
  },
  mounted() {
    if (this.activeObj.title !== null) {
      this.mini = true;
    }
  }
};
</script>

<style scoped>
.v-input--selection-controls {
  margin-top: 0;
}
</style>