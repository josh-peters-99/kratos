describe('User Login', () => {
    it('should allow a user to log in', () => {
      cy.visit('http://localhost:3000/auth/signin'); // Visit the login page
      cy.get('input[name="email"]').type('testuser@example.com');
      cy.get('input[name="password"]').type('Test1234');
      cy.get('button[type="submit"]').click(); // Submit the login form
  
      cy.url().should('include', '/'); // Assert that user is redirected to dashboard
      cy.contains('Welcome'); // Verify the user's name is on the page
    });
  });