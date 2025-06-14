pipeline {
    agent {
        docker {
            image 'node:18'
            args '-u root --privileged'
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
                echo '📦 Installing root, backend, and frontend dependencies...'
                sh '''
                    npm install --unsafe-perm
                    cd server && npm install --unsafe-perm
                    cd ../my-react-app && npm install --unsafe-perm
                '''
            }
        }

        stage('Run Backend Tests') {
            steps {
                echo '🧪 Running unit tests...'
                sh 'npm test'  // Removed "|| true" - will now fail properly
            }
        }
    }

    post {
        success {
            echo '✅ Build completed successfully!'
        }
        failure {
            echo '❌ Build failed!'
        }
        always {
            echo '📄 Build finished with status above.'
        }
    }
}

