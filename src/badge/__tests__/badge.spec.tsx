describe('badge', () => {
  beforeEach(() => {
    cy.visit('/react/components/badge');
  });

  it('base', () => {
    cy.get('.t-badge>span').first().should('have.class', 't-badge--dot');
  });

  it('color', () => {
    cy.get('.t-badge>span').first().should('have.css', 'background-color', 'rgb(227, 77, 89)');
  });

  it('shape', () => {
    cy.get('.t-badge .t-badge--circle').should('have.css', 'border-radius', '10px');
    cy.get('.t-badge .t-badge--round').should('have.css', 'border-radius', '3px');
  });

  it('size', () => {
    cy.get('.t-badge .t-size-s').should('have.css', 'padding-left', '4px');
    cy.get('.t-badge .t-size-s').should('have.css', 'padding-right', '4px');
  });

  it('offset', () => {
    cy.get('.t-badge .t-badge--circle').last().should('have.css', 'right', '10px');
    cy.get('.t-badge .t-badge--circle').last().should('have.css', 'margin-top', '-10px');
  });
});
