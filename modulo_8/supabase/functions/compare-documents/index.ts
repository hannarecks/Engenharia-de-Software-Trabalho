import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
 
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
 
// --- Amazon Nova 2 Lite (via Bedrock API key — bearer token, sem SigV4) ---
const BEDROCK_API_KEY = Deno.env.get('AWS_BEDROCK_API_KEY')!
const BEDROCK_REGION = Deno.env.get('AWS_BEDROCK_REGION') ?? 'us-east-1'
const NOVA_MODEL_ID = 'amazon.nova-2-lite-v1:0'
const BEDROCK_ENDPOINT = `https://bedrock-runtime.${BEDROCK_REGION}.amazonaws.com/model/${NOVA_MODEL_ID}/converse`
 
// Nova 2 Lite tem janela de até 1M tokens, bem maior que o limite do Groq
// free tier — dá pra folgar esse limite, mas ainda vale manter um teto por
// custo/latência. Ajuste conforme o tamanho real dos contratos de vocês.
const MAX_CHARS_PER_DOC = 60000
 
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
 
    // Converse API do Bedrock: autenticação via Bearer token (API key de
    // longa duração gerada no console do Bedrock), sem precisar de SigV4
    // nem do AWS SDK — igual a qualquer chamada REST comum.
    const aiResponse = await fetch(BEDROCK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BEDROCK_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: [
              {
                text: `${COMPARISON_PROMPT}
 
--- MINUTA DO EDITAL ---
${edital.extracted_text.slice(0, MAX_CHARS_PER_DOC)}
 
--- CONTRATO ASSINADO ---
${contrato.extracted_text.slice(0, MAX_CHARS_PER_DOC)}`,
              },
            ],
          },
        ],
        inferenceConfig: {
          maxTokens: 4096,
          temperature: 0.2,
        },
      }),
    })
 
    if (!aiResponse.ok) {
      const errBody = await aiResponse.text()
      throw new Error(`Falha ao chamar IA (${aiResponse.status}): ${errBody.slice(0, 300)}`)
    }
 
    const aiData = await aiResponse.json()
    // Formato de resposta da Converse API do Bedrock:
    // { output: { message: { role, content: [{ text }] } }, stopReason, usage, ... }
    const rawText = aiData.output?.message?.content?.[0]?.text ?? ''
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
