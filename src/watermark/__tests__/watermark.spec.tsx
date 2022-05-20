describe('badge', () => {
  beforeEach(() => {
    cy.visit('/react/components/watermark');
  });

  it('base', () => {
    cy.get('.tdesign-demo-item__body>div>div').first().should('have.class', 't-watermark');
  });
});
