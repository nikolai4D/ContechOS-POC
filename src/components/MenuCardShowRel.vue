<template>
  <div>
    <v-list-item>
      <v-list-item-subtitle>(Rel) {{activeObj.id}}</v-list-item-subtitle>
    </v-list-item>
    <v-sheet class="ma-2" outlined dark rounded v-for="(item,i) in getContent" :key="i">
      <v-list-item>
        <v-list-item-subtitle>{{item.header}}</v-list-item-subtitle>
      </v-list-item>
      <v-list-item>
        <div>
          <v-list-item-content>
            <div>{{item.content}}</div>
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
    ...mapState(["activeObj"]),
    getContent() {
      return [
          { header: "Type", content: this.activeObj.title },
          { header: "Source", content: this.activeObj.source.title },
          { header: "Target", content: this.activeObj.target.title }
        ]
    }
  }
};
</script>