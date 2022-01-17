describe('test tabs component', () => {
  beforeEach(() => {
    cy.visit('/react/components/tabs');
  });

  it('add and remove tab', () => {
    cy.get('.tdesign-demo-item--tabs-custom').within(() => {
      cy.get('.t-tabs__add-btn').click();
      cy.wait(1000);
      cy.get('.t-tabs__nav-item').should('have.length', 3);

      cy.get('.remove-btn').first().click();
      cy.wait(1000);
      cy.get('.t-tabs__nav-item').should('have.length', 2);
    });
  });

  it('scroll tab', () => {
    cy.get('.tdesign-demo-item--tabs-combination').within(() => {
      cy.get('.t-tabs__btn--right').click();
      cy.wait(1000);
      cy.get('.t-tabs__btn--left').should('have.length', 1);

      cy.get('.t-tabs__btn--left').click();
      cy.wait(1000);
      cy.get('.t-tabs__btn--right').should('have.length', 1);
    });
  });
});
