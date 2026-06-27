# Character Hub (V1)

## Objetivo

Substituir completamente a ficha fisica de D&D 5e.

## Status

**Implementado** em JS puro. Funcional para o personagem Skritch Cauda-de-Ferro.

## Features implementadas

### Overview
- [x] Avatar / portrait upload
- [x] Nome, classe, subclasse, nivel, background, alinhamento, XP
- [x] Barra de XP
- [x] Atributos (STR DEX CON INT WIS CHA) com modificadores
- [x] CA, HP (cur/max), Iniciativa, Deslocamento, Dados de Vida
- [x] Inspiracao (toggle)
- [x] Percepcao Passiva calculada
- [x] Tracos, Ideais, Ligacoes, Defeitos

### Combat
- [x] HP atual / maximo / temporario com barra de progresso
- [x] Acoes rapidas (+ Curar / - Dano)
- [x] CA, Iniciativa, Deslocamento, Dados de Vida
- [x] Testes contra a Morte (pips)
- [x] Lista de ataques (nome, bonus, dano, tipo)
- [x] Notas de ataque
- [ ] Condicoes ativas (Envenenado, Amedrontado, etc.)

### Skills
- [x] Pericias com proficiencia e expertise (ciclo ao clicar)
- [x] Busca em tempo real
- [x] Testes de Resistencia
- [x] Idiomas e proficiencias

### Equipment
- [x] Inventario (adicionar, remover, marcar equipado)
- [x] Moedas (PC, PP, PE, PO, PL)

### Features
- [x] Traits, feats, caracteristicas raciais, habilidades de classe
- [x] Adicionar / remover features

### Spellbook
- [x] Classe, habilidade, CD e bonus de ataque
- [x] Truques (cantrips)
- [x] Magias por nivel (slots usados/total, lista por nivel)

### Character
- [x] Retrato grande
- [x] Aparencia fisica (idade, altura, peso, olhos, pele, cabelos)
- [x] Historia do personagem
- [x] Aliados e organizacoes
- [x] Tesouro

### Notes
- [x] Editor de texto livre com auto-save

### Global
- [x] Dark mode / light mode toggle
- [x] Export JSON
- [x] Import JSON
- [x] Auto-save LocalStorage
- [x] Reset personagem
- [ ] PWA manifest
- [ ] Atalhos de teclado

## Pendente (finalizar antes de V2)

- [ ] Condicoes no Combat Dashboard
- [ ] Migrar para TypeScript + Vite
- [ ] PWA manifest + service worker
- [ ] Refatorar data model para Campaign container

## Criterios de aceite

- Nenhuma informacao da ficha fisica precisa de papel
- Funciona offline
- Auto-save em todas as edicoes
