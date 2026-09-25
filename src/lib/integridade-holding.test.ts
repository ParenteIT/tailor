import { describe, expect, it } from "vitest";
import { CLIENTE, IDIOMAS, txt } from "@/content/clientes";
import {
  CENA_LIVRE,
  RESPOSTAS_VAZIAS,
  escolherCena,
  esquemaRespostas,
  juntarTranscricao,
  linkDaProposta,
  sanearRespostas,
  viaDaColuna,
  viaDepoisDoAudio,
  viaDepoisDoTexto,
  type RespostasHolding,
} from "@/lib/fluxo";
import { dadosDasRespostas } from "@/lib/holding-servidor";
import { corpoDoAviso } from "@/lib/aviso-lead";

const TOKEN = "abcdefghijklmnopqrstuvwxyz012345";

function enviadas(r: RespostasHolding) {
  const { whatsapp: _w, email: _e, ...resto } = r;
  void _w;
  void _e;
  return resto;
}

describe("A35 — mensagem do WhatsApp e aviso à dona", () => {
  const mensagens = [CLIENTE.textos.fim.mensagemWhatsapp, CLIENTE.textos.proposta.mensagemWhatsapp];

  it("a mensagem pré-preenchida nunca leva o nome (o texto viaja na URL)", () => {
    for (const m of mensagens) {
      for (const idioma of IDIOMAS) expect(m[idioma]).not.toContain("{nome}");
    }
  });

  it("a mensagem leva o link da proposta", () => {
    for (const m of mensagens) {
      for (const idioma of IDIOMAS) {
        expect(txt(m, idioma, { link: "https://x/p/T" })).toContain("https://x/p/T");
      }
    }
  });

  it("o link só usa o host da requisição se for domínio do cliente", () => {
    expect(linkDaProposta(CLIENTE, CLIENTE.dominio, TOKEN)).toBe(`https://${CLIENTE.dominio}/p/${TOKEN}`);
    expect(linkDaProposta(CLIENTE, "localhost:3000", TOKEN)).toBe(`http://localhost:3000/p/${TOKEN}`);
    expect(linkDaProposta(CLIENTE, "golpe.example", TOKEN)).toBe(`https://${CLIENTE.dominio}/p/${TOKEN}`);
    expect(linkDaProposta(CLIENTE, null, TOKEN)).toBe(`https://${CLIENTE.dominio}/p/${TOKEN}`);
  });

  it("o aviso não carrega nome, contato nem o que ela escreveu", () => {
    const r: RespostasHolding = {
      ...escolherCena(CLIENTE, RESPOSTAS_VAZIAS, CENA_LIVRE),
      nome: "Maria Teste",
      livre: "um relato só dela",
      whatsapp: "11999998888",
      email: "maria@teste.com",
    };
    const corpo = JSON.stringify(corpoDoAviso(CLIENTE, r, "pt", "https://x/p/T", new Date(0)));
    for (const dado of ["Maria", "relato", "99999", "maria@"]) expect(corpo).not.toContain(dado);
    expect(corpo).toContain("https://x/p/T");
  });
});

describe("A25 — a transcrição se soma ao texto", () => {
  it("anexa ao que ela digitou, sem apagar", () => {
    expect(juntarTranscricao("Comecei assim", "e terminei falando.", 100)).toBe("Comecei assim e terminei falando.");
    expect(juntarTranscricao("  ", " só falei ", 100)).toBe("só falei");
  });

  it("passando do limite, corta a transcrição, não o texto dela", () => {
    expect(juntarTranscricao("abc", "defghij", 6)).toBe("abc de");
  });

  it("a via marca misto quando havia texto, e o banco lê misto como áudio", () => {
    expect(viaDepoisDoAudio("", null)).toBe("audio");
    expect(viaDepoisDoAudio("já tinha", "texto")).toBe("misto");
    expect(viaDepoisDoAudio("já tinha", "audio")).toBe("audio");
    expect(viaDepoisDoTexto("audio")).toBe("audio");
    expect(viaDepoisDoTexto(null)).toBe("texto");
    expect(viaDaColuna("misto")).toBe("audio");
  });
});

describe("A24/A47 — consentimento e 'Nenhuma dessas' com áudio", () => {
  const esquema = esquemaRespostas(CLIENTE, "BRL");
  const livre: RespostasHolding = {
    ...escolherCena(CLIENTE, RESPOSTAS_VAZIAS, CENA_LIVRE),
    livre: "o que ela disse",
    viaLivre: "audio",
  };

  it("via de áudio sem o carimbo de consentimento é recusada no servidor", () => {
    expect(esquema.safeParse(enviadas(livre)).success).toBe(false);
    const comCarimbo = { ...livre, consentimentoAudioEm: new Date().toISOString() };
    expect(esquema.safeParse(enviadas(comCarimbo)).success).toBe(true);
  });

  it("o carimbo tem de ser uma data, não um texto qualquer", () => {
    const torto = { ...livre, consentimentoAudioEm: "ontem" };
    expect(esquema.safeParse(enviadas(torto)).success).toBe(false);
    expect(sanearRespostas(CLIENTE, torto, "BRL").consentimentoAudioEm).toBeNull();
  });

  it("o texto de 'Nenhuma dessas' chega ao lead com a via certa", () => {
    const r = { ...livre, consentimentoAudioEm: new Date().toISOString() };
    const dados = dadosDasRespostas(CLIENTE, r, "pt");
    expect(dados.situacao).toBe("o que ela disse");
    expect(dados.situacaoVia).toBe("audio");
    expect((dados.raw as Record<string, unknown>).viaLivre).toBe("audio");
  });

  it("sair de 'Nenhuma dessas' limpa a via do texto livre", () => {
    const outra = CLIENTE.vertentes[0].id;
    expect(escolherCena(CLIENTE, livre, outra).viaLivre).toBeNull();
  });
});
