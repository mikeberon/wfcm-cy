pipeline {
    agent {
        label 'master'
    }

    options {
        timeout(time: 1, unit: 'HOURS')
    }
    
    environment {
        NODE_VERSION = '16' // Node.js version
        CYPRESS_VERSION = '8.7.0' // Cypress version
        NODE_WORKSPACE = "/home/wonders/jenkins/workspace/cy-user-config"
        REPORTS_DIR = "${NODE_WORKSPACE}/cypress/reports/mocha"
    }

    stages {
        stage('Install Dependencies') {
            steps {
                script {
                    // Install Node.js
                    sh "curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -"
                    sh "sudo apt-get install -y nodejs"

                    // Install Cypress
                    sh "npm install cypress@${CYPRESS_VERSION} --save-dev"
                    sh "npx cypress install"
                    sh 'env'
                }
            }
        }
        
        stage('Run Cypress Tests') {
            agent {
                label "${test_machine}"
            }

            steps {
                sh "NO_COLOR=1 npx cypress run --browser chrome --parallel --record --key 726eb451-3245-4f64-bb8d-d0263ab72517 --ci-build-id ${currentBuild.number}"
            }
        }
        
        stage('Generate HTML Reports') {
            agent {
                label "${test_machine}"
            }

            steps {
                script {
                    // Ensure directory permissions
                    sh "chmod -R 777 ${NODE_WORKSPACE}"
                    
                    // Merge and generate HTML reports
                    sh "npx mochawesome-merge ${REPORTS_DIR}/*.json -o ${REPORTS_DIR}/merged-report.json"
                    sh "npx mochawesome-report-generator ${REPORTS_DIR}/merged-report.json -o ${NODE_WORKSPACE}"
                }
            }
        }
    }

    post { 
        success {
            script {
                sendEmail('PASSED', CYPRESS_RUN_NUMBER)
            }
        }
        
        failure {
            script {
                sendEmail('FAILED', CYPRESS_RUN_NUMBER)
            }
        }
    }
}

def sendEmail(status, cypressRunNumber) {
    // Construct the Cypress Dashboard URL with the run number
    String dashboardUrl = "https://dashboard.cypress.io/projects/${env.CYPRESS_PROJECT_ID}/runs/${cypressRunNumber}"

    // Get current date and time with specified formats
    def currentDate = new Date().format('MM-dd-yyyy')
    def currentTime = new Date().format('HH:mm')

    // Determine recipients and subject based on status
    def recipients = status == 'PASSED' ? env.success_email_recipients : env.failed_email_recipients
    def subject = "[${status.toUpperCase()}][${env.environment.toUpperCase()}][USER-CONFIGURATION][CYPRESS][${currentDate}|${currentTime}]"

    // Define paths
    def htmlReportPath = "${REPORTS_DIR}/merged-report.html"

    // Send the email with the HTML content embedded in the body if available
    emailext(
        to: recipients,
        subject: subject,
        body: """
        WFCM scripts under USER CONFIGURATION have ${status.toLowerCase()}. <br>
        Please see full report via Cypress Dashboard: <a href='${dashboardUrl}'>Cypress WFCM dashboard</a>. <br>""",
        // <br>
        // <h2>HTML Report link: </h2><br>
        // ${htmlReportPath}
        // """,
        mimeType: 'text/html'
    )
}


