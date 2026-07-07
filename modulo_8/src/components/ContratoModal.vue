<template>
  <div>
    <v-dialog
      :value="value"
      max-width="600"
      scrollable
      @input="$emit('input', $event)"
    >
      <v-card v-if="edital" class="contrato-card">
        <v-btn icon small @click="fechar">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-card-title class="contrato-header">
          <div class="contrato-header-text">
            <span class="contrato-titulo">{{ edital.nome }}</span>
            <span class="badge-ganho">Ganho</span>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="contrato-body">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Modalidade</span>
              <span class="info-value">{{ edital.modalidade || "—" }}</span>
            </div>

            <div class="info-item">
              <span class="info-label">Cidade</span>
              <span class="info-value">{{ edital.cidade || "—" }}</span>
            </div>

            <div class="info-item">
              <span class="info-label">Data de Abertura</span>
              <span class="info-value">{{
                formatarData(edital.data_abertura)
              }}</span>
            </div>

            <div class="info-item">
              <span class="info-label">Data de Fechamento</span>
              <span class="info-value">{{
                formatarData(edital.data_fechamento)
              }}</span>
            </div>
          </div>

          <div class="info-item descricao-wrap">
            <span class="info-label">Descrição</span>
            <span class="info-value">{{
              edital.descricao || "Sem descrição disponível."
            }}</span>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="contrato-actions">
          <v-spacer></v-spacer>
          <v-btn text @click="fechar" style="margin-right: 15px;">Fechar</v-btn>
          <v-btn color="#21a5f3" depressed @click="participar">
            Quero participar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de cadastro -->
    <CadastroContratoModal
      v-model="cadastroAberto"
      :edital="edital"
      @sucesso="onCadastroSucesso"
      @erro="onCadastroErro"
    />
  </div>
</template>

<script>
import CadastroContratoModal from "@/components/CadastroContratoModal.vue";

export default {
  name: "ContratoModal",
  components: {
    CadastroContratoModal,
  },
  props: {
    value: { type: Boolean, default: false },
    edital: { type: Object, default: null },
  },
  data() {
    return {
      cadastroAberto: false,
    };
  },
  methods: {
    fechar() {
      this.$emit("input", false);
    },
    participar() {
      this.fechar();
      this.cadastroAberto = true;
    },
    onCadastroSucesso() {
      this.$emit("sucesso");
    },
    onCadastroErro(mensagem) {
      this.$emit("erro", mensagem);
    },
    formatarData(data) {
      if (!data) return "—";
      return new Date(data).toLocaleDateString("pt-BR");
    },
  },
};
</script>

<style scoped>
.contrato-card {
  border-radius: 12px !important;
  padding: 10px;
}

.contrato-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 20px 16px !important;
}

.contrato-header-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contrato-titulo {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-h, #1e293b);
  line-height: 1.4;
}

.badge-ganho {
  align-self: flex-start;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  background: #dcfce7;
  color: #166534;
}

.contrato-body {
  padding: 20px !important;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.descricao-wrap {
  padding-top: 4px;
  border-top: 1px solid var(--border, #e2e8f0);
}

.info-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-m, #64748b);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.info-value {
  font-size: 14px;
  color: var(--text-b, #1e293b);
  line-height: 1.5;
}

.contrato-actions {
  padding: 14px 20px !important;
}

@media (max-width: 500px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
