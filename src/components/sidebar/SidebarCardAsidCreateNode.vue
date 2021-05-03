<template>
      <v-list>
                <v-list-item>
                  <v-list-item-subtitle>(Ny)</v-list-item-subtitle>
                </v-list-item>
                <SidebarCardSidCreateNodeParentNode v-if="selectedGraph != 'Admin'" />
                <SidebarCardSystemCreateLabels v-if="selectedGraph != 'Admin'" />
                <SidebarCardAsidCreateNodeLabels v-if="selectedGraph == 'Admin'" />
                <SidebarCardAsidCreateNodeProps />
                <SidebarCardAsidCreateShowRels v-if="selectedGraph != 'Admin'" />
                <SidebarCardAsidCreateNodeChildProps />
      </v-list>
</template>

<script>
import { mapState } from "vuex";

import SidebarCardAsidCreateShowRels from "./SidebarCardAsidCreateShowRels";
import SidebarCardAsidCreateNodeLabels from "./SidebarCardAsidCreateNodeLabels";
import SidebarCardSystemCreateLabels from "./SidebarCardSystemCreateLabels";
import SidebarCardAsidCreateNodeProps from "./SidebarCardAsidCreateNodeProps";
import SidebarCardAsidCreateNodeChildProps from "./SidebarCardAsidCreateNodeChildProps";
import SidebarCardSidCreateNodeParentNode from "./SidebarCardSidCreateNodeParentNode";

export default {

  components: {
    SidebarCardAsidCreateNodeLabels,
    SidebarCardAsidCreateNodeProps,
    SidebarCardAsidCreateNodeChildProps,
    SidebarCardSidCreateNodeParentNode,
    SidebarCardAsidCreateShowRels,
    SidebarCardSystemCreateLabels
  },
  data() {
    return {
      createString: {
        rel: "Skapa: (Nod) -> (Bef)",
        to: "Skapa: (Nod) -> (Ny)",
        from: "Skapa: (Nod) <- (Ny)",
        new: "Skapa: (Ny)"
      },
      loader: null,
      loading3: false,
      button: {
        text: "mdi-check",
        disabled: false,
        color: "",
        successText: "Skapat!"
      }
    };
  },

  computed: {
    ...mapState([

      "successful",

      "selectedGraph",
      "asid"    ]),
  },

  async mounted() {

  },
  methods: {
  }
};
</script>
