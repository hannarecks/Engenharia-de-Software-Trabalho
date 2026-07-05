<template>
  <div class="login-wrap">
    <div class="login-card">
      <div class="login-title">LicitaSaaS — Módulo 8</div>
      <div class="login-subtitle">{{ modoCadastro ? 'Criar conta' : 'Entrar' }} (tela apenas para teste do backend)</div>

      <input v-model="email" type="email" class="modal-input" placeholder="E-mail" />
      <input v-model="password" type="password" class="modal-input" placeholder="Senha" />

      <div v-if="erro" class="alert-item critica" style="margin: 8px 0">{{ erro }}</div>

      <button class="btn-primary" style="width: 100%" @click="enviar">
        {{ modoCadastro ? 'Criar conta' : 'Entrar' }}
      </button>

      <a class="see-all-link" style="display: block; margin-top: 10px; text-align: center" @click="modoCadastro = !modoCadastro">
        {{ modoCadastro ? 'Já tenho conta — entrar' : 'Não tenho conta — criar' }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      modoCadastro: false,
    }
  },
  computed: {
    erro() {
      return this.$store.state.auth.erro
    },
  },
  methods: {
    async enviar() {
      const action = this.modoCadastro ? 'auth/register' : 'auth/login'
      try {
        await this.$store.dispatch(action, { email: this.email, password: this.password })
        this.$router.push({ name: 'home' }).catch(() => {})
      } catch (err) {
        // erro já fica exposto via store.state.auth.erro
      }
    },
  },
}
</script>

<style scoped>
.login-wrap {
  height: 100vh; display: flex; align-items: center; justify-content: center;
  background: #f5f5f5;
}
.login-card {
  background: #fff; border: 1px solid #e2e2e2; border-radius: 10px;
  padding: 28px; width: 320px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.login-title { font-size: 15px; font-weight: 700; }
.login-subtitle { font-size: 12.5px; color: #666; margin-bottom: 16px; }
.modal-input {
  border: 1px solid #ccc; border-radius: 6px; padding: 9px 10px;
  font-size: 13px; width: 100%; box-sizing: border-box; margin-bottom: 10px;
}
</style>
