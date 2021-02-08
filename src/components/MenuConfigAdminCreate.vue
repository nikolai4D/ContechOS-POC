<template>
  <v-card>
    <v-card-text>
      <v-list>
        <v-form ref="form">
          <div v-if="objCreate.type == 'create to' || objCreate.type == 'create rel'">
            <h3 v-if="objCreate.type == 'create rel'">Skapa: (Nod) -> (Bef)</h3>
            <h3 v-if="objCreate.type == 'create to'">Skapa: (Nod) -> (Ny)</h3>
            <br />
            <MenuCardNodeActive />
          </div>
          <div v-if="objCreate.type == 'create rel' && secondAct == null">
            <MenuCardNodeNotActive :secondAct="secondAct" />
          </div>
          <div v-else-if="objCreate.type == 'create rel' && secondAct != null">
            <MenuCardAdminConfigRel :relList="setConfigConfig" />
            <MenuCardNodeSecondActive :secondAct="secondAct" />
          </div>

          <div v-else-if="objCreate.type == 'create to'">
            <MenuCardAdminConfigRel :relList="setConfigConfig" />
            <MenuCardAdminConfigCreateNode />
            <br />
          </div>

          <!-- Create new node only -->

          <div v-else-if="objCreate.type=='create'">
            <MenuCardAdminConfigCreateNode />
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

import MenuCardAdminConfigCreateNode from "./MenuCardAdminConfigCreateNode";
import MenuCardAdminConfigRel from "./MenuCardAdminConfigRel";

export default {
  watch: {
    "$store.state.secondAct": async function() {
    },

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
    MenuCardAdminConfigCreateNode,
    MenuCardAdminConfigRel,
    MenuCardNodeNotActive
  },
  data() {
    return {
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
      "createObj"
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
    async getNodeValues() {
      this.$store.createObj = this.tempCreateObj;
      await this.$store.dispatch(
        "getConfigConfigNodes",
        this.tempCreateObj.rel.type.id
      );
    },
    cancel() {
      this.$store.state.successful = null;
    },
    validate() {
      if (this.$refs.form.validate()) {
        if (this.objCreate.type == "create rel") {
          if (this.createObj.rel.type.value == "") {
            this.createObj.rel.type.value = this.createObj.rel.type.valueField;
          }
          // create rel

          this.objCreate.togge = 1;
          this.createObj.rel.from = this.activeObj.id;
          this.createObj.rel.to = this.secondActiveObj.node.id;

          this.$store.dispatch("createConfigRel", this.createObj.rel);

          this.$store.state.successful = "...";
          this.button.disabled = true;
          this.$store.state.setConfigConfig = {};
          this.$store.state.setConfigConfigString = JSON.stringify(
            this.$store.state.setConfigConfig
          );
        }

        // create only node
        else if (this.objCreate.type == "create") {
          this.createObj.node["labels"] = [this.label, this.selectConfigType];
          this.$store.dispatch("createAdminConfigNode", this.createObj.node);

          this.button.disabled = true;
          this.$store.state.successful = "...";
          // this.$store.dispatch("readNodes", "System");
          this.activeObj = {};
        }

        // create node and rel
        else {
          if (this.createObj.rel.type.value == "") {
            this.createObj.rel.type.value = this.createObj.rel.type.valueField;
          }
          const newObject = {
            node: {
              ...this.createObj.node,
              labels: [this.selectConfigType, this.label]
            },
            rel: { type: this.createObj.rel.type.value }
          };

          if (this.objCreate.type == "create to") {
            this.objCreate.toggle = 1;
            newObject.direction = "from";
            newObject.node.id = this.activeObj.id;
            this.$store.dispatch("createAdminConfigNodeRel", newObject);

            this.button.disabled = true;
            this.$store.state.successful = "...";
          } else if (this.objCreate.type == "create from") {
            this.objCreate.toggle = 0;
            newObject.direction = "to";
            newObject.node.id = this.activeObj.id;
            this.$store.dispatch("createAdminConfigNodeRel", newObject);

            this.button.disabled = true;
            this.$store.state.successful = "...";
          }
        }
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
