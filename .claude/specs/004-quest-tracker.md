# Quest Tracker (V2)

## Objetivo

Rastrear quests ativas, concluidas e abandonadas com objetivos e progresso.

## Problema

Jogadores perdem o fio das quests:
- Objetivos incompletos sao esquecidos
- Sidequests sao abandonadas sem conclusao
- Recompensas prometidas sao ignoradas
- Deadlines criticos nao sao vistos

## Solucao

Tracker visual de quests com objetivos checkables, prioridade e referencias cruzadas.

## Features

### Quest Card
- Titulo
- Tipo: `principal` / `secundaria`
- Status: `ativa` / `concluida` / `falhou` / `abandonada`
- Prioridade: `alta` / `media` / `baixa`
- Descricao
- Lista de objetivos (checkable)
- Recompensas esperadas
- Deadline (opcional)

### Objetivos
- Lista de objetivos individuais
- Cada objetivo e checkable
- Barra de progresso automatica (objetivos concluidos / total)

### Referencias cruzadas
- NPCs envolvidos
- Sessoes relacionadas
- Local relacionado

### Visoes
- **Ativas**: todas as quests em andamento agrupadas por prioridade
- **Concluidas**: historico de quests resolvidas
- **Principal**: destaque para a quest principal com barra de progresso grande

### Filtros
- Por tipo (principal / secundaria)
- Por status
- Por prioridade

## UX

- Quest principal fixada no topo com visual diferenciado
- Sidequests em lista ordenada por prioridade
- Clicar em objetivo para marcar como concluido
- Badge de progresso (ex: "2/4 objetivos")
- Status mudam via badge clicavel
- Empty state: "Nenhuma quest ativa. Fale com alguem interessante."

## Criterios de aceite

- Adicionar nova quest em menos de 30 segundos
- Marcar objetivos durante ou apos sessao
- Ver claramente o que falta para concluir a quest principal
- Identificar a proxima prioridade entre as sidequests
