<template>
  <div>
 
    <div class="div-chip" v-for="item in groups" :key="groups.indexOf(item)">
     <v-chip
        small
        class="ma-1"
        text-color="white"
        fab
        :color="setColors(groups.indexOf(item))"
        v-if="item != $store.state.selectConfigType"
      >{{item}}</v-chip>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["graph", "selectedGraph", "colors", "groups"])
  },
  methods: {
    setColors(item) {
      let colorList = [];
      if (this.$store.state.groups.length < 3) {
        colorList = this.$store.state.colors.length3;
      } else if (this.$store.state.groups.length > 8) {
        colorList = this.$store.state.colors.length32;
      } else {
        let set = "length" + this.$store.state.groups.length;
        colorList = this.$store.state.colors[set];
      }
      return colorList[item];
    }
  }
};
</script>

<style scoped>
.div-chip {
  display: inline;
}
</style>