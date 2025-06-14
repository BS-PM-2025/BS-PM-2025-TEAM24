pipeline {
    agent {
        docker {
            image 'node:18'
            args '-u root'  // Only root if absolutely necessary
        }
    }

    environment {
        NPM_CONFIG_LOGLEVEL = 'warn'
        NPM_CONFIG_CACHE = '.npm'
        CI = 'true'
    }

    stages {
        stage('Install All Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                sh 'npm ci'  // Use npm ci instead of npm install for CI environments
                sh 'cd server && npm ci'
                sh 'cd my-react-app && npm ci'
            }
        }

        stage('Run Backend Tests') {
            steps {
                echo '🧪 Running unit tests...'
                sh 'npm test'  // Remove || true to fail properly
            }
        }
    }

    post {
        always {
            junit '**/test-results.xml'  // Add test reporting
            echo '📄 Build finished with status above.'
        }
    }
}
