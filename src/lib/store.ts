import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { PersonaKey } from "@/content/personas";

/**
 * Persistência com dois backends.
 *
 * Supabase é o backend de verdade. O backend de arquivo existe para que o
 * produto rode ponta a ponta numa máquina sem credencial — sem ele, revisar o
 * quiz exigiria provisionar um projeto Supabase antes de ver a primeira tela.
 * Ele nunca é escolhido quando as variáveis de ambiente existem, e grita no log
 * quando entra em ação.
 */

export interface DadosLead {
  nome?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  persona?: PersonaKey | null;
  origem?: "quiz_frio" | "quiz_audio" | "confirmacao";
  confirmationToken?: string | null;
  idioma?: string;
  utm?: { source?: string; medium?: string; campaign?: string };
}

/** O mínimo que o modo confirmação precisa saber sobre quem abriu o link. */
export interface LeadConfirmacao {
  id: string;
  nome: string | null;
  persona: PersonaKey | null;
}

/** O que o acionamento por WhatsApp precisa saber de um lead já existente. */
export interface LeadWhatsapp {
  id: string;
  nome: string | null;
  persona: PersonaKey | null;
  confirmationToken: string | null;
  /**
   * Gravado a cada contato, lido por ninguém ainda — a decisão de janela de
   * 24h de hoje usa o timestamp da mensagem sendo processada agora, que já
   * carrega essa informação para o caso imediato. Este campo é para quando
   * existir um envio fora do fluxo de recebimento (reengajamento por cron,
   * painel de admin) e precisar responder "ainda dá para mandar texto livre?"
   * sem reconstruir isso a partir do histórico de mensagens. Revisão de
   * 14/08/2026 sinalizou como escrita sem leitura; decisão foi manter — é
   * barato e a coluna já existe no schema.
   */
  ultimaMensagemRecebidaEm: string | null;
}

/** `confirmation_token` é unique. Colisão é caso de gerar outro, não de 500. */
export class TokenEmUso extends Error {
  constructor() {
    super("confirmation_token já em uso");
    this.name = "TokenEmUso";
  }
}

export interface DadosRespostas {
  situacao?: string | null;
  situacaoVia?: "texto" | "audio" | "opcao" | null;
  q3?: string | null;
  q3Via?: "texto" | "audio" | null;
  precoAtual?: number | null;
  precoDesejado?: number | null;
  volumeMensal?: number | null;
  pctUsado?: number | null;
  valorParado?: number | null;
  palavras?: string[] | null;
  q7?: string | null;
  q8?: string | null;
  q9?: string | null;
  /** Timestamp do clique em "Pode gravar" — evidência de consentimento LGPD. */
  consentimentoAudioEm?: string | null;
  raw?: Record<string, unknown>;
}

export interface PropostaSalva {
  id: string;
  leadId: string;
  token: string;
  conteudo: Record<string, unknown>;
  geradoEm: string;
  expiraEm: string;
}

export type TipoEvento =
  | "view"
  | "cta_primario_click"
  | "cta_secundario_click"
  | "checkout_iniciado"
  | "checkout_concluido";

/** Espelha o check constraint de `leads.status` na migração 0001. */
export type StatusLead =
  | "novo"
  | "proposta_gerada"
  | "proposta_aberta"
  | "checkout_iniciado"
  | "fechado"
  | "perdido";

export interface Store {
  readonly backend: "supabase" | "arquivo";
  upsertLead(id: string | null, dados: DadosLead): Promise<string>;
  salvarRespostas(leadId: string, dados: DadosRespostas): Promise<void>;
  criarProposta(
    leadId: string,
    token: string,
    conteudo: Record<string, unknown>,
    expiraEm: Date
  ): Promise<PropostaSalva>;
  buscarPropostaPorToken(token: string): Promise<PropostaSalva | null>;
  buscarPropostaPorLeadId(leadId: string): Promise<PropostaSalva | null>;
  buscarRespostas(leadId: string): Promise<DadosRespostas | null>;
  buscarLeadPorConfirmationToken(token: string): Promise<LeadConfirmacao | null>;
  /**
   * Busca por número. Recebe LISTA porque a Meta às vezes omite o nono dígito
   * do celular brasileiro — ver `variantesDeWhatsapp`. Não há unique em
   * `leads.whatsapp`: desempata pelo mais recentemente atualizado, mesmo
   * critério de `buscarPropostaPorLeadId`.
   */
  buscarLeadPorWhatsapp(numeros: string[]): Promise<LeadWhatsapp | null>;
  /**
   * Atualização estreita, de propósito: `upsertLead` com id sobrescreve com
   * null tudo que não foi informado, e aqui só queremos carimbar o contato.
   * Lança `TokenEmUso` se o token colidir.
   */
  registrarContatoWhatsapp(
    leadId: string,
    dados: { confirmationToken?: string; recebidaEm: Date }
  ): Promise<void>;
  /** `false` = este wamid já foi processado. É o portão de idempotência. */
  reservarMensagemWhatsapp(wamid: string, leadId: string | null): Promise<boolean>;
  /** Desfaz a reserva quando o processamento falhou, para a reentrega valer. */
  liberarMensagemWhatsapp(wamid: string): Promise<void>;
  /** Devolve o status anterior, ou null se o lead não existe. */
  atualizarStatusLead(leadId: string, status: StatusLead): Promise<StatusLead | null>;
  registrarEvento(
    propostaId: string,
    tipo: TipoEvento,
    meta?: Record<string, unknown>
  ): Promise<void>;
}

/* ==========================================================================
   Supabase
   ========================================================================= */

function clienteSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const chave = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !chave) return null;
  return createClient(url, chave, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function storeSupabase(db: SupabaseClient): Store {
  return {
    backend: "supabase",

    async upsertLead(id, dados) {
      const linha: Record<string, unknown> = {
        nome: dados.nome ?? null,
        whatsapp: dados.whatsapp ?? null,
        email: dados.email ?? null,
        persona: dados.persona ?? null,
        idioma: dados.idioma ?? "pt",
        utm_source: dados.utm?.source ?? null,
        utm_medium: dados.utm?.medium ?? null,
        utm_campaign: dados.utm?.campaign ?? null,
      };

      // `origem` só é escrita quando o chamador declara. O autosave por etapa
      // não declara — e sem esta guarda o primeiro avanço no modo confirmação
      // rebaixaria o lead de 'confirmacao' para 'quiz_frio', apagando de onde
      // ela veio.
      if (dados.origem) linha.origem = dados.origem;
      else if (!id) linha.origem = "quiz_frio";

      if (dados.confirmationToken !== undefined) {
        linha.confirmation_token = dados.confirmationToken;
      }

      if (id) {
        const { error } = await db.from("leads").update(linha).eq("id", id);
        if (error) throw new Error(`leads.update: ${error.message}`);
        return id;
      }

      const { data, error } = await db
        .from("leads")
        .insert(linha)
        .select("id")
        .single();
      if (error) {
        // 23505 num insert só pode ser o unique de confirmation_token — id é
        // gen_random_uuid() e nunca colide. TokenEmUso, não erro genérico, para
        // gravarTokenNovo() saber a diferença entre "tenta de novo" e "algo
        // quebrou de verdade" também no caminho de lead novo, não só no de
        // registrarContatoWhatsapp — achado na revisão de 14/08/2026.
        if (error.code === "23505") throw new TokenEmUso();
        throw new Error(`leads.insert: ${error.message}`);
      }
      return data.id as string;
    },

    async salvarRespostas(leadId, dados) {
      const { error } = await db.from("respostas").upsert(
        {
          lead_id: leadId,
          situacao: dados.situacao ?? null,
          situacao_via: dados.situacaoVia ?? null,
          q3_unica_coisa: dados.q3 ?? null,
          q3_via: dados.q3Via ?? null,
          preco_atual: dados.precoAtual ?? null,
          preco_desejado: dados.precoDesejado ?? null,
          volume_mensal: dados.volumeMensal ?? null,
          pct_usado: dados.pctUsado ?? null,
          valor_parado: dados.valorParado ?? null,
          palavras_identidade: dados.palavras ?? null,
          q7_ja_tentou: dados.q7 ?? null,
          q8_quando: dados.q8 ?? null,
          q9_investimento_faixa: dados.q9 ?? null,
          consentimento_audio_em: dados.consentimentoAudioEm ?? null,
          respostas_raw: dados.raw ?? {},
        },
        { onConflict: "lead_id" }
      );
      if (error) throw new Error(`respostas.upsert: ${error.message}`);
    },

    async buscarRespostas(leadId) {
      const { data, error } = await db
        .from("respostas")
        .select("*")
        .eq("lead_id", leadId)
        .maybeSingle();
      if (error) throw new Error(`respostas.select: ${error.message}`);
      if (!data) return null;
      return {
        situacao: data.situacao,
        q3: data.q3_unica_coisa,
        precoAtual: data.preco_atual,
        precoDesejado: data.preco_desejado,
        volumeMensal: data.volume_mensal,
        pctUsado: data.pct_usado,
        valorParado: data.valor_parado,
        palavras: data.palavras_identidade,
        q7: data.q7_ja_tentou,
        q8: data.q8_quando,
        q9: data.q9_investimento_faixa,
        consentimentoAudioEm: data.consentimento_audio_em,
        raw: data.respostas_raw,
      };
    },

    // LGPD — soft delete respeitado na leitura: lead removido não reabre link.
    async buscarLeadPorConfirmationToken(token) {
      const { data, error } = await db
        .from("leads")
        .select("id, nome, persona")
        .eq("confirmation_token", token)
        .is("removido_em", null)
        .maybeSingle();
      if (error) throw new Error(`leads.select: ${error.message}`);
      if (!data) return null;
      return {
        id: data.id as string,
        nome: (data.nome as string | null) ?? null,
        persona: (data.persona as PersonaKey | null) ?? null,
      };
    },

    async buscarLeadPorWhatsapp(numeros) {
      if (numeros.length === 0) return null;
      const { data, error } = await db
        .from("leads")
        .select("id, nome, persona, confirmation_token, ultima_mensagem_recebida_em")
        .in("whatsapp", numeros)
        .is("removido_em", null)
        .order("atualizado_em", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(`leads.select: ${error.message}`);
      if (!data) return null;
      return {
        id: data.id as string,
        nome: (data.nome as string | null) ?? null,
        persona: (data.persona as PersonaKey | null) ?? null,
        confirmationToken: (data.confirmation_token as string | null) ?? null,
        ultimaMensagemRecebidaEm:
          (data.ultima_mensagem_recebida_em as string | null) ?? null,
      };
    },

    async registrarContatoWhatsapp(leadId, dados) {
      const linha: Record<string, unknown> = {
        ultima_mensagem_recebida_em: dados.recebidaEm.toISOString(),
      };
      if (dados.confirmationToken !== undefined) {
        linha.confirmation_token = dados.confirmationToken;
      }
      // `.update()` contra um id inexistente ou removido (LGPD) não é erro no
      // Postgres — casa zero linhas e responde sucesso. Sem o `.select()` para
      // confirmar que algo foi tocado, gravarTokenNovo() devolveria um token
      // que nunca chegou ao banco, e ela receberia um link que sempre dá 404.
      // Achado na revisão de 14/08/2026.
      const { data, error } = await db
        .from("leads")
        .update(linha)
        .eq("id", leadId)
        .is("removido_em", null)
        .select("id");
      if (error) {
        if (error.code === "23505") throw new TokenEmUso();
        throw new Error(`leads.update: ${error.message}`);
      }
      if (!data || data.length === 0) {
        throw new Error(`leads.update: lead ${leadId} não encontrado (removido ou inexistente)`);
      }
    },

    async reservarMensagemWhatsapp(wamid, leadId) {
      const { error } = await db
        .from("mensagens_whatsapp")
        .insert({ wamid, lead_id: leadId });
      if (!error) return true;
      if (error.code === "23505") return false;
      throw new Error(`mensagens_whatsapp.insert: ${error.message}`);
    },

    async liberarMensagemWhatsapp(wamid) {
      const { error } = await db.from("mensagens_whatsapp").delete().eq("wamid", wamid);
      if (error) console.error(`[tailor] falha ao liberar wamid: ${error.message}`);
    },

    async criarProposta(leadId, token, conteudo, expiraEm) {
      const { data, error } = await db
        .from("propostas")
        .insert({
          lead_id: leadId,
          token,
          conteudo,
          expira_em: expiraEm.toISOString(),
        })
        .select("id, lead_id, token, conteudo, gerado_em, expira_em")
        .single();
      if (error) throw new Error(`propostas.insert: ${error.message}`);

      await db.from("leads").update({ status: "proposta_gerada" }).eq("id", leadId);

      return {
        id: data.id,
        leadId: data.lead_id,
        token: data.token,
        conteudo: data.conteudo,
        geradoEm: data.gerado_em,
        expiraEm: data.expira_em,
      };
    },

    // LGPD — mesmo soft delete que `buscarLeadPorConfirmationToken` já
    // respeitava. O join !inner com `leads` faz o link da proposta morrer
    // junto com o lead: sem isto, pedir exclusão apagaria o cadastro mas o
    // link no WhatsApp dela continuaria abrindo a proposta com o nome e a
    // confissão dentro.
    async buscarPropostaPorToken(token) {
      const { data, error } = await db
        .from("propostas")
        .select("id, lead_id, token, conteudo, gerado_em, expira_em, leads!inner(removido_em)")
        .eq("token", token)
        .is("leads.removido_em", null)
        .maybeSingle();
      if (error) throw new Error(`propostas.select: ${error.message}`);
      if (!data) return null;
      return {
        id: data.id,
        leadId: data.lead_id,
        token: data.token,
        conteudo: data.conteudo,
        geradoEm: data.gerado_em,
        expiraEm: data.expira_em,
      };
    },

    async buscarPropostaPorLeadId(leadId) {
      // Mais recente primeiro: se um lead tiver mais de uma proposta, o
      // pagamento se refere à última que ele viu.
      const { data, error } = await db
        .from("propostas")
        .select("id, lead_id, token, conteudo, gerado_em, expira_em")
        .eq("lead_id", leadId)
        .order("gerado_em", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(`propostas.select: ${error.message}`);
      if (!data) return null;
      return {
        id: data.id,
        leadId: data.lead_id,
        token: data.token,
        conteudo: data.conteudo,
        geradoEm: data.gerado_em,
        expiraEm: data.expira_em,
      };
    },

    async atualizarStatusLead(leadId, status) {
      const { data: antes, error: erroLeitura } = await db
        .from("leads")
        .select("status")
        .eq("id", leadId)
        .is("removido_em", null)
        .maybeSingle();
      if (erroLeitura) throw new Error(`leads.select: ${erroLeitura.message}`);
      if (!antes) return null;

      const anterior = antes.status as StatusLead;
      if (anterior === status) return anterior;

      const { error } = await db
        .from("leads")
        .update({ status })
        .eq("id", leadId)
        .is("removido_em", null);
      if (error) throw new Error(`leads.update: ${error.message}`);
      return anterior;
    },

    async registrarEvento(propostaId, tipo, meta) {
      const { error } = await db
        .from("eventos_abertura")
        .insert({ proposta_id: propostaId, tipo, meta: meta ?? null });
      if (error) throw new Error(`eventos.insert: ${error.message}`);
    },
  };
}

/* ==========================================================================
   Arquivo (desenvolvimento local, sem credencial)
   ========================================================================= */

interface BancoArquivo {
  leads: Record<string, Record<string, unknown>>;
  respostas: Record<string, DadosRespostas>;
  propostas: Record<string, PropostaSalva>;
  eventos: Array<{ propostaId: string; tipo: string; meta?: unknown; em: string }>;
  /** Opcional: arquivos gravados antes do acionamento por WhatsApp não o têm. */
  mensagensWhatsapp?: Record<string, { leadId: string | null; recebidaEm: string }>;
}

const ARQUIVO = path.join(process.cwd(), ".tailor-dev", "banco.json");
const VAZIO: BancoArquivo = {
  leads: {},
  respostas: {},
  propostas: {},
  eventos: [],
  mensagensWhatsapp: {},
};

async function lerArquivo(): Promise<BancoArquivo> {
  try {
    return JSON.parse(await readFile(ARQUIVO, "utf8")) as BancoArquivo;
  } catch {
    return structuredClone(VAZIO);
  }
}

async function gravarArquivo(banco: BancoArquivo): Promise<void> {
  await mkdir(path.dirname(ARQUIVO), { recursive: true });
  await writeFile(ARQUIVO, JSON.stringify(banco, null, 2), "utf8");
}

function storeArquivo(): Store {
  return {
    backend: "arquivo",

    async upsertLead(id, dados) {
      const banco = await lerArquivo();
      const leadId = id ?? randomUUID();
      // Mesmo achado do insert no Supabase: sem checar colisão, um
      // confirmationToken duplicado (matematicamente improvável, mas o teste
      // de corrida existe por causa dela) gravaria por cima em silêncio em vez
      // de dar a chance de gravarTokenNovo() tentar outro.
      if (
        dados.confirmationToken !== undefined &&
        Object.values(banco.leads).some(
          (l) => l.id !== leadId && l.confirmationToken === dados.confirmationToken
        )
      ) {
        throw new TokenEmUso();
      }
      // Espalhar `dados` cru sobrescreveria com `undefined` o que já estava
      // gravado — mesma armadilha que a guarda de `origem` fecha no Supabase.
      const informados = Object.fromEntries(
        Object.entries(dados).filter(([, valor]) => valor !== undefined)
      );
      const anterior = banco.leads[leadId] ?? {};
      banco.leads[leadId] = {
        ...anterior,
        ...informados,
        origem: dados.origem ?? anterior.origem ?? "quiz_frio",
        // Espelha o `default 'novo'` da coluna no Supabase. Sem isto o lead
        // nascia sem status neste backend, e dev deixava de refletir produção
        // justo no campo que o webhook de pagamento move.
        status: (anterior.status as StatusLead | undefined) ?? "novo",
        id: leadId,
        atualizadoEm: new Date().toISOString(),
      };
      await gravarArquivo(banco);
      return leadId;
    },

    async salvarRespostas(leadId, dados) {
      const banco = await lerArquivo();
      banco.respostas[leadId] = { ...(banco.respostas[leadId] ?? {}), ...dados };
      await gravarArquivo(banco);
    },

    async buscarRespostas(leadId) {
      const banco = await lerArquivo();
      return banco.respostas[leadId] ?? null;
    },

    // Mesmo soft delete que o Supabase respeita: agora que o fluxo do WhatsApp
    // grava tokens de verdade, lead removido não pode reabrir o link.
    async buscarLeadPorConfirmationToken(token) {
      const banco = await lerArquivo();
      const lead = Object.values(banco.leads).find(
        (l) => l.confirmationToken === token && !l.removidoEm
      );
      if (!lead) return null;
      return {
        id: String(lead.id),
        nome: (lead.nome as string | null) ?? null,
        persona: (lead.persona as PersonaKey | null) ?? null,
      };
    },

    async buscarLeadPorWhatsapp(numeros) {
      const banco = await lerArquivo();
      const candidatos = Object.values(banco.leads)
        .filter((l) => !l.removidoEm && numeros.includes(String(l.whatsapp ?? "")))
        .sort((a, b) =>
          String(b.atualizadoEm ?? "").localeCompare(String(a.atualizadoEm ?? ""))
        );
      const lead = candidatos[0];
      if (!lead) return null;
      return {
        id: String(lead.id),
        nome: (lead.nome as string | null) ?? null,
        persona: (lead.persona as PersonaKey | null) ?? null,
        confirmationToken: (lead.confirmationToken as string | null) ?? null,
        ultimaMensagemRecebidaEm:
          (lead.ultimaMensagemRecebidaEm as string | null) ?? null,
      };
    },

    async registrarContatoWhatsapp(leadId, dados) {
      const banco = await lerArquivo();
      const lead = banco.leads[leadId];
      // Mesmo achado da versão Supabase: sucesso silencioso contra um lead
      // inexistente devolveria um token que nunca foi persistido.
      if (!lead) {
        throw new Error(`leads: lead ${leadId} não encontrado`);
      }
      if (dados.confirmationToken !== undefined) {
        const emUso = Object.values(banco.leads).some(
          (l) => l.id !== leadId && l.confirmationToken === dados.confirmationToken
        );
        if (emUso) throw new TokenEmUso();
        lead.confirmationToken = dados.confirmationToken;
      }
      lead.ultimaMensagemRecebidaEm = dados.recebidaEm.toISOString();
      lead.atualizadoEm = new Date().toISOString();
      await gravarArquivo(banco);
    },

    async reservarMensagemWhatsapp(wamid, leadId) {
      const banco = await lerArquivo();
      const mensagens = (banco.mensagensWhatsapp ??= {});
      if (mensagens[wamid]) return false;
      mensagens[wamid] = { leadId, recebidaEm: new Date().toISOString() };
      await gravarArquivo(banco);
      return true;
    },

    async liberarMensagemWhatsapp(wamid) {
      const banco = await lerArquivo();
      if (banco.mensagensWhatsapp) delete banco.mensagensWhatsapp[wamid];
      await gravarArquivo(banco);
    },

    async criarProposta(leadId, token, conteudo, expiraEm) {
      const banco = await lerArquivo();
      const proposta: PropostaSalva = {
        id: randomUUID(),
        leadId,
        token,
        conteudo,
        geradoEm: new Date().toISOString(),
        expiraEm: expiraEm.toISOString(),
      };
      banco.propostas[token] = proposta;
      await gravarArquivo(banco);
      return proposta;
    },

    async buscarPropostaPorToken(token) {
      const banco = await lerArquivo();
      return banco.propostas[token] ?? null;
    },

    async buscarPropostaPorLeadId(leadId) {
      const banco = await lerArquivo();
      const daLead = Object.values(banco.propostas)
        .filter((p) => p.leadId === leadId)
        .sort((a, b) => b.geradoEm.localeCompare(a.geradoEm));
      return daLead[0] ?? null;
    },

    async atualizarStatusLead(leadId, status) {
      const banco = await lerArquivo();
      const lead = banco.leads[leadId];
      if (!lead) return null;
      const anterior = (lead.status as StatusLead) ?? "novo";
      if (anterior === status) return anterior;
      lead.status = status;
      lead.atualizadoEm = new Date().toISOString();
      await gravarArquivo(banco);
      return anterior;
    },

    async registrarEvento(propostaId, tipo, meta) {
      const banco = await lerArquivo();
      banco.eventos.push({
        propostaId,
        tipo,
        meta,
        em: new Date().toISOString(),
      });
      await gravarArquivo(banco);
    },
  };
}

let cache: Store | null = null;

export function getStore(): Store {
  if (cache) return cache;
  const db = clienteSupabase();
  if (db) {
    cache = storeSupabase(db);
  } else {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "SUPABASE_URL e SUPABASE_SERVICE_ROLE são obrigatórias em produção — " +
          "o backend de arquivo é só para desenvolvimento local."
      );
    }
    console.warn(
      "[tailor] Sem SUPABASE_URL/SUPABASE_SERVICE_ROLE: usando .tailor-dev/banco.json. " +
        "Nada aqui persiste em produção."
    );
    cache = storeArquivo();
  }
  return cache;
}
