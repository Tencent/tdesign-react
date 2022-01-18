describe('list', () => {
  beforeEach(() => {
    cy.visit('/react/components/list');
  });

  it('base', () => {
    cy.get('.t-list>.t-list__inner>.t-list-item').should('exist');
  });

  it('multiline', () => {
    cy.get('.t-list .t-list-item__meta')
      .first()
      .get('.t-list-item__meta-content>.t-list-item__meta-title')
      .should('exist');

    cy.get('.t-list .t-list-item__meta')
      .first()
      .get('.t-list-item__meta-content>.t-list-item__meta-description')
      .should('exist');
  });

  it('image', () => {
    cy.get('.t-list .t-list-item__meta-avatar')
      .first()
      .get('img')
      .should((elem) => {
        expect(elem).to.have.attr('src');
      });
  });

  it('operation', () => {
    cy.get('.t-list .t-list-item__action')
      .first()
      .get('li a')
      .should((elem) => {
        expect(elem).to.have.attr('href');
      });
  });

  it('size', () => {
    cy.get('.t-size-s').should('exist');

    cy.get('.t-size-l').should('exist');
  });

  it('stripe', () => {
    cy.get('.t-list--stripe .t-list-item:nth-child(2)').should('have.css', 'background-color', 'rgb(243, 243, 243)');
  });

  it('load', () => {
    cy.get('.t-radio-group .t-radio-button')
      .first()
      .click()
      .then(() => {
        cy.get('.t-list .t-list__load--load-more').should('exist');
      });
  });

  it('header', () => {
    cy.get('.t-list__header').should('exist');
  });

  it('footer', () => {
    cy.get('.t-list__footer').should('exist');
  });

  it('scroll', () => {
    cy.get('.t-list').last().scrollTo('bottom').get('.t-list-item').last().should('be.visible');
  });
});
