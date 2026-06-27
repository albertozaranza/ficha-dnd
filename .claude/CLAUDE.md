# D&D Second Brain — Regras Globais

## O que é este projeto

Um sistema pessoal de gerenciamento de campanha para D&D 5e. A ficha do personagem é apenas o ponto de entrada. O objetivo final é uma memória viva da campanha.

## Estrutura de arquivos

```
.claude/
├── architecture/   — decisões técnicas e de design (não mudar sem entender)
├── specs/          — especificação de cada módulo (ler antes de implementar)
└── tasks/          — sprint atual e backlog
```

## Regras

1. Ler a spec do módulo antes de implementar qualquer feature.
2. Atualizar `data-model.md` ao adicionar qualquer nova entidade.
3. Seguir os princípios em `ux-principles.md` sem exceção.
4. Seguir o processo: entender → arquitetura → wireframe → implementar → validar UX.
5. Não usar `any` em TypeScript.
6. Não criar formulários gigantes — preferir cards, inline editing, modais focados.
7. Auto-save em tudo que for texto livre (debounce 1s).
8. IDs: `crypto.randomUUID()`.
9. Datas: sempre ISO 8601.
