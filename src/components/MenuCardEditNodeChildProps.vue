<template>
  <v-sheet class="ma-2" outlined dark rounded>
    <v-list-item>
      <v-list-item-subtitle>Child Properties</v-list-item-subtitle>
    </v-list-item>
    <v-list-item dense v-for="item in activeObj.childProps" :key="item.keyId" >
      <v-text-field v-model="item.key" label="Key" :rules="[v => !!v || 'Please fill in the field.']" required/>
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