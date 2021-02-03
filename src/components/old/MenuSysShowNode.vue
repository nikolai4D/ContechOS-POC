<template>
  <div>
    <h3>{{activeObj.type}}</h3>
    <div v-if="objEditingId == activeObj.id">
      <div>
        <v-sheet outlined dark rounded>
          <v-list-item>
            <v-list-item-subtitle>(Nod)</v-list-item-subtitle>
          </v-list-item>
          <v-sheet class="ma-2" outlined dark rounded>
            <v-list-item>
              <v-list-item-subtitle>Labels</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <div>
                <v-list-item dense>
                  <div v-for="(item, i) in activeObj.labels" :key="i" :id="`obj-edit-${item}`">
                    <v-text-field
                      v-if="item != 'System' "
                      label
                      :rules="[v => !!v || 'Vänligen fyll i.']"
                      required
                      :value="item"
                      @input="changeLabel($event, item)"
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
                <v-list-item
                  dense
                  v-for="(item, i) in activeObj.props"
                  :key="i"
                  :id="`obj-edit-${item}`"
                >
                  <div>
                    <v-text-field
                      :rules="[v => !!v || 'Vänligen fyll i.']"
                      required
                      :label="item.key"
                      v-model="item.value"
                    ></v-text-field>
                  </div>
                </v-list-item>
              </div>
            </v-list-item>
          </v-sheet>
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
      <v-sheet outlined dark rounded>
        <v-list-item>
          <v-list-item-subtitle>(Nod)</v-list-item-subtitle>
        </v-list-item>
        <v-sheet class="ma-2" outlined dark rounded>
          <v-list-item>
            <v-list-item-subtitle>Labels</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <div v-for="item in activeObj.labels" :key="item.id">
              <v-list-item dense v-if="item !='System'">
                <v-list-item-content>
                  <div>{{item}}</div>
                </v-list-item-content>
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
              <v-list-item dense v-for="item in activeObj.props" :key="item.id">
                <v-list-item-content>
                  <div>{{item.key}} : {{item.value}}</div>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-list-item>
        </v-sheet>
        <v-list>
          <v-list-item>
            <v-list-item-action>
              <v-btn icon>
                <v-icon @click="setToEditing" color="grey lighten-1">mdi-pencil-box-outline</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-sheet>
    </div>

    <!-- 
    <h3>ID</h3>
    <v-list>
      <v-list-item>
        <v-list-item-content>{{activeObj.id}}</v-list-item-content>
      </v-list-item>
    </v-list>-->
  </div>
</template>

<script>
import { mapState } from "vuex";

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
  computed: {
    ...mapState(["activeObj", "objEditingId", "systemConfig"])
  },
  mounted() {
    this.createNodeConfig();
  },
  methods: {
    changeLabel(e, item) {
      console.log(e, item);
      this.newLabel = [e, item];
    },
    async createNodeConfig() {
      await this.$store.dispatch("getSystemConfig");
      this.createObj.node.props = this.systemConfig.props;
    },
    setToEditing() {
      let objId = this.activeObj.id;
      console.log(this.activeObj, "editing");
      this.$store.state.objEditingId = objId;
      setTimeout(() => {
        document.getElementById(`obj-edit-${objId}`).focus();
      }, 1);
    },
    updateObject() {
      if (this.activeObj.source != null) {
        // this.$store.dispatch("updateRel", this.activeObj);
      } else {
        let labelss = this.activeObj.labels.map(str => {
          if (str == this.newLabel[1]) {
            return str.replace(this.newLabel[1], this.newLabel[0]);
          } else {
            return str;
          }
        });
        
        let {id, index, props, title, vx, vy, x, y} = this.activeObj


        let  newActiveObj = {id, index, props, title, vx, vy, x, y, labels: labelss}
        this.activeObj = newActiveObj
        console.log(newActiveObj)

        // this.$store.dispatch("updateNode", this.activeObj);
      }
      this.$store.state.objEditingId = "";
    },

    resetEdit() {
      this.$store.state.objEditingId = "";
    }
  }
};
</script>

<style scoped>
</style>