<template>
  <v-select
    small
    @change="changeConfig()"
    v-model="$store.state.selectConfigType"
    class="config-drop-down"
    :items="configItems"
    label
    absolute
    left
  ></v-select>
</template>

<script>
export default {
  data() {
    return {
      configItems: [
        "Config",
        "AdminConfig",
        "SystemConfig",
        "InformationConfig",
        "DataConfig"
      ]
    };
  },
  props: ["selectConfig"],
  methods: {
    changeConfig() {
      this.$nextTick(async () => {
        await this.$store.dispatch(
          "readConfig",
          this.$store.state.selectConfigType
        );
      });
    }
  }
};
</script>

<style scoped>
.config-drop-down {
  width: 15%;
}
</style>