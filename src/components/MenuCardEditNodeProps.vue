<template>
  <v-sheet class="ma-2" outlined dark rounded>
    <v-list-item>
      <v-list-item-subtitle>Properties</v-list-item-subtitle>
    </v-list-item>
    <v-list-item>
      <div>
        <v-list-item dense v-for="(item, i) in activeObj.props" :key="i">
          <v-text-field v-model="item.value" :label="item.key" />
        </v-list-item>
      </div>
    </v-list-item>
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