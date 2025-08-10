# ServeRest QA Sênior

Automação de testes para a aplicação [ServeRest](https://serverest.dev), desenvolvida como parte do desafio técnico para vaga de **QA Sênior**.

Este projeto cobre **testes de API** e **testes de Frontend (UI)** utilizando o **Cypress** com **TypeScript**, seguindo boas práticas de arquitetura, organização e manutenção.

---

## ✅ Pré-requisitos

- **Node.js LTS (>= 18)** e **npm**
- **Git**
- (Opcional) **VS Code** + extensão oficial do Cypress

---

## 📂 Estrutura de Pastas

```
serverest-qa-senior/
│
├── src/                            # Código de suporte reutilizável
│   ├── helpers/                    # Funções utilitárias (ex: geradores de dados, formatadores)
│   ├── services/                   # Serviços para chamadas de API
│   ├── types/                      # Tipos e interfaces do TypeScript
│   └── constants/                  # Constantes e variáveis globais
│
├── cypress/
│   ├── e2e/
│   │   ├── api/                     # Testes de API
│   │   ├── ui/                      # Testes de UI
│   │   └── common/                  # Testes comuns ou utilitários
│   │
│   ├── fixtures/                    # Massa de dados estática (JSONs)
│   ├── support/                     # Comandos customizados e hooks globais
│   └── config/                      # Configurações de ambiente
│
├── .github/workflows/               # Pipeline CI/CD
├── .gitignore
├── cypress.config.ts                # Configuração principal do Cypress
├── package.json                     # Dependências e scripts do projeto
├── README.md                        # Documentação do projeto
└── tsconfig.json                    # Configuração do TypeScript

```
---

## 🚀 Tecnologias Utilizadas
- [Cypress](https://www.cypress.io/) para automação de testes
- [TypeScript](https://www.typescriptlang.org/) para tipagem estática
- [GitHub Actions](https://github.com/features/actions) para integração contínua (CI/CD)

---

## 📌 Objetivo
O objetivo deste repositório é entregar uma automação completa para a aplicação **ServeRest**, cobrindo:
1. **Testes de API** — CRUD de usuários e produtos, cenários de sucesso e falha.
2. **Testes de UI** — Fluxo de login e compra de produto.
3. **Boas práticas de QA Sênior** — Arquitetura limpa, reuso de código, e execução em CI.

---

## 🔧 Setup do Projeto

```bash
# 1) Clonar
git clone https://github.com/<seu-usuario>/serverest-qa-senior.git
cd serverest-qa-senior

# 2) Instalar dependências
npm install

# 3) Verificar binário do Cypress
npx cypress verify

# 4) Checar tipagem TypeScript
npm run typecheck
```

## 🧪 Testes e Scripts

Scripts principais (via `npm run ...`):

- **Abrir GUI do Cypress**: `cy:open`  
- **Rodar toda a suíte (headless)**: `cy:run`  
- **Somente API**: `cy:api`  
- **Somente UI**: `cy:ui`  
- **Sanity/Healthcheck de UI**: `check:ui`  
- **Typecheck TS**: `typecheck` (usado também por `lint`/`pretest`)

Exemplos:
```bash
npm run cy:open
npm run cy:run
npm run cy:api
npm run cy:ui
npm run check:ui   # roda apenas cypress/e2e/common/healthcheck.cy.ts
```

### Healthcheck incluído
Spec: `cypress/e2e/common/healthcheck.cy.ts`  
- Verifica resposta **200/304** do `/login`
- Valida renderização de elementos-chave (título, inputs, botão `data-testid="entrar"`), com timeouts e retries seguros

---

## ⚙️ Detalhes de Configuração

- **TypeScript (`tsconfig.json`)**
  - `types: ["cypress", "node"]`
  - `include`: `cypress/**/*.ts`, `src/**/*.ts`, `cypress.config.ts`
  - Sem `typeRoots` (o TS resolve os tipos do Cypress via `node_modules/cypress/types`)
- **Cypress (`cypress.config.ts`)**
  - Import de módulos nativos com `import * as fs from "fs"; import * as path from "path";`
  - Carregamento opcional de `cypress/config/env.local.json`
  - `baseUrl` padrão: `https://front.serverest.dev`
  - `env.apiUrl` padrão: `https://serverest.dev`

---

## 🤖 CI (GitHub Actions)
Pipeline simples em `.github/workflows/ci.yml` executando Cypress em `ubuntu-latest`.  
(opcional) Você pode adicionar um job de **sanity** chamando `npm run check:ui` antes da suíte completa.

---

## 🩺 Troubleshooting
- **Types do Cypress/Node não encontrados**:  
  `npm install`, selecione **TypeScript: Use Workspace Version** no VS Code e rode `npm run typecheck`.
- **Timeout para carregar a UI**:  
  Use `npm run check:ui` (spec com timeouts/retries específicos) ou ajuste `pageLoadTimeout`/`defaultCommandTimeout` conforme necessário.
---