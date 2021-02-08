<template>
  <div>
    <v-list-item>
      <v-list-item-subtitle>(Nod) {{activeObj.id}}</v-list-item-subtitle>
    </v-list-item>
    <v-sheet class="ma-2" outlined dark rounded>
      <v-list-item>
        <v-list-item-subtitle>Labels</v-list-item-subtitle>
      </v-list-item>
      <v-list-item>
        <div>
          <v-list-item>{{selectedGraph}}</v-list-item>
          <v-list-item>
            <v-text-field v-model="activeObj.title" />
          </v-list-item>
        </div>
      </v-list-item>
    </v-sheet>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["activeObj", "selectedGraph"])
  }
};
</script>