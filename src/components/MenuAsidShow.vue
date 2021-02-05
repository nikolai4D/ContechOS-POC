<template>
  <div>
    <h3>{{activeObj.type}}</h3>
    <div v-if="objEditingId == activeObj.id">
      <div>
        <v-sheet outlined dark rounded>
          <v-form ref="form">
            <MenuCardEditNodeLabel />
            <MenuCardEditNodeProps />
            <MenuCardEditNodeChildProps />
          </v-form>
        </v-sheet>
      </div>

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
          <v-form ref="form">
            <MenuCardShowNodeLabels />
            <MenuCardShowNodeProps />

            <v-sheet class="ma-2" outlined dark rounded>
              <MenuCardShowNodeChildProps />
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
                          :rules="[v => !!v || 'Please fill in the field.']"
                          required
                        ></v-combobox>
                        <v-select
                          v-if="!asid.childProps.props.includes(textField.value1)"
                          label="DataType"
                          :items="asid.childProps.dataTypes"
                          item-value="id"
                          item-text="value"
                          v-model="textField.value2"
                          :rules="[v => !!v || 'Select an option, please.']"
                          required
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
          </v-form>
        </v-sheet>
      </div>
      <div v-else>
        <MenuCardShowRel />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MenuCardShowNodeLabels from "./MenuCardShowNodeLabels";
import MenuCardShowRel from "./MenuCardShowRel";

import MenuCardEditNodeLabel from "./MenuCardEditNodeLabel";

import MenuCardEditNodeProps from "./MenuCardEditNodeProps";
import MenuCardEditNodeChildProps from "./MenuCardEditNodeChildProps";
import MenuCardShowNodeProps from "./MenuCardShowNodeProps";
import MenuCardShowNodeChildProps from "./MenuCardShowNodeChildProps";

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
    MenuCardShowNodeLabels,
    MenuCardShowNodeProps,
    MenuCardEditNodeLabel,
    MenuCardEditNodeProps,
    MenuCardEditNodeChildProps,
    MenuCardShowNodeChildProps,
    MenuCardShowRel
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
      if (this.$refs.form.validate()) {
        let oldLabels = this.activeObj.labels;
        const index = oldLabels.indexOf(this.selectedGraph);
        oldLabels.splice(index, 1);

        let oldLabel = oldLabels[0];
        this.activeObj["oldLabel"] = oldLabel;
        this.$store.dispatch("updateAsidNode", this.activeObj);

        let newLabels = [this.activeObj.title, this.selectedGraph];
        this.activeObj["labels"] = newLabels;

        this.$store.state.objEditingId = "";
      }
    },

    updateChildProp() {
      if (this.$refs.form.validate()) {
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

        this.$store.dispatch("updateAsidChildProp", {
          node: {
            id: this.activeObj.id,
            childProps: this.$store.state.textFields
          },
          selectedGraph: this.selectedGraph
        });

        this.$store.state.textFields = [];
      }
    },

    resetEdit() {
      this.$store.state.objEditingId = "";
    },

    remove(index) {
      this.$store.state.textFields.splice(index, 1);
    },
    getItems() {
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