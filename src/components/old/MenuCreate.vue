<template>
      <v-card>
        <v-card-text>
          <h3>Skapa nod</h3>
          <v-list>
            <v-form ref="form">
              <v-list-item>
                <v-text-field
                  :rules="[v => !!v || 'Vänligen fyll i.']"
                  required
                  v-model="objCreate.title"
                  label="Titel"
                ></v-text-field>
              </v-list-item>


              <div v-if="objCreate.type == 'create rel'">
                                <v-list-item>
                  <v-text-field
                    :rules="[v => !!v || 'Vänligen fyll i.']"
                    required
                    v-model="objCreate.relTitle"
                    label="Relation"
                  ></v-text-field>
                
                </v-list-item>
                <v-list-item v-if="activeObj.titale == null">
                  <v-list-item-content>
                    <h5>Tryck på nod i graf</h5>
                  </v-list-item-content>
                </v-list-item>
              </div>

              <div v-else-if="objCreate.type != 'create'">
                <v-list-item>
                  <v-text-field
                    :rules="[v => !!v || 'Vänligen fyll i.']"
                    required
                    v-model="objCreate.relTitle"
                    label="Relation"
                  ></v-text-field>
                  <v-btn-toggle v-model="toggle_exclusive" mandatory>
                    <v-btn small icon>
                      <v-icon color="grey lighten-1">mdi-arrow-down-bold</v-icon>
                    </v-btn>
                    <v-btn small icon>
                      <v-icon active-class color="grey lighten-1">mdi-arrow-up-bold</v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </v-list-item>
                <v-list-item v-if="activeObj.titale == null">
                  <v-list-item-content>
                    <h5>Tryck på nod i graf</h5>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-else>
                  <v-list-item-content>{{activeObj.title}}</v-list-item-content>
                </v-list-item>
              </div>
              <v-list-item>
                <v-list-item-action>
                  <v-btn
                    @click="validate"
                    :color="button.color"
                    :disabled="button.disabled"
                  >{{button.text}}</v-btn>
                </v-list-item-action>
                <v-list-item-action>
                  <v-skeleton-loader v-if="successful=='...'" type="avatar"></v-skeleton-loader>
                  <v-icon v-if="successful == true" x-large color="green">mdi-check-circle-outline</v-icon>
                </v-list-item-action>
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
      }
    },
    activeObj: function() {
      if (this.activeObj.title != null) {
        this.mini = false;
      } else {
        this.mini = true;
      }
    },
    objCreate: function() {
      if (this.objCreate.status) {
        this.mini = false;
        if (this.objCreate.type == "create to") {
          this.toggle_exclusive = 1;
        } else if (this.objCreate.type == "create from") {
          this.toggle_exclusive = 0;
        }
      }
    },
    deep: true
  },

  data() {
    return {
      button: { text: "Skapa", disabled: false, color: "" },
      options: [{ title: "Från" }, { title: "Till" }],
    };
  },
  computed: {
    ...mapState(["activeObj", "objEditingId", "objCreate", "successful"])
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        if (this.toggle_exclusive == 0) {
          this.$store.state.objCreate.direction = "to";
          this.$store.state.objCreate.id = this.activeObj.id;
          this.$store.state.successful = "...";

          this.button.disabled = true;

          this.$store.dispatch("createNodeRel", this.objCreate);
        } else if (this.toggle_exclusive == 1) {
          this.$store.state.objCreate.direction = "from";
          this.$store.state.objCreate.id = this.activeObj.id;

          this.$store.dispatch("createNodeRel", this.objCreate);
          this.button.disabled = true;
          this.$store.state.successful = "...";
        } else {
          this.$store.dispatch("createNode", this.objCreate);
          this.button.disabled = true;
          this.$store.state.successful = "...";
        }
      }
    }
  }
}
</script>

<style scoped>
</style>