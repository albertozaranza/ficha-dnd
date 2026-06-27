# Sprint atual — Fechar V1 + Iniciar V2

## V1 — Pendencias (Character Hub)

- [ ] Condicoes no Combat Dashboard (Envenenado, Amedrontado, Paralisado...)
- [ ] Migrar para TypeScript + Vite (estrutura modular)
- [ ] Refatorar LocalStorage: `character` → `campaign` (container top-level)
- [ ] PWA: manifest.json + service worker basico
- [ ] Atalhos de teclado (pelo menos: S = salvar, N = notas, C = combate)

## V2 — Proximo modulo a implementar

Ordem: **Journal → NPC Database → Quest Tracker**

### Pre-requisitos para V2
- [ ] Estrutura de Campaign no LocalStorage resolvida (V1 pendencia acima)
- [ ] Navegacao principal refatorada para suportar novos modulos

### Session Journal (spec 002)
- [ ] Wireframe aprovado
- [ ] Componente SessionCard
- [ ] Componente Timeline
- [ ] CRUD de sessoes
- [ ] Busca por texto
- [ ] Filtro por tags

### NPC Database (spec 003)
- [ ] Componente NPCCard com status badge
- [ ] CRUD de NPCs
- [ ] Filtro por status e faccao

### Quest Tracker (spec 004)
- [ ] Componente QuestCard
- [ ] Objetivos checkables com progresso
- [ ] Visao de quest principal em destaque
