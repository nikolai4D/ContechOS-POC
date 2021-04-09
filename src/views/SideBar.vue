<template>
  <v-navigation-drawer permanent app v-model="drawer" dark :mini-variant.sync="mini">
    <v-list-item class="px-2">
      <v-btn icon @click.stop="mini = !mini">
        <v-icon v-if="mini">mdi-chevron-right</v-icon>
        <v-icon v-else>mdi-chevron-left</v-icon>
      </v-btn>
    </v-list-item>
    <v-divider></v-divider>

    <SidebarItems :getMenuItem="getMenuItem" />
    <SidebarCard />

    <template v-slot:append>
      <div class="pa-2">
        <v-switch v-model="switch1" color="#a05195" hide-details></v-switch>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";
import SidebarItems from "../components/sidebar/SidebarItems";
import SidebarCard from "../components/sidebar/SidebarCard";


export default {
  name: "SideBar",
  components: {
    SidebarItems,
    SidebarCard
  },

  data() {
    return {
      switch1: false,
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
    }
  },
    watch: {
    activeObj: function() {
      if (this.activeObj.title != null) {
        this.mini = false;
      }
      if (this.objCreate.status) {
        if (this.objCreate.type == "create to") {
          this.objCreate.toggle = 1;
        } else if (this.objCreate.type == "create from") {
          this.objCreate.toggle = 0;
        }
      }
    }
    },
  computed: {
    ...mapState([
      "activeObj",
    ]),
    getMenuItem() {
      if (this.switch1) {
        return this.itemsConf;
      } else {
        return this.items;
      }
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