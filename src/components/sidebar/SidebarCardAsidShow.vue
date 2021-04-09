<template>
  <div>
    <h3>{{activeObj.type}}</h3>
    <div v-if="objEditingId == activeObj.id">
      <div>
        <v-sheet outlined dark rounded>
          <SidebarCardVEditNodeLabel />
          <SidebarCardVEditNodeProps />
          <SidebarCardVEditNodeChildProps />
        </v-sheet>
      </div>

      <!-- <v-text-field v-model="activeObj.title" :id="`obj-edit-${activeObj.id}`" /> -->
      <v-list-item-action>
        <v-btn icon>
          <v-icon @click="updateObject" color="grey lighten-1">mdi-check</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon @click="resetEdit" color="grey lighten-1">mdi-close</v-icon>
        </v-btn>
      </v-list-item-action>
    </div>

    <div v-else>
      <div v-if="activeObj.source == null">
        <v-sheet outlined dark rounded>
          <SidebarCardVShowNodeLabels />
          <SidebarCardVShowNodeProps />

          <v-sheet class="ma-2" outlined dark rounded>
            <SidebarCardVShowNodeChildProps />
            <div v-if="this.$store.state.textFields.length >0">
              <v-list-item>
                <div>
                  <v-list-item
                    dense
                    v-for="(textField, i) in this.$store.state.textFields"
                    :key="i"
                  >
                    <div>
                      <v-divider />
                      <v-combobox
                        label="Prop"
                        :items="asid.childProps.props"
                        item-value="id"
                        item-text="value"
                        return-object
                        v-model="textField.value1"
                      ></v-combobox>
                      <v-select
                        v-if="!asid.childProps.props.includes(textField.value1)"
                        label="DataType"
                        :items="asid.childProps.dataTypes"
                        item-value="id"
                        item-text="value"
                        v-model="textField.value2"
                      ></v-select>
                      <div v-else></div>
                    </div>
                    <v-list-item-action>
                      <v-btn small icon>
                        <v-icon small @click="remove(i)" color="grey lighten-1">mdi-close</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </div>
              </v-list-item>
              <v-list-item>
                <v-list-item-action class="buttons">
                  <v-btn icon>
                    <v-icon @click="updateChildProp" color="grey lighten-1">mdi-check</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </div>
          </v-sheet>
          <v-list-item v-if="this.$store.state.textFields.length ==0">
            <v-list-item-action>
              <v-btn icon>
                <v-icon @click="setToEditing" color="grey lighten-1">mdi-pencil-box-outline</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-sheet>
      </div>
      <div v-else><SidebarCardVShowRel/></div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SidebarCardVShowNodeLabels from "./SidebarCardVShowNodeLabels";
import SidebarCardVShowRel from "./SidebarCardVShowRel";

import SidebarCardVEditNodeLabel from "./SidebarCardVEditNodeLabel";

import SidebarCardVEditNodeProps from "./SidebarCardVEditNodeProps";
import SidebarCardVEditNodeChildProps from "./SidebarCardVEditNodeChildProps";
import SidebarCardVShowNodeProps from "./SidebarCardVShowNodeProps";
import SidebarCardVShowNodeChildProps from "./SidebarCardVShowNodeChildProps";

export default {
  data() {
    return {
      newLabel: [],
      createObj: {
        node: { labels: { nodeType: "System" }, props: {} },
        rel: {}
      },
      button: { text: "Skapa", disabled: false, color: "" }
    };
  },
  components: {
    SidebarCardVShowNodeLabels,
    SidebarCardVShowNodeProps,
    SidebarCardVEditNodeLabel,
    SidebarCardVEditNodeProps,
    SidebarCardVEditNodeChildProps,
    SidebarCardVShowNodeChildProps,
    SidebarCardVShowRel
  },
  computed: {
    ...mapState([
      "activeObj",
      "objEditingId",
      "systemConfig",
      "selectConfigType",
      "asid",
      "selectedGraph"
    ])
  },
  mounted() {
    this.createNodeConfig();
  },
  methods: {
    changeLabel(e, item) {
      this.newLabel = [e, item];
    },
    async createNodeConfig() {
      await this.$store.dispatch("getSystemConfig");
      this.createObj.node.props = this.systemConfig.props;
    },
    setToEditing() {
      let objId = this.activeObj.id;
      this.$store.state.objEditingId = objId;
      setTimeout(() => {
        document.getElementById(`obj-edit-${objId}`).focus();
      }, 1);
    },
    updateObject() {
      let oldLabels = this.activeObj.labels;
      const index = oldLabels.indexOf(this.selectedGraph);
      oldLabels.splice(index, 1);

      let oldLabel = oldLabels[0];
      this.activeObj["oldLabel"] = oldLabel;
      console.log(this.activeObj, "active");
      this.$store.dispatch("updateAsidNode", this.activeObj);
      // console.log
      // }

      let newLabels = [this.activeObj.title, this.selectedGraph];
      this.activeObj["labels"] = newLabels;
      console.log(this.activeObj, "active");

      this.$store.state.objEditingId = "";
    },

    updateChildProp() {
      if (this.$store.state.textFields[0].value1.value != null) {
        this.activeObj.childProps.push({
          key: this.$store.state.textFields[0].value1.value,
          keyId: this.$store.state.textFields[0].value1.id
        });
      } else {
        this.activeObj.childProps.push({
          key: this.$store.state.textFields[0].value1,
          keyId: this.$store.state.textFields[0].value2
        });
      }

      console.log(
        this.activeObj,
        {
          node: {
            id: this.activeObj.id,
            childProps: this.$store.state.textFields
          }
        },
        "childpropobject"
      );

      this.$store.dispatch("updateAsidChildProp", {
        node: {
          id: this.activeObj.id,
          childProps: this.$store.state.textFields
        },
        selectedGraph: this.selectedGraph
      });
      // this.$store.dispatch(
      //   "getAsidRootConfig",
      //   this.$store.state.selectedGraph
      // );

      this.$store.state.textFields = [];
    },

    resetEdit() {
      this.$store.state.objEditingId = "";
    },
    // add() {
    //   let hello = this.asid.childProps.props.filter(function(el) {
    //     return !this.activeObj.childProps.includes(el);
    //   });
    //   console.log("hello", hello);
    //   this.$store.state.textFields.push({
    //     label1: "Prop",
    //     value1: "",
    //     label2: "DataType",
    //     value2: ""
    //   });
    // },
    remove(index) {
      this.$store.state.textFields.splice(index, 1);
    },
    getItems() {
      let hello = this.asid.childProps.props.filter(function(el) {
        return !this.activeObj.childProps.includes(el);
      });
      console.log("hello", hello);
      // return hello
      return this.asid.childProps.props;
    }
  }
};
</script>

<style scoped>
.buttons {
  display: inline;
}
</style>