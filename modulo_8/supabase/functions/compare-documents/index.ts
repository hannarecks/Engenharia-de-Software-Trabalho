// supabase/functions/compare-documents/index.ts
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')!
const GROQ_MODEL = 'llama-3.3-70b-versatile' // free tier: 1000 req/dia, 12K TPM

// Limite de caracteres por documento enviado ao modelo, calibrado pro
// limite de tokens-por-minuto do tier gratuito do Groq (12K TPM nesse modelo).
// Se dois documentos grandes derem 429 (rate limit), reduza esse valor.
const MAX_CHARS_PER_DOC = 15000

const COMPARISON_PROMPT = `Você é um especialista em análise contratual de licitações públicas.
Compare o texto da MINUTA DO EDITAL com o texto do CONTRATO ASSINADO abaixo.

Identifique divergências relevantes, especialmente:
- Valores (preços unitários, totais, multas)
- Datas (vigência, prazos de entrega, reajuste)
- Cláusulas removidas ou alteradas de forma material
- Itens de tabelas de preços que não batem

Ignore diferenças puramente de formatação ou redação que não mudam o sentido.

Responda APENAS com um JSON válido, sem texto adicional, no formato:
{
  "divergences": [
    {
      "clausula": "string",
      "severidade": "alta" | "media" | "baixa",
      "tipo": "string curto (ex: valor_divergente, data_divergente, clausula_removida)",
      "trecho_edital": "string",
      "trecho_contrato": "string",
      "descricao": "string explicando o risco/impacto"
    }
  ]
}`

serve(async (req) => {
  let comparisonId: string | undefined
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  try {
    const body = await req.json()
    comparisonId = body.comparison_id

    if (!comparisonId) {
      return jsonResponse({ error: 'comparison_id é obrigatório.' }, 400)
    }

    await supabase
      .from('mod8_document_comparisons')
      .update({ status: 'processing' })
      .eq('id', comparisonId)

    const { data: comparison, error: fetchError } = await supabase
      .from('mod8_document_comparisons')
      .select(
        `id, edital_document_id, contrato_document_id,
         edital:mod8_contract_documents!edital_document_id(extracted_text, extraction_status),
         contrato:mod8_contract_documents!contrato_document_id(extracted_text, extraction_status)`
      )
      .eq('id', comparisonId)
      .single()

    if (fetchError || !comparison) {
      throw new Error('Comparação não encontrada.')
    }

    const edital = comparison.edital as unknown as {
      extracted_text: string | null
      extraction_status: string
    }
    const contrato = comparison.contrato as unknown as {
      extracted_text: string | null
      extraction_status: string
    }

    if (
      edital.extraction_status !== 'success' ||
      contrato.extraction_status !== 'success' ||
      !edital.extracted_text ||
      !contrato.extracted_text
    ) {
      throw new Error(
        'Um dos documentos não teve o texto extraído com sucesso. Reenvie os arquivos.'
      )
    }

    const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'user',
            content: `${COMPARISON_PROMPT}

--- MINUTA DO EDITAL ---
${edital.extracted_text.slice(0, MAX_CHARS_PER_DOC)}

--- CONTRATO ASSINADO ---
${contrato.extracted_text.slice(0, MAX_CHARS_PER_DOC)}`,
          },
        ],
      }),
    })

    if (!aiResponse.ok) {
      const errBody = await aiResponse.text()
      throw new Error(`Falha ao chamar IA (${aiResponse.status}): ${errBody.slice(0, 300)}`)
    }

    const aiData = await aiResponse.json()
    const rawText = aiData.choices?.[0]?.message?.content ?? ''
    const cleaned = rawText.replace(/```json|```/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      throw new Error('Resposta da IA não pôde ser interpretada como JSON.')
    }

    const divergences = parsed.divergences ?? []
    const summary = {
      total: divergences.length,
      alta: divergences.filter((d: any) => d.severidade === 'alta').length,
      media: divergences.filter((d: any) => d.severidade === 'media').length,
      baixa: divergences.filter((d: any) => d.severidade === 'baixa').length,
    }

    await supabase
      .from('mod8_document_comparisons')
      .update({
        status: 'completed',
        divergences,
        summary,
        completed_at: new Date().toISOString(),
      })
      .eq('id', comparisonId)

    return jsonResponse({ divergences, summary })
  } catch (err) {
    if (comparisonId) {
      await supabase
        .from('mod8_document_comparisons')
        .update({
          status: 'error',
          error_message: err instanceof Error ? err.message : 'Erro desconhecido',
        })
        .eq('id', comparisonId)
    }
    return jsonResponse(
      { error: err instanceof Error ? err.message : 'Erro desconhecido' },
      500
    )
  }
})

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}