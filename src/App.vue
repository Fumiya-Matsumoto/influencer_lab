<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Home from './pages/Home.vue';
import CreateHashtag from "./pages/CreateHashtag.vue";

export default defineComponent({
  name: "App",
  components: {
    Home,
    CreateHashtag
  },
});
</script>

<style></style>
