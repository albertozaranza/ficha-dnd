# Visão

Transformar a ficha de personagem em uma plataforma de gerenciamento de campanha onde o jogador registra, consulta, analisa e toma decisões baseadas em todo o histórico da aventura.

> A ficha é apenas o ponto de entrada para uma memória viva da campanha.

---

## Módulos

```
Campaign
│
├── V1 — Character Hub      (spec 001) ← implementado
├── V2 — Journal            (spec 002)
│    ├── Session Journal
│    ├── NPC Database       (spec 003)
│    └── Quest Tracker      (spec 004)
├── V3 — Combat Intelligence
│    ├── Bestiary           (spec 005)
│    └── Combat Tracker     (spec 006)
├── V4 — World Encyclopedia (spec 007)
├── V5 — AI Companion       (spec 008)
├── V6 — Analytics          (spec 009)
└── V7 — Build Planner      (spec 010)
```

---

## V1 — Core Character Experience

Substituir completamente a ficha física.

Status: **implementado** (JS puro, aguardando migração para TS).

Módulos: Overview · Combat · Skills · Equipment · Features · Spellbook · Character · Notes

---

## V2 — Campaign Memory

Criar memória persistente da campanha.

**Session Journal**: registro de sessões com data, resumo, participantes, eventos, tags (NPC, Local, Quest, Evento), timeline e busca.

**NPC Database**: cadastro de NPCs com nome, raça, ocupação, facção, relacionamento, status (aliado/neutro/inimigo/morto/desaparecido/suspeito), última localização, histórico, segredos.

**Quest Tracker**: quests principais e secundárias com objetivos, progresso, recompensas, status e prioridade.

---

## V3 — Combat Intelligence

Transformar combate em coleta de informações.

**Bestiary**: bestiário pessoal com estatísticas observadas (HP min/max, AC, ataques, dano), resistências/imunidades/vulnerabilidades, comportamento, padrões e métricas de confiança por campo.

**Combat Tracker**: ordem de iniciativa, turnos, rodadas, rastreamento de recursos (HP, spell slots, charges, condições), histórico de ataques/dano/críticos.

---

## V4 — World Encyclopedia

Wiki viva da campanha.

Locais (cidades, vilas, castelos, dungeons, regiões), Facções (guildas, cultos, organizações, reinos), Eventos históricos, Artefatos e itens mágicos importantes.

---

## V5 — AI Companion

Conselheiro pessoal do personagem com acesso ao contexto completo da campanha.

Personality Engine: personalidade, medos, objetivos, crenças, traumas, relacionamentos.

Context Engine: fornece à IA o histórico de sessões, NPCs, quests, locais, combates.

Exemplos de perguntas: "O que meu personagem faria?", "Quem pode estar mentindo?", "Quais pistas temos?", "Quais opções estratégicas existem?"

---

## V6 — Analytics

Gamificar a campanha com estatísticas de personagem (dano causado/recebido, magias lançadas, críticos, falhas) e de campanha (sessões, quests, NPCs, inimigos, economia).

---

## V7 — Build Planner

Planejamento estratégico de progressão: próximos níveis, multiclasse, feats, ASI. Simulações de DPR, AC, spell slots, saving throws.
