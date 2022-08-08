describe('test affix component', () => {
  beforeEach(() => {
    cy.visit('/react/components/affix');
    cy.wait(2000);
  });
  it('default affix', () => {
    cy.scrollTo(0, 500);
    cy.get('.t-affix').should('exist');
  });

  it('offsetTop affix not scrolled', () => {
    cy.scrollTo(0, 500);
    cy.get('.tdesign-demo-item__body').eq(1).get('.t-affix').should('exist');
  });
  it('offsetTop affix scrolled', () => {
    cy.scrollTo(0, 500);
    cy.get('.tdesign-demo-item__body').eq(1).children().first().children().first().scrollTo(0, 300);
    cy.get('.tdesign-demo-item__body').eq(1).get('.t-affix').should('have.css', 'top');
  });
});
