<template>
  <v-card>
    <v-card-text>
      <v-list>
        <v-form ref="form">
          <div
            v-if="objCreate.type == 'create to' || objCreate.type == 'create from' || objCreate.type == 'create rel'"
          >
            <!-- <v-sheet outlined dark rounded> -->
            <h3 v-if="objCreate.type == 'create rel'">Skapa: (Nod) -> (Bef)</h3>
            <h3 v-if="objCreate.type == 'create to'">Skapa: (Nod) -> (Ny)</h3>
            <h3 v-if="objCreate.type == 'create from'">{{createString}}</h3>

            <br />

            <v-list-item v-if="activeObj.title == null">
              <v-list-item-content>
                <h5>Tryck på nod i graf</h5>
              </v-list-item-content>
            </v-list-item>

            <v-sheet outlined dark rounded v-else>
              <v-list-item>
                <v-list-item-subtitle>(Nod)</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{activeObj.title}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-sheet>

            <v-list-item>
              <v-select
                :items="setConfigDataType.rel.props"
                item-value="key"
                item-text="key"
                label="Rel"
                v-model="createObj.rel.type"
              ></v-select>
              <v-list-item-action>
                <v-btn-toggle v-model="objCreate.toggle" mandatory>
                  <v-btn
                    v-if="objCreate.type == 'create to' || objCreate.type == 'create rel' "
                    small
                    icon
                  >
                    <v-icon color="grey lighten-1">mdi-arrow-down-bold</v-icon>
                  </v-btn>
                  <v-btn v-if="objCreate.type == 'create from'" small icon>
                    <v-icon active-class color="grey lighten-1">mdi-arrow-up-bold</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-list-item-action>
            </v-list-item>
            <br />
          </div>
          <div v-if="objCreate.type == 'create rel'">
            <v-sheet outlined dark rounded>
              <v-list-item>
                <v-list-item-subtitle>(Bef)</v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if=" secondAct == null">
                <v-list-item-content>
                  <h5>Tryck på nod i graf</h5>
                </v-list-item-content>
              </v-list-item>

              <v-list-item v-else>
                <v-list-item-content>
                  <v-list-item-title>{{secondAct}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-sheet>
          </div>

          <!-- Create new node only -->
          <div v-else>
            <div v-if="objCreate.type=='create'">
              <h3>Skapa: (Ny)</h3>
              <br />
            </div>
            <v-sheet outlined dark rounded>
              <v-list-item>
                <v-list-item-subtitle>(Ny)</v-list-item-subtitle>
              </v-list-item>
              <v-sheet class="ma-2" outlined dark rounded>
                <v-list-item>
                  <v-list-item-subtitle>Labels</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <div>
                    <v-list-item-content>{{selectConfigType}}</v-list-item-content>
                    <v-select
                      :items="setConfigDataType.node.props"
                      v-model="label"
                      item-value="key"
                      item-text="key"
                      label="Label"
                    ></v-select>
                  </div>
                </v-list-item>
              </v-sheet>

              <v-sheet class="ma-2" outlined dark rounded>
                <v-list-item>
                  <v-list-item-subtitle>Properties</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-text-field v-model="createObj.node.props.key" label="Key" />:
                  <v-text-field v-model="createObj.node.props.value" label="Value" />
                </v-list-item>
              </v-sheet>
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

export default {
  watch: {
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

  data() {
    return {
      createString: "Skapa: (Nod) <- (Ny)",
      createObj: {
        rel: {},
        node: { props: { key: "", value: "" } }
      },
      label: {},
      loader: null,
      loading3: false,
      textFields: [],
      textFieldsRel: [],
      button: {
        text: "mdi-check",
        disabled: false,
        color: "",
        successText: "Skapat!"
      },
      options: [{ title: "Från" }, { title: "Till" }]
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
      "setConfigDataType"
    ]),
    getSecond() {
      return this.secondActiveObj.node;
    }
  },
  async mounted() {
    this.createNodeConfig();
    await this.$store.dispatch("getConfigDataTypes");
  },
  methods: {
    async createNodeConfig() {
      // await this.$store.dispatch("getSystemConfig");
      // this.createObj.node.props = this.systemConfig.props;
    },
    add() {
      this.textFields.push({
        key: "",
        value: ""
      });
      this.textFields.push({
        key: "",
        value: ""
      });
    },

    remove(index) {
      this.textFields.splice(index, 1);
    },

    addRel() {
      this.textFieldsRel.push({
        key: "",
        value: ""
      });
    },

    removeRel(index) {
      this.textFieldsRel.splice(index, 1);
    },

    cancel() {
      this.$store.state.successful = null;
    },
    validate() {
      if (this.$refs.form.validate()) {
        const newObject = {
          node: {
            ...this.createObj.node,
            labels: [this.selectConfigType, this.label]
          },
          rel: { type: this.createObj.rel.type }
        };

        if (this.objCreate.type == "create rel") {
          this.objCreate.toggle = 1;
          this.createObj.rel.from = this.activeObj.id;
          this.createObj.rel.to = this.secondActiveObj.node.id;
          this.$store.dispatch("createConfigRel", this.createObj.rel);
          this.button.disabled = true;
          this.$store.state.successful = "...";
        } else if (this.objCreate.type == "create to") {
          this.objCreate.toggle = 1;
          newObject.direction = "from";
          newObject.node.id = this.activeObj.id;
          this.$store.dispatch("createConfigNodeRel", newObject);

          this.button.disabled = true;
          this.$store.state.successful = "...";
        } else if (this.objCreate.type == "create from") {
          this.objCreate.toggle = 0;
          newObject.direction = "to";
          newObject.node.id = this.activeObj.id;
          this.$store.dispatch("createConfigNodeRel", newObject);
          this.button.disabled = true;
          this.$store.state.successful = "...";
        }

        // create node rel, or only node
        else {
          this.createObj.node["labels"] = [this.label, this.selectConfigType];
          this.$store.dispatch("createConfigNode", this.createObj.node);

          this.button.disabled = true;
          this.$store.state.successful = "...";
          this.activeObj = {};
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
