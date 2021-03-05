<template>
  <v-sheet outlined dark rounded>
    <v-list-item>
      <v-list-item-subtitle>(Nod) {{activeObj.id}}</v-list-item-subtitle>
    </v-list-item>

    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>{{activeObj.title}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>


      <div v-for="item in activeObj.parent.labels" :key="item.id">
        <v-list-item v-if="!['Admin', 'System', 'Information'].includes(item)">
          <div>
            <v-list-item-content>
              <div>({{item}})</div>
            </v-list-item-content>
          </div>
        </v-list-item>
      </div>
  </v-sheet>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["activeObj"])
  }
};
</script>