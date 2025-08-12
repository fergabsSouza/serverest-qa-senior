import * as Users from '@services/userService'
import { makeRandomUser } from '@helpers/generateData'

describe('UI - Produtos: adicionar à lista e ir ao carrinho', () => {
  const creds = { email: '', password: '' }
  const created = { id: '' }

  before(() => {
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
    cy.uiLogin(creds.email, creds.password)

    cy.uiClearShoppingListIfAny()

    cy.uiGoHome()
    cy.contains('button, [role="button"]', /adicionar a lista/i, { timeout: 20000 })
      .first()
      .scrollIntoView()
      .click({ force: true })

    cy.uiOpenShoppingList()

    cy.get('body').then(($b) => {
      const plusBtn = $b.find('button:contains("+")').first()
      const minusBtn = $b.find('button:contains("-")').first()

      expect(plusBtn.length, 'botão + visível').to.be.greaterThan(0)
      expect(minusBtn.length, 'botão - visível').to.be.greaterThan(0)
    })

    cy.contains('button, [role="button"]', /adicionar no carrinho/i).should('be.visible')
    cy.contains('button, [role="button"]', /limpar lista/i).should('be.visible')

    cy.contains('button, [role="button"]', /adicionar no carrinho/i)
      .click({ force: true })

    cy.location('pathname', { timeout: 15000 }).should('include', '/carrinho')
    cy.contains(/em construção aguarde/i, { timeout: 15000 }).should('be.visible')

    cy.uiGoHome()
    cy.uiLogout()
  })
})
