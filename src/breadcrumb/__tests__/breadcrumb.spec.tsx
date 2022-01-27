describe('breadcrumb', () => {
  beforeEach(() => {
    cy.visit('/react/components/breadcrumb');
  });

  it('base', () => {
    cy.get('.t-breadcrumb').should('exist');
  });

  it('icon', () => {
    cy.get('.t-icon').should('exist');
  });

  it('custom', () => {
    cy.get('.t-breadcrumb__separator').should('exist');
  });
});
