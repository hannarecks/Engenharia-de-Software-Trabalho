<template>
  <div id="app-root">
    <AppSidebar />

    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script>
import AppSidebar   from '@/components/AppSidebar.vue'
import NewTaskModal from '@/components/NewTaskModal.vue'
import TabOverview    from '@/views/TabOverview.vue'
import TabDivergencias from '@/views/TabDivergencias.vue'

import { initialTasks } from '@/data/mockData'

export default {
  name: 'App',
  components: {
    AppSidebar,
    NewTaskModal,
    TabOverview,
    TabDivergencias,
  },
}
</script>

<style>

@import '@/assets/styles.css';
</style>

<style scoped>
#app-root {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

</style>
