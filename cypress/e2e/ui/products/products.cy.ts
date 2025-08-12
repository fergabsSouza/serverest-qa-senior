import * as Users from '@services/userService'
import { makeRandomUser } from '@helpers/generateData'

describe('UI - Produtos: adicionar à lista e ir ao carrinho', () => {
  const creds = { email: '', password: '' }
  const created = { id: '' }

  before(() => {
    // seed do usuário (comum) via API
    const u = makeRandomUser(false)
    creds.email = u.email
    creds.password = u.password

    return Users.create(u).then((r) => {
      expect(r.status).to.eq(201)
      created.id = r.body._id
    })
  })

  after(() => {
    if (created.id) {
      return Users.remove(created.id).then((r) => {
        expect([200, 204, 404]).to.include(r.status)
      })
    }
  })

  it('adiciona produto à Lista de Compras e navega ao Carrinho', () => {
    // 1) Login via UI
    cy.uiLogin(creds.email, creds.password)

    // 2) Garante lista vazia para cenário determinístico
    cy.uiClearShoppingListIfAny()

    // 3) Volta à Home e adiciona o 1º produto da grade à lista
    cy.uiGoHome()
    cy.contains('button, [role="button"]', /adicionar a lista/i, { timeout: 20000 })
      .first()
      .scrollIntoView()
      .click({ force: true })

    // Alguns builds redirecionam automaticamente, outros não. Força abertura da lista:
    cy.uiOpenShoppingList()

    // 4) Valida que há pelo menos 1 item na lista e botões de quantidade
    cy.get('body').then(($b) => {
      const plusBtn = $b.find('button:contains("+")').first()
      const minusBtn = $b.find('button:contains("-")').first()

      // existe um card com controles de quantidade
      expect(plusBtn.length, 'botão + visível').to.be.greaterThan(0)
      expect(minusBtn.length, 'botão - visível').to.be.greaterThan(0)
    })

    // 5) Botões principais da página da lista
    cy.contains('button, [role="button"]', /adicionar no carrinho/i).should('be.visible')
    cy.contains('button, [role="button"]', /limpar lista/i).should('be.visible')

    // 6) Envia para o Carrinho e valida tela "Em construção"
    cy.contains('button, [role="button"]', /adicionar no carrinho/i)
      .click({ force: true })

    cy.location('pathname', { timeout: 15000 }).should('include', '/carrinho')
    cy.contains(/em construção aguarde/i, { timeout: 15000 }).should('be.visible')

    // 7) (Opcional) volta pra Home e faz logout para isolar próximos cenários
    cy.uiGoHome()
    cy.uiLogout()
  })
})
