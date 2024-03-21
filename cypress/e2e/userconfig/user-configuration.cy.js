describe('user-configuration', () => {
    
    const agentName = 'ETERNALS1';
    const newLocation = 'NYC';
    const defaultLocation = 'MNL';

    // Use the custom command to perform login and setup before each test
    beforeEach(() => {
        cy.loginAndSetup();
        // Load userConfigElements fixture
        cy.loadUserConfigFixtures();
    });

    afterEach(() => {
        // Call the custom logout command
        cy.logout();
    });

    it('should ensure that all specified elements are visible', () => {
        // Check visibility using userconfig
        cy.checkVisibility();
    });

    it('should ensure that user is able to sort username column', () => {
        // Ensure that the "Username header" element is visible
        cy.sortUsername();
        cy.log('Successfully sorted username column')
    });

    it('should ensure that user is able to save changes', () => {
        // Search agent
        cy.searchAgent(agentName);
        // Update agent's location
        cy.updateAgentLocation(newLocation);
        // Revert agent's location
        cy.updateAgentLocation(defaultLocation);
    });
});