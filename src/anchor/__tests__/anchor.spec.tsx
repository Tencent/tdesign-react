describe('anchor', () => {
  beforeEach(() => {
    cy.visit('/react/components/anchor');
  });

  it('base', () => {
    cy.get('.t-anchor>.t-anchor__item').should('exist');
  });

  it('container', () => {
    cy.get('#anchor-container').should('exist');
  });

  it('cursor', () => {
    cy.get('.t-anchor__line-cursor-wrapper').should('exist');
  });

  it('large', () => {
    cy.get('.t-size-l').should('exist');
  });

  it('small', () => {
    cy.get('.t-size-s').should('exist');
  });

  it('multiple', () => {
    cy.get('.t-anchor__item>.t-anchor__item').should('exist');
  });

  it('target', () => {
    cy.get('.t-anchor__target').should('exist');
  });
});
