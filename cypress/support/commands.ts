/// <reference types="cypress" />
import type { User } from '../../src/types/user'
import type { Product } from '../../src/types/products'

const API = Cypress.env('apiUrl') || 'https://serverest.dev'
const authHeader = (token: string) => ({ Authorization: token })

// ============ AUTH ============
Cypress.Commands.add('apiLogin', (email: string, password: string) => {
  return cy
    .request({
      method: 'POST',
      url: `${API}/login`,
      body: { email, password },
      failOnStatusCode: false,
    })
    .then((res) => res.body?.authorization as string) 
})

// ============ USERS ============
Cypress.Commands.add('apiCreateUser', (user: User) => {
  return cy.request({
    method: 'POST',
    url: `${API}/usuarios`,
    body: user,
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('apiGetUserById', (_id: string) => {
  return cy.request({
    method: 'GET',
    url: `${API}/usuarios/${_id}`,
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('apiUpdateUser', (_id: string, user: User) => {
  return cy.request({
    method: 'PUT',
    url: `${API}/usuarios/${_id}`,
    body: user,
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('apiDeleteUser', (_id: string) => {
  return cy.request({
    method: 'DELETE',
    url: `${API}/usuarios/${_id}`,
    failOnStatusCode: false,
  })
})

// ============ PRODUCTS ============
Cypress.Commands.add('apiCreateProduct', (product: Product, token: string) => {
  return cy.request({
    method: 'POST',
    url: `${API}/produtos`,
    headers: authHeader(token),
    body: product,
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('apiGetProductById', (_id: string) => {
  return cy.request({
    method: 'GET',
    url: `${API}/produtos/${_id}`,
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('apiUpdateProduct', (_id: string, product: Product, token: string) => {
  return cy.request({
    method: 'PUT',
    url: `${API}/produtos/${_id}`,
    headers: authHeader(token),
    body: product,
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('apiDeleteProduct', (_id: string, token: string) => {
  return cy.request({
    method: 'DELETE',
    url: `${API}/produtos/${_id}`,
    headers: authHeader(token),
    failOnStatusCode: false,
  })
})

// ============ UI ============
Cypress.Commands.add('uiLogin', (email: string, password: string) => {
  const API = Cypress.env('apiUrl') || 'https://serverest.dev'
  cy.intercept('POST', `${API}/login`).as('apiLogin')

  cy.visit('/login')

  cy.get('body').then(($b) => {
    const emailSel = '[data-testid="email"], input[type="email"], input[name="email"]'
    const passSel  = '[data-testid="senha"], [data-testid="password"], input[type="password"], input[name="password"]'
    const btnSel   = '[data-testid="entrar"], button[type="submit"]'

    if ($b.find(emailSel).length) cy.get(emailSel).first().clear().type(email)
    else cy.contains('label, span', /email|e-mail/i).closest('form,div').find('input').first().clear().type(email)

    if ($b.find(passSel).length) cy.get(passSel).first().clear().type(password, { log: false })
    else cy.get('input[type="password"]').first().clear().type(password, { log: false })

    if ($b.find(btnSel).length) cy.get(btnSel).first().click({ force: true })
    else cy.contains('button, [role="button"]', /entrar|login/i).click({ force: true })
  })

  cy.wait('@apiLogin').its('response.statusCode').should('eq', 200)
  cy.location('pathname', { timeout: 20_000 }).should('not.include', '/login')
})

Cypress.Commands.add('uiAssertLoggedIn', () => {
  cy.location('pathname', { timeout: 20_000 }).should('not.include', '/login')
  cy.get('body', { timeout: 10_000 }).then(($b) => {
    const selectors = [
      '[data-testid="sair"]',
      '[data-testid="logout"]',
      'a[href*="produt"]',
      'a[href*="carrinh"]',
    ]
    const found = selectors.some((s) => $b.find(s).length > 0)
    if (!found) {
      cy.contains(/sair|logout|produt|carrinh/i).should('be.visible')
    }
  })
})

Cypress.Commands.add('uiLogout', () => {
  cy.get('body').then(($b) => {
    const btnSel = '[data-testid="sair"], [data-testid="logout"]'
    if ($b.find(btnSel).length) {
      cy.get(btnSel).first().click({ force: true })
    } else {
      cy.contains('button, a, [role="button"]', /sair|logout/i).click({ force: true })
    }
  })

  cy.location('pathname', { timeout: 20_000 }).should('include', '/login')
})

Cypress.Commands.add('uiGoHome', () => {
  cy.get('body').then(($b) => {
    const link = $b.find('a:contains("Home"), a:contains("Página Inicial"), [href*="/home"]').first()
    if (link.length) {
      cy.wrap(link).click({ force: true })
    } else {
      cy.visit('/home')
    }
  })

  cy.contains('h1,h2', /serverest store/i, { timeout: 15000 }).should('be.visible')
})

Cypress.Commands.add('uiOpenShoppingList', () => {
  cy.get('body').then(($b) => {
    const link = $b.find('a:contains("Lista de Compras"), [href*="minhaLista"]').first()
    if (link.length) cy.wrap(link).click({ force: true })
  })

  cy.location('pathname', { timeout: 15000 }).should('include', '/minhaLista')
  cy.contains('h1,h2', /lista de compras/i).should('be.visible')
})

Cypress.Commands.add('uiClearShoppingListIfAny', () => {
  cy.uiOpenShoppingList()
  cy.get('body').then(($b) => {
    const hasCard = $b.find('button:contains("+"), button:contains("-")').length > 0
    if (hasCard) {
      const btn = $b.find('button:contains("Limpar Lista")').first()
      if (btn.length) cy.wrap(btn).click({ force: true })
    }
  })
})

