describe('test steps component', () => {
  beforeEach(() => {
    cy.visit('/react/components/steps');
  });

  it('render steps', () => {
    cy.get('.tdesign-demo-item--steps-status').within(() => {
      cy.get('.t-steps-item--error').should('have.length', 1);
    });
  });
});
