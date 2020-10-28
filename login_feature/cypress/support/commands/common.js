import { 
  commonButtons,
  commonInputFields
} from '../utils/configUtils/configUtils';
import "cypress-localstorage-commands";

// Open Landing Page
Cypress.Commands.add('openLandingPage', (moduleUrl) => {
  cy.visit(moduleUrl, {
    onBeforeLoad: (win) => {
      win.sessionStorage.clear();
    }
  });
});

// Verify that page is loaded correctly
Cypress.Commands.add('verifyPage', (url, elementText) => {
  cy.title()
    .should('include', 'SECmarket Booking platform');
  cy.url()
    .should('include', url);
  cy.contains('span', elementText);
});

// Select button
Cypress.Commands.add('selectButton', (buttonText) => {
  const buttonItem = commonButtons;

  cy.contains('div > span', buttonItem[buttonText])
    .should('not.be.disabled')
    .click();
});

// Fill in given input field with wanted text
Cypress.Commands.add('fillInInputField', (text, inputName) => {
  const inputNameItem = commonInputFields;
  
  cy.get(`input[name="${inputNameItem[inputName]}"]`)
    .should('be.visible')
    .type(text)
    .blur();
});

/// Clear given input field
Cypress.Commands.add('clearInputField', (inputName) => {
  const inputNameItem = commonInputFields;

  cy.get(`input[name="${inputNameItem[inputName]}"]`)
    .click()
    .clear();
});
