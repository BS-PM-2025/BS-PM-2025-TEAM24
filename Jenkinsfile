pipeline {
  // pick any node that has at least one executor
  agent any

  environment {
    NPM_CONFIG_LOGLEVEL = 'warn'
    NPM_CONFIG_CACHE    = '.npm'
    CI                  = 'true'
  }

  stages {
    stage('Install All Dependencies') {
      steps {
        script {
          // launch a node:18 container for installation
          docker.image('node:18').inside('-u root --privileged') {
            echo '📦 Installing root, backend, and frontend dependencies…'
            sh 'npm install --unsafe-perm'

            dir('server') {
              sh 'npm install --unsafe-perm'
            }

            dir('my-react-app') {
              sh 'npm install --unsafe-perm'
            }
          }
        }
      }
    }

    stage('Run Backend Tests') {
      steps {
        script {
          docker.image('node:18').inside('-u root --privileged') {
            echo '🧪 Running server tests…'
            dir('server') {
              sh 'npm test'
            }
          }
        }
      }
    }
  }

  post {
    success {
      echo '✅ Build succeeded!'
    }
    failure {
      echo '❌ Build failed!'
    }
    always {
      echo '📄 Build finished.'
    }
  }
}
