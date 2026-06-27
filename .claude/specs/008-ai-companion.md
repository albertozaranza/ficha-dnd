# AI Companion (V5)

## Objetivo

Conselheiro pessoal do personagem com acesso ao contexto completo da campanha.

## Problema

O jogador acumula informacao durante a campanha mas nao consegue sintetizar:
- Nao sabe o que o personagem faria em uma situacao
- Esquece pistas investigadas
- Nao ve conexoes entre eventos e NPCs
- Tem dificuldade em tomar decisoes estrategicas de combate

## Solucao

Um assistente com contexto completo da campanha que responde perguntas no ponto de vista do personagem.

## Features

### Personality Engine

Registrar a personalidade do personagem:
- Tracos de personalidade
- Medos e fobias
- Objetivos de curto e longo prazo
- Crencas e valores
- Traumas
- Relacionamentos importantes

### Context Engine

O que e injetado automaticamente no contexto da IA:
- Toda a `Campaign`: sessoes, NPCs, quests, locais, combates
- Character: atributos, features, historico
- Personalidade registrada acima
- Sessao mais recente (prioridade)

### Interface de Chat

Campo de pergunta livre com respostas da IA em balao de dialogo.

Exemplos de perguntas pre-definidas (quick actions):
- O que meu personagem faria nesta situacao?
- O que nos esquecemos de investigar?
- Quem pode estar mentindo para nos?
- Quais pistas ainda nao investigamos?
- O que aprendemos sobre este inimigo? [campo para nome]
- Quais opcoes estrategicas temos no proximo combate?
- Qual NPC pode nos ajudar com [problema]?

### Historico de conversa

- Salvar conversas por sessao
- Marcar respostas como favoritas
- Exportar insights como nota no Journal

## Stack (V5)

- Claude API (claude-sonnet-4-6 ou equivalente disponivel)
- Context window: serializar Campaign completa como JSON no system prompt
- Streaming de resposta
- API key configurada pelo usuario nas settings

## UX

- Painel lateral ou tela dedicada
- Campo de texto com envio por Enter ou botao
- Quick actions como chips clicaveis
- Respostas em markdown renderizado
- Indicador de "pensando..." durante streaming

## Criterios de aceite

- Responder em menos de 10 segundos
- Resposta coerente com a personalidade registrada
- Resposta coerente com o historico da campanha
- Nao inventar fatos que nao estao na Campaign
