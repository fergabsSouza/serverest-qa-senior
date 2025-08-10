describe('healthcheck', () => {
  it('abre a home do front', () => {
    cy.visit('https://front.serverest.dev');
    cy.contains('ServeRest').should('be.visible');
  });
});