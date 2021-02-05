`<template>
  <div>
    <v-sheet class="ma-2" outlined dark rounded>
      <v-list-item>
        <v-list-item-subtitle>Labels</v-list-item-subtitle>
      </v-list-item>
      <v-list-item>
        <div>
          <v-list-item>
            <div>
              <v-list-item-content>{{$store.state.selectedGraph}}</v-list-item-content>
              <v-text-field v-model="$store.state.label" label="Label" :rules="[v => !!v || 'Please fill in the field.']" required/>
            </div>
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
    ...mapState(["asid"])
  }
};
</script>