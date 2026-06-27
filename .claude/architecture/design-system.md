# Design System

## Paleta (dark mode first)

```
Background:   #0f1117  (base)  /  #1a1d27  (surface)  /  #242838  (elevated)
Border:       #2d3148  (default)  /  #3d4266  (focus)
Text:         #e8eaf6  (primary)  /  #9ea3c0  (muted)  /  #5c6080  (disabled)
Accent:       #7c6af7  (purple — primary)  /  #a78bfa  (hover)
Success:      #22c55e
Warning:      #f59e0b
Danger:       #ef4444
HP bar:       #22c55e → #f59e0b → #ef4444  (por %%)
```

## Tipografia

```
Display:  Cinzel 700  — títulos de seção, nomes de módulo
Body:     Inter 400/500/600
Mono:     system-ui mono — valores numéricos (bônus, dano)
```

## Espaçamento

```
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64
```

## Border radius

```
8  — inputs, badges
12 — cards pequenos
16 — cards grandes, modais
20 — painéis/sidebar
```

## Componentes

| Componente   | Uso                                          |
|-------------|----------------------------------------------|
| Card        | Container de informação agrupada             |
| StatCard    | Valor numérico + label (atributos, HP, AC)   |
| SkillRow    | Linha de perícia com proficiency indicator   |
| SpellCard   | Magia com nível, componentes, concentração   |
| NPCCard     | NPC com status badge e facção                |
| QuestCard   | Quest com status, prioridade, progresso      |
| MonsterCard | Criatura com confiança bars                  |
| SessionCard | Sessão com data, número, tags                |
| Timeline    | Lista cronológica de eventos/sessões         |
| Badge       | Status tag colorido (NPC status, quest type) |
| Modal       | Formulário focado, máx 480px de largura      |
| EmptyState  | Placeholder quando lista estiver vazia       |

## Padrões de interação

- **Inline editing**: clicar no valor para editar, Enter/blur para salvar
- **Add button**: sempre `+ Adicionar` no header da seção
- **Search**: `input[type=search]` no header, filtro em tempo real
- **Status badges**: color-coded, clicáveis para ciclar entre estados
- **Confidence bars**: barras horizontais finas com % numérico
- **Empty state**: ilustração + texto + CTA quando não há dados
