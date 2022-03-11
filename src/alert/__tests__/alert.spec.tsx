describe('test alert component', () => {
  beforeEach(() => {
    cy.visit('/react/components/alert');
  });

  it('render alert', () => {
    cy.get('.tdesign-demo-item--alert-operation').within(() => {
      cy.get('.t-alert--success .t-icon-check-circle-filled').should('have.length', 1);
    });
  });
});
