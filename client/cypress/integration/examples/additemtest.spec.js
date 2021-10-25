describe('Test for adding items', function() {
    beforeEach(() => {
      cy.server();
      cy.visit('/');
      //login process
      cy.get('[data-cy=login-username]').type('TheAdministrator');
      cy.get('[data-cy=login-password]').type('Admin@ccount123456');
      cy.get('[data-cy=login-button]').click();
    })

    it('checking if add item adds 1 to the list', function() {
        cy.visit('/');
        cy.get('[data-cy=itemCard]').should('have.length', 3);
        
        cy.visit('/shop/add');
        cy.get('[data-cy=add-item-name]').clear();
        cy.get('[data-cy=add-item-name]').type('testitem');
        cy.get('[data-cy=add-item-price]').type(34000);
        cy.get('[data-cy=add-item-submit]').click();

        cy.visit('/');
        cy.get('[data-cy=itemCard]').should('have.length', 4);
    });

    it('on error should show error message', function() {
      cy.visit('/shop/add');
        cy.get('[data-cy=add-item-name]').clear();
        cy.get('[data-cy=add-item-name]').type('testitem');
        cy.get('[data-cy=add-item-price]').type(-5);
        cy.get('[data-cy=add-item-price]').blur();
        cy.get('[data-cy=add-item-error]').should('be.visible');
    });
});