# Ficha D&D 5e

Gerador de ficha de personagem de **Dungeons & Dragons 5ª Edição** — 100% offline, sem dependências de servidor.

## Como usar

Abra `src/index.html` no navegador. Não é necessário servidor, build ou instalação.

## Funcionalidades

- **3 páginas** fiéis à ficha oficial em português
  - Ficha principal — atributos, perícias, combate, ataques, equipamento, traços
  - Personagem — aparência, história, aliados, características raciais/classe, tesouro
  - Magias — truques, espaços de magia nível 1–9
- **Cálculos automáticos** — modificadores, bônus de proficiência, expertise, percepção passiva, iniciativa
- **Persistência automática** via `localStorage` com debounce de 300ms
- **Export / Import** em JSON
- **Dark mode** e **impressão otimizada**

## Stack

- HTML5
- JavaScript ES2022 (sem framework)
- TailwindCSS via CDN
- Persistência via `localStorage`

## Estrutura

```
src/
├── index.html          — HTML das 3 páginas
├── character-data.js   — Dados do personagem (pré-carregado)
├── calculations.js     — Regras D&D 5e (modificadores, proficiência…)
├── storage.js          — localStorage: salvar, carregar, exportar, importar
├── app.js              — Render e interação
└── styles.css          — Estética da ficha (fontes, bordas, dark mode)
```

## Personagem de exemplo

Skritch Cauda-de-Ferro — Ladino 1, Ferakh (Rato), Antecedente: Criminoso.
