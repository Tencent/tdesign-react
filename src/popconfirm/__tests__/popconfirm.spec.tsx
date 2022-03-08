describe('test popconfirm component', () => {
  beforeEach(() => {
    cy.visit('/react/components/popconfirm');
  });

  it('default popconfirm', () => {
    cy.get('.tdesign-demo-block-row').within(() => {
      cy.get('.t-button').first().click().should('have:css', 't-popconfirm__content');
    });
  });
});
