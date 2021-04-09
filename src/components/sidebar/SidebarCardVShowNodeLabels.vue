<template>
  <div>
    <v-list-item>
      <v-list-item-subtitle>(Nod) {{activeObj.id}}</v-list-item-subtitle>
    </v-list-item>
    <v-sheet class="ma-2" outlined dark rounded>
      <v-list-item>
        <v-list-item-subtitle>Labels</v-list-item-subtitle>
      </v-list-item>
      <div v-for="item in activeObj.labels" :key="item.id">
        <v-list-item v-if="item != selectedGraph">
          <div>
            <v-list-item-content>
              <div>{{item}}</div>
            </v-list-item-content>
          </div>
        </v-list-item>
      </div>

      <div v-if="activeObj.parent">
        <div v-for="item in activeObj.parent.labels" :key="item.id">
          <v-list-item v-if="!['Admin', 'System', 'Information'].includes(item)">
            <div>
              <v-list-item-content>
                <div>({{item}})</div>
              </v-list-item-content>
            </div>
          </v-list-item>
        </div>
      </div>
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