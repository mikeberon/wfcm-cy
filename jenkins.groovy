pipeline {
    agent {
        label 'master'
    }

    options {
        timeout(time: 1, unit: 'HOURS')
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout your code from version control system (e.g., Git)
                git branch: 'master', url: 'https://github.com/your/repo.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install Node.js and npm
                sh 'curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -'
                sh 'sudo apt-get install -y nodejs'

                // Install Cypress globally or locally
                sh 'npm install -g cypress'
            // OR, install Cypress locally in your project
            // sh 'npm install cypress --save-dev'
            }
        }

        stage('Run Cypress Tests') {
            agent {
                label "${test_machine}"
            }
            steps {
                // Run Cypress tests
                sh 'npx cypress run'
            }
        }

        stage('Generate Test Reports') {
            steps {
                // Generate Cypress test reports (optional)
                sh 'npx mochawesome-merge cypress/results/*.json > cypress/results/report.json'
                sh 'npx marge cypress/results/report.json --reportDir cypress/reports'
            }
        }
    }

    post {
        always {
            // Clean up any temporary files or resources
            cleanWs()
        }
    }
}
