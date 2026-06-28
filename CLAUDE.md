# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# Projeto

D&D Second Brain — sistema pessoal de gerenciamento de personagem e campanha para D&D 5e. A ficha é o ponto de entrada para uma **memória viva da campanha**.

Roadmap de versões em `.claude/architecture/vision.md`. Specs de cada módulo em `.claude/specs/`.

---

# Comandos

```bash
npm run dev      # dev server em http://127.0.0.1:5173
npm run build    # tsc + vite build (produção)
npm run preview  # preview do build de produção
```

Sem testes automatizados. Validação é manual via browser.

---

# Stack

- **React 18** + TypeScript (strict) + Vite 6
- **Zustand 5** + immer — estado global
- **vite-plugin-pwa** (workbox) — service worker gerado no build
- **LocalStorage** — persistência (`dnd5e_campaign`, JSON)
- CSS puro com variáveis (`--bg-*`, `--text-*`, `--accent`)
- Offline First / PWA

---

# Arquitetura

## Fluxo de dados

```
localStorage
    ↓  Storage.load()
campaignStore (Zustand + immer)
    ↓  useCampaignStore(s => ...)
Componentes React
    ↓  updateCharacter / addSession / ...
campaignStore
    ↓  useAutoSave → Storage.scheduleSave (debounce 300ms)
localStorage
```

## Entry point

`src/main.tsx` monta o `<App>` em `#sidebar-root` (div em `index.html`).

`App.tsx` usa `createPortal` para injetar as views React dentro de `<main id="main">`, ao lado do único elemento vanilla restante (view `#view-journal`).

## Estado global (`src/store/`)

| Store | Responsabilidade |
|-------|-----------------|
| `campaignStore.ts` | `Campaign` completa + actions (updateCharacter, addSession, updateSession, deleteSession, importCampaign, resetCampaign) |
| `uiStore.ts` | activeView, isDark, saveStatus, openModal, editingSessionId |

Mutations no `campaignStore` usam **immer** — mutação direta do draft é ok.

## Persistência (`src/storage.ts`)

`Storage.{save, load, reset, scheduleSave, exportJSON, importJSON}` — único ponto de acesso ao localStorage. `deepMerge` com `DEFAULT_CHARACTER` garante que dados antigos sejam normalizados.

## Cálculos D&D (`src/calculations.ts`)

`Calc.{modifier, proficiencyBonus, skillBonus, savingThrowBonus, passivePerception, initiative, formatBonus}` — funções puras, sem side effects.

## Componentes

```
src/
├── App.tsx                      ← orquestra: sidebar + portal de views + efeitos globais
├── main.tsx                     ← entry point React
├── main.ts                      ← bootstrap do Journal vanilla + toolbar actions exportados
│
├── components/
│   ├── layout/                  ← Sidebar, SidebarHero, XpBar, SidebarNav, SidebarFooter
│   ├── ui/                      ← StatCard (compartilhado entre Overview e Skills)
│   └── views/                   ← uma view por arquivo; Journal ainda vanilla (ver abaixo)
│
├── store/                       ← campaignStore.ts, uiStore.ts
├── hooks/                       ← useAutoSave.ts
└── lib/                         ← constants.ts (CONDITIONS, ATTR_KEYS, NAV_ITEMS, etc.)
```

## Navegação entre views

`SidebarNav` chama `uiStore.setActiveView(id)`. O `App.tsx` tem um `useEffect` que alterna a classe `.active` nos elementos `.view` do DOM — funciona tanto para views React (via portal) quanto para o Journal vanilla.

## Situação do Journal

`src/journal.ts` (~580 linhas) e `src/main.ts` ainda são vanilla JS. O Journal renderiza diretamente em `#view-journal` (HTML estático em `index.html`). Ele é inicializado em `App.tsx` via `initViewsVanilla()`. **Migração pendente** para React (próximo grande item).

---

# Regras

1. Ler a spec em `.claude/specs/` antes de implementar qualquer feature.
2. Atualizar `.claude/architecture/data-model.md` ao adicionar qualquer nova entidade.
3. Seguir `.claude/architecture/ux-principles.md` — especialmente: dashboards/cards, não formulários; progressive disclosure; escaneabilidade em combate.
4. Não usar `any` em TypeScript.
5. Não criar formulários gigantes — inline editing, modais focados.
6. Auto-save em texto livre: debounce 1s (useAutoSave faz 300ms no campaignStore; componentes com `defaultValue` + `onChange` podem debouncer localmente com `useRef`).
7. IDs: `crypto.randomUUID()`. Datas: ISO 8601.
8. Mutations de estado: sempre via `updateCharacter(c => { c.field = value })` — nunca criar novo objeto Campaign fora do store.

---

# CSS

`src/styles.css` — CSS global com variáveis de tema em `:root.dark` e `:root.light`. Classes de componente (`.stat-card`, `.feature-card`, `.session-card`, etc.) vivem aqui por enquanto. Sem Tailwind — apenas CSS puro com as variáveis definidas.

Paleta principal: `--accent` (#7c6af7), `--green`, `--amber`, `--red`, `--bg-base` (#0f1117), `--bg-surface`, `--bg-elevated`.
