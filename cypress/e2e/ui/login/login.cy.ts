import * as Users from '@services/userService'
import { makeRandomUser } from '@helpers/generateData'

describe('UI - Usuário: login pela tela usando seed via API', () => {
  const creds = { email: '', password: '' }
  let createdId = ''

  before(() => {
    const u = makeRandomUser(false) 
    creds.email = u.email
    creds.password = u.password

    return Users.create(u).then((r) => {
      expect(r.status).to.eq(201)
      createdId = r.body._id
    })
  })

  after(() => {
    
    if (createdId) {
      return Users.remove(createdId).then((r) => {
        expect([200, 204, 404]).to.include(r.status)
      })
    }
  })

  it('login com sucesso via UI (valida elementos estáveis do header)', () => {
    cy.uiLogin(creds.email, creds.password)

    cy.location('pathname', { timeout: 20_000 }).should('include', '/home')

    cy.contains('h1, h2, [data-testid*=title], [class*=font]', 'Serverest Store', {
      matchCase: false,
      timeout: 10_000,
    }).should('be.visible')

    cy.contains('a, [role="link"]', /^Home$/i).should('be.visible')
    cy.contains('a, [role="link"]', /Lista de Compras/i).should('be.visible')
    cy.contains('a, [role="link"]', /Carrinho/i).should('be.visible')

    cy.contains('button, [role="button"], [data-testid="logout"]', /logout|sair/i).should('be.visible')
  })

  it('senha inválida mostra erro e permanece na tela de login', () => {
    cy.visit('/login')

    cy.get('[data-testid="email"], input[type="email"], input[name="email"]')
      .first()
      .clear()
      .type(creds.email)

    cy.get('[data-testid="senha"], [data-testid="password"], input[type="password"], input[name="password"]')
      .first()
      .clear()
      .type('senha_errada', { log: false })

    cy.get('[data-testid="entrar"], button[type=submit]').first().click({ force: true })

    cy.location('pathname', { timeout: 20_000 }).should('include', '/login')

    cy.get('body').then(($b) => {
      if ($b.find('[role="alert"], .toast, .alert').length) {
        cy.get('[role="alert"], .toast, .alert')
          .contains(/inv[aá]lido|credenciais|senha/i)
          .should('be.visible')
      } else {
        cy.contains(/inv[aá]lido|credenciais|senha/i).should('be.visible')
      }
    })
  })
})
