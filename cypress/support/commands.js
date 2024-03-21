require('./userConfigCommands');

const ini = require('ini');
const asAIniPath = 'cypress/config/.as-a.ini';

Cypress.Commands.add('loginAndSetup', () => {
    cy.checkAsAIniFileExists(asAIniPath).then((fileExists) => {
        cy.log('as-a.ini file exists:', fileExists);
        if (fileExists) {
            cy.readAsAIniFile(asAIniPath).then(({ fileUsername, filePassword }) => {
                cy.loginWithCredentials(fileUsername, filePassword);
            });
        } else {
            cy.loginWithDefaultCredentials(username, password);
        }
    });
});

Cypress.Commands.add('checkAsAIniFileExists', (filePath) => {
    return cy.task('fileExists', filePath);
});

Cypress.Commands.add('readAsAIniFile', (filePath) => {
    return cy.readFile(filePath, 'utf8').then((iniContent) => {
        const config = ini.parse(iniContent);
        return {
            fileUsername: config.credentials.username,
            filePassword: config.credentials.password,
        };
    });
});

Cypress.Commands.add('login', (username, password) => {
    cy.get('#username').clear().type(username);
    cy.get('#password').clear().type(password, { log: false });
    cy.get('#login').click();
});

const loginPage = '/KJTCore/resources/userconfigclient/index.html';

Cypress.Commands.add('loginWithCredentials', (username, password) => {
    cy.log('Using credentials from as-a.ini');
    cy.visit(loginPage);
    cy.get('#username').should('be.visible').clear().type(username);
    cy.get('#password').should('be.visible').clear().type(password, { log: false });
    cy.get('#login').should('be.visible').click();
});

Cypress.Commands.add('loginWithDefaultCredentials', (username, password) => {
    cy.log('as-a.ini file not found, using default credentials');
    cy.visit(loginPage);
    cy.get('#username').should('be.visible').clear().type(username);
    cy.get('#password').should('be.visible').clear().type(password, { log: false });
    cy.get('#login').should('be.visible').click();
});

Cypress.Commands.add('logout', () => {
    cy.get('#ucc-nav-account-menu');
    cy.get('#navbar-logout');
    cy.get('#confirm-ucc-logout-btn');
    cy.log('Logged out successfully');
});

Cypress.Commands.add('openPage', (page) => {
    cy.get('#ConfigNavbarDropdown').click();
    cy.get(`#${page}`).click();
});

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});
