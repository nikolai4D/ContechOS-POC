<template>
  <v-list dense>
    <v-list-item-group>
      <v-list-item
        v-for="item in getMenuItem"
        :key="item.title"
        link
        @click="checkSelectedItem(item)"
        :class="{ active: isActive }"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
export default {
  name: "MenuItems",
  data() {
    return {
      isActive: true,
      selectedItem: 0,
      items: [
        { title: "Config", icon: "mdi-cog-outline" },
        { title: "Admin", icon: "mdi-cogs" },
        { title: "System", icon: "mdi-vector-circle" },
        { title: "Information", icon: "mdi-graph-outline" },
        { title: "Data", icon: "mdi-vector-polyline" }
      ]
    };
  },
  props:['getMenuItem'],
  methods: {
    checkSelectedItem(item) {
      this.selectedItem = this.items.indexOf(item);
      this.$store.state.selectedGraph = item.title;
      this.$store.state.selectConfigType = "";
      this.$store.state.activeObj = {};
      this.$store.state.objCreate = { status: false};


      if (item.title != "Config") {
        this.$store.dispatch("readModel", item.title);
      } else {
        this.$store.state.graph = {
        };
      }
    }
  }
};
</script>

<style scoped>
</style>