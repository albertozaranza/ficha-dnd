# Combat Tracker (V3)

## Objetivo

Gerenciar combate em tempo real com rastreamento de iniciativa, recursos e historico.

## Problema

Durante combate, e dificil rastrear simultaneamente:
- Ordem de iniciativa
- HP de todos os participantes
- Spell slots e recursos usados
- Condicoes ativas
- O que aconteceu nas rodadas anteriores

## Solucao

Tracker de combate focado em velocidade de uso, acessivel com uma mao no celular.

## Features

### Setup de Combate
- Adicionar participantes: PC, aliados, inimigos
- Rolar iniciativa ou inserir manualmente
- Ordem automatica por iniciativa (decrescente)
- Vincular inimigos ao Bestiary

### Tracker de Turno
- Destaque visual no turno ativo
- Botao "Proximo Turno" (acao principal)
- Contador de rodadas
- Linha do tempo de turnos (mini-historico)

### Painel por Participante
- HP atual (input rapido)
- Condicoes ativas (badges)
- Recursos: spell slots, charges, usos de habilidade
- Botoes rapidos: dano rapido, cura rapida

### Historico de Combate
- Log de eventos (ataque, dano, critico, falha critica, death save)
- Estatisticas ao fim do combate:
  - Dano causado por participante
  - Dano recebido
  - Criticos
  - Rodadas

### Integracao com Bestiary
- Ao adicionar inimigo: auto-preenche AC e HP estimados do Bestiary
- Ao finalizar combate: opção de atualizar dados do Bestiary com o observado

## UX

- Tela dedicada: ocupa a view inteira durante combate
- Layout vertical: cada participante e uma linha/card compacto
- Turno ativo tem borda colorida e maior destaque
- "Encerrar Combate" abre modal com resumo e opção de salvar no Journal
- Uso possivel com uma mao no celular

## Criterios de aceite

- Setup de combate (3 inimigos) em menos de 1 minuto
- Navegar por turnos sem confusao
- Registrar HP, dano e condicoes de todos os participantes
- Ao fim, exportar resumo do combate para o Journal
