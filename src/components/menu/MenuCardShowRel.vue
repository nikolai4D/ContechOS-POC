<template>
  <div>
    <v-list-item>
      <v-list-item-subtitle>(Rel) {{activeObj.id}}</v-list-item-subtitle>
    </v-list-item>
    <v-sheet class="ma-2" outlined dark rounded v-for="(item,i) in getContent" :key="i">
      <v-list-item>
        <v-list-item-subtitle>{{item.header}} {{item.id}}</v-list-item-subtitle>
      </v-list-item>
      <v-list-item>
        <div>
          <v-list-item-content>
            <div>{{item.content}}</div>
          </v-list-item-content>
        </div>
      </v-list-item>


        <div v-if="item.parent">
          <div v-for="label in item.parent" :key="label">
            <v-list-item v-if="!['Admin', 'System', 'Information'].includes(label)">
              <div>
                <v-list-item-content>
                  <div>({{label}})</div>
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
    ...mapState(["activeObj"]),
    getContent() {
      return [
        { header: "Type", content: this.activeObj.title },
        {
          header: "(Source)",
          content: this.activeObj.source.title,
          parent: this.activeObj.source.parent.labels,
          id: this.activeObj.source.id
        },
        {
          header: "(Target)",
          content: this.activeObj.target.title,
          parent: this.activeObj.target.parent.labels,
          id: this.activeObj.target.id

        }
      ];
    }
  }
};
</script>