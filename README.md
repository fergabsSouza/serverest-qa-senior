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
A instalação e execução do projeto serão documentadas assim que os testes forem implementados.

