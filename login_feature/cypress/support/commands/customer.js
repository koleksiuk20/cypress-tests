// Open Login Page for Customer
Cypress.Commands.add('openCustomerLoginPage', () => {
  cy.openLandingPage('/')
    .verifyPage('/', 'Sign in')
    .selectButton('Sign in');
});
