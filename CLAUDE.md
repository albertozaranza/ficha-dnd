# Projeto

D&D Second Brain — sistema pessoal de gerenciamento de personagem, campanha e conhecimento para D&D 5e.

Não é uma ficha digital. A ficha é apenas o ponto de entrada para uma memória viva da campanha.

Ver visão completa: `.claude/architecture/vision.md`

---

# Stack

- HTML + Tailwind (CDN por agora, Vite quando modularizar)
- TypeScript (migrar de JS puro no início da V2)
- LocalStorage (Campaign como container top-level)
- Offline First / PWA

---

# Princípios

- UX first
- Dark mode first
- Desktop first, Mobile second
- Não reproduzir PDFs — sempre preferir dashboards e cards
- Progressive disclosure: mostrar o essencial, revelar o detalhe sob demanda
- Priorizar escaneabilidade: o jogador precisa de informação rápida durante combate
- Componentes modernos — nunca formulários gigantes

---

# Processo

Antes de implementar qualquer feature:

1. Entender o problema (ler spec em `.claude/specs/`)
2. Definir arquitetura de dados (atualizar `data-model.md` se necessário)
3. Fazer wireframe (descrever UX no próprio spec)
4. Implementar
5. Validar UX contra os princípios

---

# Estado atual

**V1 — Character Hub**: implementado em JS puro (`src/`). Funcional.

**Foco agora**: concluir V1 (condições, TS migration) e iniciar V2 (Journal + NPC Database).

Ver tasks: `.claude/tasks/current.md` e `.claude/tasks/backlog.md`
