import { supabase } from "./supabase";

// NOTA IMPORTANTE DE ESCOPO:
// mod1_editais pertence ao Módulo 1 (fase de licitação), não ao Módulo 8.
// A "regra de ouro" do mod8 é não participar mais do processo administrativo
// oficial — mas a tela "Editais" (home) lista os editais do fornecedor,
// em qualquer status (homologado, aberto, suspenso, deserto, etc), e a UI
// é quem decide o que fazer com cada status (ex: só permitir "Gerar
// contrato" quando for homologado).
//
// TODO/assunção que ainda precisa ser confirmada com quem manteve o mod1:
// não existe (ou não veio no zip) uma tabela/coluna que amarre "este
// edital pertence a ESTE fornecedor logado". Por enquanto isso lista TODOS
// os editais de mod1_editais para qualquer usuário autenticado. Se existir
// uma tabela de vencedores/participantes por fornecedor, troque a query
// abaixo para filtrar por ela.
export async function listEditais() {
  const { data, error } = await supabase
    .from("mod1_editais")
    .select("*")
    .order("data_abertura", { ascending: false });

  if (error) throw error;
  return data;
}
