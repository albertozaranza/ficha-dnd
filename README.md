# Ficha D&D 5e

Gerenciador pessoal de personagem e campanha para **Dungeons & Dragons 5ª Edição** — offline-first, com dados persistidos no navegador.

## Como usar

Instale e rode o servidor local:

```bash
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
```

## Funcionalidades

- **3 páginas** fiéis à ficha oficial em português
  - Ficha principal — atributos, perícias, combate, ataques, equipamento, traços
  - Personagem — aparência, história, aliados, características raciais/classe, tesouro
  - Magias — truques, espaços de magia nível 1–9
- **Cálculos automáticos** — modificadores, bônus de proficiência, expertise, percepção passiva, iniciativa
- **Persistência automática** via `localStorage` com container top-level de campanha
- **Migração automática** do storage legado `dnd5e_character` para `dnd5e_campaign`
- **Export / Import** em JSON de campanha
- **Dark mode** e **impressão otimizada**

## Stack

- HTML5
- TypeScript
- Vite
- TailwindCSS via CDN
- Persistência via `localStorage`

## Estrutura

```
├── index.html          — Entrada Vite
├── public/             — Manifest e service worker
└── src/
    ├── main.ts         — Render, navegação e interação
    ├── character-data.ts — Dados do personagem (pré-carregado)
    ├── calculations.ts — Regras D&D 5e (modificadores, proficiência…)
    ├── storage.ts      — Campaign no localStorage, exportar/importar
    ├── types.ts        — Tipos compartilhados
    └── styles.css      — Estética da ficha (fontes, bordas, dark mode)
```

## Personagem de exemplo

Skritch Cauda-de-Ferro — Ladino 1, Ferakh (Rato), Antecedente: Criminoso.
