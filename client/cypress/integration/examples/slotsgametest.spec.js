describe('Test for the slots machine', function() {
    beforeEach(() => {
      cy.server();
      cy.visit('/');
      //login process
      cy.get('[data-cy=login-username]').type('xXGamingMasterXx');
      cy.get('[data-cy=login-password]').type('P@ssword1111');
      cy.get('[data-cy=login-button]').click();
    })

    it('slots on error show error message', function(){
      cy.visit('/game/slots');
      cy.get('[data-cy=bet-input]').clear();
      cy.get('[data-cy=bet-input]').type(0);
      cy.get('[data-cy=go-button]').should('be.disabled');
      //remove focus from input so the error shows
      cy.get('[data-cy=bet-input]').blur();
      cy.get('[data-cy=bet-error]').should('be.visible');
    });
    
    it('slot updates balance of the player', function(){
      cy.visit('/game/slots');
      cy.get('[data-cy=bet-input]').type(100);
      cy.get('[data-cy=player-balance]');
      const balance = cy.get('[data-cy=player-balance]').invoke('text').then(console.log);
      cy.get('[data-cy=go-button]').click();
      cy.wait(10000); //wait 10 seconds (for the slot animation to finish and the balance to be updated)
      const newBalance = cy.get('[data-cy=player-balance]').invoke('text').then(console.log);
      expect(balance).to.not.equal(newBalance);
    });

});