<template>
  <div>
    <div class="page-header">
      <div>
        <div class="page-title">Comparação de Documentos</div>
        <div class="page-subtitle">Coteje edital, proposta e contrato assinado para identificar variações</div>
      </div>
      <div class="flex-row">
        <button class="btn-secondary">📥 Importar documento</button>
        <button class="btn-primary" @click="$emit('change-tab', 'divergencias')">🔍 Ver Divergências</button>
      </div>
    </div>

    <!-- Selector -->
    <div class="panel" style="margin-bottom: 16px">
      <div class="panel-header">
        <div class="panel-title">Seleção de documentos para comparação</div>
      </div>
      <div class="panel-body">
        <div class="selector-row">
          <div style="flex: 1; min-width: 180px">
            <div class="form-label">Documento Base (Edital)</div>
            <select class="form-input">
              <option>EDITAL-PMSP-0047-2024.pdf</option>
              <option>EDITAL-PMSP-0047-2024-REV1.pdf</option>
            </select>
          </div>
          <div class="swap-icon">⇄</div>
          <div style="flex: 1; min-width: 180px">
            <div class="form-label">Documento Comparado (Contrato)</div>
            <select class="form-input">
              <option>CONTRATO-CTR-2024-0047.pdf</option>
              <option>PROPOSTA-TEC-2024.pdf</option>
            </select>
          </div>
          <div style="margin-top: 18px">
            <button class="btn-primary">⚖️ Comparar Agora</button>
          </div>
        </div>
        <div class="summary-row">
          <span>🟡 <strong>3 divergências</strong> encontradas nesta comparação</span>
          <span>🔴 2 de alta severidade</span>
          <span>🟡 1 de média severidade</span>
        </div>
      </div>
    </div>

    <!-- Side by side diff -->
    <div class="comparison-grid">
      <!-- Edital -->
      <div class="comparison-doc">
        <div class="comparison-doc-header">
          <span class="doc-type-badge">EDITAL</span>
          EDITAL-PMSP-0047-2024.pdf
          <span class="doc-section">Cláusula 12 – Preços</span>
        </div>
        <div
          v-for="line in editalLines"
          :key="line.num"
          class="doc-line"
          :class="line.cls"
        >
          <span class="line-num">{{ line.num }}</span>
          <div v-if="line.marker" class="diff-marker" :class="line.markerCls">{{ line.markerIcon }}</div>
          <span class="line-text" v-html="line.text"></span>
        </div>
      </div>

      <!-- Contrato -->
      <div class="comparison-doc">
        <div class="comparison-doc-header">
          <span class="doc-type-badge" style="background: var(--emerald)">CONTRATO</span>
          CONTRATO-CTR-2024-0047.pdf
          <span class="doc-section">Cláusula 12 – Preços</span>
        </div>
        <div
          v-for="line in contratoLines"
          :key="line.num"
          class="doc-line"
          :class="line.cls"
        >
          <span class="line-num">{{ line.num }}</span>
          <div v-if="line.marker" class="diff-marker" :class="line.markerCls">{{ line.markerIcon }}</div>
          <span class="line-text" v-html="line.text"></span>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="legend-row">
      <span class="legend-item">
        <span class="legend-swatch divergent"></span> Divergência de valor/data
      </span>
      <span class="legend-item">
        <span class="legend-swatch removed"></span> Cláusula removida
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabCompare',
  data() {
    return {
      editalLines: [
        { num: 45, cls: '',              marker: false, text: 'O valor unitário de cada equipamento não poderá' },
        { num: 46, cls: '',              marker: false, text: 'exceder o praticado no mercado, conforme pesquisa' },
        { num: 47, cls: 'divergent',     marker: true,  markerCls: 'warn',    markerIcon: '!', text: 'de preços realizada em <strong>outubro de 2024</strong>, limitada' },
        { num: 48, cls: 'divergent',     marker: true,  markerCls: 'warn',    markerIcon: '!', text: 'a R$ <strong>12.500,00</strong> (doze mil e quinhentos reais) por unidade.' },
        { num: 49, cls: '',              marker: false, text: 'O reajuste anual seguirá o índice IPCA acumulado' },
        { num: 50, cls: '',              marker: false, text: 'do período de vigência contratual.' },
        { num: 51, cls: 'divergent-left',marker: true,  markerCls: 'removed', markerIcon: '✕', text: 'Multa por atraso: <strong>2%</strong> ao mês sobre o valor da parcela.' },
      ],
      contratoLines: [
        { num: 45, cls: '',          marker: false, text: 'O valor unitário de cada equipamento não poderá' },
        { num: 46, cls: '',          marker: false, text: 'exceder o praticado no mercado, conforme pesquisa' },
        { num: 47, cls: 'divergent', marker: true,  markerCls: 'warn', markerIcon: '!', text: 'de preços realizada em <strong>setembro de 2024</strong>, limitada' },
        { num: 48, cls: 'divergent', marker: true,  markerCls: 'warn', markerIcon: '!', text: 'a R$ <strong>13.200,00</strong> (treze mil e duzentos reais) por unidade.' },
        { num: 49, cls: '',          marker: false, text: 'O reajuste anual seguirá o índice IPCA acumulado' },
        { num: 50, cls: '',          marker: false, text: 'do período de vigência contratual.' },
        { num: '—', cls: 'suppressed', marker: false, text: '<em style="color:var(--text-m)">[ linha suprimida no contrato ]</em>' },
      ],
    }
  },
}
</script>

<style scoped>
.selector-row {
  display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
}
.swap-icon { font-size: 20px; color: var(--text-m); margin-top: 18px; }
.summary-row {
  margin-top: 12px; display: flex; gap: 16px;
  font-size: 12px; color: var(--text-m);
}

.comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.comparison-doc { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
.comparison-doc-header {
  padding: 10px 14px; background: var(--ice);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 8px;
  font-size: 12.5px; font-weight: 600; color: var(--text-h);
}
.doc-type-badge {
  font-size: 10px; font-weight: 700;
  background: var(--navy); color: #fff;
  padding: 2px 7px; border-radius: 4px; letter-spacing: 0.05em;
}
.doc-section { margin-left: auto; font-size: 11px; color: var(--text-m); }

.doc-line {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 8px 14px; border-bottom: 1px solid var(--ice);
  font-size: 12.5px; line-height: 1.5;
}
.doc-line:last-child { border-bottom: none; }
.doc-line.divergent      { background: #FFF7ED; }
.doc-line.divergent-left { background: #FFF1F2; }
.doc-line.suppressed     { background: var(--ice); }

.line-num {
  font-family: 'JetBrains Mono', monospace; font-size: 10.5px;
  color: var(--text-m); min-width: 24px; margin-top: 1px; user-select: none;
}
.line-text { color: var(--text-b); }
.divergent      .line-text { color: #92400E; }
.divergent-left .line-text { color: #9F1239; }

.diff-marker {
  width: 16px; height: 16px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; flex-shrink: 0; margin-top: 1px;
}
.diff-marker.warn    { background: #FED7AA; color: var(--amber); }
.diff-marker.removed { background: #FECDD3; color: var(--red); }

.legend-row {
  margin-top: 14px; display: flex; gap: 16px;
  font-size: 12.5px; align-items: center; color: var(--text-m);
}
.legend-item { display: flex; align-items: center; gap: 5px; }
.legend-swatch { width: 14px; height: 14px; border-radius: 3px; display: inline-block; }
.legend-swatch.divergent { background: #FFF7ED; border: 1px solid #FED7AA; }
.legend-swatch.removed   { background: #FFF1F2; border: 1px solid #FECDD3; }

@media (max-width: 900px) {
  .comparison-grid { grid-template-columns: 1fr; }
}
</style>
