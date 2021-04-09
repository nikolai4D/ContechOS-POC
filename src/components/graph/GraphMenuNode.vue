<template>
  <div>
    <v-list small dense>
      <v-list-item-group color="primary">
        <GraphMenuNodeChoices
          v-if="this.$store.state.selectedGraph == 'Config'"
          :items="items.node.config"
          :prep="prep"
        />
        <GraphMenuNodeChoices v-else :items="items.node.asid" :prep="prep" />
        <GraphMenuNodeDelete :prep="prep" />
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
import GraphMenuNodeDelete from "./GraphMenuNodeDelete";
import GraphMenuNodeChoices from "./GraphMenuNodeChoices";

export default {
  name: "GraphMenuNode",
  props: ["prep"],
  components: { GraphMenuNodeDelete, GraphMenuNodeChoices },

  data() {
    return {
      showMenuNode: false,
      items: {
        canvas: [
          {
            type: "create",
            text: "Skapa nod",
            icon: "mdi-plus-circle-outline"
          }
        ],
        node: {
          config: [
            {
              type: "create to",
              text: "Skapa: (Nod) -> (Ny)",
              icon: "mdi-ray-start-arrow"
            },
            {
              type: "create rel",
              text: "Skapa: (Nod) -> (Bef)",
              icon: "mdi-vector-line"
            },
            {
              type: "update",
              text: "Redigera nod",
              icon: "mdi-circle-edit-outline"
            }
          ],
          asid: [
            {
              type: "create from",
              text: "Skapa: (Nod) <- (Ny)",
              icon: "mdi-ray-end-arrow"
            },

            {
              type: "create rel",
              text: "Skapa: (Nod) -> (Bef)",
              icon: "mdi-vector-line"
            },
            {
              type: "update",
              text: "Redigera nod",
              icon: "mdi-circle-edit-outline"
            }
          ]
        }
      }
    };
  },
}
</script>

