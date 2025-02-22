describe("User Registration", () => {
    it("should allow a user to register", () => {
      cy.visit("http://localhost:3000/auth/signup");
      cy.get('input[name="username"]').type("testuser");
      cy.get('input[name="email"]').type("testuser@example.com");
      cy.get('input[name="password"]').type("Test1234");
      cy.get('button[type="submit"]').click();
  
      // Capture the alert message
      cy.on("window:alert", (text) => {
        expect(text).to.contains("Signup successful. You can now sign in.");
      });
    });
  });