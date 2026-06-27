# World Encyclopedia (V4)

## Objetivo

Wiki viva da campanha — registrar o que o personagem sabe sobre o mundo.

## Problema

O conhecimento do mundo fica disperso entre anotacoes, PDFs e memoria:
- Locais visitados sem registro
- Faccoes com relacionamentos indefinidos
- Historico do mundo nao documentado
- Artefatos com origem desconhecida

## Solucao

Quatro secoes interligadas: Locais, Faccoes, Eventos, Artefatos.

## Features

### Locais
Tipos: cidade / vila / castelo / dungeon / regiao / outro

Por local:
- Nome, tipo, descricao
- NPCs que estao/estiveram la
- Quests relacionadas
- Eventos historicos
- Notas livres
- Sessoes em que foi visitado

Vista: grid de cards + mapa (futuro)

### Faccoes
Tipos: guilda / culto / organizacao / reino

Por faccao:
- Nome, tipo, descricao
- Objetivos
- Membros conhecidos (link NPCs)
- Relacionamento com o personagem (aliado / neutro / inimigo / desconhecido)
- Notas

Vista: lista com relationship badge

### Eventos Historicos
- Nome do evento
- Data no calendario da campanha
- Descricao
- NPCs e Locais envolvidos
- Impacto atual

Vista: timeline

### Artefatos
Tipos: item magico / reliquia / objeto chave

Por artefato:
- Nome, tipo, descricao
- Localizacao atual
- Historico de posse
- Sessoes relacionadas
- Notas

Vista: galeria de cards

## UX

- Navegacao por tabs: Locais / Faccoes / Eventos / Artefatos
- Busca global dentro da Encyclopedia
- Tags para conectar entidades entre secoes
- Cada entrada tem botao "Ver sessoes relacionadas"
- Empty state por secao com call-to-action contextual

## Criterios de aceite

- Registrar um local com suas conexoes em menos de 1 minuto
- Ver todos os NPCs de uma faccao
- Ver todos os locais visitados em uma sessao especifica
- Encontrar um artefato por busca de nome
