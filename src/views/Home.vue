<template>
  <v-content>
    <SideBar />
    <v-container fluid fill-height v-if="graphSelected == 'Config'">
      <v-col>
        <HomeConfigSelect />
        <!-- <div v-if="$store.state.selectConfigType == ''">Välj config</div> -->
        <HomeChips  v-if="$store.state.selectConfigType != ''"/>
      </v-col>
      <GraphConfig class="graph" :isLoaded="isLoadedSys" v-if="$store.state.selectConfigType != ''" />
    </v-container>
    <v-container fluid fill-height v-if="graphSelected == 'Admin'">
      <v-col>
        <HomeChips />
      </v-col>
      <GraphAdmin class="graph" v-if="graphSelected = 'Admin'" :isLoaded="isLoadedSys" />
    </v-container>
    <v-container fluid fill-height v-if="graphSelected == 'System'">
      <v-col>
        <HomeChips />
      </v-col>
      <GraphSystem class="graph" v-if="graphSelected = 'System'" :isLoaded="isLoadedSys" />
    </v-container>
    <v-container fluid fill-height v-if="graphSelected == 'Information'">
      <v-col>
        <HomeChips />
      </v-col>
      <GraphInfo class="graph" v-if="graphSelected = 'Information'" />
    </v-container>
    <v-container fluid fill-height v-if="graphSelected == 'Data'">
      <v-col>
        <HomeChips />
      </v-col>
      <GraphData class="graph" v-if="graphSelected = 'Data'" />
    </v-container>
  </v-content>
</template>

<script>
import SideBar from "./SideBar";
import GraphConfig from "./GraphConfig";
import GraphAdmin from "./GraphAdmin";
import GraphData from "./GraphData";
import GraphInfo from "./GraphInfo";
import GraphSystem from "./GraphSystem";
import HomeChips from "../components/HomeChips";
import HomeConfigSelect from "../components/HomeConfigSelect";

import { mapState } from "vuex";
export default {
  data() {
    return {
      activeObj: {},
      graphSelected: "",
      isLoadedSys: false,
      isLoadedInfo: false,
      isLoadedData: false
    };
  },
  components: {
    SideBar,
    GraphConfig,
    GraphAdmin,
    GraphData,
    GraphInfo,
    GraphSystem,
    HomeChips,
    HomeConfigSelect
  },
  computed: {
    ...mapState(["graph", "selectedGraph", "selectConfigType"]),
    isDone() {
      return this.graph !== {};
    }
  },
  async mounted() {
    // this.isLoadedCo = false;
    // this.isLoadedCo = true;

    this.isLoadedSys = false;
    // await this.$store.dispatch("readNodes", "System");
    this.isLoadedSys = true;

    this.isLoadedInfo = false;
    // await this.$store.dispatch("readNodesParents", "Info");
    this.isLoadedInfo = true;
    this.isLoadedData = false;
    // await this.$store.dispatch("readNodesParents", "Data");
    this.isLoadedData = true;
  },
  watch: {
    selectedGraph: function() {
      this.graphSelected = this.selectedGraph;
    },
    deep: true
  }
};
</script>

<style lang="scss" scoped>
.v-card {
  display: block ruby;
  align-self: start;
  padding-top: 0;
}
.container {
  padding: 0;
}
.v-text-field {
  padding-top: 0;
}

.col {
  padding-top: 0;
}

.graph {
  height: 70vh;
}
</style>