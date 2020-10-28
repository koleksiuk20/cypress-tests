import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";

// Open Landing Page
Given(/^I open Landing Page$/, () => {
  cy.openLandingPage('/');
});

// Open Login / Register modal
Given(/^I have started "([^"]*)" "([^"]*)"$/, (userRole, modalName) => {
  if (userRole === 'Company User' && modalName === 'login') {
    cy.openCompanyUserLoginPage();
  }
  else if (userRole === 'Company User' && modalName === 'registration') {
    cy.openCompanyUserRegistrationPage();
  }
  else if (userRole === 'Customer' && modalName === 'registration') {
    cy.openCustomerRegistrationPage();
  }
  else if (userRole === 'Customer' && modalName === 'login') {
    cy.openCustomerLoginPage();
  }
  else {
    throw new Error(`${userName} ${modalName} modal not found`);
  }
});

// Fill in Login / Registration modal and proceed
When(/^I complete "([^"]*)" "([^"]*)" modal with the following credentials:$/, (userRole, modalName, dataTable) => {
  const userCredentials = dataTable.rowsHash();
  if (userRole === 'Customer' && (modalName === 'login' || modalName === 'registration') || (userRole === 'Company User' && modalName === 'login')) {
    if (userCredentials['email'] !== '' && userCredentials['password'] !== '') {
      cy.fillInInputField(userCredentials['email'], 'E-Mail Address')
        .fillInInputField(userCredentials['password'], 'Password')
        .selectButton('Log In');
    }
    else if (userCredentials['email'] !== '') {
      cy.fillInInputField(userCredentials['email'], 'E-Mail Address')
        .fillInInputField('.', 'Password')
        .clearInputField('Password');
    }
    else if (userCredentials['password'] !== '') {
      cy.fillInInputField('.', 'E-Mail Address')
        .clearInputField('E-Mail Address')
        .fillInInputField(userCredentials['password'], 'Password')
    }
    else {
      cy.fillInInputField('.', 'E-Mail Address')
        .clearInputField('E-Mail Address')
        .fillInInputField('.', 'Password')
        .clearInputField('Password')
    }
    
  }
  else if(userRole === 'Company User' && modalName === 'registration') {
    cy.fillInInputField(userCredentials['companyName'], 'Company name')
      .fillInInputField(userCredentials['email'], 'E-Mail Address')
      .selectButton('Log In');
  }
  else {
    throw new Error(`${userRole} ${modalName} modal not found`);
  }
});

// Verify that user is logged in
Then (/^I should see that I am logged in as "([^"]*)"$/, (userRole) => {
  if (userRole === 'Customer') {
    cy.verifyPage('/customer/account', 'My account');
  }
  else if (userRole === 'Company User') {
    cy.verifyPage('/company/bookings/not-seen', 'My account');
  }
  else {
    throw new Error(`${userRole} not found`);
  }
});

// Login / Registration possible error messages
Given(/^these error messages exist$/, async function (table) {
  this.credentialErrors = table.hashes();
});

// Check error visibility
And(/^this (inline|password) error message "(.*)" is (visible|not visible)$/, async function (errorType, errorText, visible) {
  let arr = this.credentialErrors;
  let keyArr = arr.map(k => Object.values(k));
  const errorTypeItem = {
    'inline': 'div > p',
    'password': 'span'
  };
  
  visible = visible === 'visible';

  for(let i = 0; i < keyArr.length; i++) {
    var innerArrayLength = keyArr[i].length;

    for(let j = 0; j < innerArrayLength; j++) {
      if(keyArr[i][j] === errorText) {
        cy.get(errorTypeItem[errorType])
          .should(visible ? 'be.visible' : 'not.be.visible')
          .contains(keyArr[i][j+1]);
      }
      else {
        throw new Error(`${errorTypeItem[errorType]} not found`);
      }
    }
  }
});
