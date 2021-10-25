describe('test the login process', function() {
    it('test if addItems is hidden before and shown after login', function(){
      cy.server();
      cy.visit('/');
      cy.get('[data-cy=addItems]').should('not.exist');

      cy.get('[data-cy=login-username]').type('xXGamingMasterXx');
      cy.get('[data-cy=login-password]').type('P@ssword1111');
      cy.get('[data-cy=login-button]').click();
      cy.get('[data-cy=addItems]').should('be.visible');
    });
});