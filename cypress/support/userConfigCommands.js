Cypress.Commands.add("loadUserConfigFixtures", () => {
    cy.fixture('userconfig/userconfig.json').as('userConfig');
});

Cypress.Commands.add('checkVisibility', () => {
    // Access the "elements" dictionary directly from the loaded fixture
    cy.get('@userConfig').then((userconfig) => {
        const userConfigElements = userconfig['elements'];

        // Iterate through each element in the "elements" dictionary
        Object.entries(userConfigElements).forEach(([elementName, locator]) => {
            cy.xpath(locator).should('be.visible');
            cy.log(`${elementName} is visible`);
        });

        cy.log('All elements are visible');
    });
});

Cypress.Commands.add('sortUsername', () => {
    cy.get('@userConfig').then((userconfig) => {
        const elements = userconfig['elements'];
        const wait = userconfig['wait'];

        cy.xpath(elements['Username Header']).should('be.visible');
        cy.wait(wait['default'], { log: false });
        cy.xpath(elements['Username Header']).click();
    });
});

Cypress.Commands.add('searchAgent', (agent) => {
    cy.get('@userConfig').then((userconfig) => {
        const elements = userconfig['elements'];
        const update = userconfig['update'];
        const agentResult = update['Agent Search Result'].replace('${agent}', agent);

        // Click on the Agent Dropdown
        cy.xpath(elements['Agent Dropdown']).click();
        // Deselect all agents
        cy.xpath(update["Agent Deselect All"]).click();
        // Type agent name in search
        cy.xpath(update["Agent Search"]).type(agent);
        // Click Agent
        cy.xpath(agentResult).click();
        cy.xpath(elements['Go']).click();
    });
});

Cypress.Commands.add('updateAgentLocation', (location) => {
    cy.get('@userConfig').then((userconfig) => {
        const elements = userconfig['elements'];
        const update = userconfig['update'];
        const newLocation = update['New Location'].replace('${location}', location);
        // Click Agent location arrow
        cy.xpath(update['Agent Location Arrow']).click();
        // Choose new location
        cy.xpath(newLocation).click();
        cy.xpath(elements['Save']).click();
        cy.log('Successfully updated agent location to new location:', newLocation);
    });
});