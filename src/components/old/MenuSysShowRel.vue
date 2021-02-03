<template>
  <div>
    <h3>{{activeObj.type}}</h3>

    <div>
      <v-sheet outlined dark rounded>
        <v-list-item>
          <v-list-item-subtitle>Labels</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <div v-for="item in activeObj.labels" :key="item.id">
             <v-list-item dense  v-if="item !='System'" >
                <v-list-item-content>
                  <div>{{item}}</div>
                  
                </v-list-item-content>
            </v-list-item>
          </div>
        </v-list-item>
      </v-sheet>
      <br />

      <v-sheet outlined dark rounded>
        <v-list-item>
          <v-list-item-subtitle>Properties</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <div>
            <v-list-item dense v-for="item in activeObj.props" :key="item.id">
                <v-list-item-content >
                  <div>{{item.key}} : {{item.value}}</div>
                </v-list-item-content>
            </v-list-item>
          </div>
        </v-list-item>
      </v-sheet>
    </div>
    <v-list v-if="objEditingId == activeObj.id">
      <v-list-item>
        <v-text-field v-model="activeObj.title" :id="`obj-edit-${activeObj.id}`" />
        <v-list-item-action>
          <v-btn icon>
            <v-icon @click="updateObject" color="grey lighten-1">mdi-check</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon @click="resetEdit" color="grey lighten-1">mdi-close</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-list v-else>
      <!-- <v-list-item>
        <v-list-item-action>
          <v-btn icon>
            <v-icon @click="setToEditing" color="grey lighten-1">mdi-pencil-box-outline</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>-->
    </v-list>
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
      button: { text: "Skapa", disabled: false, color: "" }
    };
  },
  computed: {
    ...mapState(["activeObj", "objEditingId", "systemConfig"])
  },
  methods: {
    setToEditing() {
      let objId = this.activeObj.id;
      this.$store.state.objEditingId = objId;
      setTimeout(() => {
        document.getElementById(`obj-edit-${objId}`).focus();
      }, 1);
    },
    updateObject() {
      if (this.activeObj.type == null) {
        this.$store.dispatch("updateRel", this.activeObj);
      } else {
        this.$store.dispatch("updateNode", this.activeObj);
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