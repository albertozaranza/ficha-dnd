# UX Principles

## Principios fundamentais

### Escaneabilidade primeiro
O jogador precisa de uma informacao em segundos — durante combate, mid-roleplay, em plena discussao na mesa. Nenhuma tela exige leitura longa para encontrar o dado relevante. Hierarquia visual clara: o mais importante e maior e mais contrastado.

### Dashboards, nao formularios
Nunca criar uma tela com formulario longo para preencher de uma vez. Preferir cards editaveis inline, modais focados (uma acao por vez), e edicao contextual (clicar no valor para editar).

### Progressive disclosure
Mostrar o essencial. Revelar detalhes sob demanda (expandir card, abrir painel lateral, abrir modal). Nao sobrecarregar a tela com campos raramente usados.

### Velocidade durante combate
Combat Dashboard e Combat Tracker sao as telas mais criticas. Devem funcionar com uma mao, sem rolagem excessiva, com botoes grandes o suficiente para toque. Acao mais comum = botao mais acessivel.

### Feedback imediato
Todo input tem resposta visual instantanea: salvo, marcado, calculado. Auto-save com indicador discreto. Nenhuma acao fica sem feedback.

---

## Padroes de interacao

| Situacao | Padrao |
|---|---|
| Editar um valor simples | Inline edit — clicar no valor, campo aparece, blur salva |
| Adicionar um item a uma lista | Botao `+ Adicionar` no header da secao, abre modal minimo |
| Ciclar entre estados | Badge clicavel (ex: status de NPC, proficiencia de pericia) |
| Deletar | Swipe ou botao de lixeira que aparece no hover/focus |
| Confirmar acao destrutiva | Modal de confirmacao sempre |
| Formulario com muitos campos | Modal paginado ou secoes colapsaveis, nunca scroll infinito |
| Lista vazia | Empty state com ilustracao + texto + CTA contextual |
| Busca | `input[type=search]` no header da secao, filtro em tempo real sem submit |

---

## Hierarquia de modulos por frequencia de uso

1. **Combat Dashboard / Combat Tracker** — uso durante cada combate
2. **Character Hub (Overview)** — consulta frequente
3. **Spellbook** — uso frequente em combate
4. **Journal** — uso pos-sessao
5. **NPC Database / Quest Tracker** — consulta entre sessoes
6. **Bestiary** — consulta durante e apos combate
7. **World Encyclopedia** — consulta esporadica
8. **Analytics / Build Planner** — uso estrategico, baixa frequencia

A navegacao principal deve refletir essa hierarquia.

---

## Regras de densidade

- Cards: sempre com padding interno generoso (16-24px)
- Listas compactas (pericias, ataques): podem ter densidade alta — linha por item
- Formularios em modal: max 480px de largura, campos empilhados
- Texto de descricao: max 65 caracteres por linha para leitura confortavel
- Nunca mais de 3 niveis de hierarquia visual em uma mesma tela

---

## Dark mode

- Dark mode e o padrao — nunca testar apenas em light
- Contraste minimo: texto primario vs fundo = 7:1
- Cores de status (verde/vermelho/amarelo) devem ser legíveis em dark sem saturacao excessiva
- Sombras em dark: usar `box-shadow` com cor opaca escura, nunca preto puro

---

## Mobile (segundo plano)

- Layout principal e para desktop (sidebar + main)
- Em mobile: sidebar vira bottom nav ou drawer
- Combat Tracker deve ser 100% usavel em mobile (mesa de jogo)
- Inputs de numero (HP, dano) devem abrir teclado numerico em mobile (`inputmode="numeric"`)
