describe('test tabs component', () => {
  beforeEach(() => {
    cy.visit('/react/components/input-number');
  });

  it('increase and decrease input-number', () => {
    cy.get('.tdesign-demo-item--input-number-center').within(() => {
      cy.get('.t-input-number__decrease').click();
      cy.wait(1000);
      cy.get('.t-input__inner').should('have.value', 0);

      cy.get('.t-input-number__increase').first().click();
      cy.wait(1000);
      cy.get('.t-input__inner').should('have.value', 1);
    });
  });
});
