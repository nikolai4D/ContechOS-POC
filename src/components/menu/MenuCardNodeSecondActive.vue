<template>
  <v-sheet outlined dark rounded>
    <v-list-item>
      <v-list-item-subtitle>(Bef) {{secondActiveNode.id}}</v-list-item-subtitle>
    </v-list-item>

    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>{{secondActiveNode.title}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <div v-for="item in parentLabels" :key="item.id">
      <v-list-item v-if="!['Admin', 'System', 'Information'].includes(item)">
        <div>
          <v-list-item-content>
             <v-list-item-title>({{item}})</v-list-item-title>
          </v-list-item-content>
        </div>
      </v-list-item>
    </div>
  </v-sheet>
</template>

<script>
export default {
  props: ["secondAct", "secondActiveObj"],
  computed: {
    parentLabels() {
      return this.$store.state.secondActiveObj.node.parent.labels;
    },
    secondActiveNode() {
      return this.$store.state.secondActiveObj.node;
    }
  }
};
</script>