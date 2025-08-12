describe('healthcheck (login)', () => {
  before(() => {
    Cypress.config('pageLoadTimeout', 60000)
    Cypress.config('defaultCommandTimeout', 10000)
  })

  it('deve responder 200 no /login (sem render)', () => {
    cy.request({
      url: `${Cypress.config('baseUrl')}/login`,
      failOnStatusCode: false
    }).its('status').should('be.oneOf', [200, 304])
  })

  it('deve renderizar a página de login e elementos principais', { retries: 2 }, () => {
    cy.visit('/login', { failOnStatusCode: false })

    cy.get('.login-page.container', { timeout: 20000 }).should('be.visible')

    cy.contains('h1.font-robot', 'Login', { timeout: 20000 }).should('be.visible')

    cy.get('input[placeholder="Digite seu email"]').should('be.visible')
    cy.get('input[placeholder="Digite sua senha"]').should('be.visible')

    cy.get('[data-testid="entrar"]')
      .should('be.visible')
      .and('contain', 'Entrar')
      .and('not.be.disabled')
  })
})
