import '@testing-library/cypress/add-commands';
import 'cypress-file-upload';
import { loginPage } from './index';

Cypress.Commands.add('login', (realm, username, password) => {
  return cy.session(username, () => {
    cy.visit(loginPage);
    cy.get('.ant-dropdown-trigger.realm').click();
    cy.get('ul')
      .contains(realm.name)
      .click();

    cy.get('.login-button').click();
    cy.origin(
      realm.baseUrl,
      { args: [username, password] },
      ([username, password]) => {
        cy.get('#username').type(username);
        cy.get('#password').type(password);
        cy.screenshot('login');
        cy.get('input[name="login"]').click();
      }
    );
    cy.wait(500);
  });
});
