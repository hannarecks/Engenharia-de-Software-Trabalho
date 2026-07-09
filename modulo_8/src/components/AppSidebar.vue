<template>
  <v-card width="256" class="mx-auto">
    <v-navigation-drawer permanent color="#f7f7edd7">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Módulo 8 </v-list-item-title>
          <v-list-item-subtitle>
            Monitoramento de contratos
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" :to="item.route" link exact>
          <v-list-item-icon class="item-icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
export default {
  name: "AppSidebar",
  data() {
    return {
      items: [
        { icon: "mdi-home", title: "Editais", route: { name: "home" } },
        { icon: "mdi-compare", title: "Comparar Editais", route: { name: "compare" } },
        { icon: "mdi-alert", title: "Divergências", route: { name: "divergencias" } },
        { icon: "mdi-cash", title: "Pagamentos", route: { name: "pagamentos" } },
        { icon: "mdi-bell", title: "Alertas", route: { name: "alertas" } },
        { icon: "mdi-checkbox-marked-outline", title: "Tarefas", route: { name: "tarefas" } },
      ],
    };
  },
};
</script>

<style scoped>
.v-icon {
  margin-right: 10px;
}
</style>
