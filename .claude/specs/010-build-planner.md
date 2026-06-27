# Build Planner (V7)

## Objetivo

Planejamento estrategico de progressao do personagem.

## Problema

Jogadores tomam decisoes de build sem visibilidade das consequencias:
- Nao sabem se vale a pena multiclassear
- Nao comparam feats vs ASI
- Nao projetam DPR em niveis futuros
- Nao simulam mudancas de spell slots em multiclasse

## Solucao

Planner de niveis futuros com simulacoes de DPR, AC e recursos.

## Features

### Progressao

- Nivel atual (automatico do Character Hub)
- Planejamento de niveis 1-20
- Por nivel: classe (para multiclasse), feat ou ASI, subclasse

### Multiclasse

- Adicionar segunda (ou terceira) classe
- Visualizar requisitos de atributo para multiclasse
- Calcular spell slots combinados (tabela oficial)
- Alertar sobre perda de progressao de subclasse

### Feats vs ASI

- Por nivel que da ASI: escolher entre ASI ou feat
- Para ASI: qual atributo aumentar, com preview do novo modificador
- Para feat: campo de nome + descricao + efeito estimado no DPR/AC

### Simulacoes

**DPR (Damage Per Round)**
- Ataque: arma / bonus / dado de dano / ataques extras / modificadores
- Spell: dado de dano / nivel / frequencia
- Grafico de DPR por nivel

**AC**
- Armadura + escudo + magias + habilidades
- AC calculada por nivel

**Spell Slots**
- Tabela de slots por nivel (uniclasse e multiclasse)

**Saving Throw DCs**
- Por nivel projetado

### Comparacao de builds

- Salvar ate 3 versoes de build
- Comparar DPR entre versoes no mesmo nivel

## UX

- Layout de duas colunas: nivel timeline (esquerda) + painel de detalhes (direita)
- Cada nivel e uma linha clicavel
- Preview de DPR como mini-grafico no topo
- Tooltips com regras relevantes (ex: requisito de multiclasse)
- Botao "Aplicar ao personagem" para confirmar nivel ao subir

## Criterios de aceite

- Planejar os proximos 5 niveis em menos de 5 minutos
- Ver DPR projetado ao nivel 10 com a build atual
- Comparar DPR de feat vs ASI no proximo nivel
- Calcular spell slots de uma multiclasse Ladino/Mago
