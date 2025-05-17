pipeline {
    agent {
        docker {
            image 'node:18'  // ✅ Node.js with npm pre-installed
        }
    }

    stages {
        stage('Install Root Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Unit Tests') {
            steps {
                sh 'npm test'
            }
        }
    }

    post {
        success {
            echo '✅ All unit tests passed!'
        }
        failure {
            echo '❌ Unit tests failed!'
        }
    }
}