# Sprint atual — V2: Campaign Memory

## V1 — Concluída ✓

- [x] Condições no Combat Dashboard (Cego, Envenenado, Paralisado, Amedrontado...)
- [x] Atalhos de teclado (S=salvar, C=combate, N=notas, O=visão geral)
- [x] PWA: manifest.json + service worker básico
- [x] Dark mode, offline-first, export/import JSON, auto-save

**Movido para início de V2 (pré-requisitos):**
- [ ] Migrar para TypeScript + Vite (estrutura modular)
- [ ] Refatorar LocalStorage: `character` → `campaign` (container top-level)
- [ ] Navegação principal refatorada para suportar novos módulos

---

## V2 — Campaign Memory

Ordem: **TypeScript/Vite + Campaign model → Journal → NPC Database → Quest Tracker**

### Pré-requisitos (fazer primeiro)
- [ ] Migrar para TypeScript + Vite
- [ ] Estrutura de Campaign no LocalStorage
- [ ] Navegação principal refatorada

### Session Journal (spec 002)
- [ ] Wireframe aprovado
- [ ] Componente SessionCard
- [ ] Componente Timeline
- [ ] CRUD de sessões
- [ ] Busca por texto
- [ ] Filtro por tags

### NPC Database (spec 003)
- [ ] Componente NPCCard com status badge
- [ ] CRUD de NPCs
- [ ] Filtro por status e facção

### Quest Tracker (spec 004)
- [ ] Componente QuestCard
- [ ] Objetivos checkables com progresso
- [ ] Visão de quest principal em destaque
