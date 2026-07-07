<template>
  <div id="app-root" data-app>
    <AppSidebar />

    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script>
import AppSidebar from "@/components/AppSidebar.vue";

export default {
  name: "App",
  components: {
    AppSidebar,
  },
};
</script>

<style>
@import "@/assets/styles.css";
</style>

<style scoped>
#app-root {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f5f5; 
}
</style>