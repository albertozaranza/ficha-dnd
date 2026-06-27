# Session Journal (V2)

## Objetivo

Criar memoria persistente da campanha por meio do registro de sessoes.

## Problema

Jogadores esquecem o que aconteceu nas sessoes anteriores:
- Quem encontraram
- O que foi revelado
- O que prometeram fazer
- O que aprenderam

## Solucao

Um diario de sessoes estruturado com busca, timeline e tags de referencia cruzada com NPCs, locais e quests.

## Features

### Session Card
- Numero da sessao (auto-incremento)
- Data (date picker)
- Titulo (editavel inline)
- Resumo (text area, auto-save)
- Participantes (lista de jogadores)

### Eventos
- Lista livre de eventos importantes (bullet list)
- Cada evento pode ter tag: NPC / Local / Quest / Combate / Revelacao

### Referencias cruzadas
- NPCs encontrados (link para NPC Database)
- Locais visitados (link para World Encyclopedia)
- Quests atualizadas (link para Quest Tracker)
- Monstros encontrados (link para Bestiary)

### Recompensas
- XP ganho na sessao
- Ouro ganho na sessao

### Timeline
- Lista cronologica de todas as sessoes
- Busca por texto
- Filtro por tag
- Agrupamento por arc / regiao (futuro)

## UX

- Lista de sessoes ordenada por numero (mais recente no topo)
- Clicar no card expande o resumo completo
- "Nova Sessao" abre modal com data pre-preenchida (hoje) e numero auto-incrementado
- Tags como chips coloridos
- Empty state: "Nenhuma sessao registrada. Comece agora."

## Criterios de aceite

- Registrar uma sessao em menos de 2 minutos
- Buscar uma informacao de sessao passada por palavra-chave
- Ver todas as sessoes em que um NPC apareceu
- Ver a timeline completa da campanha
