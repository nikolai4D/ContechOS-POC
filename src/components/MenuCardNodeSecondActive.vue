<template>
  <v-sheet>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>{{secondAct}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-sheet>
</template>

<script>
export default {
      props:['secondAct']
};
</script>