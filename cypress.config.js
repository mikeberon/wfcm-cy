const fs = require('fs'); // Import the fs module

module.exports = {
  e2e: {
    projectId: "167civ",
    CYPRESS_RECORD_KEY: "726eb451-3245-4f64-bb8d-d0263ab72517",
    baseUrl: "https://qa.letsdochinese.com/",
    viewportWidth: 1920,
    viewportHeight: 1080,
    defaultCommandTimeout: 10000, // Use the correct default command timeout
    parallel: true,
    record: false,
    watchForFileChanges: false,
    headless: true,
    reporter: "mochawesome", // Use mochawesome as the reporter
    reporterOptions: {
      reportDir: "cypress/reports/mocha", // Define where to save the reports
      overwrite: false, // Do not overwrite reports
      html: false, // Do not create HTML report
      json: true, // Create JSON report
    },
    // reporter: "cypress-html-reporter",
    // reporterOptions: {
    //   output: "cypress/report/cypress-html-report",
    //   openReportInBrowser: true
    // },
    // Define custom tasks and node event listeners
    setupNodeEvents(on, config) {
      // Custom task to check if a file exists
      on('task', {
        fileExists(filename) {
          return fs.existsSync(filename);
        },
      });

      // Implement other node event listeners here if needed
    },

    // Override Cypress configuration
    Cypress: {
      config: {
        // Disable Cypress from failing the test on uncaught exceptions
        "uncaught:exception": false,
      },
    },
  },
};
