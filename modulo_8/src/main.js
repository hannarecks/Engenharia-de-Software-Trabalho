import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'
import router from "./router";

Vue.config.productionTip = false

// Espera o Supabase confirmar se já existe uma sessão salva antes de inicializar a aplicação
store.dispatch('auth/init').then(() => {
  new Vue({
    store,
    router,
    vuetify,
    render: h => h(App)
  }).$mount('#app')
})