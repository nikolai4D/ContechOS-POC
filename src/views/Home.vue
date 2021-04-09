<template>
  <v-main>
    <Sidebar />
    <v-container fluid fill-height>
      <v-col>
        <HomeConfigSelect v-if="selectedGraph == 'Config'" />
        <HomeChips v-if="selectedGraph != 'Admin'" />
      </v-col>
      <Graph />
    </v-container>
  </v-main>
</template>

<script>
import Sidebar from "./Sidebar";
import HomeChips from "../components/HomeChips";
import HomeConfigSelect from "../components/HomeConfigSelect";
import Graph from "../components/graph/Graph";

import { mapState } from "vuex";
export default {
  data() {
    return {
    };
  },
  components: {
    Sidebar,
    Graph,
    HomeChips,
    HomeConfigSelect
  },
  computed: {
    ...mapState(["selectedGraph"]),
  },
};
</script>

<style lang="scss" scoped>

.container {
  padding: 0;
}
.v-text-field {
  padding-top: 0;
}

.col {
  padding-top: 0;
}

</style>