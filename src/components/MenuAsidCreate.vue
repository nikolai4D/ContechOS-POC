<template>
  <v-card>
    <v-card-text>
      <v-list>
        <v-form ref="form">
          <div
            v-if="objCreate.type == 'create to' || objCreate.type == 'create from' || objCreate.type == 'create rel'"
          >
            <h3 v-if="objCreate.type == 'create rel'">{{createString.rel}}</h3>
            <h3 v-if="objCreate.type == 'create to'">{{createString.to}}</h3>
            <h3 v-if="objCreate.type == 'create from'">{{createString.from}}</h3>

            <br />
            <MenuCardNodeActive />
          </div>
          <div v-if="objCreate.type == 'create rel' && secondAct == null">
            <MenuCardNodeNotActive :secondAct="secondAct" />
          </div>
          <div v-else-if="objCreate.type == 'create rel' && secondAct != null">
            <MenuCardAsidRel :relList="setConfigConfig" />
            <MenuCardNodeSecondActive :secondAct="secondAct" />
          </div>

          <div v-else-if="objCreate.type == 'create to' || objCreate.type == 'create from'">
            <MenuCardAsidRel v-if="objCreate.type == 'create to'" :relList="setConfigConfig" />
            <MenuCardAsidRel v-if="objCreate.type == 'create from'" :relList="setConfigConfig" />

            <v-sheet outlined dark rounded>
              <v-list-item>
                <v-list-item-subtitle>(Ny)</v-list-item-subtitle>
              </v-list-item>
              <MenuSidCreateNodeParentNode v-if="selectedGraph != 'Admin'" />
              <MenuSystemCreateLabels v-if="selectedGraph != 'Admin'" />
              <MenuAsidCreateNodeLabels v-if="selectedGraph == 'Admin'" />
              <MenuAsidCreateNodeProps />
              <MenuAsidCreateNodeChildProps />
              <MenuSidCreateNodeParentRels
                v-if="selectedGraph != 'Admin' && selectedGraph != 'System'"
              />
            </v-sheet>
            <br />
          </div>

          <!-- Create new node only -->

          <div v-else-if="objCreate.type=='create'">
            <div>
              <h3>{{createString.new}}</h3>
              <br />
            </div>
            <v-sheet outlined dark rounded>
              <v-list-item>
                <v-list-item-subtitle>(Ny)</v-list-item-subtitle>
              </v-list-item>
              <MenuSidCreateNodeParentNode v-if="selectedGraph != 'Admin'" />
              <MenuSystemCreateLabels v-if="selectedGraph != 'Admin'" />
              <MenuAsidCreateNodeLabels v-if="selectedGraph == 'Admin'" />
              <MenuAsidCreateNodeProps />
              <MenuAsidCreateShowRels v-if="selectedGraph != 'Admin'" />
              <MenuAsidCreateNodeChildProps />
            </v-sheet>
          </div>

          <v-list-item>
            <v-list-item-action>
              <v-btn
                :loading="loading3"
                @click="validate"
                :color="button.color"
                :disabled="button.disabled"
                icon
              >
                <v-icon color="grey lighten-1">{{button.text}}</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <v-btn @click="cancel" v-if="successful=='...'" icon>
                <v-icon color="grey lighten-1">mdi-close</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action v-if="successful == true" color="green">{{button.successText}}</v-list-item-action>
          </v-list-item>
        </v-form>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
import MenuCardNodeActive from "./MenuCardNodeActive";
import MenuCardNodeSecondActive from "./MenuCardNodeSecondActive";
import MenuCardNodeNotActive from "./MenuCardNodeNotActive";

// import MenuCardAdminConfigCreateNode from "./MenuCardAdminConfigCreateNode";
import MenuCardAsidRel from "./MenuCardAsidRel";
import MenuAsidCreateShowRels from "./MenuAsidCreateShowRels";

import MenuAsidCreateNodeLabels from "./MenuAsidCreateNodeLabels";
import MenuSystemCreateLabels from "./MenuSystemCreateLabels";

import MenuAsidCreateNodeProps from "./MenuAsidCreateNodeProps";
import MenuAsidCreateNodeChildProps from "./MenuAsidCreateNodeChildProps";
import MenuSidCreateNodeParentRels from "./MenuSidCreateNodeParentRels";
import MenuSidCreateNodeParentNode from "./MenuSidCreateNodeParentNode";

export default {
  watch: {
    "$store.state.secondAct": async function() {},

    successful: function() {
      if (this.successful == null) {
        this.button.disabled = false;
        const l = this.loader;
        this[l] = false;
        this.loader = null;
      }
      if (this.successful == "...") {
        this.loader = "loading3";
        this.button.disabled = true;
        const l = this.loader;
        this[l] = !this[l];
      }
      if (this.successful == true) {
        const l = this.loader;
        this[l] = false;
        this.loader = null;
        // this.button.disabled = true
      }
    },

    deep: true
  },
  props: ["secondAct"],
  components: {
    MenuCardNodeActive,
    MenuCardNodeSecondActive,
    // MenuCardAdminConfigCreateNode,
    MenuCardAsidRel,
    MenuCardNodeNotActive,
    MenuAsidCreateNodeLabels,
    MenuAsidCreateNodeProps,
    MenuAsidCreateNodeChildProps,
    MenuSidCreateNodeParentRels,
    MenuSidCreateNodeParentNode,
    MenuAsidCreateShowRels,
    MenuSystemCreateLabels
  },
  data() {
    return {
      createString: {
        rel: "Skapa: (Nod) -> (Bef)",
        to: "Skapa: (Nod) -> (Ny)",
        from: "Skapa: (Nod) <- (Ny)",
        new: "Skapa: (Ny)"
      },
      loader: null,
      loading3: false,
      button: {
        text: "mdi-check",
        disabled: false,
        color: "",
        successText: "Skapat!"
      }
    };
  },

  computed: {
    ...mapState([
      "activeObj",
      "objEditingId",
      "objCreate",
      "successful",
      "systemConfig",
      "secondActiveObj",
      "selectConfigType",
      "setConfigDataType",
      "setConfigConfig",
      "label",
      "createObj",
      "selectedGraph",
      "asid",
      "relsInfoData"
    ]),

    getSecond() {
      return this.secondActiveObj.node;
    }
  },

  async mounted() {
    await this.$store.dispatch("getConfigDataTypes");
    await this.$store.dispatch("getConfigConfigRel");
  },
  methods: {
    // async getNodeValues() {
    //   this.$store.createObj = this.tempCreateObj;
    //   await this.$store.dispatch(
    //     "getConfigConfigNodes",
    //     this.tempCreateObj.rel.type.id
    //   );
    // },
    cancel() {
      this.$store.state.successful = null;
    },
    validate() {
      if (this.$refs.form.validate()) {
        if (this.objCreate.type == "create rel") {
          if (this.createObj.rel.type == null) {
            this.createObj.rel.type.value = this.createObj.rel.type.valueField;
          }
          // create rel

          this.objCreate.toggle = 1;
          this.createObj.rel.from = this.activeObj.id;
          this.createObj.rel.to = this.secondActiveObj.node.id;

          if (
            this.$store.state.selectedGraph != "Config" &&
            this.$store.state.selectedGraph != "Admin"
          ) {
            this.createObj.rel.type = this.$store.state.propsToAdd.parentRel;
          }
          // console.log("createrel", this.createObj);
          this.$store.dispatch("createAsidRel", this.createObj.rel);
          // this.$store.dispatch("createAsidRel", this.createObj.rel);

          this.$store.state.successful = "...";
          this.button.disabled = true;
          this.$store.state.setConfigConfig = {};
          this.$store.state.setConfigConfigString = JSON.stringify(
            this.$store.state.setConfigConfig
          );
        }

        // create only node
        else if (this.objCreate.type == "create") {
          this.createObj.node["labels"] = [
            this.$store.state.label,
            this.selectedGraph
          ];
          this.createObj.node["props"] = this.$store.state.propsToChange;
          if (
            this.$store.state.selectedGraph != "Config" &&
            this.$store.state.selectedGraph != "Admin"
          ) {
            this.createObj.node["props"] = this.$store.state.propsToShow;
            this.createObj.node["rels"] = []; // change this later
            this.createObj[
              "parentNodeId"
            ] = this.$store.state.propsToAdd.valueId;
          }
          this.createObj.node["childProps"] = this.$store.state.textFields;
          this.createObj["configNodeId"] = this.asid.root.node.configNodeId;

          // console.log(this.createObj, "createObj");
          if (
            this.$store.state.selectedGraph != "Config" &&
            this.$store.state.selectedGraph != "Admin"
          ) {
            this.$store.dispatch("createSystemRootNode", this.createObj);
          } else {
            this.$store.dispatch("createRootNode", this.createObj);
          }
          this.button.disabled = true;
          this.$store.state.successful = "...";
          // this.$store.dispatch("readNodes", "System");
          this.activeObj = {};
        }

        // create node and rel
        else {
          if (
            this.selectedGraph == "Admin" &&
            this.createObj.rel.type == null
          ) {
            this.createObj.rel.type.value = this.createObj.rel.type.valueField;
          }
          // const newObject = {
          //   node: {
          //     ...this.createObj.node,
          //     labels: [this.selectConfigType, this.label]
          //   },
          //   rel: { type: this.createObj.rel.type.value }
          // };

          if (this.objCreate.type == "create to") {
            this.createObj.node["labels"] = [
              this.$store.state.label,
              this.selectedGraph
            ];
            this.createObj.node["props"] = this.$store.state.propsToChange;
            this.createObj.node["childProps"] = this.$store.state.textFields;
            this.createObj["configNodeId"] = this.asid.root.node.configNodeId;
            this.createObj.node["id"] = this.activeObj.id;
            this.createObj["direcion"] = "to";
            this.createObj.node["labels"] = [
              this.$store.state.label,
              this.selectedGraph
            ];

            this.objCreate.toggle = 1;
            // newObject.direction = "from";
            // newObject.node.id = this.activeObj.id;
            console.log("create to", this.newObject);
            // this.$store.dispatch("createAdminConfigNodeRel", newObject);

            this.button.disabled = true;
            this.$store.state.successful = "...";
          } else if (this.objCreate.type == "create from") {
            this.createObj.node["labels"] = [
              this.$store.state.label,
              this.selectedGraph
            ];
            this.createObj.node["props"] = this.$store.state.propsToChange;
            if (
              this.$store.state.selectedGraph != "Config" &&
              this.$store.state.selectedGraph != "Admin"
            ) {
              this.createObj.node["props"] = this.$store.state.propsToShow;
              if (this.$store.state.selectedGraph != "System") {
    
              const objectMap = (obj, fn) =>
                Object.fromEntries(
                  Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)])
                );
              this.createObj.relss = [];
              objectMap(this.relsInfoData, v => this.createObj.relss.push(v));
   }
              this.createObj[
                "parentNodeId"
              ] = this.$store.state.propsToAdd.valueId;

              this.createObj.rel[
                "type"
              ] = this.$store.state.propsToAdd.parentRel; // change this la $store.state.propsToAdd.parentRel
            }
            this.createObj.node["childProps"] = this.$store.state.textFields;
            this.createObj["configNodeId"] = this.asid.root.node.configNodeId;

            this.createObj.node["id"] = this.activeObj.id;
            this.createObj["direction"] = "from";

            this.createObj.node["labels"] = [
              this.$store.state.label,
              this.selectedGraph
            ];

            this.objCreate.toggle = 0;
            // newObject.direction = "to";
            // newObject.node.id = this.activeObj.id;
            if (this.selectedGraph == "Admin") {
              this.$store.dispatch("createSubNodeRel", this.createObj);
              console.log("create from", this.createObj);
            } else if (
              this.selectedGraph == "Information" ||
              this.selectedGraph == "Data"
            ) {
                          this.$store.dispatch("createInfoDataSubNodeRel", this.createObj);

              console.log("create from, info data", this.createObj);
            } else {
              this.$store.dispatch("createSystemSubNodeRel", this.createObj);
              console.log("create from", this.createObj);
            }

            this.button.disabled = true;
            this.$store.state.successful = "...";
          }
        }
        this.$store.state.textFields = [];
      }
    }
  }
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}

.rels {
  border-style: solid;
  border-color: blanchedalmond;
  border-radius: 3px;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
