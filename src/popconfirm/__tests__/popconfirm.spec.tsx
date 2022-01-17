describe('test popconfirm component', () => {
  beforeEach(() => {
    cy.visit('/react/components/popconfirm');
  });
  it('default popconfirm', () => {
    cy.get('.t-popup__content').should((elem) => {
      expect(elem).to.have.class('t-popconfirm');
    });
  });
});
