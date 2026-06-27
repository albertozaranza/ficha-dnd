# NPC Database (V2)

## Objetivo

Registrar e consultar todos os NPCs encontrados na campanha.

## Problema

Jogadores esquecem:
- Nome de NPCs
- O que um NPC fez ou disse
- Quem pode ser aliado ou inimigo
- Onde foi visto pela ultima vez

## Solucao

Banco de dados pessoal de NPCs com status, historico e referencias cruzadas com sessoes.

## Features

### NPC Card
- Nome
- Retrato (opcional, upload)
- Raca
- Ocupacao
- Faccao (link para World Encyclopedia)
- Relacionamento com o personagem (texto livre)

### Status
Badge colorido, clicavel para ciclar:
- `aliado` — verde
- `neutro` — cinza
- `inimigo` — vermelho
- `morto` — preto
- `desaparecido` — amarelo
- `suspeito` — laranja

### Inteligencia
- Ultima localizacao conhecida
- Historico de encontros
- Segredos descobertos
- Observacoes

### Referencias cruzadas
- Sessoes em que apareceu
- Quests relacionadas
- Faccao

### Busca e filtros
- Busca por nome
- Filtro por status
- Filtro por faccao
- Ordenacao: nome / ultima aparicao / status

## UX

- Grid de cards (retrato + nome + status badge)
- Clicar no card abre painel lateral com detalhes
- Edicao inline em todos os campos
- "Novo NPC" abre modal minimo (nome obrigatorio, resto opcional)
- Empty state por status (ex: "Nenhum aliado registrado ainda")

## Criterios de aceite

- Criar NPC com nome, status e relacionamento em menos de 30 segundos
- Filtrar todos os NPCs de status "inimigo"
- Ver todas as sessoes em que um NPC apareceu
- Ver todos os NPCs de uma faccao especifica
