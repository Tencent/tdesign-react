describe('test tag component', () => {
  beforeEach(() => {
    cy.visit('/react/components/tag');
  });
  it('default tag', () => {
    cy.get('.t-tag').should((elem) => {
      expect(elem).to.have.class('t-tag--default');
    });
  });
  it('tag theme', () => {
    cy.get('.t-tag--primary').should('exist');
    cy.get('.t-tag--warning').should('exist');
    cy.get('.t-tag--danger').should('exist');
    cy.get('.t-tag--success').should('exist');
  });
  it('tag variant', () => {
    cy.get('.t-tag--light').should('exist');
    cy.get('.t-tag--dark').should('exist');
    cy.get('.t-tag--outline').should('exist');
  });
  it('tag icon', () => {
    cy.get('.t-tag svg').should('exist');
  });
  it('tag closable', () => {
    cy.get('.t-tag .t-tag__icon-close').should('have.class', 't-icon-close');
  });
  it('tag checked', () => {
    cy.get('.t-tag--checked').first().click().should('have.class', 't-tag--check');
  });
  it('tag maxWidth', () => {
    cy.get('.t-tag.t-tag--ellipsis').should('have.css', 'max-width', '150px');
  });
  it('tag size', () => {
    cy.get('.t-tag--large').should('have.class', 't-size-l');
  });
  it('tag shape', () => {
    cy.get('.t-tag--round').first().should('have.css', 'border-radius', '12px');
  });
});
