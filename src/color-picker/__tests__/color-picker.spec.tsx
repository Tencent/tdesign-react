describe('test color-picker component', () => {
  beforeEach(() => {
    cy.visit('/react/components/color-picker');
  });

  it('render color-picker', () => {
    cy.get('.t-color-picker__panel')
      .first()
      .within(() => {
        cy.get('.t-icon-add').should('have.length', 1);
        cy.get('.t-icon-add').click();
        cy.get('.t-icon-delete').should('have.length', 1);
      });
  });
});
