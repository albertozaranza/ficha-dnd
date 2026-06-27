# CLAUDE.md

## Projeto

Gerador de ficha de personagem de Dungeons & Dragons 5ª Edição baseado em:

- Um arquivo PDF contendo o layout da ficha.
- Um arquivo Markdown contendo os dados do personagem.

O objetivo é gerar uma aplicação web local que reproduza visualmente a ficha do PDF e preencha automaticamente os dados do Markdown.

---

# Stack obrigatória

- HTML5
- JavaScript ES2022+
- TailwindCSS via CDN
- Sem framework frontend
- Sem backend
- Sem banco de dados
- Persistência usando localStorage

---

# Regras gerais

## Regra principal

A fidelidade visual da ficha é mais importante do que a complexidade do código.

Sempre priorizar:

1. Reprodução visual do PDF.
2. Preenchimento correto dos dados.
3. Persistência.
4. Facilidade de manutenção (campos editáveis).

---

# Estrutura do projeto

```text
project/
├── src/
│   ├── index.html          ← HTML das 3 páginas (Ficha, Personagem, Magias)
│   ├── character-data.js   ← Dados do personagem (objeto DEFAULT_CHARACTER)
│   ├── calculations.js     ← Cálculos D&D 5e (modificadores, proficiência, perícias)
│   ├── storage.js          ← localStorage: save, load, reset, export, import
│   ├── app.js              ← Render de todas as seções + event listeners
│   └── styles.css          ← Estética da ficha (fontes Cinzel/IM Fell, dark mode, print)
├── .gitignore
├── CLAUDE.md
└── README.md
```

O ponto de entrada é `src/index.html`. Não há build step — abrir direto no navegador.

---

# Fluxo da aplicação

```text
Markdown
     ↓
Parser
     ↓
Character Object
     ↓
Render HTML
     ↓
Persistência Local
     ↓
Re-render automático
```

---

# Estrutura do personagem

Sempre utilizar a seguinte estrutura:

```javascript
const character = {
  meta: {
    name: "",
    race: "",
    subrace: "",
    class: "",
    subclass: "",
    level: 1,
    background: "",
    alignment: "",
    experience: 0,
    player: "",
  },

  attributes: {
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
  },

  modifiers: {},

  savingThrows: {},

  skills: {},

  combat: {
    ac: 10,
    initiative: 0,
    speed: 30,
    hp: {
      current: 0,
      max: 0,
      temp: 0,
    },
    hitDice: "",
  },

  proficiencies: [],

  languages: [],

  features: [],

  traits: [],

  equipment: [],

  weapons: [],

  spells: [],

  money: {
    cp: 0,
    sp: 0,
    ep: 0,
    gp: 0,
    pp: 0,
  },

  notes: "",
};
```

---

# Cálculos automáticos

Implementar automaticamente:

## Modificador de atributo

```text
(attribute - 10) / 2
arredondado para baixo
```

Exemplo:

```text
8  -> -1
10 -> 0
12 -> +1
18 -> +4
20 -> +5
```

---

## Bônus de proficiência

```text
1-4   = +2
5-8   = +3
9-12  = +4
13-16 = +5
17-20 = +6
```

---

## Iniciativa

```text
DEX modifier
```

---

## Percepção passiva

```text
10 + percepção
```

---

## Saving Throws

```text
attribute modifier
+ proficiency if proficient
```

---

## Skills

```text
attribute modifier
+ proficiency if proficient
+ expertise if expertise
```

---

# Persistência

Sempre implementar:

```javascript
loadCharacter();
saveCharacter();
resetCharacter();
exportCharacter();
importCharacter();
```

Regras:

- Salvar automaticamente.
- Debounce de 300ms.
- Restaurar automaticamente ao abrir.
- Nunca perder dados do usuário.

---

# Interface

Obrigatório:

- TailwindCSS.
- Responsiva.
- Dark mode.
- Print mode.
- Campos editáveis.
- Accordion para seções grandes.
- Feedback visual de salvamento.

---

# Layout

Ao analisar o PDF:

1. Identificar todas as seções.
2. Mapear cada campo visual.
3. Criar grid equivalente.
4. Reproduzir proporções.
5. Reproduzir agrupamentos.

Nunca inventar layouts sem antes tentar reproduzir o PDF.

---

# Parser do Markdown

O parser deve:

- Detectar atributos.
- Detectar classe.
- Detectar raça.
- Detectar equipamentos.
- Detectar magias.
- Detectar características raciais.
- Detectar proficiências.
- Detectar idiomas.
- Detectar notas.

Caso alguma informação não exista:

- Criar campo vazio.
- Nunca falhar.

---

# Qualidade de código

Obrigatório:

- Funções pequenas.
- Sem duplicação.
- Nomes descritivos.
- Comentários apenas quando necessários.
- Separação clara de responsabilidades.

---

# Proibições

Não utilizar:

- React
- Vue
- Angular
- Svelte
- Next
- Vite
- Node backend
- Banco de dados
- Framework CSS além de Tailwind
- Dependências desnecessárias

---

# Processo de desenvolvimento

Antes de implementar:

1. Analisar o PDF.
2. Analisar o Markdown.
3. Criar mapeamento campo → campo.
4. Descrever a arquitetura.
5. Implementar.
6. Validar visualmente.
7. Validar cálculos.
8. Validar persistência.

---

# Critério de sucesso

A aplicação será considerada pronta quando:

- O layout for visualmente semelhante ao PDF.
- Todos os dados do Markdown forem carregados.
- Todos os campos forem editáveis.
- O localStorage funcionar.
- A impressão funcionar.
- O dark mode funcionar.
- O sistema funcionar completamente offline.
