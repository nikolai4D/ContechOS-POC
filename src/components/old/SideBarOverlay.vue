<template>
    <v-list dense rounded>
        
      <v-btn small @click="onClickButton">Tillbaka</v-btn>
                              <!-- <v-btn  icon @click.stop="mini = !mini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn> -->
      <v-list-item v-for="item in items" :key="item.title" link>
          
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
</template>

<script>

export default {
  
  data() {
    return {
              icons: ['mdi-chevron-left'],
      items: [
        { title: "Home", icon: "mdi-view-dashboard" },
        { title: "About", icon: "mdi-forum" }
      ]
    };
  },
  props: ["clicked"],
  methods: {
    onClickButton() {
      this.$emit("clicked", false);
    }
  }
};
</script>