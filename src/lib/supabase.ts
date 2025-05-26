import { createClient } from '@supabase/supabase-js'
import { Item, Donate, Donor, DisplayDonate, TotalItem  } from '../types/index'

// Substitua pelos seus dados do Supabase:
const SUPABASE_URL = 'https://prutohdpwoflqjtsqzfm.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBydXRvaGRwd29mbHFqdHNxemZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMjIyNjEsImV4cCI6MjA2MzY5ODI2MX0.iFBRhesEm4Tb50nLhikIUbmvPXztr1cJgZR7Tmde5Hk'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// GETTERS
export async function listarItems(): Promise<Item[] | null> {
  const { data, error } = await supabase
    .from('Item')
    .select('*')

  if (error) {
    console.error('Erro ao listar clientes:', error)
    return null
  }

  return data as Item[]
}

export async function calcularTotalPorItem(): Promise<TotalItem[] | null> {
  const items = await listarItems()
  if (!items) {
    console.error('Erro ao listar itens')
    return null
  }

  const resultados: TotalItem[] = []

  for (const item of items) {
    // 1. Buscar todos os doacao_id na tabela intermediária DoacaoItem pelo item_id
    const { data: doacaoItens, error: errDoacaoItens } = await supabase
      .from('DoacaoItem')
      .select('doacao_id')
      .eq('item_id', item.item_id)

      if (errDoacaoItens) {
      console.error(`Erro ao buscar doacao_ids para item ${item.id}:`, errDoacaoItens)
      continue
    }

    if (!doacaoItens || doacaoItens.length === 0) {
      // Nenhuma doação para este item, soma 0
      resultados.push({ item, arrecadado: 0 })
      continue
    }

    // Extrair array de IDs das doações
    const doacaoIds = doacaoItens.map(d => d.doacao_id)

    // 2. Buscar as doações pelo array de IDs
    const { data: doacoes, error: errDoacoes } = await supabase
      .from('Doacao')
      .select('valor')
      .in('doacao_id', doacaoIds)

    if (errDoacoes) {
      console.error(`Erro ao buscar doações para item ${item.id}:`, errDoacoes)
      continue
    }

    // Soma os valores das doações (amount)
    const totalArrecadado = doacoes?.reduce((acc, doacao) => acc + (doacao.valor ?? 0), 0) ?? 0

    // Cria o objeto TotalItem
    resultados.push({
      item,
      arrecadado: totalArrecadado
    })
  }

  return resultados
}

export async function listarDonates(): Promise<DisplayDonate[] | null> {
  const { data: doacoes, error: erroDoacoes } = await supabase
    .from('Doacao')
    .select('*')

  if (erroDoacoes || !doacoes) {
    console.error('Erro ao listar doações:', erroDoacoes)
    return null
  }

  const resultado: DisplayDonate[] = []
  for (const doacao of doacoes) {
    // Busca o doador usando o donorId (assumindo que existe na tabela Doacao)
    
    
    const idDoMeuDoador = doacao.doador_id;
    const { data: doador, error: erroDoador } = await supabase
      .from('Doador')
      .select('*')
      .eq('doador_id', idDoMeuDoador)
      .single()

      if (erroDoador || !doador) {
      console.error(`Erro ao buscar doador da doação ${doacao.id}:`, erroDoador)
      continue // pula essa doação se não encontrar doador
    }
    const itemId = await listarDoadorDoItem(idDoMeuDoador)
    // Monta objeto no formato DisplayDonate
    const display: DisplayDonate = {
      id: itemId,
      name: doador.nome,
      email: doador.email,
      phoneNumber: doador.telefone,
      photoUrl: doacao.foto,
      message: doacao.mensagem,
      amount: doacao.valor,
      donorId: idDoMeuDoador,
      timestamp: doacao.created_at
    }

    resultado.push(display)
  }

  return resultado
}

//SETTERS
export async function fazerDonate(doacao: Donate, itemId: number): Promise<void> {

   
  console.log(doacao)
  const doadorCorrigido = {
    created_at: new Date().toISOString(),
    nome: doacao.name,
    email: doacao.email,
    telefone: doacao.phoneNumber,
  }


  const { data: doador, error: erroDoadorCadastro } = await supabase.from('Doador').insert([doadorCorrigido]).select('doador_id')

  if (erroDoadorCadastro || !doador) {
    console.error('Erro ao inserir doador:', erroDoadorCadastro)
    return
  }


  const doacaoCorrigida = {
    created_at: new Date().toISOString(),
    valor: doacao.amount,
    foto: doacao.photoUrl,
    mensagem: doacao.message,
    doador_id: doador[0].doador_id,
  }
  // 1. Insere na tabela Doacao e pega o id retornado
  const { data: doacaoInserida, error: erroDoacao } = await supabase
  .from('Doacao').insert([doacaoCorrigida]).select('doacao_id') // importante: retorna o ID gerado

  if (erroDoacao || !doacaoInserida || doacaoInserida.length === 0) {
    console.error('Erro ao inserir doação:', erroDoacao)
    return
  }

  const doacaoId = doacaoInserida[0].doacao_id

  // 2. Insere na tabela intermediária DoacaoItem
  const { error: erroIntermediaria } = await supabase
    .from('DoacaoItem')
    .insert([
      {
        doacao_id: doacaoId,
        item_id: itemId
      }
    ])

  if (erroIntermediaria) {
    console.error('Erro ao vincular item à doação:', erroIntermediaria)
    return
  }
}

export async function excluirDoacao(id: number): Promise<void> {
  const { error } = await supabase
    .from('Doacao')
    .delete()
    .eq('doacao_id', id)

  if (error) {
    console.error(`Erro ao excluir doação com id ${id}:`, error)
  } else {
    console.log(`Doação com id ${id} excluída com sucesso.`)
  }
}

export async function excluirItem(id: number): Promise<void> {
  // 1. Verifica se existe uma doação vinculada a esse item
  const { data: doacaoItem, error: errorDoacaoItem } = await supabase
    .from('DoacaoItem')
    .select('doacao_id')
    .eq('item_id', id);

  if (errorDoacaoItem) {
    console.error(`Erro ao buscar doacao_id para item ${id}:`, errorDoacaoItem);
    return;
  }

  // 2. Se encontrar, exclui a doação relacionada
  if (doacaoItem && doacaoItem.length > 0) {
    const doacaoId = doacaoItem[0].doacao_id;

    const { error: errorExclusaoDoacaoItem } = await supabase
      .from('DoacaoItem')
      .delete()
      .eq('item_id', id);

    if (errorExclusaoDoacaoItem) {
      console.error(`Erro ao excluir de DoacaoItem com item_id ${id}:`, errorExclusaoDoacaoItem);
      return;
    }

    const { error: errorExclusaoDoacao } = await supabase
      .from('Doacao')
      .delete()
      .eq('doacao_id', doacaoId);

    if (errorExclusaoDoacao) {
      console.error(`Erro ao excluir doação com id ${doacaoId}:`, errorExclusaoDoacao);
      return;
    }
  }

  // 3. Exclui o item da tabela Item
  const { error: errorExclusaoItem } = await supabase
    .from('Item')
    .delete()
    .eq('item_id', id);

  if (errorExclusaoItem) {
    console.error(`Erro ao excluir item com id ${id}:`, errorExclusaoItem);
  } else {
    console.log(`Item com id ${id} excluído com sucesso.`);
  }
}
export async function atualizarValorDoacao(id: number, novoValor: number): Promise<void> {
  const { error } = await supabase
    .from('Doacao')
    .update({ valor: novoValor })
    .eq('doacao_id', id)

  if (error) {
    console.error(`Erro ao atualizar valor da doação com id ${id}:`, error)
  } else {
    console.log(`Valor da doação com id ${id} atualizado para R$${novoValor}.`)
  }
}

export async function calcularValorArrecadado(id: string): Promise<number | null> {
  // 1. Buscar todos os doacao_id na tabela intermediária DoacaoItem pelo item_id
  const resposta = await supabase
    .from('DoacaoItem')
    .select('doacao_id')
    .eq('item_id', id)

  let arrecadado
  const itemDonate = await supabase.from('Item').select('*').eq('item_id', id)
  const item = itemDonate.data ?? []
  const doacaoItens = resposta.data ?? []
  const errDoacaoItens = resposta.error
    
  if (errDoacaoItens) {
    console.error(`Erro ao buscar doacao_ids para item ${id}:`, errDoacaoItens)
  }

  if (errDoacaoItens) {
    console.error(`Erro ao buscar doacao_ids para item ${id}:`, errDoacaoItens);
  }
    
  if (doacaoItens.length === 0) {
    arrecadado = 0;
  } else {
    const doacaoIds = doacaoItens.map(d => d.doacao_id);
    // 2. Buscar as doações pelo array de IDs
    const { data: doacoes, error: errDoacoes } = await supabase
      .from('Doacao')
      .select('valor')
      .in('doacao_id', doacaoIds)

    if (errDoacoes) {
      console.error(`Erro ao buscar doações para item: ${item[0].name}`, errDoacoes)
    }

    // Soma os valores das doações (amount)
    arrecadado = doacoes?.reduce((acc, doacao) => acc + (doacao.valor ?? 0), 0) ?? 0
  }
  // Retorna o valor arrecadado
  return arrecadado
}

export async function listarDoadorDoItem(id: number): Promise<number | null> {
  
  const { data: doacaoId, error: errDoacaoItens } = await supabase
  .from('Doacao')
  .select('doacao_id')
  .eq('doador_id', id)
  .maybeSingle(); // ou .limit(1) se preferir


  if (errDoacaoItens) {
    console.error(`Erro ao buscar doador do item ${id}:`, errDoacaoItens)
    return null
  }

  const { data, error } = await supabase
    .from('DoacaoItem')
    .select('item_id')
    .eq('doacao_id', doacaoId.doacao_id)

  if (error) {
    console.error(`Erro ao buscar doador do item ${id}:`, error)
    return null
  }

  if (data) {
    return data[0].item_id 
  }
  return 0

}