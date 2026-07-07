<template>
  <v-dialog
    :value="value"
    max-width="900"
    scrollable
    persistent
    @input="$emit('input', $event)"
  >
    <v-card>
      <v-card-title class="cadastro-header">
        <div>
          <span class="cadastro-titulo">Cadastrar Contrato</span>
          <span v-if="edital" class="cadastro-subtitulo">{{
            edital.nome
          }}</span>
        </div>
        <v-btn icon small @click="cancelar" :disabled="salvando">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="cadastro-body">
        <v-form ref="form" v-model="formValido">
          <!-- Dados do Contrato -->
          <div class="secao-titulo">Dados do Contrato</div>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.numeroContrato"
                label="Número do contrato"
                solo
                dense
                hide-details="auto"
                :rules="[regras.obrigatorio]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.valorTotal"
                label="Valor total do contrato"
                prefix="R$"
                type="number"
                step="0.01"
                solo
                dense
                hide-details="auto"
                :rules="[regras.obrigatorio, regras.numeroPositivo]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <div class="campo-label">Data de assinatura</div>
              <v-text-field
                v-model="form.dataAssinatura"
                type="date"
                solo
                dense
                hide-details="auto"
                :rules="[regras.obrigatorio]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <div class="campo-label">Data de início da vigência</div>
              <v-text-field
                v-model="form.dataInicioVigencia"
                type="date"
                solo
                dense
                hide-details="auto"
                :rules="[regras.obrigatorio]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <div class="campo-label">Data de fim da vigência</div>
              <v-text-field
                v-model="form.dataFimVigencia"
                label="Data de fim da vigência"
                type="date"
                solo
                dense
                hide-details="auto"
                :rules="[regras.obrigatorio]"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Gestor do Contrato -->
          <div class="secao-titulo">Gestor do Contrato (órgão público)</div>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.gestorNome"
                label="Nome do gestor"
                solo
                dense
                hide-details="auto"
                :rules="[regras.obrigatorio]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.gestorEmail"
                label="E-mail do gestor"
                type="email"
                solo
                dense
                hide-details="auto"
                :rules="[regras.obrigatorio, regras.email]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.gestorTelefone"
                label="Telefone do gestor"
                solo
                dense
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Financeiro -->
          <div class="secao-titulo">Financeiro</div>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.formaPagamento"
                label="Forma de pagamento"
                :items="opcoesFormaPagamento"
                solo
                dense
                hide-details="auto"
                :rules="[regras.obrigatorio]"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.prazoPagamentoDias"
                label="Prazo para pagamento após NF (em dias)"
                type="number"
                solo
                dense
                hide-details="auto"
                :rules="[regras.obrigatorio, regras.numeroPositivo]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.indiceReajuste"
                label="Índice de reajuste"
                :items="['IPCA', 'INPC', 'IGP-M', 'Nenhum']"
                solo
                dense
                hide-details="auto"
                :rules="[regras.obrigatorio]"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <div class="campo-label">Data prevista de reajuste</div>
              <v-text-field
                v-model="form.dataPrevistaReajuste"
                type="date"
                solo
                dense
                hide-details="auto"
                :disabled="form.indiceReajuste === 'Nenhum'"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Alertas -->
          <div class="secao-titulo">Alertas</div>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.alertaDiasAntecedencia"
                label="Dias de antecedência para alerta de vencimento"
                :items="[30, 60, 90]"
                solo
                dense
                hide-details="auto"
                :rules="[regras.obrigatorio]"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.canalNotificacao"
                label="Canal de notificação"
                :items="opcoesCanalNotificacao"
                multiple
                chips
                solo
                dense
                hide-details="auto"
                :rules="[regras.pelomenosUm]"
              ></v-select>
            </v-col>
          </v-row>

          <!-- Documentos -->
          <div class="secao-titulo">Documentos</div>
          <v-row>
            <v-col cols="12">
              <v-file-input
                v-model="arquivoContrato"
                label="Upload do contrato assinado (PDF)"
                accept=".pdf"
                prepend-icon=""
                append-icon="mdi-paperclip"
                solo
                dense
                hide-details="auto"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="cadastro-actions">
        <v-spacer></v-spacer>
        <v-btn
          text
          :disabled="salvando"
          @click="cancelar"
          style="margin-right: 15px"
          >Cancelar</v-btn
        >
        <v-btn color="#21a5f3" depressed :loading="salvando" @click="cadastrar">
          Cadastrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { supabase } from "@/services/supabase";

function formVazio() {
  return {
    numeroContrato: "",
    valorTotal: "",
    dataAssinatura: "",
    dataInicioVigencia: "",
    dataFimVigencia: "",
    gestorNome: "",
    gestorEmail: "",
    gestorTelefone: "",
    formaPagamento: "",
    prazoPagamentoDias: "",
    indiceReajuste: "",
    dataPrevistaReajuste: "",
    alertaDiasAntecedencia: "",
    canalNotificacao: [],
  };
}

export default {
  name: "CadastroContratoModal",
  props: {
    value: { type: Boolean, default: false },
    edital: { type: Object, default: null },
  },
  data() {
    return {
      formValido: false,
      salvando: false,
      arquivoContrato: null,
      form: formVazio(),
      opcoesFormaPagamento: [
        { text: "Mensal", value: "mensal" },
        { text: "Por medição", value: "por_medicao" },
        { text: "Por entrega", value: "por_entrega" },
      ],
      opcoesCanalNotificacao: [
        { text: "E-mail", value: "email" },
        { text: "WhatsApp", value: "whatsapp" },
      ],
      regras: {
        obrigatorio: (v) =>
          (v !== null && v !== undefined && v !== "") || "Campo obrigatório.",
        numeroPositivo: (v) =>
          (v !== "" && Number(v) > 0) || "Informe um valor maior que zero.",
        email: (v) => /^\S+@\S+\.\S+$/.test(v) || "E-mail inválido.",
        pelomenosUm: (v) =>
          (Array.isArray(v) && v.length > 0) || "Selecione ao menos um canal.",
        arquivoObrigatorio: () =>
          !!this.arquivoContrato || "Envie o contrato assinado em PDF.",
      },
    };
  },
  watch: {
    value(novo) {
      if (novo) {
        this.resetFormulario();
      }
    },
  },
  methods: {
    resetFormulario() {
      this.form = formVazio();
      this.arquivoContrato = null;
      this.salvando = false;
      this.$nextTick(() => {
        if (this.$refs.form) this.$refs.form.resetValidation();
      });
    },

    cancelar() {
      if (this.salvando) return;
      this.$emit("input", false);
    },

    async cadastrar() {
      const formOk = this.$refs.form.validate();
      const arquivoOk = !!this.arquivoContrato;

      if (!formOk || !arquivoOk) {
        this.$forceUpdate();
        return;
      }

      this.salvando = true;

      try {
        const path = `contratos/${Date.now()}-${this.arquivoContrato.name}`;

        const { error: uploadError } = await supabase.storage
          .from("contract-documents")
          .upload(path, this.arquivoContrato);

        if (uploadError) {
          throw new Error("Falha ao enviar o arquivo do contrato.");
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        const { error: insertError } = await supabase
          .from("mod8_contratos")
          .insert({
            edital_referencia: this.edital?.nome ?? null,
            numero_contrato: this.form.numeroContrato,
            data_assinatura: this.form.dataAssinatura,
            data_inicio_vigencia: this.form.dataInicioVigencia,
            data_fim_vigencia: this.form.dataFimVigencia,
            valor_total: Number(this.form.valorTotal),
            gestor_nome: this.form.gestorNome,
            gestor_email: this.form.gestorEmail,
            gestor_telefone: this.form.gestorTelefone || null,
            forma_pagamento: this.form.formaPagamento,
            prazo_pagamento_dias: Number(this.form.prazoPagamentoDias),
            indice_reajuste: this.form.indiceReajuste,
            data_prevista_reajuste: this.form.dataPrevistaReajuste || null,
            alerta_dias_antecedencia: Number(this.form.alertaDiasAntecedencia),
            canal_notificacao: this.form.canalNotificacao,
            contrato_arquivo_path: path,
            contrato_arquivo_nome: this.arquivoContrato.name,
            created_by: user?.id ?? null,
          });

        if (insertError) {
          throw new Error("Falha ao salvar o contrato no banco de dados.");
        }

        this.$emit("sucesso");
        this.$emit("input", false);
      } catch (err) {
        this.$emit(
          "erro",
          err.message || "Erro inesperado ao cadastrar o contrato.",
        );
      } finally {
        this.salvando = false;
      }
    },
  },
};
</script>

<style scoped>
.cadastro-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 20px 16px !important;
}

.cadastro-titulo {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-h, #1e293b);
}

.cadastro-subtitulo {
  display: block;
  font-size: 12.5px;
  color: var(--text-m, #64748b);
  margin-top: 2px;
}

.cadastro-body {
  padding: 20px !important;
  max-height: 65vh;
}

.campo-label {
  font-size: 12px;
  font-weight: 600;
  color: #616161;
  margin-bottom: 4px;
}

.secao-titulo {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--text-m, #64748b);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 20px 0 10px;
}

.secao-titulo:first-child {
  margin-top: 0;
}

.cadastro-actions {
  padding: 14px 20px !important;
}
</style>
