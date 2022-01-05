describe('test tag component', () => {
  beforeEach(() => {
    cy.visit('/react/components/tag');
  });
  it('default tag', () => {
    cy.get('.t-tag').should((elem) => {
      expect(elem).to.have.class('t-tag--default');
    });
  });
});
