describe('Test for GET', function() {
  beforeEach(() => {
    cy.server();
    cy.visit('/');
    //login process
    cy.get('[data-cy=login-username]').type('xXGamingMasterXx');
    cy.get('[data-cy=login-password]').type('P@ssword1111');
    cy.get('[data-cy=login-button]').click();
  })

  it('mock items get', function() {
      cy.server({ delay: 1000 });
      cy.route({
      method: 'GET',
      url: '/api/items',
      status: 200,
      response: 'fixture:items.json'
      });
  
      cy.visit('/');
      cy.get('[data-cy=itemCard]').should('have.length', 3);
  });

  it('on error should show error message', function() {
      cy.server();
      cy.route({
        method: 'GET',
        url: '/api/items',
        status: 500,
        response: 'ERROR'
      });
      cy.visit('/');
      cy.get('[data-cy=appError]').should('be.visible');
  });
    
});