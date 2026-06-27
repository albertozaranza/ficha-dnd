# Analytics (V6)

## Objetivo

Gamificar a campanha com estatisticas do personagem e da aventura.

## Problema

O jogador nao tem visibilidade de:
- Quanto dano causou/recebeu no total
- Quantas magias lancou e de que nivel
- Quantas quests concluiu
- Quanto ouro ganhou e gastou

## Solucao

Dashboard de estatisticas derivadas dos dados ja registrados na Campaign.

## Importante

Nenhum dado e inserido manualmente no Analytics. Tudo e calculado automaticamente a partir de:
- Combat Tracker (historico de combates)
- Journal (sessoes, XP, ouro)
- Quest Tracker (status das quests)
- NPC Database (quantidades por status)
- Bestiary (inimigos enfrentados)

## Features

### Personagem

- Dano total causado (por sessao, por tipo de ataque)
- Dano total recebido
- Curas recebidas
- Magias lancadas (por nivel, por escola)
- Criticos (quantidade e %)
- Falhas criticas (quantidade e %)
- Morte evitadas (testes contra a morte superados)
- Condicoes sofridas mais frequentes

### Campanha

- Total de sessoes jogadas
- Duracao media de sessao (calculado por data)
- Quests concluidas / em andamento / falhadas
- NPCs conhecidos (total, por status)
- Inimigos derrotados (total, por tipo)
- Locais visitados

### Economia

- Ouro total ganho (soma de sessoes)
- Ouro total gasto (manual ou por itens adquiridos)
- Saldo atual
- Itens adquiridos

### Linha do tempo de progressao

- Grafico de nivel por sessao
- Grafico de XP acumulado
- Marcos: level ups, quests principais concluidas

## UX

- Dashboard com cards de estatisticas numericas
- Graficos simples (barras horizontais, linhas)
- Filtros por: sessao / periodo / tipo
- Secoes: Personagem / Campanha / Economia / Progressao
- Cada estatistica tem tooltip explicando de onde vem

## Criterios de aceite

- Todas as metricas sao calculadas automaticamente, sem entrada manual
- Dashboard carrega em menos de 500ms
- Grafico de progressao de nivel visivel desde a sessao 1
