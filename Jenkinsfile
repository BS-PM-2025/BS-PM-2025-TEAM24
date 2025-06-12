pipeline {
    agent {
        docker {
            image 'node:18'
            args '-u root --privileged'
        }
    }

    environment {
        NPM_CONFIG_LOGLEVEL = 'warn'
        NPM_CONFIG_CACHE    = '.npm'
        CI                  = 'true'
    }

    stages {
        stage('Install All Dependencies') {
            steps {
                echo '📦 Installing root, backend, and frontend dependencies...'
                sh '''
                    npm install --unsafe-perm || true

                    # Go into server and install its deps
                    cd server
                    npm install --unsafe-perm || true

                    # Now pull in the Babel bits Jest needs—without touching package.json
                    npm install @babel/core @babel/preset-env babel-jest --no-save || true

                    # Back out and install the React app
                    cd ../my-react-app
                    npm install --unsafe-perm || true
                '''
            }
        }

        stage('Run Backend Tests') {
            steps {
                echo '🧪 Running server tests…'
                dir('server') {
                    // Run tests here so that the freshly-installed babel packages are in scope
                    sh 'npm test'
                }
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
