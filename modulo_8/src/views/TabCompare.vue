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

            <v-file-input
              v-else
              v-model="editalFile"
              accept=".pdf,.doc,.docx"
              outlined
              dense
              prepend-icon="mdi-file-upload"
              label="Selecionar edital"
              show-size
              hide-details="auto"
              class="small-file-input"
              @change="onFileSelected($event, 'edital_minuta')"
            />
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
              v-model="contratoFile"
              accept=".pdf,.doc,.docx"
              outlined
              dense
              prepend-icon="mdi-file-upload"
              label="Selecionar contrato"
              show-size
              hide-details="auto"
              class="small-file-input"
              @change="onFileSelected($event, 'contrato')"
            />
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
// import { supabase } from '@/lib/supabaseClient'
import { extractText, ExtractionError } from "@/utils/documentExtractor";

export default {
  name: "TabCompare",
  props: {
    processoId: { type: String, required: true },
  },
  data() {
    return {
      editalDoc: null,
      contratoDoc: null,
      comparando: false,
      erro: null,
      ultimaComparacao: null,
    };
  },
  computed: {
    podeComparar() {
      return !!this.editalDoc && !!this.contratoDoc;
    },
  },
  async mounted() {
    await this.carregarEditalExistente();
  },
  methods: {
    async carregarEditalExistente() {
      const { data, error } = await supabase
        .from("contract_documents")
        .select("*")
        .eq("processo_id", this.processoId)
        .eq("doc_type", "edital_minuta")
        .eq("extraction_status", "success")
        .order("uploaded_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        this.editalDoc = data;
      }
    },

    resetContrato() {
      this.contratoDoc = null;
      this.ultimaComparacao = null;
      this.erro = null;
    },

    async onFileSelected(event, docType) {
      const file = event.target.files[0];
      this.erro = null;
      if (!file) return;

      try {
        const texto = await extractText(file);
        const doc = await this.salvarDocumento(file, docType, texto);

        if (docType === "edital_minuta") {
          this.editalDoc = doc;
        } else {
          this.contratoDoc = doc;
        }
      } catch (err) {
        this.erro =
          err instanceof ExtractionError
            ? err.message
            : "Erro inesperado ao processar o arquivo.";
        event.target.value = "";
      }
    },

    async salvarDocumento(file, docType, extractedText) {
      const path = `${this.processoId}/${docType}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("contract-documents")
        .upload(path, file);

      if (uploadError) {
        throw new Error("Falha ao enviar arquivo para o storage.");
      }

      const { data, error } = await supabase
        .from("contract_documents")
        .insert({
          processo_id: this.processoId,
          doc_type: docType,
          file_name: file.name,
          storage_path: path,
          mime_type: file.type,
          file_size_bytes: file.size,
          extracted_text: extractedText,
          extraction_status: "success",
        })
        .select()
        .single();

      if (error) {
        throw new Error("Falha ao registrar documento no banco.");
      }

      return data;
    },

    async compararDocumentos() {
      this.erro = null;

      if (!this.editalDoc) {
        this.erro = "Envie a minuta do edital antes de comparar.";
        return;
      }
      if (!this.contratoDoc) {
        this.erro = "Envie o contrato antes de comparar.";
        return;
      }

      this.comparando = true;
      this.ultimaComparacao = null;

      try {
        const { data: comparisonRow, error: insertError } = await supabase
          .from("document_comparisons")
          .insert({
            processo_id: this.processoId,
            edital_document_id: this.editalDoc.id,
            contrato_document_id: this.contratoDoc.id,
            status: "pending",
          })
          .select()
          .single();

        if (insertError) {
          throw new Error("Falha ao criar registro de comparação.");
        }

        const { data, error: fnError } = await supabase.functions.invoke(
          "compare-documents",
          { body: { comparison_id: comparisonRow.id } },
        );

        if (fnError) {
          throw new Error("Falha ao processar comparação via IA.");
        }

        this.ultimaComparacao = data;
      } catch (err) {
        this.erro = err.message || "Erro inesperado ao comparar documentos.";
      } finally {
        this.comparando = false;
      }
    },
  },
};
</script>

<style scoped>

.small-file-input {
  max-width: 260px;
}

.small-file-input .v-input__slot {
  min-height: 38px !important;
}

.small-file-input .v-label {
  font-size: 13px;
}

.small-file-input ::v-deep input {
  margin-left: 5px;
}

.small-file-input input {
  font-size: 13px;
}

.small-file-input .v-icon {
  font-size: 18px !important;
}

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
