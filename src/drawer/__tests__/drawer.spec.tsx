describe('test drawer component', () => {
  beforeEach(() => {
    cy.visit('/react/components/drawer');
  });
  it('default drawer', () => {
    cy.get('.t-drawer').should('exist');
  });

  it('drawer open', () => {
    cy.get('#可查看的抽屉').scrollIntoView();
    cy.get('.t-drawer--open').should('not.exist');
    cy.get('#可查看的抽屉').next().next().find('.t-button--theme-primary').first().click();
    cy.get('.t-drawer--open').should('exist');
  });

  it('drawer mode', () => {
    cy.get('#弹出模式抽屉').scrollIntoView();
    cy.get('#弹出模式抽屉').next().next().find('.t-button--theme-primary').first().click();
    cy.get('body').should('have.css', 'margin', '0px 0px 0px -300px');
  });
});
