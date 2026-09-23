@AGENTS.md

# Tailor — memória do projeto

Sistema de propostas sob medida da consultoria de imagem da Renilza Miranda.
Leia `PRODUCT.md` para a verdade de produto e `DESIGN.md` para o mundo visual
como construído. Este arquivo é o log de decisões e as convenções do código.

## Fontes da verdade, nesta ordem

1. `PRODUCT.md` — usuárias, propósito, condições do Conselho, compromissos de marca.
2. `OneDrive/_millionaire/ParenteMiranda/20-renilza-planejamento/branding/BRAND-VISUAL.md`
   v1.1 — sistema de identidade, com protocolo de mudança no §10. **Vence o
   protótipo** em cor, tipografia, forma e vetos.
3. `.../21-renilza-consultoria-imagem/tailor-proposal-crafter/tailor-copy-deck.md`
   — a fonte de texto. `messages/pt.json` é ele como dados.
4. `.../tailor-spec.md` — rotas, schema, pipeline, custo, riscos.
5. `.../tailor-v0.2.html` — o protótipo. Autoridade sobre **estrutura, fluxo,
   copy e modelo de estado**. Não é autoridade visual: foi construído sem o
   BRAND-VISUAL v1.1 e viola o §8 em quatro pontos (gradiente na barra de
   progresso, botão primário preenchido de ouro, emoji na interface, tipografia
   divergente).

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

## Convenções do código

- Código e comentários em **português**, como o resto do domínio — a exceção
  são termos de framework. Nomes de tipo em PascalCase, funções em camelCase,
  arquivos em kebab-case.
- Comentário só quando o **porquê** não é óbvio pelo código. A densidade atual
  é a referência: comentar decisão de conselho, armadilha medida e divergência
  de marca; não comentar o que a linha seguinte já diz.
- Tailwind para layout e espaço (só os tokens `p1..p7`); tokens de marca por
  CSS custom property; as primitivas do mundo em `globals.css` e
  `components/molde.tsx`.
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
resolvido no histórico.

Regra para quem escreve aqui: **o que muda com frequência (uma sessão, uma
decisão pontual) vai para o histórico. Só regra, convenção e fonte de
verdade ficam neste arquivo.**
