@AGENTS.md

# Tailor — memória do projeto

SaaS white label de quiz com proposta sob medida. Primeiro cliente: Renilza
Miranda, holding em 3 vertentes (Imagem, Posicionamento, Estética) desde
22/09/2026. Leia `PRODUCT.md` para a verdade de produto, `DESIGN.md` para o
mundo visual como construído e `docs/holding/HANDOFF-implementacao.md` para o
quiz da holding. Este arquivo guarda regra, convenção e fonte da verdade; o
log de decisões vive em `docs/history/CHANGELOG.md`.

## Fontes da verdade, nesta ordem

Caminhos com `.../` partem de `OneDrive/_millionaire/ParenteMiranda/`.

1. `PRODUCT.md` — usuárias, propósito, condições do Conselho, compromissos de
   marca. Onde divergir das decisões assinadas em 22/09 (white label, 3
   vertentes, níveis por vertente, entrada direta), vencem essas decisões,
   registradas no HANDOFF.
2. `docs/holding/HANDOFF-implementacao.md` + `docs/holding/prototipo/layout-final.html`
   — a spec do quiz da holding, assinada em 22/09: fluxo, roteiro, tokens por
   vertente, figuras, animações, exceções de marca e ordem de trabalho. O
   protótipo é autoridade sobre **estrutura, fluxo, copy e modelo de estado**
   do quiz (o objeto `ROTEIRO` é a copy das perguntas); o HANDOFF vence o
   protótipo onde os dois divergem. O protótipo está publicado e **não se
   edita**: correção vai para a "Errata do protótipo" no HANDOFF.
3. `.../20-renilza-planejamento/branding/BRAND-VISUAL.md` v1.1 — sistema de
   identidade, com protocolo de mudança no §10. **Vence os protótipos** em
   cor, tipografia, forma e vetos. As exceções assinadas em 22/09 (HANDOFF
   §6) valem enquanto não entram no §10: degradê, pílula e seleção preenchida
   só em Posicionamento; logo "RENILZA MIRANDA" em Bodoni Moda com dourado em
   degradê; botão com canto de 10px em Imagem e Estética; fundo próprio por
   vertente.
4. `.../20-renilza-planejamento/holding/` — **o negócio**: esteira, produtos,
   preços de oferta, gate de certificação, cronograma, o que se sabe da
   Renilza e do público. O documento-mestre é `holding/00-HOLDING.md`. As
   fontes que viviam em `docs/` estão em
   `holding/fontes/` (planejamento da holding, `renilza-conhecimento.md`,
   entrevista da rodada 1, decisões da esteira de 20 e 22/09, capacidade,
   cronograma, portfólios antigos). No planejamento, "[DECIDIDO]" é
   recomendação forte, não assinatura da Renilza.
5. `.../21-renilza-consultoria-imagem/tailor-proposal-crafter/tailor-copy-deck.md`
   — a fonte de texto da proposta e do fluxo único; `messages/pt.json` é ele
   como dados. A copy das perguntas do quiz da holding sai do `ROTEIRO` do
   protótipo, ainda pendente de leitura com a Renilza; depois da
   implementação, reconciliar os dois.
6. `.../tailor-spec.md` (mesma pasta) — rotas, schema, pipeline, custo, riscos.
7. `.../tailor-v0.2.html` (mesma pasta) — **histórico.** O protótipo do fluxo
   único e da proposta em 7 blocos; no quiz, superado pelo `layout-final.html`.
   Nunca foi autoridade visual: viola o §8 do BRAND-VISUAL em quatro pontos
   (gradiente na barra de progresso, botão primário preenchido de ouro, emoji
   na interface, tipografia divergente).

Etiquetas de fonte em docs de negócio e pendências: `[RENILZA via WILLIAN]`
(fala do Willian, vale como posição dela), `[VAULT]` (documento do vault),
`[INFERI]` (inferência de quem escreveu, sem confirmação), `[NÃO SEI]`
(lacuna declarada); frase de cliente e credencial pública exigem fonte original.

## As sete condições do Conselho (13/08/2026, aprovado 6–0)

Restrição de produto, não sugestão. Ver o README para onde cada uma vive.
`src/lib/conselho.test.ts` trava C1, C3 e C4, que quebram em silêncio.

## Regras que não se negociam neste repo

- **Nenhum preço fora de `src/content/config.ts`.** Se aparecer um número de
  oferta em outro arquivo, é bug.
- **Nenhum número exibido que ela não tenha declarado.** Nada de projeção,
  estimativa ou exemplo. A aritmética é dela e só dela.
- **Nenhum depoimento, contador de alunas, credencial ou case inventado.** Não
  existe material real; o Bloco 6 diz isso na tela.
- **Nunca commitar credencial.** `.env.example` com placeholders; valores reais
  só em `.env.local`.
- **Commits são manuais do Willian.** Um agente pode `git add`; nunca
  `git commit` nem `git push`.
- Conventional Commits, em inglês. Nenhuma menção a IA em commit, código,
  comentário ou PR.

## Fronteiras (desde 22/09/2026)

- **White label.** Nada de marca, vertente, pergunta, faixa, produto ou texto
  de cliente escrito em componente: tudo sai da configuração do cliente, e
  vertente é dado, não `if` (HANDOFF §1). Vale para todo código novo; o fluxo
  único em `develop` é anterior e migra com a holding. Infra multi-cliente
  fica fora de escopo até a Renilza estar validada.
- **Repo × vault.** O repo guarda código, a spec de implementação
  (`docs/holding/`), as pendências e o histórico. Negócio e estratégia vão
  para o vault (`.../20-renilza-planejamento/holding/`); material superado,
  para `.../90-arquivo/`. O mapa está em `docs/README.md`.

## Convenções do código

- Código e comentários em **português**, como o resto do domínio — a exceção
  são termos de framework. Nomes de tipo em PascalCase, funções em camelCase,
  arquivos em kebab-case.
- Comentário só quando o **porquê** não é óbvio pelo código. A densidade atual
  é a referência: comentar decisão de conselho, armadilha medida e divergência
  de marca; não comentar o que a linha seguinte já diz.
- Tailwind para layout e espaço (só os tokens `p1..p7`); tokens de marca por
  CSS custom property; as primitivas do mundo em `globals.css` e
  `components/molde.tsx`. Na holding, os tokens de cada vertente entram por
  `[data-vertente]`, e as figuras (`agulha`, `templo`, `toque`) e os gestos de
  seleção (`fio`, `preenchimento`, `onda`) são componentes de um catálogo,
  escolhidos pela configuração (HANDOFF §1 e §5).
- Rotas de API validam com Zod na entrada e **refazem** no servidor toda
  validação que o cliente já fez.
- Nada de animar `height`/`width`. Movimento por `transform` e `opacity`.

## Ambiente

- **Node 20.9+** (Next 16). A máquina responde Node 18 por padrão:
  `nvm use 20.17.0`, ou prefixe `C:\Users\willi\AppData\Local\nvm\v20.17.0` no PATH.
- `vitest.config.mts` precisa da extensão `.mts` — como `package.json` não tem
  `"type": "module"`, um `.ts` é carregado como CJS e o vitest quebra com
  `ERR_REQUIRE_ESM` no Node 20.
- `src/middleware.ts` (runtime edge), não `proxy.ts` — o Next 16 mantém a
  convenção antiga exatamente para edge, e o adapter do Netlify só tem caminho
  maduro para middleware edge (o wrapper de node-middleware quebra no runtime
  do bundler). Ver o comentário no próprio arquivo.

---

## Histórico

O log de decisões, sessão por sessão, desde 13/08/2026 — fundido com o log de
`DESIGN.md` em ordem cronológica — vive em `docs/history/CHANGELOG.md`. O que
ainda depende de decisão humana (conta, credencial, preço, escolha de
produto) está consolidado em `docs/PENDING.md`, sem duplicar o que já foi
resolvido no histórico. O mapa dos docs, incluindo o que saiu para o vault e
para o arquivo em 23/09/2026, está em `docs/README.md`.

Regra para quem escreve aqui: **o que muda com frequência (uma sessão, uma
decisão pontual) vai para o histórico. Só regra, convenção e fonte de
verdade ficam neste arquivo.**
