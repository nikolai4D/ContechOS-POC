<template>
  <div>
    <v-list-item>
      <v-list-item-subtitle>(Nod) {{activeObj.id}}</v-list-item-subtitle>
    </v-list-item>
    <v-sheet class="ma-2" outlined dark rounded>
      <v-list-item>
        <v-list-item-subtitle>Labels</v-list-item-subtitle>
      </v-list-item>
      <v-list-item v-for="item in activeObj.labels" :key="item.id">
        <div>
          <v-list-item-content>
            <div>{{item}}</div>
          </v-list-item-content>
        </div>
      </v-list-item>
    </v-sheet>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["activeObj"])
  }
};
</script>