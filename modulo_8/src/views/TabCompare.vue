<template>
  <div>
    <div class="page-header">
      <div>
        <div class="page-title">Comparação de Documentos</div>
        <div class="page-subtitle">
          Coteje edital, proposta e contrato assinado para identificar variações
        </div>
      </div>
    </div>

    <!-- Seletor / Upload -->
    <div class="panel" style="margin-bottom: 16px">
      <div class="panel-header">
        <div class="panel-title">Seleção de documentos para comparação</div>
      </div>
      <div class="panel-body">
        <div class="selector-row">
          <!-- Edital -->
          <div style="flex: 1; min-width: 220px">
            <div class="form-label">Documento Base (Edital)</div>
            <div v-if="editalDoc" class="doc-loaded">
              📄 {{ editalDoc.file_name }}
              <span class="doc-loaded-tag">carregado do processo</span>
            </div>
            <div v-else>
              <v-file-input
                label="Selecionar edital"
                accept=".pdf,.docx"
                solo
                dense
                hide-details
                prepend-icon=""
                append-icon="mdi-paperclip"
                :loading="carregandoEdital"
                @change="onFileSelected($event, 'edital_minuta')"
              ></v-file-input>
              <div class="field-hint">
                Edital não encontrado no processo — envie manualmente.
              </div>
            </div>
          </div>

          <div class="swap-icon">⇄</div>

          <!-- Contrato -->
          <div style="flex: 1; min-width: 220px">
            <div class="form-label">Documento Comparado (Contrato)</div>
            <div v-if="contratoDoc" class="doc-loaded">
              📄 {{ contratoDoc.file_name }}
              <button class="link-btn" @click="resetContrato">trocar</button>
            </div>
            <v-file-input
              v-else
              label="Selecionar contrato"
              accept=".pdf,.docx"
              solo
              dense
              hide-details
              prepend-icon=""
              append-icon="mdi-paperclip"
              :loading="carregandoContrato"
              @change="onFileSelected($event, 'contrato')"
            ></v-file-input>
          </div>

          <div style="margin-top: 18px">
            <button
              class="btn-primary"
              :disabled="!podeComparar || comparando"
              @click="compararDocumentos"
            >
              {{ comparando ? "⏳ Comparando..." : "⚖️ Comparar Agora" }}
            </button>
          </div>
        </div>

        <div v-if="erro" class="error-banner">⚠️ {{ erro }}</div>

        <div v-if="ultimaComparacao?.summary" class="summary-row">
          <span
            >🟡
            <strong>{{ ultimaComparacao.summary.total }} divergências</strong>
            encontradas nesta comparação</span
          >
          <span v-if="ultimaComparacao.summary.alta"
            >🔴 {{ ultimaComparacao.summary.alta }} de alta severidade</span
          >
          <span v-if="ultimaComparacao.summary.media"
            >🟡 {{ ultimaComparacao.summary.media }} de média severidade</span
          >
        </div>
      </div>
    </div>

    <!-- Estado vazio -->
    <div v-if="!ultimaComparacao && !comparando" class="empty-state">
      Envie os dois documentos e clique em "Comparar Agora" para ver o
      resultado.
    </div>

    <!-- Loading -->
    <div v-if="comparando" class="empty-state">
      Extraindo e comparando os documentos, isso pode levar alguns segundos...
    </div>

    <!-- Divergências -->
    <div v-if="ultimaComparacao?.divergences?.length" class="divergences-list">
      <div
        v-for="(div, idx) in ultimaComparacao.divergences"
        :key="idx"
        class="divergence-card"
        :class="'sev-' + div.severidade"
      >
        <div class="divergence-header">
          <span class="divergence-clausula">{{ div.clausula }}</span>
          <span class="severity-badge" :class="'sev-' + div.severidade">
            {{
              div.severidade === "alta"
                ? "🔴 alta"
                : div.severidade === "media"
                ? "🟡 média"
                : "⚪ baixa"
            }}
          </span>
        </div>
        <div class="divergence-columns">
          <div class="divergence-col">
            <div class="doc-section">EDITAL</div>
            <div class="line-text">{{ div.trecho_edital }}</div>
          </div>
          <div class="divergence-col">
            <div class="doc-section">CONTRATO</div>
            <div class="line-text">{{ div.trecho_contrato }}</div>
          </div>
        </div>
        <div class="divergence-desc">{{ div.descricao }}</div>
      </div>
    </div>

    <div
      v-else-if="ultimaComparacao && !ultimaComparacao.divergences?.length"
      class="empty-state"
    >
      ✅ Nenhuma divergência relevante encontrada entre os documentos.
    </div>
  </div>
</template>

<script>
import { supabase } from "@/services/supabase";
import { extractText, ExtractionError } from "@/utils/documentExtractor";

export default {
  name: "TabCompare",
  data() {
    return {
      editalDoc: null, // documento já salvo no banco (carregado ou após upload)
      contratoDoc: null, // documento já salvo no banco
      editalFile: null, // arquivo em memória aguardando upload
      contratoFile: null, // arquivo em memória aguardando upload
      comparando: false,
      carregandoEdital: false,
      carregandoContrato: false,
      erro: null,
      ultimaComparacao: null,
    };
  },
  computed: {
    podeComparar() {
      // pode comparar se tiver o doc salvo OU o arquivo em memória, nos dois lados
      return (
        (!!this.editalDoc || !!this.editalFile) &&
        (!!this.contratoDoc || !!this.contratoFile)
      );
    },
  },

  methods: {
    resetContrato() {
      this.contratoDoc = null;
      this.contratoFile = null;
      this.ultimaComparacao = null;
      this.erro = null;
    },

    // Agora só guarda o arquivo em memória, sem fazer nada ainda
    onFileSelected(file, docType) {
      this.erro = null;
      if (!file) return;

      if (docType === "edital_minuta") {
        this.editalFile = file;
        this.editalDoc = null; // reseta o doc salvo se o usuário trocar o arquivo
      } else {
        this.contratoFile = file;
        this.contratoDoc = null;
      }
    },

    async salvarDocumento(file, docType, sessionId) {
      const texto = await extractText(file);
      const path = `${sessionId}/${docType}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("contract-documents")
        .upload(path, file);

      if (uploadError)
        throw new Error("Falha ao enviar arquivo para o storage.");

      const { data, error } = await supabase
        .from("mod8_contract_documents")
        .insert({
          doc_type: docType,
          file_name: file.name,
          storage_path: path,
          mime_type: file.type,
          file_size_bytes: file.size,
          extracted_text: texto,
          extraction_status: "success",
        })
        .select()
        .single();

      if (error) throw new Error("Falha ao registrar documento no banco.");
      return data;
    },

    async compararDocumentos() {
      this.erro = null;
      this.comparando = true;
      this.ultimaComparacao = null;

      const sessionId = crypto.randomUUID(); // mesmo ID para os dois docs dessa comparação

      try {
        this.carregandoEdital = true;
        this.editalDoc = await this.salvarDocumento(
          this.editalFile,
          "edital_minuta",
          sessionId,
        );
        this.carregandoEdital = false;

        this.carregandoContrato = true;
        this.contratoDoc = await this.salvarDocumento(
          this.contratoFile,
          "contrato",
          sessionId,
        );
        this.carregandoContrato = false;

        const { data: comparisonRow, error: insertError } = await supabase
          .from("mod8_document_comparisons")
          .insert({
            session_id: sessionId,
            edital_document_id: this.editalDoc.id,
            contrato_document_id: this.contratoDoc.id,
            status: "pending",
          })
          .select()
          .single();

        if (insertError)
          throw new Error("Falha ao criar registro de comparação.");

        const { data, error: fnError } = await supabase.functions.invoke(
          "compare-documents",
          { body: { comparison_id: comparisonRow.id } },
        );

        if (fnError) throw new Error("Falha ao processar comparação via IA.");

        this.ultimaComparacao = data;
      } catch (err) {
        this.carregandoEdital = false;
        this.carregandoContrato = false;
        this.erro =
          err instanceof ExtractionError
            ? err.message
            : err.message || "Erro inesperado ao comparar documentos.";
      } finally {
        this.comparando = false;
      }
    },
  },
};
</script>

<style scoped>
.selector-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}
.swap-icon {
  font-size: 20px;
  color: var(--text-m);
  margin-top: 32px;
}
.summary-row {
  margin-top: 12px;
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--text-m);
}

.doc-loaded {
  font-size: 13px;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--ice);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.doc-loaded-tag {
  font-size: 10.5px;
  color: var(--text-m);
}
.link-btn {
  background: none;
  border: none;
  color: var(--blue-acc);
  font-size: 12px;
  cursor: pointer;
  padding: 0;
}
.field-hint {
  font-size: 11.5px;
  color: var(--text-m);
  margin-top: 4px;
}

.error-banner {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 6px;
  background: #fff1f2;
  color: #9f1239;
  font-size: 13px;
}

.empty-state {
  padding: 32px;
  text-align: center;
  color: var(--text-m);
  font-size: 13.5px;
  border: 1px dashed var(--border);
  border-radius: 8px;
}

.divergences-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.divergence-card {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 14px;
}
.divergence-card.sev-alta {
  border-left: 4px solid var(--red);
}
.divergence-card.sev-media {
  border-left: 4px solid var(--amber);
}
.divergence-card.sev-baixa {
  border-left: 4px solid var(--border);
}

.divergence-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.divergence-clausula {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-h);
}
.severity-badge {
  font-size: 11px;
  font-weight: 600;
}

.divergence-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 8px;
}
.divergence-col {
  background: var(--ice);
  border-radius: 6px;
  padding: 8px 10px;
}
.doc-section {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--text-m);
  margin-bottom: 4px;
}
.line-text {
  font-size: 12.5px;
  color: var(--text-b);
}

.divergence-desc {
  font-size: 12px;
  color: var(--text-m);
  font-style: italic;
}

@media (max-width: 900px) {
  .divergence-columns {
    grid-template-columns: 1fr;
  }
}
</style>
