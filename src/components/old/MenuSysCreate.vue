<template>
  <v-card>
    <v-card-text>
      <!-- Egenskaper:
        <v-btn v-if="successful == null" @click="add" icon rounded>
          <v-icon>mdi-plus-circle-outline</v-icon>
      </v-btn>-->

      <v-list>
        <v-form ref="form">
          <div v-if="successful == null">
            <div v-if="objCreate.type == 'create rel'">
              <!-- Create rel -->
              <h3>Skapa: (Nod) - (Bef)</h3>
              <br />
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

            <!-- Create rel w new node -->
            <div v-else>
              <h3>Skapa: (Nod) - (Ny)</h3>
              <br />

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
                      <v-list-item dense>
                        <div v-for="(item, i) in systemConfig.labels" :key="i">
                          <v-text-field
                            v-if="item.value == 'string' "
                            :label="item.key"
                            :rules="[v => !!v || 'Vänligen fyll i.']"
                            required
                            v-model="createObj.node.labels.nodeLabel"
                          ></v-text-field>
                        </div>
                      </v-list-item>
                    </div>
                  </v-list-item>
                </v-sheet>

                <v-sheet class="ma-2" outlined dark rounded>
                  <v-list-item>
                    <v-list-item-subtitle>Properties</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <div>
                      <v-list-item dense v-for="(item, i) in createObj.node.props" :key="i">
                        <div>
                          <v-text-field
                            v-if="item.value == 'string' "
                            :rules="[v => !!v || 'Vänligen fyll i.']"
                            required
                            :label="item.key"
                            v-model="item.result"
                          ></v-text-field>
                        </div>
                      </v-list-item>
                    </div>
                  </v-list-item>
                </v-sheet>
              </v-sheet>
            </div>
          </div>

          <div v-else>
            <v-list-item>{{objCreate.title}}</v-list-item>

            <v-sheet outlined dark rounded v-if="textFields.length >0">
              <v-list-item>
                <v-list-item-subtitle>Egenskaper</v-list-item-subtitle>
              </v-list-item>
              <v-list-item dense v-for="(textField, i) in textFields" :key="i">
                <div>
                  <v-list-item-content>{{textField.key}}: {{textField.value}}</v-list-item-content>
                </div>
              </v-list-item>
            </v-sheet>
          </div>

          <div v-if="objCreate.type != 'create'">
            <!-- <v-sheet outlined dark rounded> -->
            <v-list-item>
              <v-text-field
                :rules="[v => !!v || 'Vänligen fyll i.']"
                required
                v-model="createObj.rel.type"
                label="Rel"
              ></v-text-field>
              <v-list-item-action>
                <v-btn-toggle v-model="objCreate.toggle" mandatory>
                  <v-btn small icon>
                    <v-icon color="grey lighten-1">mdi-arrow-down-bold</v-icon>
                  </v-btn>
                  <v-btn small icon>
                    <v-icon active-class color="grey lighten-1">mdi-arrow-up-bold</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-list-item-action>
            </v-list-item>
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

                  <!-- <v-list-item-subtitle>Nod</v-list-item-subtitle> -->
                </v-list-item-content>
              </v-list-item>
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
      createObj: {
        node: { labels: { nodeType: "System" }, props: {} },
        rel: {}
      },
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
      "secondActiveObj"
    ]),
    getSecond() {
      return this.secondActiveObj.node;
    }
  },
  mounted() {
    this.createNodeConfig();
  },
  methods: {
    async createNodeConfig() {
      await this.$store.dispatch("getSystemConfig");
      this.createObj.node.props = this.systemConfig.props;
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
        if (this.objCreate.type == "create rel") {
          console.log("sending ");

          // create rel
          if (this.objCreate.toggle == 0) {
            this.createObj.rel.to = this.activeObj.id;
            this.createObj.rel.from = this.secondActiveObj.node.id;

            const newObject = {
              systemConfig: this.systemConfig,
              createObj: { ...this.createObj }
            };

            console.log(newObject, "newObject", this.objCreate.toggle);
            this.$store.dispatch("createRel", newObject);

            this.$store.state.successful = "...";
            this.button.disabled = true;
          } else if (this.objCreate.toggle == 1) {
            this.createObj.rel.from = this.activeObj.id;
            this.createObj.rel.to = this.secondActiveObj.node.id;

            const newObject = {
              systemConfig: this.systemConfig,
              createObj: { ...this.createObj }
            };
            console.log(newObject, "newObject", this.objCreate.toggle);

            this.$store.dispatch("createRel", newObject);
            this.button.disabled = true;
            this.$store.state.successful = "...";
          }
        }
        // create node rel, or only node
        else {
          if (this.objCreate.toggle == 0) {
            this.createObj.rel.direction = "from";
            this.createObj.rel.id = this.activeObj.id;

            const newObject = {
              systemConfig: this.systemConfig,
              createObj: { ...this.createObj }
            };
            console.log(newObject, "newObject", this.objCreate.toggle);
            this.$store.dispatch("createNodeRel", newObject);
            this.$store.state.successful = "...";
            this.button.disabled = true;
          } else if (this.objCreate.toggle == 1) {
            this.createObj.rel.direction = "to";
            this.createObj.rel.id = this.activeObj.id;

            const newObject = {
              systemConfig: this.systemConfig,
              createObj: { ...this.createObj }
            };
            console.log(newObject, "newObject", this.objCreate.toggle);

            this.$store.dispatch("createNodeRel", newObject);
            this.button.disabled = true;
            this.$store.state.successful = "...";
          } else {
            const newObject = {
              systemConfig: this.systemConfig,
              createObj: { ...this.createObj }
            };
            this.$store.dispatch("createNode", newObject);
            console.log("newObject", newObject);
            this.button.disabled = true;
            this.$store.state.successful = "...";
            this.$store.dispatch("readNodes", "System");
            this.activeObj = {};
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
