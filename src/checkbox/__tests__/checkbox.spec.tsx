describe('checkbox', () => {
  beforeEach(() => {
    cy.visit('/react/components/checkbox');
  });

  it('base', () => {
    cy.get('.t-checkbox').first().should('exist');
    cy.get('.t-checkbox').first().find('input[type="checkbox"]').should('exist');
    cy.get('.t-checkbox').first().click().should('has.class', 't-is-checked');
    cy.get('.t-is-disabled')
      .first()
      .find('input')
      .should((elem) => {
        expect(elem).to.have.attr('disabled');
      });
  });

  it('group', () => {
    cy.get('.t-checkbox-group').first().find('.t-checkbox:nth-child(4)').click().should('has.class', 't-is-checked');
  });

  it('max', () => {
    cy.get('.tdesign-demo-item__body')
      .last()
      .find('.t-checkbox-group')
      .find('label')
      .first()
      .should('has.class', 't-is-checked');
    cy.get('.tdesign-demo-item__body')
      .last()
      .find('.t-checkbox-group')
      .find('label:nth-child(2)')
      .should('has.class', 't-is-disabled');
  });
});
