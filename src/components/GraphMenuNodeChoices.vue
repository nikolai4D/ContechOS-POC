<template>
  <div>
    <v-list small dense>
      <v-list-item-group color="primary">
        <v-item class="pa-2">
          <v-list-item-title>(Nod): {{prep.title}}</v-list-item-title>
        </v-item>

          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            @click="triggerEvent(item.type)"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
import * as d3 from "d3";
// import { mapState } from "vuex";
export default {
  name: "GraphMenuNode",
  props: ["prep", "items"],

  data() {
    return {
      showMenuNode: false,
    };
  },

  methods: {
    async triggerEvent(value) {
      this.$store.state.propsToChange = [];
      d3.selectAll("circle").attr("stroke", null);
      d3.selectAll("text").classed("textEdgeFocus", false);
      if (this.$store.state.selectedGraph == "Admin") {
        await this.$store.dispatch(
          "getAsidRootConfig",
          this.$store.state.selectedGraph
        );
        this.$store.state.propsToChange = this.$store.state.asid.root.node.props.map(
          obj => {
            if (obj.dataType == "string") {
              return { keyId: obj.keyId, value: "", key: obj.key };
            }
          }
        );
        this.$store.state.done = "true";
        this.$store.state.done = "false";
      }

      if (
        this.$store.state.selectedGraph != "Config" &&
        this.$store.state.selectedGraph != "Admin"
      ) {
        await this.$store.dispatch(
          "getSystemRootConfig",
          this.$store.state.selectedGraph
        );
        this.$store.state.propsToChange = this.$store.state.asid.root.node.props.map(
          obj => {
            if (obj.dataType == "string") {
              return { keyId: obj.keyId, value: "", key: obj.key };
            }
          }
        );
        this.$store.state.done = "true";
        this.$store.state.done = "false";
      }

      if (value == "update") {
        this.$store.state.activeObj = this.prep;
        this.$store.state.objEditingId = this.prep.id;
        this.$store.state.objCreate = { status: false };
      } else if (value == "create") {
        this.$store.state.activeObj = this.prep;
        this.$store.state.objCreate = { status: true, type: "create" };
      } else if (value == "create to") {
        this.$store.state.activeObj = this.prep;
        this.$store.state.objCreate = { status: true, type: "create to" };
      } else if (value == "create from") {
        if (
          this.$store.state.selectedGraph != "Config" &&
          this.$store.state.selectedGraph != "Admin"
        ) {
          await this.$store.dispatch("getSystemSub");
        }

        this.$store.state.activeObj = this.prep;
        this.$store.state.objCreate = { status: true, type: "create from" };
      } else if (value == "create rel") {
        this.$store.state.activeObj = this.prep;
        this.$store.state.objCreate = { status: true, type: "create rel" };
        this.$store.state.secondActiveObj.status = true;
        this.$store.dispatch("getSidRel", this.$store.state.activeObj.id);
      } else {
        this.$store.state.objCreate = { status: false };
      }
    }
  }
};
</script>

